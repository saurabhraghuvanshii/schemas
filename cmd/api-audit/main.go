// Command api-audit runs the consumer audit: it walks meshery/schemas, joins
// it against handler implementations in meshery/meshery and meshery-cloud,
// and reports per-endpoint coverage and implementation drift.
//
// Usage:
//
//	go run ./cmd/api-audit                                                 # summary only
//	go run ./cmd/api-audit --meshery-repo=../meshery --cloud-repo=../meshery-cloud
//	go run ./cmd/api-audit --dry-run --output=audit.csv                    # local CSV export
//	go run ./cmd/api-audit --dry-run --baseline-csv=prev.csv               # diff against explicit baseline
//	go run ./cmd/api-audit --sheet-id=<id> --credentials=<path>            # canonical sheet write
package main

import (
	"encoding/csv"
	"flag"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"sort"

	"github.com/meshery/schemas/validation"
)

func main() {
	mesheryRepo := flag.String("meshery-repo", "", "Path to a meshery/meshery checkout (Gorilla router)")
	cloudRepo := flag.String("cloud-repo", "", "Path to a meshery-cloud checkout (Echo router)")
	verbose := flag.Bool("verbose", false, "Print per-construct breakdown and Schema-only / Consumer-only lists")
	sheetID := flag.String("sheet-id", "", "Google Sheet ID to read/write canonical audit state")
	credentials := flag.String("credentials", "", "Path to Google service-account JSON credentials (for --sheet-id)")
	dryRun := flag.Bool("dry-run", false, "Do not touch Google Sheets; optionally diff against --baseline-csv and emit CSV to --output or stdout")
	outputPath := flag.String("output", "", "Write CSV output to this file. Use - for stdout. When omitted, CSV is only written during --dry-run and goes to stdout")
	baselineCSV := flag.String("baseline-csv", "", "Optional baseline CSV used for dry-run diffs and refreshed after a successful sheet write")
	flag.Parse()

	rootDir, err := findRepoRoot()
	if err != nil {
		fmt.Fprintf(os.Stderr, "consumer-audit: could not find repository root: %v\n", err)
		os.Exit(1)
	}

	if *dryRun && *sheetID != "" {
		fmt.Fprintln(os.Stderr, "consumer-audit: --dry-run and --sheet-id are mutually exclusive")
		os.Exit(1)
	}

	opts := validation.ConsumerAuditOptions{
		RootDir:     rootDir,
		MesheryRepo: *mesheryRepo,
		CloudRepo:   *cloudRepo,
		Verbose:     *verbose,
	}

	if *sheetID != "" {
		if *credentials == "" {
			fmt.Fprintln(os.Stderr, "consumer-audit: --credentials is required when --sheet-id is set")
			os.Exit(1)
		}
		creds, err := os.ReadFile(*credentials)
		if err != nil {
			fmt.Fprintf(os.Stderr, "consumer-audit: read credentials: %v\n", err)
			os.Exit(1)
		}
		opts.SheetID = *sheetID
		opts.SheetsCredentials = creds
	}

	if *baselineCSV != "" {
		previous, err := readCSVCache(resolvePath(rootDir, *baselineCSV))
		if err != nil {
			fmt.Fprintf(os.Stderr, "consumer-audit: read baseline %s: %v\n", *baselineCSV, err)
			os.Exit(1)
		}
		opts.PreviousRows = previous
	}

	result, err := validation.RunConsumerAudit(opts)
	if err != nil {
		fmt.Fprintf(os.Stderr, "consumer-audit: %v\n", err)
		os.Exit(1)
	}

	summaryOut := io.Writer(os.Stdout)
	if shouldWriteStdoutCSV(*dryRun, *outputPath) {
		summaryOut = os.Stderr
	}
	printSummary(summaryOut, result, *mesheryRepo != "", *cloudRepo != "")

	if *verbose {
		printVerbose(summaryOut, result)
	}

	if len(result.Tracked) > 0 {
		printDiff(summaryOut, result.Tracked)
	}

	if *sheetID != "" && *baselineCSV != "" {
		if err := writeCSVCache(resolvePath(rootDir, *baselineCSV), result); err != nil {
			fmt.Fprintf(os.Stderr, "consumer-audit: warning: could not refresh %s: %v\n", *baselineCSV, err)
		}
	}

	if *outputPath != "" {
		if err := writeCSVPath(resolvePath(rootDir, *outputPath), result); err != nil {
			fmt.Fprintf(os.Stderr, "consumer-audit: write CSV: %v\n", err)
			os.Exit(1)
		}
	}

	if shouldWriteStdoutCSV(*dryRun, *outputPath) {
		if err := writeCSV(os.Stdout, result); err != nil {
			fmt.Fprintf(os.Stderr, "consumer-audit: write CSV: %v\n", err)
			os.Exit(1)
		}
	}
}

// findRepoRoot walks up from the current working directory looking for go.mod.
func findRepoRoot() (string, error) {
	dir, err := os.Getwd()
	if err != nil {
		return "", err
	}
	for {
		if _, err := os.Stat(filepath.Join(dir, "go.mod")); err == nil {
			return dir, nil
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			return "", fmt.Errorf("go.mod not found in any parent directory")
		}
		dir = parent
	}
}

func printSummary(out io.Writer, result *validation.ConsumerAuditResult, mesheryProvided, cloudProvided bool) {
	s := result.Summary
	fmt.Fprintln(out, "consumer-audit: scanning schemas...")
	fmt.Fprintf(out, "  found %d schema-defined endpoints (+ %d consumer-only handlers = %d audit rows)\n",
		s.SchemaEndpoints, s.ConsumerOnly, len(result.Rows))

	if mesheryProvided {
		fmt.Fprintf(out, "\nconsumer-audit: scanning meshery/meshery...\n")
		fmt.Fprintf(out, "  parsed %d Gorilla route registrations\n", s.MesheryEndpoints)
	}
	if cloudProvided {
		fmt.Fprintf(out, "\nconsumer-audit: scanning meshery-cloud...\n")
		fmt.Fprintf(out, "  parsed %d Echo route registrations\n", s.CloudEndpoints)
	}

	fmt.Fprintln(out, "\nconsumer-audit: matching...")
	fmt.Fprintln(out)
	fmt.Fprintln(out, "+---------------------------------+----------+----------+----------+")
	fmt.Fprintln(out, "|                                 |  Schema  | Meshery  |  Cloud   |")
	fmt.Fprintln(out, "+---------------------------------+----------+----------+----------+")
	fmt.Fprintf(out, "| %-31s | %8d | %8d | %8d |\n", "Total endpoints", s.SchemaEndpoints, s.MesheryEndpoints, s.CloudEndpoints)
	fmt.Fprintf(out, "| %-31s | %8d | %8s | %8s |\n", "Matched (schema <-> consumer)", s.Matched, "--", "--")
	fmt.Fprintf(out, "| %-31s | %8d | %8s | %8s |\n", "Schema-only (no handler)", s.SchemaOnly, "--", "--")
	fmt.Fprintf(out, "| %-31s | %8s | %8d | %8d |\n", "Consumer-only (no schema)", "--", s.ConsumerOnlyMeshery, s.ConsumerOnlyCloud)
	fmt.Fprintln(out, "+---------------------------------+----------+----------+----------+")
	fmt.Fprintf(out, "| %-31s | %8s | %8d | %8d |\n", "Schema-Backed = TRUE", "--", s.MesheryBackedTrue, s.CloudBackedTrue)
	fmt.Fprintf(out, "| %-31s | %8d | %8s | %8s |\n", "Schema Completeness = TRUE", s.SchemaCompletenessOK, "--", "--")
	fmt.Fprintf(out, "| %-31s | %8d | %8s | %8s |\n", "Schema Completeness = FALSE", s.SchemaCompletenessNo, "--", "--")
	fmt.Fprintf(out, "| %-31s | %8s | %8d | %8d |\n", "Schema-Driven = TRUE", "--", s.MesheryDrivenTrue, s.CloudDrivenTrue)
	fmt.Fprintf(out, "| %-31s | %8s | %8d | %8d |\n", "Schema-Driven = Partial", "--", s.MesheryDrivenPartial, s.CloudDrivenPartial)
	fmt.Fprintf(out, "| %-31s | %8s | %8d | %8d |\n", "Schema-Driven = FALSE", "--", s.MesheryDrivenFalse, s.CloudDrivenFalse)
	fmt.Fprintf(out, "| %-31s | %8s | %8d | %8d |\n", "Schema-Driven = Not Audited", "--", s.MesheryDrivenNotAud, s.CloudDrivenNotAud)
	fmt.Fprintln(out, "+---------------------------------+----------+----------+----------+")
}

func printVerbose(out io.Writer, result *validation.ConsumerAuditResult) {
	if result == nil || result.Match == nil {
		return
	}
	fmt.Fprintln(out)
	fmt.Fprintln(out, "Schema-only endpoints (defined but no handler):")
	for _, ep := range result.Match.SchemaOnly {
		fmt.Fprintf(out, "  %-7s %s   (%s)\n", ep.Method, ep.Path, ep.SourceFile)
	}
	fmt.Fprintln(out)
	fmt.Fprintln(out, "Consumer-only endpoints (registered but no schema):")
	for _, c := range result.Match.ConsumerOnly {
		fmt.Fprintf(out, "  %-7s %s   (%s, %s)\n", c.Method, c.Path, c.Repo, c.HandlerName)
	}
}

// printDiff prints a short summary of the reconciliation state transitions.
// Only runs when a previous state (sheet or cache) was available.
func printDiff(out io.Writer, tracked []validation.TrackedEndpoint) {
	type bucket struct {
		label string
		rows  []validation.TrackedEndpoint
	}
	buckets := map[validation.EndpointState]*bucket{
		validation.StateNew:     {label: "Added"},
		validation.StateChanged: {label: "Changed"},
		validation.StateDeleted: {label: "Removed"},
	}
	for _, t := range tracked {
		if b, ok := buckets[t.State]; ok {
			b.rows = append(b.rows, t)
		}
	}
	order := []validation.EndpointState{validation.StateNew, validation.StateChanged, validation.StateDeleted}
	anyChanges := false
	for _, st := range order {
		if len(buckets[st].rows) > 0 {
			anyChanges = true
			break
		}
	}
	fmt.Fprintln(out)
	if !anyChanges {
		fmt.Fprintln(out, "consumer-audit: no changes since last run")
		return
	}
	fmt.Fprintln(out, "consumer-audit: diff against previous state")
	for _, st := range order {
		b := buckets[st]
		if len(b.rows) == 0 {
			continue
		}
		sort.Slice(b.rows, func(i, j int) bool {
			if b.rows[i].Row.Endpoint != b.rows[j].Row.Endpoint {
				return b.rows[i].Row.Endpoint < b.rows[j].Row.Endpoint
			}
			return b.rows[i].Row.Method < b.rows[j].Row.Method
		})
		fmt.Fprintf(out, "  %s (%d):\n", b.label, len(b.rows))
		for _, t := range b.rows {
			fmt.Fprintf(out, "    %-7s %s  %s\n", t.Row.Method, t.Row.Endpoint, t.ChangeLog)
		}
	}
}

// writeCSV emits the full audit result (header + rows) as CSV to the given
// writer. When reconciliation has run, the reconciled rows are preferred so
// the emitted Change Log column reflects the state transitions.
func writeCSV(out io.Writer, result *validation.ConsumerAuditResult) error {
	rows := result.CSVRows()
	w := csv.NewWriter(out)
	if err := w.WriteAll(rows); err != nil {
		return err
	}
	w.Flush()
	return w.Error()
}

func readCSVCache(path string) ([][]string, error) {
	f, err := os.Open(path)
	if err != nil {
		if os.IsNotExist(err) {
			return nil, nil
		}
		return nil, err
	}
	defer f.Close()
	r := csv.NewReader(f)
	r.FieldsPerRecord = -1
	return r.ReadAll()
}

func writeCSVCache(path string, result *validation.ConsumerAuditResult) error {
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer f.Close()
	return writeCSV(f, result)
}

func writeCSVPath(path string, result *validation.ConsumerAuditResult) error {
	if path == "-" {
		return writeCSV(os.Stdout, result)
	}
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer f.Close()
	return writeCSV(f, result)
}

func shouldWriteStdoutCSV(dryRun bool, outputPath string) bool {
	if outputPath == "-" {
		return true
	}
	return dryRun && outputPath == ""
}

func resolvePath(rootDir, path string) string {
	if path == "" || path == "-" || filepath.IsAbs(path) {
		return path
	}
	return filepath.Join(rootDir, path)
}

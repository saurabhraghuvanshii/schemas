import { Container, Typography, Box, Breadcrumbs, Paper, Grid, Card, CardContent, Chip } from "@mui/material";
import Link from "next/link";
import { loadSchemaProperties } from "@/lib/schemas";
import DataTableClient from "@/components/DataTableClient";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { getVersions } from "@/lib/openapi";

export async function generateStaticParams() {
  return getVersions().map((version) => ({ version }));
}

export default async function SelectorsPage({ params }: { params: Promise<{ version: string }> }) {
  const { version } = await params;
  // selector.yaml uses JSON Schema `definitions` format:
  //   definitions.selector     – individual selector item
  //   definitions.selectors    – array of selectorSet items
  //   definitions.matchSelector – match binding config
  const selectorItemProps = loadSchemaProperties(version, "selector", "selector");
  const selectorsSetProps = loadSchemaProperties(version, "selector", "selectors");
  const matchSelectorProps = loadSchemaProperties(version, "selector", "matchSelector");

  // Also pull from relationship.yaml which has the OpenAPI-style schemas
  const selectorFromRelationship = loadSchemaProperties(version, "relationship", "Selector");
  const selectorItemFromRelationship = loadSchemaProperties(version, "relationship", "SelectorItem");
  const matchFromRelationship = loadSchemaProperties(version, "relationship", "MatchSelector");
  const selectorSetItemFromRelationship = loadSchemaProperties(version, "relationship", "SelectorSetItem");

  // Legacy fallback (v1alpha1 root properties)
  const legacyFromProps = loadSchemaProperties(version, "selector", "from");
  const legacyToProps = loadSchemaProperties(version, "selector", "to");

  const columns = [
    { name: "name", label: "Property Name", options: { filter: false, sort: true } },
    { name: "type", label: "Type", options: { filter: true, sort: true } },
    { name: "required", label: "Required", options: { filter: true, sort: true } },
    { name: "description", label: "Description", options: { filter: false, sort: false } },
  ];

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="xl">
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4 }}>
          <Link href={`/${version}`} style={{ textDecoration: "none", color: "#00B39F" }}>
            Home
          </Link>
          <Typography color="text.primary">Selectors</Typography>
        </Breadcrumbs>

        <Box display="flex" alignItems="center" mb={2}>
          <FilterAltIcon sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
          <Typography variant="h3" component="h1" fontWeight="bold" sx={{ color: "primary.main" }}>
            Selectors
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary" paragraph>
          Selectors are evaluation mechanisms used to identify components within a design. They specify
          exactly which components link to each other based on kind, model, and matching constraints
          during relationship evaluation.
        </Typography>

        {/* Visual explanation of how selectors work */}
        <Paper
          elevation={1}
          sx={{ p: 4, mb: 6, backgroundColor: "#f9f9f9", borderLeft: "4px solid #00B39F" }}
        >
          <Typography variant="h5" gutterBottom fontWeight="bold">
            How Selectors Work
          </Typography>
          <Box sx={{ fontSize: "1rem", lineHeight: 1.5, mb: 2 }}>
            Each relationship contains a <strong>SelectorSet</strong> — an array of selector rules
            interpreted as a logical <Chip label="OR" size="small" color="primary" sx={{ mx: 0.5, verticalAlign: "middle" }} /> union.
            Each rule has <strong>allow</strong> and optionally <strong>deny</strong> blocks,
            interpreted as a logical <Chip label="AND" size="small" color="secondary" sx={{ mx: 0.5, verticalAlign: "middle" }} /> intersection.
          </Box>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: "100%", boxShadow: "none", border: "1px solid #ddd" }}>
                <CardContent>
                  <Typography variant="overline" color="text.secondary">
                    From → To
                  </Typography>
                  <Typography variant="h6">Directional Matching</Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Selectors define a <strong>from</strong> side (source) and a <strong>to</strong> side
                    (target). Each can match by kind, model, or ID.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: "100%", boxShadow: "none", border: "1px solid #ddd" }}>
                <CardContent>
                  <Typography variant="overline" color="text.secondary">
                    Patch Strategy
                  </Typography>
                  <Typography variant="h6">merge / add / copy …</Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    When a match is found, a patch strategy (RFC 6902) specifies <em>how</em> the
                    relationship mutates the matched component.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: "100%", boxShadow: "none", border: "1px solid #ddd" }}>
                <CardContent>
                  <Typography variant="overline" color="text.secondary">
                    Allow / Deny
                  </Typography>
                  <Typography variant="h6">Inclusion & Exclusion</Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    <strong>Allow</strong> selectors are required — they define which pairs are
                    connected. <strong>Deny</strong> selectors are optional — they exclude specific
                    pairs.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        <Typography variant="h4" gutterBottom mt={4} mb={3}>
          Schema Reference (OpenAPI — relationship.yaml)
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          These are the canonical OpenAPI selector schemas defined inside <code>relationship.yaml</code>.
        </Typography>

        {selectorFromRelationship.length > 0 && (
          <DataTableClient title="Selector" columns={columns} data={selectorFromRelationship} />
        )}
        {selectorItemFromRelationship.length > 0 && (
          <DataTableClient title="SelectorItem" columns={columns} data={selectorItemFromRelationship} />
        )}
        {matchFromRelationship.length > 0 && (
          <DataTableClient title="MatchSelector" columns={columns} data={matchFromRelationship} />
        )}
        {selectorSetItemFromRelationship.length > 0 && (
          <DataTableClient
            title="SelectorSetItem (Allow / Deny)"
            columns={columns}
            data={selectorSetItemFromRelationship}
          />
        )}

        <Typography variant="h4" gutterBottom mt={6} mb={3}>
          Schema Reference (JSON Schema — selector.yaml)
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          These are the JSON Schema definitions from the standalone <code>selector.yaml</code>.
        </Typography>

        {selectorItemProps.length > 0 && (
          <DataTableClient title="selector (item definition)" columns={columns} data={selectorItemProps} />
        )}
        {selectorsSetProps.length > 0 && (
          <DataTableClient title="selectors (set definition)" columns={columns} data={selectorsSetProps} />
        )}
        {matchSelectorProps.length > 0 && (
          <DataTableClient title="matchSelector" columns={columns} data={matchSelectorProps} />
        )}

        {/* Legacy Root Fallbacks */}
        {legacyFromProps.length > 0 && (
          <DataTableClient title="from (legacy selector definition)" columns={columns} data={legacyFromProps} />
        )}
        {legacyToProps.length > 0 && (
          <DataTableClient title="to (legacy selector definition)" columns={columns} data={legacyToProps} />
        )}
      </Container>
    </Box>
  );
}

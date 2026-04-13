---
layout: page
title: Go Reference
description: Go consumer reference for Meshery Schemas — generated structs, helper conventions, and import paths.
permalink: /go/
---

<div class="card-grid">
  <a class="card" href="{{ '/go/structs' | relative_url }}" style="text-decoration:none;color:inherit;">
    <h3>Generated Structs</h3>
    <p>Browse auto-generated Go structs for every construct — field tags, types, and schema property mappings.</p>
  </a>
  <a class="card" href="{{ '/go/helpers' | relative_url }}" style="text-decoration:none;color:inherit;">
    <h3>Helper Conventions</h3>
    <p>When and how to write <code>*_helper.go</code> files — SQL drivers, <code>TableName()</code>, <code>Value()</code>/<code>Scan()</code> rules.</p>
  </a>
</div>

## Quick Start

```bash
go get github.com/meshery/schemas@latest
```

```go
import (
    "github.com/meshery/schemas/models/v1beta1/connection"
    "github.com/meshery/schemas/models/core"
)
```

## Import Path Reference

| Package             | Path                                                    | Contains                                                          |
| ------------------- | ------------------------------------------------------- | ----------------------------------------------------------------- |
| Core types          | `github.com/meshery/schemas/models/core`                | `Uuid`, `Time`, `Id`, `Map`, `NullTime`, `MapObject`, SQL helpers |
| v1beta1 constructs  | `github.com/meshery/schemas/models/v1beta1/<construct>` | Generated struct + helpers                                        |
| v1beta2 constructs  | `github.com/meshery/schemas/models/v1beta2/<construct>` | Generated struct + helpers                                        |
| v1alpha1 constructs | `github.com/meshery/schemas/models/v1alpha1`            | Legacy generated types                                            |

<div class="callout callout-info">
  <strong>Single core package</strong>
  All core types resolve to <code>models/core</code> regardless of which schema version references them. The generator's import mapping coalesces <code>v1alpha1/core</code>, <code>v1beta1/core</code>, and <code>v1beta2/core</code> into the single <code>models/core</code> package.
</div>


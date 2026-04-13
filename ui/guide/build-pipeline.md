---
layout: guide
title: Build Pipeline
description: "How make build transforms YAML schemas into Go structs, TypeScript types, and RTK Query hooks."
permalink: /guide/build-pipeline
---

## Pipeline Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│  schemas/constructs/<version>/<construct>/api.yml                   │
│  schemas/constructs/<version>/<construct>/<construct>.yaml          │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                    make validate-schemas
                            │
                    make bundle-openapi
                            │
              ┌─────────────┼────────────────────┐
              ▼             ▼                    ▼
     _openapi_build/   _openapi_build/     _openapi_build/
     merged_openapi    cloud_openapi       meshery_openapi
              │             │                    │
     ┌────────┤        ┌────┤               ┌────┤
     ▼        ▼        ▼    ▼               ▼    ▼
        oapi-    openapi-  RTK   Spec          RTK   Spec
  codegen  typescript codegen              codegen
     │        │        │    │               │    │
     ▼        ▼        ▼    ▼               ▼    ▼
        models/  typescript/ typescript/rtk/    API specs
  *.go     generated/  cloudApi.ts
           *.d.ts      mesheryApi.ts
```

## Make Targets

### `make build`

The full pipeline. Runs all steps in sequence:

```bash
make build
# Equivalent to:
#   make validate-schemas
#   make bundle-openapi
#   make generate-golang
#   make generate-rtk
#   make generate-ts
#   make generate-permissions
#   make build-ts
#   make test-golang
```

### `make validate-schemas`

Runs the repository schema validation rules (41 rules in the `validation/` Go package). Fails on violations. Use this to catch issues before committing.

```bash
make validate-schemas          # Design rules only (CI gate)
make validate-schemas-strict   # + consistency + style debt + contract debt
make audit-schemas             # Advisory warnings (uses baseline)
make audit-schemas-full        # Full advisory backlog
```

### `make bundle-openapi`

Merges all per-construct `api.yml` files into unified OpenAPI bundles:

| Output                               | Content             | Controlled by             |
| ------------------------------------ | ------------------- | ------------------------- |
| `_openapi_build/merged_openapi.yml`  | All APIs merged     | —                         |
| `_openapi_build/cloud_openapi.yml`   | Cloud-only APIs     | `x-internal: ["cloud"]`   |
| `_openapi_build/meshery_openapi.yml` | Meshery Server APIs | `x-internal: ["meshery"]` |

Paths without `x-internal` appear in both cloud and meshery bundles.

### `make generate-golang`

Runs `oapi-codegen` to produce Go structs from the bundled OpenAPI spec. Output goes to `models/<version>/<construct>/<construct>.go`.

Configuration: `build/oapi-codegen-config.yml`

### `make generate-ts`

Runs `openapi-typescript` to produce TypeScript type definitions. Output goes to `typescript/generated/`.

### `make generate-rtk`

Generates RTK Query `createApi` hooks for React/Redux consumers. Output goes to `typescript/rtk/`.

### `make build-ts`

Bundles the TypeScript distribution using `tsup`. This produces the `dist/` directory for npm publishing.

Configuration: `tsup.config.ts`

## Prerequisites

```bash
# Install dependencies
make setup

# This runs:
#   go mod download
#   npm install
```

Required tools:

- **Go** 1.21+
- **Node.js** 18+
- **npm** 9+

## Common Failure Modes

### `make validate-schemas` fails

The validator found rule violations. Check the output for:

- **Casing violations** — see [Naming Rules]({{ '/guide/naming-rules' | relative_url }})
- **Missing `additionalProperties: false`** on entity schemas
- **Missing `description`** on properties (Rule 37)
- **Missing string constraints** (`maxLength`, `pattern`) (Rule 38)
- **Missing numeric constraints** (`minimum`, `maximum`) (Rule 39)

### `make bundle-openapi` fails

Usually a `$ref` resolution error. Check that:

- All `$ref` paths are correct relative paths
- Referenced schemas exist at the target location
- No circular references that break the bundler

### `make generate-golang` fails

Common causes:

- Invalid OpenAPI in the bundled spec
- `x-go-type-import` pointing to wrong package
- Conflicting schema names across constructs

### Generated code differs from expected

Generated artifacts are committed by automation on `master`. If your local generation produces different output:

1. Verify you're on the latest `master`
2. Run `make setup` to ensure dependencies match
3. Run `make build` from a clean state

## Environment Variables

| Variable       | Purpose                     | Default       |
| -------------- | --------------------------- | ------------- |
| `OAPI_CODEGEN` | Path to oapi-codegen binary | Auto-detected |
| `NODE_ENV`     | Node environment            | `development` |

## File Map

| File                            | Purpose                                 |
| ------------------------------- | --------------------------------------- |
| `build/bundle-openapi.js`       | Merges all api.yml into unified specs   |
| `build/generate-golang.js`      | Orchestrates Go code generation         |
| `build/generate-typescript.js`  | Orchestrates TypeScript type generation |
| `build/generate-rtk.js`         | Generates RTK Query clients             |
| `build/oapi-codegen-config.yml` | Go codegen configuration                |
| `build/openapi.config.yml`      | TypeScript codegen configuration        |
| `tsup.config.ts`                | TypeScript bundler configuration        |


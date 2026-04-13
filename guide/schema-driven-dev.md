---
layout: guide
title: Schema-Driven Development
description: Understand how Meshery uses YAML schemas as the single source of truth for Go structs, TypeScript types, RTK Query hooks, and API documentation.
permalink: /guide/schema-driven-dev
---

## What Is Schema-Driven Development?

Meshery follows a **schema-first** approach: every API resource, database entity, and client-side type is derived from a single set of OpenAPI YAML files in this repository. When a schema changes here, the change automatically propagates into:

- **Go structs** consumed by `meshery/meshery` and `layer5io/meshery-cloud`
- **TypeScript types** published as `@meshery/schemas` on npm
- **RTK Query hooks** used by the Meshery UI and Layer5 Cloud frontend
- **OpenAPI documentation** served at this site

This eliminates drift between backend and frontend, ensures validation is consistent, and makes the schema the authoritative contract for every Meshery integration.

## How It Works

```
schemas/constructs/<version>/<construct>/
    ├── api.yml              ← You write this
    └── <construct>.yaml     ← You write this
           │
           ▼
    make bundle-openapi      → _openapi_build/merged_openapi.yml
           │
     ┌─────┼──────────────────────────┐
     ▼     ▼                          ▼
  oapi-codegen          openapi-typescript     RTK codegen
     │                       │                      │
     ▼                       ▼                      ▼
  models/v1beta1/      typescript/generated/   typescript/rtk/
  <construct>.go       <construct>.d.ts        cloudApi.ts
                                               mesheryApi.ts
                                                    │
                                                    ▼
                                           npm publish @meshery/schemas
```

### The Flow

1. **You define the schema** — a `<construct>.yaml` file for the entity and an `api.yml` file with endpoints, payloads, and pagination envelopes.
2. **`make bundle-openapi`** merges all per-construct `api.yml` files into unified OpenAPI bundles (one for Meshery Server, one for Layer5 Cloud, using the `x-internal` annotation).
3. **Go generation** — `oapi-codegen` reads the bundled spec and produces Go structs with JSON/YAML/DB tags in `models/<version>/<construct>/`.
4. **TypeScript generation** — `openapi-typescript` produces `.d.ts` type definitions in `typescript/generated/`.
5. **RTK generation** — a custom codegen reads the bundled spec and produces `createApi` hooks in `typescript/rtk/`.
6. **npm publish** — the TypeScript distribution is built with `tsup` and published as `@meshery/schemas`.

## Source of Truth Rules

| Migration Stage                                                | Source of Truth                                                                 |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Pre-migration** — construct being moved from downstream repo | The downstream implementation is the reference for field names, types, and tags |
| **Post-migration** — schema defined here                       | **This repository is the permanent authority.** Downstream must conform.        |

Once a construct lives here, do not weaken schemas or skip validation to accommodate legacy downstream code. If a downstream implementation diverges, the downstream code must be updated.

## Key Design Principles

### The Dual-Schema Pattern

Every writable entity has **two** schema definitions:

- **`<construct>.yaml`** — the full server-side object as returned in API responses, including all server-generated fields (`id`, `created_at`, `updated_at`, `deleted_at`) and `additionalProperties: false`.
- **`{Construct}Payload`** — defined in `api.yml`, containing only client-settable fields. All `POST`/`PUT` request bodies reference the Payload, never the entity schema.

See [Add a Construct]({{ '/guide/add-a-construct' | relative_url }}) for the step-by-step walkthrough.

### Casing Is Schema-Determined

Field casing isn't arbitrary — it's determined by whether the field maps to a database column:

- **DB-backed fields** use the exact `snake_case` column name
- **Non-DB fields** use `camelCase`

See [Naming Rules]({{ '/guide/naming-rules' | relative_url }}) for the complete reference.

### Versioning Is Explicit

Schema versions (`v1alpha1`, `v1beta1`, `v1beta2`) are directory-level. Partial casing migrations within a version are forbidden. If the wire format must change, introduce a new version.

See [Versioning]({{ '/guide/versioning' | relative_url }}) for the rules.

## Before You Change a Schema

<div class="callout callout-warning">
  <strong>Pre-flight checklist</strong>
  <ul>
    <li>Have you read the <a href="{{ '/guide/naming-rules' | relative_url }}">Naming Rules</a>?</li>
    <li>Does your entity follow the <a href="{{ '/guide/add-a-construct' | relative_url }}">dual-schema pattern</a>?</li>
    <li>Have you run <code>make build</code> and <code>make validate-schemas</code>?</li>
    <li>Are you only modifying schema YAML files (not generated code)?</li>
  </ul>
</div>

## Downstream Propagation Map

```
meshery/schemas (this repo)
    │
    ├──► meshery/meshery
    │       Go structs (models/)
    │       OpenAPI docs (docs/)
    │
    ├──► layer5io/meshery-cloud
    │       TypeScript types (typescript/generated/)
    │       RTK Query hooks (typescript/rtk/)
    │
    └──► npm: @meshery/schemas
            Published package consumed by any frontend
```

Changes here affect multiple repositories. Always verify with `make build` before opening a PR.


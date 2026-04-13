---
layout: guide
title: "@meshery/schemas Package Guide"
description: "Import guide for @meshery/schemas — generated TypeScript types, runtime schema constants, and deep imports."
permalink: /typescript/package-guide
---

## Installation

```bash
npm install @meshery/schemas
# or
yarn add @meshery/schemas
```

## What the Package Exports

The `@meshery/schemas` npm package provides three categories of exports:

### 1. Generated TypeScript Types

Type definitions produced by `openapi-typescript` from the bundled OpenAPI specs. These are `.d.ts` files in `typescript/generated/`.

```typescript
import type { Connection } from "@meshery/schemas";
import type { Design } from "@meshery/schemas";
import type { Component } from "@meshery/schemas";
```

### 2. Runtime Schema Constants

The `*Schema.ts` files export the raw JSON schema as a JavaScript object, usable for runtime validation:

```typescript
import { connectionSchema } from "@meshery/schemas";

// Use with any JSON Schema validator (e.g., Ajv)
const ajv = new Ajv();
const validate = ajv.compile(connectionSchema);
```

### 3. RTK Query Hooks

Pre-built API hooks for Redux Toolkit Query. See [RTK Query Hooks]({{ '/typescript/rtk-hooks' | relative_url }}).

```typescript
import { cloudApi } from "@meshery/schemas/rtk";
```

## Type Name Conventions

Generated TypeScript type names follow the schema `components/schemas` names (PascalCase):

| Schema Component    | TypeScript Type     |
| ------------------- | ------------------- |
| `Connection`        | `Connection`        |
| `ConnectionPayload` | `ConnectionPayload` |
| `ConnectionPage`    | `ConnectionPage`    |
| `Design`            | `Design`            |
| `Component`         | `Component`         |
| `Relationship`      | `Relationship`      |

<div class="callout callout-warning">
  <strong>Property names may not be PascalCase</strong>
  While type names are PascalCase, property names match the schema exactly — which may be <code>snake_case</code> for DB-backed fields. Always check the generated <code>.d.ts</code> files for actual property names.
</div>

## Deep Import Paths

For tree-shaking or direct access, use deep imports:

```typescript
// Types from specific constructs
import type { Connection } from "@meshery/schemas/typescript/generated/connection";

// RTK hooks
import { cloudApi } from "@meshery/schemas/typescript/rtk/cloudApi";
import { mesheryApi } from "@meshery/schemas/typescript/rtk/mesheryApi";

// Permissions
import { permissions } from "@meshery/schemas/typescript/permissions";
```

## Build from Source

If you need the latest unreleased types:

```bash
git clone https://github.com/meshery/schemas.git
cd schemas
make setup
make build      # Generates TS types + RTK hooks
npm run build   # Produces dist/
```

The `dist/` directory contains the bundled package ready for local linking:

```bash
cd dist
npm link
# In your project:
npm link @meshery/schemas
```

## Import Path Reference

| Import Path                               | Contents                          |
| ----------------------------------------- | --------------------------------- |
| `@meshery/schemas`                        | Main entry — re-exports all types |
| `@meshery/schemas/rtk`                    | RTK Query API hooks               |
| `@meshery/schemas/typescript/generated/*` | Per-construct generated types     |
| `@meshery/schemas/typescript/permissions` | Permission constants              |

<div class="callout callout-info">
  <strong>Do not use .d.ts in import paths</strong>
  TypeScript resolves <code>.d.ts</code> files automatically. Import from the module path without extension.
</div>

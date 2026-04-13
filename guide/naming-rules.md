---
layout: guide
title: Naming Rules
description: Definitive casing reference for every element in Meshery schemas — properties, paths, parameters, enums, and identifiers.
permalink: /guide/naming-rules
---

Every element in the API has exactly one correct casing. This page is the single authoritative reference.

## Casing Table

| Element                   | Casing                       | Example                              | Wrong                                     |
| ------------------------- | ---------------------------- | ------------------------------------ | ----------------------------------------- |
| Schema property (non-DB)  | `camelCase`                  | `schemaVersion`, `displayName`       | ~~`schema_version`~~, ~~`SchemaVersion`~~ |
| ID-suffix property        | `camelCase` + `Id`           | `modelId`, `registrantId`            | ~~`modelID`~~, ~~`model_id`~~             |
| DB-backed field           | exact `snake_case` db column | `created_at`, `user_id`, `sub_type`  | ~~`createdAt`~~, ~~`userId`~~             |
| New enum value            | `lowercase`                  | `enabled`, `ignored`                 | ~~`Enabled`~~, ~~`ENABLED`~~              |
| `components/schemas` name | `PascalCase`                 | `ModelDefinition`, `KeychainPayload` | ~~`modelDefinition`~~                     |
| File / folder name        | `lowercase`                  | `api.yml`, `keychain.yaml`           | ~~`Keychain.yaml`~~                       |
| Path segment              | `kebab-case`, plural         | `/api/role-holders`                  | ~~`/api/roleHolders`~~                    |
| Path parameter            | `camelCase` + `Id`           | `{orgId}`, `{workspaceId}`           | ~~`{orgID}`~~, ~~`{org_id}`~~             |
| `operationId`             | lower `camelCase` verbNoun   | `getAllRoles`, `createWorkspace`     | ~~`GetAllRoles`~~, ~~`get_all_roles`~~    |
| Go type name              | `PascalCase` (generated)     | `Connection`, `KeychainPayload`      | —                                         |
| Go field name             | `PascalCase` (generated)     | `CreatedAt`, `UpdatedAt`             | —                                         |
| TypeScript type name      | `PascalCase` (generated)     | `Connection`, `KeychainPayload`      | —                                         |

## The DB Rule

**The database column name is the compatibility boundary.** If a property has `x-oapi-codegen-extra-tags.db` with a `snake_case` value, the schema property name and JSON tag must use that exact snake_case name.

```yaml
# This field maps to a DB column — must be snake_case
sub_type:
  type: string
  x-oapi-codegen-extra-tags:
    db: "sub_type"

# This field does NOT map to a DB column — must be camelCase
schemaVersion:
  type: string
```

<div class="callout callout-warning">
  <strong>Same name, different casing across constructs is correct</strong>
  <code>Connection.sub_type</code> is snake_case (DB-backed), while <code>RelationshipDefinition.subType</code> is camelCase (not DB-backed). Both are correct. Casing is per-property, per-construct.
</div>

## Forbidden Migrations

**Partial casing migrations are forbidden within an API version.** Do not rename selected fields from `snake_case` to `camelCase` while leaving other published fields unchanged. If the wire format must change, introduce a new API version and migrate consistently.

## Pagination Envelope Fields

These are fixed API contract fields — always `snake_case` regardless of DB backing:

| Field         | Casing       | Note                                 |
| ------------- | ------------ | ------------------------------------ |
| `page`        | lowercase    | Query parameter and response         |
| `page_size`   | `snake_case` | Must have `minimum: 1`               |
| `total_count` | `snake_case` | Response only                        |
| `pagesize`    | lowercase    | Query parameter (published contract) |

## operationId Convention

Format: **lower camelCase verb + Noun**

| Pattern     | Example           | Wrong                                         |
| ----------- | ----------------- | --------------------------------------------- |
| List all    | `getKeychains`    | ~~`GetKeychains`~~, ~~`get_keychains`~~       |
| Get one     | `getKeychainById` | ~~`GetKeychainById`~~                         |
| Create      | `createKeychain`  | ~~`CreateKeychain`~~                          |
| Update      | `updateKeychain`  | ~~`UpdateKeychain`~~                          |
| Delete      | `deleteKeychain`  | ~~`DeleteKeychain`~~                          |
| Bulk delete | `deleteKeychains` | Via `POST .../delete`, not `DELETE` with body |

## Path Conventions

| Rule                         | Example             | Wrong                                             |
| ---------------------------- | ------------------- | ------------------------------------------------- |
| `/api` prefix                | `/api/workspaces`   | ~~`/workspaces`~~                                 |
| Plural nouns                 | `/api/environments` | ~~`/api/environment`~~                            |
| kebab-case                   | `/api/role-holders` | ~~`/api/roleHolders`~~                            |
| Parameters: camelCase + `Id` | `/api/keys/{keyId}` | ~~`/api/keys/{keyID}`~~, ~~`/api/keys/{key_id}`~~ |

### Category Prefixes

| Prefix               | Domain                                 |
| -------------------- | -------------------------------------- |
| `/api/identity/`     | Users, orgs, roles, teams, invitations |
| `/api/integrations/` | Connections, environments, credentials |
| `/api/content/`      | Designs, views, components, models     |
| `/api/entitlement/`  | Plans, subscriptions, features         |
| `/api/auth/`         | Tokens, keychains, keys                |

## Enum Values

- **New enums**: lowercase words (`enabled`, `ignored`, `duplicate`)
- **Published enums** (`x-enum-casing-exempt: true`): preserved as-is (e.g., `"Free"`, `"Team Designer"`)

## ID Properties

- Default: `format: uuid` or `$ref` to a UUID schema type
- External system IDs (Stripe, etc.): annotate with `x-id-format: external` instead

```yaml
# Normal UUID ID
connection_id:
  $ref: ../../v1alpha1/core/api.yml#/components/schemas/uuid

# External system ID
billing_id:
  type: string
  x-id-format: external
  maxLength: 500
  pattern: '^[A-Za-z0-9_\-]+$'
```

## Validation Rules Reference

The schema validator (`make validate-schemas`) enforces these per-property rules:

| Rule | What It Checks                                                                   |
| ---- | -------------------------------------------------------------------------------- |
| 37   | Every property has a `description`                                               |
| 38   | String properties have `minLength`, `maxLength`, `pattern`, `format`, or `const` |
| 39   | Numeric properties have `minimum`, `maximum`, or `const`                         |
| 40   | ID properties have `format: uuid` or `$ref` to UUID, or `x-id-format: external`  |
| 41   | Page-size properties have `minimum: 1`                                           |
| 42   | `format` values are from the known OpenAPI 3.0 / JSON Schema set                 |


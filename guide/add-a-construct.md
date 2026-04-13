---
layout: guide
title: Add a Construct
description: Step-by-step tutorial for adding a new entity schema following the dual-schema pattern, file layout conventions, and PR checklist.
permalink: /guide/add-a-construct
---

This guide walks you through adding a new entity schema to `meshery/schemas`. By the end, you'll have a fully conformant construct with entity schema, payload schema, API endpoints, and template files.

## Prerequisites

- Node.js and Go installed
- Repository cloned and dependencies installed (`make setup`)
- Familiarity with [Schema-Driven Development]({{ '/guide/schema-driven-dev' | relative_url }})

## Step 1: Create the Directory Structure

Every construct lives under `schemas/constructs/<version>/<construct>/`:

```
schemas/constructs/v1beta1/keychain/
├── api.yml                          # OpenAPI spec: endpoints + schemas
├── keychain.yaml                    # Entity (response) schema
└── templates/
    ├── keychain_template.json       # Example instance (JSON)
    └── keychain_template.yaml       # Example instance (YAML)
```

<div class="callout callout-info">
  <strong>File naming</strong>
  All files and directories use lowercase names. The construct directory, YAML files, and template files all use the singular form of the noun.
</div>

## Step 2: Define the Entity Schema

The `<construct>.yaml` file represents the **full server-side object** as returned in API responses.

**Required properties of every entity `.yaml`:**

- `type: object` at the root
- `additionalProperties: false` at the root
- All server-generated fields in `properties`: `id`, `created_at`, `updated_at`, `deleted_at`
- Server-generated fields that are always present in `required`

```yaml
# keychain.yaml
type: object
additionalProperties: false
required:
  - id
  - name
  - owner
  - created_at
  - updated_at
properties:
  id:
    $ref: ../../v1alpha1/core/api.yml#/components/schemas/uuid
    description: Unique identifier for the keychain.
  name:
    type: string
    description: Human-readable name of the keychain.
    minLength: 1
    maxLength: 500
  description:
    type: string
    description: Optional description of the keychain purpose.
    maxLength: 2000
  owner:
    $ref: ../../v1alpha1/core/api.yml#/components/schemas/uuid
    description: ID of the user who owns this keychain.
  created_at:
    $ref: ../../v1alpha1/core/api.yml#/components/schemas/created_at
    description: Timestamp when the keychain was created.
  updated_at:
    $ref: ../../v1alpha1/core/api.yml#/components/schemas/updated_at
    description: Timestamp when the keychain was last updated.
  deleted_at:
    $ref: ../../v1alpha1/core/api.yml#/components/schemas/nullTime
    description: Soft-delete timestamp; null if not deleted.
```

## Step 3: Define the Payload Schema in api.yml

For any entity with `POST` or `PUT` operations, define a `{Construct}Payload` in `api.yml` that contains **only client-settable fields**:

```yaml
components:
  schemas:
    KeychainPayload:
      type: object
      description: Payload for creating or updating a keychain.
      required:
        - name
      properties:
        id:
          $ref: ../../v1alpha1/core/api.yml#/components/schemas/uuid
          description: Existing keychain ID for updates; omit on create.
          x-oapi-codegen-extra-tags:
            json: "id,omitempty"
        name:
          type: string
          description: Human-readable name of the keychain.
          minLength: 1
          maxLength: 500
        description:
          type: string
          description: Optional description.
          maxLength: 2000
        owner:
          $ref: ../../v1alpha1/core/api.yml#/components/schemas/uuid
          description: ID of the owning user.
          x-oapi-codegen-extra-tags:
            json: "owner,omitempty"
```

<div class="callout callout-error">
  <strong>Common mistake</strong>
  Never use the full entity schema as a <code>POST</code>/<code>PUT</code> <code>requestBody</code>. This forces clients to supply server-generated fields like <code>created_at</code>. Always reference <code>*Payload</code>.
</div>

## Step 4: Define API Endpoints

In the same `api.yml`, define paths, parameters, and operations:

```yaml
openapi: 3.0.0
info:
  title: Keychain API
  version: v1beta1

security:
  - jwt: []

tags:
  - name: Keychains
    description: Operations for managing keychains.

paths:
  /api/auth/keychains:
    get:
      tags: [Keychains]
      operationId: getKeychains
      summary: List all keychains
      parameters:
        - $ref: "../core/api.yml#/components/parameters/page"
        - $ref: "../core/api.yml#/components/parameters/pagesize"
        - $ref: "../core/api.yml#/components/parameters/search"
        - $ref: "../core/api.yml#/components/parameters/order"
      responses:
        "200":
          description: Keychains list
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/KeychainPage"
    post:
      tags: [Keychains]
      operationId: createKeychain
      summary: Create a new keychain
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/KeychainPayload"
      responses:
        "201":
          description: Keychain created
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Keychain"

  /api/auth/keychains/{keychainId}:
    get:
      tags: [Keychains]
      operationId: getKeychainById
      parameters:
        - $ref: "#/components/parameters/keychainId"
      responses:
        "200":
          description: Keychain details
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Keychain"
    put:
      tags: [Keychains]
      operationId: updateKeychain
      parameters:
        - $ref: "#/components/parameters/keychainId"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/KeychainPayload"
      responses:
        "200":
          description: Keychain updated
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Keychain"
    delete:
      tags: [Keychains]
      operationId: deleteKeychain
      parameters:
        - $ref: "#/components/parameters/keychainId"
      responses:
        "204":
          description: Keychain deleted
```

### Key Conventions

| Element            | Rule                      | Example                |
| ------------------ | ------------------------- | ---------------------- |
| `operationId`      | lower camelCase verbNoun  | `createKeychain`       |
| Path segments      | kebab-case, plural        | `/api/auth/keychains`  |
| Path parameters    | camelCase + `Id`          | `{keychainId}`         |
| POST (create only) | Returns `201`             | Not `200`              |
| DELETE (single)    | Returns `204`, no body    |                        |
| Bulk delete        | `POST .../delete`         | Not `DELETE` with body |
| Every operation    | At least one `tags` entry | `[Keychains]`          |

## Step 5: Create Template Files

Add example instances in `templates/`. These are embedded in documentation and used for testing.

```json
// templates/keychain_template.json
{
  "id": "00000000-0000-0000-0000-000000000000",
  "name": "My Keychain",
  "description": "",
  "owner": "00000000-0000-0000-0000-000000000000",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z",
  "deleted_at": null
}
```

<div class="callout callout-warning">
  <strong>Value types must match the schema</strong>
  If the schema says <code>type: array</code>, use <code>[]</code> not <code>{}</code>. If <code>type: string</code>, use <code>""</code> not <code>{}</code>.
</div>

## Step 6: Verify

Run the full build and validation:

```bash
make build               # Generate Go structs + TS types + RTK clients
make validate-schemas    # Run schema validation rules
go test ./...            # Go tests
npm run build            # TypeScript distribution
```

## PR Checklist

Before opening your pull request, verify:

- [ ] `<construct>.yaml` has `additionalProperties: false`
- [ ] `<construct>.yaml` lists all server-generated fields in `properties` and `required`
- [ ] `api.yml` defines `{Construct}Payload` with only client-settable fields
- [ ] All `POST`/`PUT` `requestBody` entries reference `{Construct}Payload`
- [ ] `GET` responses reference the full `{Construct}` entity schema
- [ ] `operationId` is lower camelCase verbNoun
- [ ] Path parameters are camelCase with `Id` suffix
- [ ] No `DELETE` operation has a `requestBody`
- [ ] `POST` for creation only returns `201`
- [ ] Every operation has at least one `tags` entry
- [ ] String properties have `description`, `maxLength`
- [ ] Numeric properties have `minimum`, `maximum`
- [ ] ID properties have `format: uuid` or `x-id-format: external`
- [ ] Template files are in `templates/` with correct value types
- [ ] `make build` passes
- [ ] `make validate-schemas` passes
- [ ] Only schema YAML files are in the commit (not generated code)

## Canonical References

When uncertain, model new schemas on these constructs:

- `connection/` — `connection.yaml` + `ConnectionPayload` in `api.yml`
- `key/` — `key.yaml` + `KeyPayload` in `api.yml`
- `team/` — `team.yaml` + `teamPayload`/`teamUpdatePayload` in `api.yml`
- `environment/` — `environment.yaml` + `environmentPayload` in `api.yml`


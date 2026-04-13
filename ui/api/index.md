---
layout: page
title: API Reference
description: Interactive REST API documentation for Meshery Server and Layer5 Cloud.
permalink: /api/
---

Browse the full Meshery REST API from bundled OpenAPI specifications in this repository.

<div class="card-grid">
  <a class="card" href="{{ '/api/meshery' | relative_url }}" style="text-decoration:none;color:inherit;">
    <h3>Meshery Server API</h3>
    <p>Endpoints for the open-source Meshery Server — designs, components, models, relationships, connections, and more.</p>
    <span class="badge current">meshery_openapi.yml</span>
  </a>
  <a class="card" href="{{ '/api/cloud' | relative_url }}" style="text-decoration:none;color:inherit;">
    <h3>Layer5 Cloud API</h3>
    <p>Endpoints for Layer5 Cloud — identity, entitlements, teams, subscriptions, and cloud-specific operations.</p>
    <span class="badge current">cloud_openapi.yml</span>
  </a>
</div>

## How API Docs Are Generated

The API documentation is generated automatically from the same schema sources used for code generation:

1. Per-construct `api.yml` files define all endpoints
2. `make bundle-openapi` merges them into unified specs
3. The `x-internal` annotation controls which spec includes each path:
   - `x-internal: ["cloud"]` → `cloud_openapi.yml` only
   - `x-internal: ["meshery"]` → `meshery_openapi.yml` only
   - No annotation → included in both

## Endpoint Categories

| Category     | Prefix               | Domain                                 |
| ------------ | -------------------- | -------------------------------------- |
| Identity     | `/api/identity/`     | Users, orgs, roles, teams, invitations |
| Integrations | `/api/integrations/` | Connections, environments, credentials |
| Content      | `/api/content/`      | Designs, views, components, models     |
| Entitlement  | `/api/entitlement/`  | Plans, subscriptions, features         |
| Auth         | `/api/auth/`         | Tokens, keychains, keys                |

## Regenerating Docs Locally

```bash
# Generate the bundled OpenAPI specs
make bundle-openapi

# The specs are output to:
#   _openapi_build/meshery_openapi.yml
#   _openapi_build/cloud_openapi.yml
```

You can then open these files in any OpenAPI viewer.


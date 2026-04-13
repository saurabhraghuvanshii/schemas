---
layout: guide
title: Versioning
description: When and how to introduce a new API version for a schema construct.
permalink: /guide/versioning
---

## API Version Lifecycle

Schema constructs are organized by API version. Each version has a directory under `schemas/constructs/`:

```
schemas/constructs/
├── v1alpha1/    # Deprecated — initial experimental schemas
├── v1alpha2/    # Deprecated
├── v1alpha3/    # Deprecated
├── v1beta1/     # Migrating — stable but undergoing v1beta2 migration
└── v1beta2/     # Current — latest schema definitions
```

## Version Semantics

| Stage         | Meaning                                                                                              |
| ------------- | ---------------------------------------------------------------------------------------------------- |
| `v1alpha*`    | Experimental. Breaking changes expected. No stability guarantees.                                    |
| `v1beta1`     | Stable but with known style/casing violations from initial migration. Being superseded by `v1beta2`. |
| `v1beta2`     | Current target. Consistent casing, full validation compliance.                                       |
| `v1` (future) | GA. Wire-format stability guaranteed.                                                                |

## When to Introduce a New Version

Add a new API version when:

1. **Wire-format changes** — renaming published JSON property names (e.g., `sub_type` → `subType`)
2. **Structural changes** — removing required fields, changing field types, restructuring nested objects
3. **Casing corrections** — fixing snake_case → camelCase for non-DB fields across a resource

**Do NOT introduce a new version for:**

- Adding new optional fields to an existing resource
- Adding new endpoints
- Adding new enum values
- Fixing descriptions or documentation

## The Partial Migration Ban

<div class="callout callout-error">
  <strong>Partial casing migrations are forbidden within an API version</strong>
  Do not rename selected fields within the same resource from <code>snake_case</code> to <code>camelCase</code> while leaving other published fields unchanged. Either migrate the entire resource in a new version, or leave it as-is.
</div>

This prevents a confusing mix of casings in the same API response. Clients should be able to assume consistent field naming within a single version of a resource.

## Deprecation Process

1. Add `x-deprecated: true` and `x-superseded-by: <new-version>` to the `info` section of the old `api.yml`
2. Create the new version directory with the corrected schemas
3. The validation rules skip deprecated constructs — known violations won't block CI
4. Update downstream consumers to reference the new version
5. The old version remains for backward compatibility until all consumers have migrated

```yaml
# In the deprecated api.yml
info:
  title: Connection API
  version: v1beta1
  x-deprecated: true
  x-superseded-by: v1beta2
```

## Construct Version Matrix

| Construct    | v1alpha1 | v1beta1 | v1beta2 |
| ------------ | -------- | ------- | ------- |
| academy      | —        | ✓       | ✓       |
| capability   | ✓        | ✓       | —       |
| catalog      | —        | ✓       | ✓       |
| component    | ✓        | ✓       | ✓       |
| connection   | —        | ✓       | ✓       |
| credential   | —        | ✓       | —       |
| design       | —        | ✓       | ✓       |
| environment  | —        | ✓       | —       |
| evaluation   | —        | ✓       | —       |
| event        | —        | ✓       | ✓       |
| feature      | —        | ✓       | —       |
| invitation   | —        | ✓       | ✓       |
| key          | —        | ✓       | —       |
| keychain     | —        | ✓       | —       |
| model        | ✓        | ✓       | —       |
| organization | —        | ✓       | —       |
| plan         | —        | ✓       | ✓       |
| relationship | ✓        | ✓       | ✓       |
| role         | —        | ✓       | —       |
| selector     | ✓        | ✓       | ✓       |
| subscription | —        | ✓       | ✓       |
| team         | —        | ✓       | —       |
| token        | —        | ✓       | ✓       |
| user         | —        | ✓       | —       |
| view         | —        | ✓       | —       |
| workspace    | —        | ✓       | —       |


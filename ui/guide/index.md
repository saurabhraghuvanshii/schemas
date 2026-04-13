---
layout: page
title: Guide
description: Learn how to work with Meshery Schemas — from understanding schema-driven development to adding your first construct.
permalink: /guide/
---

Everything you need to contribute to or consume Meshery's central schema repository.

## Getting Started

<div class="card-grid">
  <a class="card" href="{{ '/guide/schema-driven-dev' | relative_url }}" style="text-decoration:none;color:inherit;">
    <h3>Schema-Driven Development</h3>
    <p>Understand how YAML schemas propagate into Go structs, TypeScript types, and API docs across the Meshery ecosystem.</p>
  </a>
  <a class="card" href="{{ '/guide/add-a-construct' | relative_url }}" style="text-decoration:none;color:inherit;">
    <h3>Add a Construct</h3>
    <p>Step-by-step tutorial: create an entity schema, define a payload, wire up endpoints, and pass validation.</p>
  </a>
</div>

## Reference

<div class="card-grid">
  <a class="card" href="{{ '/guide/naming-rules' | relative_url }}" style="text-decoration:none;color:inherit;">
    <h3>Naming Rules</h3>
    <p>The definitive casing cheat sheet — camelCase, snake_case, PascalCase, kebab-case, and when each one applies.</p>
  </a>
  <a class="card" href="{{ '/guide/versioning' | relative_url }}" style="text-decoration:none;color:inherit;">
    <h3>Versioning</h3>
    <p>When to introduce a new API version, the deprecation process, and the construct version matrix.</p>
  </a>
  <a class="card" href="{{ '/guide/build-pipeline' | relative_url }}" style="text-decoration:none;color:inherit;">
    <h3>Build Pipeline</h3>
    <p>How <code>make build</code> transforms schemas into generated code — every target, prerequisite, and failure mode.</p>
  </a>
</div>

## Quick Links

- [Constructs browser]({{ '/constructs/' | relative_url }}) — browse all constructs with version filter
- [Interactive validator]({{ '/validate/' | relative_url }}) — validate YAML/JSON against a schema
- [API reference]({{ '/api/' | relative_url }}) — bundled OpenAPI specs for Meshery and Cloud APIs
- [Go structs]({{ '/go/structs' | relative_url }}) — generated struct reference
- [TypeScript package]({{ '/typescript/package-guide' | relative_url }}) — `@meshery/schemas` import guide
- [GitHub repository](https://github.com/meshery/schemas) — source code


---
layout: default
title: Meshery Schemas
---

<div class="page-content">
  <div class="hero">
    <h1>Meshery Schemas</h1>
    <p class="lead">
      The central schema repository for the Meshery platform. Browse constructs, validate
      documents, explore the REST API, and learn schema-driven development.
    </p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="{{ '/guide/schema-driven-dev' | relative_url }}">Get Started</a>
      <a class="btn btn-outline" href="{{ '/constructs/' | relative_url }}">Browse Constructs</a>
      <a class="btn btn-outline" href="{{ '/validate/' | relative_url }}">Validate a Document</a>
    </div>
  </div>

  <div class="section">
    <div class="section-header">
      <h2>What Can You Do Here?</h2>
      <p>Everything you need to work with Meshery's schema-driven architecture.</p>
    </div>
    <div class="card-grid">
      <a class="card" href="{{ '/validate/' | relative_url }}" style="text-decoration:none;color:inherit;">
        <h3>Validate</h3>
        <p>Paste a YAML or JSON document and validate it against any published construct schema — no repo clone needed.</p>
      </a>
      <a class="card" href="{{ '/constructs/' | relative_url }}" style="text-decoration:none;color:inherit;">
        <h3>Explore Constructs</h3>
        <p>Browse every construct across all API versions — property tables, required fields, and example values.</p>
      </a>
      <a class="card" href="{{ '/api/meshery' | relative_url }}" style="text-decoration:none;color:inherit;">
        <h3>API Reference</h3>
        <p>Interactive, browsable REST API docs for Meshery Server and Layer5 Cloud, powered by ReDoc.</p>
      </a>
      <a class="card" href="{{ '/guide/add-a-construct' | relative_url }}" style="text-decoration:none;color:inherit;">
        <h3>Add a Construct</h3>
        <p>Step-by-step guide to adding a new entity schema following the dual-schema pattern.</p>
      </a>
      <a class="card" href="{{ '/guide/naming-rules' | relative_url }}" style="text-decoration:none;color:inherit;">
        <h3>Naming Rules</h3>
        <p>Single-page cheat sheet for every casing rule — camelCase, snake_case, PascalCase, and when each applies.</p>
      </a>
      <a class="card" href="{{ '/guide/build-pipeline' | relative_url }}" style="text-decoration:none;color:inherit;">
        <h3>Build Pipeline</h3>
        <p>Understand how YAML schemas flow through code generators into Go structs, TypeScript types, and RTK hooks.</p>
      </a>
      <a class="card" href="{{ '/go/structs' | relative_url }}" style="text-decoration:none;color:inherit;">
        <h3>Go Structs</h3>
        <p>Browse auto-generated Go structs for every construct, with JSON tags and schema property mappings.</p>
      </a>
      <a class="card" href="{{ '/typescript/package-guide' | relative_url }}" style="text-decoration:none;color:inherit;">
        <h3>TypeScript Package</h3>
        <p>Import guide for <code>@meshery/schemas</code> — types, RTK Query hooks, and runtime schema constants.</p>
      </a>
    </div>
  </div>

  <div class="section">
    <div class="section-header">
      <h2>Quick Install</h2>
    </div>
    <div class="comparison">
      <div>
        <h4>Go</h4>
        <pre><code>go get github.com/meshery/schemas@latest</code></pre>
      </div>
      <div>
        <h4>TypeScript / npm</h4>
        <pre><code>npm install @meshery/schemas</code></pre>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-header">
      <h2>Construct Versions at a Glance</h2>
      <p>Current API versions available in the repository.</p>
    </div>
    <table>
      <thead>
        <tr><th>Version</th><th>Status</th><th>Constructs</th></tr>
      </thead>
      <tbody>
        <tr>
          <td><code>v1beta2</code></td>
          <td><span class="version-badge">current</span></td>
          <td>academy, catalog, component, connection, design, event, invitation, plan, relationship, selector, subscription, token</td>
        </tr>
        <tr>
          <td><code>v1beta1</code></td>
          <td><span class="version-badge deprecated">migrating</span></td>
          <td>31 constructs — academy, badge, capability, catalog, category, component, connection, credential, design, environment, evaluation, event, feature, invitation, key, keychain, model, organization, plan, relationship, role, schedule, selector, subcategory, subscription, team, token, user, view, workspace, and more</td>
        </tr>
        <tr>
          <td><code>v1alpha3</code></td>
          <td><span class="version-badge deprecated">deprecated</span></td>
          <td>relationship</td>
        </tr>
        <tr>
          <td><code>v1alpha2</code></td>
          <td><span class="version-badge deprecated">deprecated</span></td>
          <td>relationship</td>
        </tr>
        <tr>
          <td><code>v1alpha1</code></td>
          <td><span class="version-badge deprecated">deprecated</span></td>
          <td>capability, catalog_data, component, core, model, relationship, selector</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>


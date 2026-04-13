---
layout: page
title: Constructs
description: Browse every Meshery schema construct across all API versions — property tables, required fields, and example values.
permalink: /constructs/
---

<p>Every Meshery resource type is defined as a <strong>construct</strong> — an OpenAPI schema with entity definition, payload schema, and API endpoints. Use the version filter to browse constructs by API version.</p>

<div class="version-filter" id="version-filter">
  <button class="active" data-version="all">All</button>
  <button data-version="v1beta2">v1beta2 (current)</button>
  <button data-version="v1beta1">v1beta1</button>
  <button data-version="v1alpha1">v1alpha1</button>
</div>

<div class="card-grid" id="constructs-grid">

  <!-- v1beta2 constructs -->
  <div class="card" data-versions="v1beta2 v1beta1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta2/academy">academy</a></h3>
    <span class="badge current">v1beta2</span><span class="badge">v1beta1</span>
    <p>Academy curricula and learning resources.</p>
  </div>

  <div class="card" data-versions="v1beta1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta1/badge">badge</a></h3>
    <span class="badge">v1beta1</span>
    <p>Achievement badges for users.</p>
  </div>

  <div class="card" data-versions="v1beta1 v1alpha1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta1/capability">capability</a></h3>
    <span class="badge">v1beta1</span><span class="badge">v1alpha1</span>
    <p>Capabilities of models and components.</p>
  </div>

  <div class="card" data-versions="v1beta2 v1beta1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta2/catalog">catalog</a></h3>
    <span class="badge current">v1beta2</span><span class="badge">v1beta1</span>
    <p>Catalog entries and published designs.</p>
  </div>

  <div class="card" data-versions="v1beta1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta1/category">category</a></h3>
    <span class="badge">v1beta1</span>
    <p>Model categories and groupings.</p>
  </div>

  <div class="card" data-versions="v1beta2 v1beta1 v1alpha1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta2/component">component</a></h3>
    <span class="badge current">v1beta2</span><span class="badge">v1beta1</span><span class="badge">v1alpha1</span>
    <p>Infrastructure components — the building blocks of designs.</p>
  </div>

  <div class="card" data-versions="v1beta2 v1beta1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta2/connection">connection</a></h3>
    <span class="badge current">v1beta2</span><span class="badge">v1beta1</span>
    <p>Managed connections to infrastructure providers.</p>
  </div>

  <div class="card" data-versions="v1beta1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta1/credential">credential</a></h3>
    <span class="badge">v1beta1</span>
    <p>Stored credentials for connections.</p>
  </div>

  <div class="card" data-versions="v1beta2 v1beta1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta2/design">design</a></h3>
    <span class="badge current">v1beta2</span><span class="badge">v1beta1</span>
    <p>Infrastructure designs — composable configurations managed visually.</p>
  </div>

  <div class="card" data-versions="v1beta1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta1/environment">environment</a></h3>
    <span class="badge">v1beta1</span>
    <p>Deployment environments grouping connections.</p>
  </div>

  <div class="card" data-versions="v1beta1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta1/evaluation">evaluation</a></h3>
    <span class="badge">v1beta1</span>
    <p>Policy evaluation results.</p>
  </div>

  <div class="card" data-versions="v1beta2 v1beta1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta2/event">event</a></h3>
    <span class="badge current">v1beta2</span><span class="badge">v1beta1</span>
    <p>System events and notifications.</p>
  </div>

  <div class="card" data-versions="v1beta1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta1/feature">feature</a></h3>
    <span class="badge">v1beta1</span>
    <p>Plan features and entitlements.</p>
  </div>

  <div class="card" data-versions="v1beta2 v1beta1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta2/invitation">invitation</a></h3>
    <span class="badge current">v1beta2</span><span class="badge">v1beta1</span>
    <p>Team and organization invitations.</p>
  </div>

  <div class="card" data-versions="v1beta1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta1/key">key</a></h3>
    <span class="badge">v1beta1</span>
    <p>API keys for authentication.</p>
  </div>

  <div class="card" data-versions="v1beta1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta1/keychain">keychain</a></h3>
    <span class="badge">v1beta1</span>
    <p>Key grouping containers.</p>
  </div>

  <div class="card" data-versions="v1beta1 v1alpha1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta1/model">model</a></h3>
    <span class="badge">v1beta1</span><span class="badge">v1alpha1</span>
    <p>Infrastructure models defining components and relationships.</p>
  </div>

  <div class="card" data-versions="v1beta1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta1/organization">organization</a></h3>
    <span class="badge">v1beta1</span>
    <p>Multi-tenant organizations.</p>
  </div>

  <div class="card" data-versions="v1beta2 v1beta1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta2/plan">plan</a></h3>
    <span class="badge current">v1beta2</span><span class="badge">v1beta1</span>
    <p>Subscription plans and pricing tiers.</p>
  </div>

  <div class="card" data-versions="v1beta2 v1beta1 v1alpha1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta2/relationship">relationship</a></h3>
    <span class="badge current">v1beta2</span><span class="badge">v1beta1</span><span class="badge">v1alpha1</span>
    <p>Relationships between components — edges in the MeshMap graph.</p>
  </div>

  <div class="card" data-versions="v1beta1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta1/role">role</a></h3>
    <span class="badge">v1beta1</span>
    <p>RBAC roles and permissions.</p>
  </div>

  <div class="card" data-versions="v1beta1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta1/schedule">schedule</a></h3>
    <span class="badge">v1beta1</span>
    <p>Scheduled operations.</p>
  </div>

  <div class="card" data-versions="v1beta2 v1beta1 v1alpha1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta2/selector">selector</a></h3>
    <span class="badge current">v1beta2</span><span class="badge">v1beta1</span><span class="badge">v1alpha1</span>
    <p>Selectors for matching components in relationships.</p>
  </div>

  <div class="card" data-versions="v1beta1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta1/subcategory">subcategory</a></h3>
    <span class="badge">v1beta1</span>
    <p>Model subcategories.</p>
  </div>

  <div class="card" data-versions="v1beta2 v1beta1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta2/subscription">subscription</a></h3>
    <span class="badge current">v1beta2</span><span class="badge">v1beta1</span>
    <p>User and organization subscriptions.</p>
  </div>

  <div class="card" data-versions="v1beta1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta1/team">team</a></h3>
    <span class="badge">v1beta1</span>
    <p>Teams within organizations.</p>
  </div>

  <div class="card" data-versions="v1beta2 v1beta1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta2/token">token</a></h3>
    <span class="badge current">v1beta2</span><span class="badge">v1beta1</span>
    <p>Authentication tokens.</p>
  </div>

  <div class="card" data-versions="v1beta1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta1/user">user</a></h3>
    <span class="badge">v1beta1</span>
    <p>User accounts and profiles.</p>
  </div>

  <div class="card" data-versions="v1beta1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta1/view">view</a></h3>
    <span class="badge">v1beta1</span>
    <p>Saved views of designs.</p>
  </div>

  <div class="card" data-versions="v1beta1">
    <h3><a href="https://github.com/meshery/schemas/tree/master/schemas/constructs/v1beta1/workspace">workspace</a></h3>
    <span class="badge">v1beta1</span>
    <p>Workspaces grouping environments and designs.</p>
  </div>

</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  var buttons = document.querySelectorAll('#version-filter button');
  var cards = document.querySelectorAll('#constructs-grid .card');

  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      buttons.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var version = btn.getAttribute('data-version');
      cards.forEach(function(card) {
        if (version === 'all' || card.getAttribute('data-versions').indexOf(version) !== -1) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
});
</script>


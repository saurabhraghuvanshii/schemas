---
layout: page
title: Constructs
description: Browse every Meshery schema construct across all API versions — property tables, required fields, and example values.
permalink: /constructs/
---

<p>Every Meshery resource type is defined as a <strong>construct</strong> — an OpenAPI schema with entity definition, payload schema, and API endpoints. Use the version filter to browse constructs by API version.</p>

<div class="version-filter" id="version-filter">
  <button class="active" data-version="all">All</button>
  {% for v in site.data.constructs.versions %}
  {% if v == site.data.constructs.versions.first %}
  <button data-version="{{ v }}">{{ v }} (current)</button>
  {% else %}
  <button data-version="{{ v }}">{{ v }}</button>
  {% endif %}
  {% endfor %}
</div>

<div class="card-grid" id="constructs-grid">
  {% for item in site.data.constructs.items %}
  <div class="card" data-versions="{{ item.versions | join: ' ' }}">
    <h3><a href="{{ '/constructs/detail' | relative_url }}?name={{ item.name }}&amp;version={{ item.latestVersion }}">{{ item.name }}</a></h3>
    {% for v in item.versions %}
    {% if v == item.latestVersion %}
    <span class="badge current">{{ v }}</span>
    {% else %}
    <span class="badge">{{ v }}</span>
    {% endif %}
    {% endfor %}
    {% if item.hasApi %}<span class="badge" style="background:#e8f5e9;color:#2e7d32">API</span>{% endif %}
    {% if item.description != "" %}
    <p>{{ item.description }}</p>
    {% else %}
    <p>{{ item.name | capitalize }} schema construct.</p>
    {% endif %}
  </div>
  {% endfor %}
</div>

<p class="text-muted" style="margin-top:1.5rem;font-size:0.85rem">
  {{ site.data.constructs.items | size }} constructs across {{ site.data.constructs.versions | size }} API versions.
  Data auto-generated from <code>schemas/constructs/</code> at build time.
</p>

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

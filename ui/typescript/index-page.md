---
layout: page
title: TypeScript Reference
description: TypeScript consumer reference for @meshery/schemas — types, RTK Query hooks, and import paths.
permalink: /typescript/
---

<div class="card-grid">
  <a class="card" href="{{ '/typescript/package-guide' | relative_url }}" style="text-decoration:none;color:inherit;">
    <h3>Package Guide</h3>
    <p>What <code>@meshery/schemas</code> exports, how to import types, and how to use runtime schema constants.</p>
  </a>
  <a class="card" href="{{ '/typescript/rtk-hooks' | relative_url }}" style="text-decoration:none;color:inherit;">
    <h3>RTK Query Hooks</h3>
    <p>How to use the generated <code>cloudApi</code> and <code>mesheryApi</code> hooks in a React/Redux app.</p>
  </a>
</div>

## Quick Start

```bash
npm install @meshery/schemas
```

```typescript
import type { Connection } from "@meshery/schemas";
import { cloudApi } from "@meshery/schemas/rtk";
```

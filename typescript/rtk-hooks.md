---
layout: guide
title: RTK Query Hooks Guide
description: How to use the generated RTK Query hooks for Meshery API and Layer5 Cloud API in a React/Redux app.
permalink: /typescript/rtk-hooks
---

## What Are RTK Query Hooks?

[RTK Query](https://redux-toolkit.js.org/rtk-query/overview) is the data-fetching solution built into Redux Toolkit. The `@meshery/schemas` package ships pre-generated API definitions that you can integrate into any React/Redux app.

Two API definitions are generated:

| API          | Source Spec           | Generated File                 |
| ------------ | --------------------- | ------------------------------ |
| `cloudApi`   | `cloud_openapi.yml`   | `typescript/rtk/cloudApi.ts`   |
| `mesheryApi` | `meshery_openapi.yml` | `typescript/rtk/mesheryApi.ts` |

## Setup

### 1. Install Dependencies

```bash
npm install @meshery/schemas @reduxjs/toolkit react-redux
```

### 2. Add the API to Your Store

```typescript
import { configureStore } from "@reduxjs/toolkit";
import { cloudApi } from "@meshery/schemas/rtk";

export const store = configureStore({
  reducer: {
    [cloudApi.reducerPath]: cloudApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(cloudApi.middleware),
});
```

### 3. Wrap Your App with the Provider

```typescript
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <YourApp />
    </Provider>
  );
}
```

## Using the Hooks

Each endpoint in the OpenAPI spec generates a corresponding hook:

```typescript
import { cloudApi } from '@meshery/schemas/rtk';

// In a component:
function ConnectionList() {
  const { data, isLoading, error } = cloudApi.useGetConnectionsQuery({
    page: 1,
    pagesize: 10,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading connections</div>;

  return (
    <ul>
      {data?.connections?.map((conn) => (
        <li key={conn.id}>{conn.name}</li>
      ))}
    </ul>
  );
}
```

## Hook Naming Convention

Hook names are derived from the `operationId` in the OpenAPI spec:

| operationId        | Query Hook               | Mutation Hook                 |
| ------------------ | ------------------------ | ----------------------------- |
| `getConnections`   | `useGetConnectionsQuery` | —                             |
| `createConnection` | —                        | `useCreateConnectionMutation` |
| `updateConnection` | —                        | `useUpdateConnectionMutation` |
| `deleteConnection` | —                        | `useDeleteConnectionMutation` |
| `getDesigns`       | `useGetDesignsQuery`     | —                             |

- **GET operations** → `use{OperationId}Query`
- **POST/PUT/DELETE** → `use{OperationId}Mutation`

## Mutations

```typescript
function CreateConnectionButton() {
  const [createConnection, { isLoading }] =
    cloudApi.useCreateConnectionMutation();

  const handleCreate = async () => {
    try {
      const result = await createConnection({
        name: 'My New Connection',
        kind: 'kubernetes',
        sub_type: 'config',
      }).unwrap();
      console.log('Created:', result.id);
    } catch (err) {
      console.error('Failed:', err);
    }
  };

  return (
    <button onClick={handleCreate} disabled={isLoading}>
      Create Connection
    </button>
  );
}
```

## Cache Invalidation

RTK Query handles caching automatically. To invalidate after mutations:

```typescript
// The generated API includes tag-based invalidation
// Mutations automatically invalidate related queries
```

## Customizing Base URL

The generated API uses a default base URL. Override it in your store setup:

```typescript
import { cloudApi } from "@meshery/schemas/rtk";

const customizedApi = cloudApi.enhanceEndpoints({
  // Add custom configuration
});

// Or override the baseUrl via fetchBaseQuery configuration
```

## Both APIs in One Store

```typescript
import { configureStore } from "@reduxjs/toolkit";
import { cloudApi } from "@meshery/schemas/rtk";
import { mesheryApi } from "@meshery/schemas/rtk";

export const store = configureStore({
  reducer: {
    [cloudApi.reducerPath]: cloudApi.reducer,
    [mesheryApi.reducerPath]: mesheryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cloudApi.middleware).concat(mesheryApi.middleware),
});
```


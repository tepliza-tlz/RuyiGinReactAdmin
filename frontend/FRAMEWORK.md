# Admin Framework — Config-Driven Admin System

A generic, config-driven admin management framework for React + TypeScript + Vite.  
**Change one config file, swap your page components, and you have a new admin system.**

Built on and extracted from the RuyiGinReactAdmin project.

---

## Architecture Overview

```
src/
├── config/
│   ├── types.ts          ← All TypeScript interfaces (menu, route, permission, theme, api, plugin)
│   ├── admin.config.ts   ← ★ THE FILE YOU CHANGE for a new project
│   └── ConfigContext.tsx  ← ConfigProvider + useConfig() + useMenu() hooks
├── theme/
│   ├── ThemeProvider.tsx  ← Multi-theme provider, applies CSS vars to :root
│   └── themes/
│       ├── ruyi.ts        ← Dark 国风科技蓝 theme
│       └── light.ts       ← Light 清雅白 theme
├── plugins/
│   ├── PluginManager.ts   ← Plugin registry, slot system, middleware pipeline
│   └── analytics.ts       ← Example plugin (page tracking + API logging)
├── api/
│   ├── ApiClient.ts       ← Mock/real switching + middleware pipeline
│   └── services/
│       ├── dashboard.ts   ← Dashboard API with mock data
│       └── users.ts       ← Users CRUD API with mock data + pagination
├── router/
│   └── AppRouter.tsx      ← Hash-based router, renders from config.routes
├── pages/
│   ├── Dashboard.tsx       ← Real dashboard (already existed)
│   └── UserList.tsx, ...   ← Placeholder pages — replace with your own
├── components/
│   ├── Layout.tsx          ← Layout wrapper (named export + default)
│   ├── Sidebar.tsx         ← ★ Now reads from useMenu() (config-driven)
│   └── Header.tsx          ← ★ Now uses config.app + theme switcher
└── App.tsx                 ← Bootstrap: config → theme → api → plugins → render
```

---

## Four Pillars

### 1. Config System — Single File, Everything Defined

Everything flows from `src/config/admin.config.ts`. It defines:

| Section | What it controls |
|---------|-----------------|
| `app` | Name, logo, version, description |
| `permissions` | All permission keys with labels |
| `menu` | Sidebar structure (nested, badges, dividers, permission-gated) |
| `routes` | URL paths → page components (lazy-loaded), permissions |
| `theme` | Available themes + default |
| `api` | Mock/real mode, baseURL, timeout, mock delay |
| `plugins` | Array of plugin definitions to install |

**Key interfaces:**
```typescript
interface AdminConfig {
  app: AppInfo;
  menu: MenuItemConfig[];
  routes: RouteConfig[];
  permissions: PermissionConfig[];
  theme: { defaultTheme: string; themes: ThemeDefinition[] };
  api: ApiConfig;
  plugins: AdminPlugin[];
  getUserPermissions?: () => string[];
}
```

**Permission model:** `'admin'` grants everything. Supports hierarchical matching (`'user'` matches `'user:*'`, `'user:view'`, etc.).

### 2. Theme System — Add Themes Without Code Changes

**How to add a theme:**
1. Create a file like `src/theme/themes/forest.ts`
2. Export a `ThemeDefinition` object with CSS variables
3. Add it to the `theme.themes` array in `admin.config.ts`

That's it. The `ThemeProvider` applies CSS vars to `:root` and sets `data-theme="forest"` for conditional CSS. Users cycle themes via the header button. Preference is persisted in localStorage.

**Two themes included:**
- `ruyi` — dark 国风科技蓝 (the original)
- `light` — clean light 清雅白

### 3. Plugin System — Extend Without Touching Core Code

Plugins can:
| Capability | API |
|-----------|-----|
| Run at boot | `install(ctx)` — async |
| Hook route changes | `onRouteChange(from, to)` |
| Inject UI into slots | `ctx.addSlotComponent('slot-name', Component)` |
| Add API middleware | `ctx.addMiddleware({ onRequest, onResponse, onError })` |
| Register extra routes | `ctx.addRoute(route)` |
| Access other plugins | `ctx.getPlugin('name')` |
| Cleanup | `uninstall()` |

**Example — Analytics plugin** (`src/plugins/analytics.ts`): Logs page views, wraps API calls, injects a visitor counter component.

### 4. Mock/Real API — One-Line Switch

**To switch:** Change `api.mode` in `admin.config.ts`:
```typescript
api: { mode: 'mock' }   // → mock data, no backend needed
api: { mode: 'real' }   // → real HTTP calls to baseURL
api: { mode: 'auto' }   // → mock in dev, real in production
```

**Each service file** (e.g. `src/api/services/users.ts`) exports three things:
1. **TypeScript interfaces** — `User`, `UserQuery`, `PaginatedResponse<T>`
2. **Mock endpoints** — `usersMocks: MockEndpointMap` (used in mock mode)
3. **API methods** — `usersApi.list()`, `usersApi.getById()`, etc. (same API in both modes)

Components call `usersApi.list({ page: 1 })` — it works identically in mock and real mode.

**Middleware pipeline:** All requests flow through middleware (auth token injection, logging, error normalization). Plugins can add custom middleware.

---

## How to Copy to a New Project

```bash
# 1. Copy the framework layer
cp -r src/config/       new-project/src/config/
cp -r src/theme/        new-project/src/theme/
cp -r src/plugins/      new-project/src/plugins/
cp -r src/api/          new-project/src/api/
cp -r src/router/       new-project/src/router/
cp src/App.tsx          new-project/src/App.tsx
cp src/main.tsx         new-project/src/main.tsx

# 2. Edit ONE file: src/config/admin.config.ts
#    - Change app.name, app.logo, app.description
#    - Define your menu items, routes, permissions
#    - Point routes to your page components
#    - Set api.baseURL to your backend

# 3. Create your page components in src/pages/
#    - Each page uses dashboardApi, usersApi, etc.
#    - Or create new API services in src/api/services/

# 4. Optionally: create new themes in src/theme/themes/
#    and new plugins in src/plugins/

# 5. Run
npm run dev
```

---

## Routing

Uses hash-based routing (`#/dashboard`, `#/users`, etc.) — no server config needed.  
The `AppRouter` component matches `window.location.hash` against `config.routes` and renders the corresponding lazy-loaded component.

Navigation from any component:
```typescript
import { useHashRouter } from '../router/AppRouter';
const { navigate } = useHashRouter();
navigate('/users');
```

---

## Permission Guarding

Three layers:
1. **Route level** — `RouteConfig.permission` blocks access, shows 404
2. **Menu level** — `MenuItemConfig.permission` hides menu items from sidebar
3. **API level** — check permissions in service methods (optional)

```typescript
// In your component:
const { hasPermission } = useConfig();
if (hasPermission('user:delete')) {
  // show delete button
}
```

---

## File Summary

| File | Purpose |
|------|---------|
| `src/config/types.ts` | All TypeScript interfaces (270 lines) |
| `src/config/admin.config.ts` | **Single config file** — change for new projects |
| `src/config/ConfigContext.tsx` | React context + `useConfig()` + `useMenu()` |
| `src/theme/ThemeProvider.tsx` | Multi-theme engine |
| `src/theme/themes/ruyi.ts` | Dark theme definition |
| `src/theme/themes/light.ts` | Light theme definition |
| `src/plugins/PluginManager.ts` | Plugin lifecycle + slot registry + middleware |
| `src/plugins/analytics.ts` | Example plugin |
| `src/api/ApiClient.ts` | Mock/real client + middleware pipeline |
| `src/api/services/dashboard.ts` | Dashboard API + mock data |
| `src/api/services/users.ts` | Users CRUD API + mock data + pagination |
| `src/router/AppRouter.tsx` | Hash-based config-driven router |
| `src/App.tsx` | Bootstrap: config → theme → api → plugins → render |
| `src/components/Sidebar.tsx` | Now config-driven via `useMenu()` |
| `src/components/Header.tsx` | Now uses `useConfig()` + theme switcher |
| `src/pages/*.tsx` | Page components (Dashboard is real, rest are placeholders) |

**Build output:** `tsc --noEmit` passes clean. `vite build` produces 13 chunks with proper code-splitting (each page is a separate lazy-loaded chunk).

---

## Adding a New Page (Step-by-Step)

```typescript
// 1. Create src/pages/ProductList.tsx
export default function ProductList() {
  return <div>产品列表</div>;
}

// 2. In admin.config.ts, add to menu:
menu: [
  ...,
  { key: 'products', label: '产品管理', icon: '📦', route: '/products', permission: 'product:view' },
]

// 3. In admin.config.ts, add to routes:
routes: [
  ...,
  { key: 'products', path: '/products', title: '产品管理', permission: 'product:view',
    component: { type: 'lazy', loader: () => import('../pages/ProductList') } },
]

// 4. In admin.config.ts, add permission:
permissions: [
  ...,
  { key: 'product:view', label: '查看产品' },
]
```

Done. Menu item appears, clicking navigates to `#/products`, page lazy-loads.

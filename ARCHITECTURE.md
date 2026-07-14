# 如意 Admin — Component Library Architecture

> **Design target:** A reusable React admin shell template. Copy to a new repo, change one folder, rebuild any admin system.

---<img width="1912" height="917" alt="image" src="https://github.com/user-attachments/assets/37a3fd4b-c740-4dff-8383-797ff5daed48" />


## 1. Current State Audit

| File | Category | Problem |
|---|---|---|
| `Header.tsx` | Layout shell | Hardcoded brand name (如意), subtitle, user name (张大鹏), avatar initial |
| `Sidebar.tsx` | Layout shell | Hardcoded menu items, labels, icons, badges — all Chinese strings in component body |
| `Layout.tsx` | Layout shell | Directly imports `ParticleBackground` — no way to swap or disable backgrounds |
| `ParticleBackground.tsx` | Visual effect | Fine as-is — pure canvas, no business logic |
| `AmbientParticles.tsx` | Visual effect | Fine as-is — pure CSS particle effect |
| `Dashboard.tsx` | Page | ALL data (`statsCards`, `quickActions`, `activities`) is hardcoded inline; `StatCard` is a private subcomponent trapped inside the page file |
| `useTilt.ts` | Hook | Generic — no issues |
| `useRipple.ts` | Hook | Generic — no issues |
| `useScrollReveal.ts` | Hook | Generic — no issues |
| `theme.css` | Style | CSS variables + glass classes + animations — good foundation |
| `modern-enhancements.css` | Style | Extended effects — too large (622 lines), could split further |
| `App.tsx` | Entry | No router, hardcoded `<Layout><Dashboard /></Layout>` |

**Root cause:** Nearly every component has project-specific data baked in. There is no "config" layer. Starting a new admin means rewriting Header, Sidebar, and Dashboard every time.

---

## 2. Design Principles

1. **The `config/` folder is the contract.** When you start a new project, you change files in `config/` — not in `lib/`, not in `features/`, not in `pages/`. All hardcoded strings/structures move to config.

2. **Four-layer separation.** Every file lives in exactly one layer:

   | Layer | Folder | What it is | Depends on |
   |---|---|---|---|
   | **L1: Primitives** | `lib/primitives/` | Pure UI atoms: Button, Card, Badge, Avatar | Nothing except hooks |
   | **L2: Layout shells** | `lib/layout/` | Page frame: AdminLayout, HeaderBar, SidebarNav | L1 primitives |
   | **L3: Business** | `features/` | Domain composites: StatCard, ActivityFeed, UserMenu | L1 + L2 + hooks |
   | **L4: Pages** | `pages/` | Route-level page components | L3 business components |

3. **Every component is independently importable.** Each component file is self-contained with its own types. No cross-imports between sibling features. Barrel `index.ts` at every directory level.

4. **Config, not code, defines a project.** `config/app.ts` has the brand name, logo, version. `config/menu.ts` has the sidebar tree. `config/mock-user.ts` has the current user. Changing these three files rebrands the entire admin.

---

## 3. Proposed Directory Tree

```
frontend/src/
│
├── main.tsx                          # ReactDOM.createRoot — never changes between projects
├── App.tsx                           # <Providers><Router /><Providers> — minimal shell
│
├── lib/                              # ★ REUSABLE CORE ★ — copy this folder as-is to any new admin
│   │
│   ├── primitives/                   # L1: UI atoms — no business logic, no config
│   │   ├── index.ts                  # barrel: export { Button } from './Button'; ...
│   │   ├── Button.tsx                # glass-styled button, variants: primary / ghost / icon
│   │   ├── Card.tsx                  # glass card wrapper (card-3d, glow-border support)
│   │   ├── Badge.tsx                 # pill badge (count, status dot)
│   │   ├── Avatar.tsx                # circular avatar (image or initials fallback)
│   │   ├── Icon.tsx                  # emoji wrapper or SVG icon registry
│   │   └── Text.tsx                  # typography helpers: Title, Subtitle, Muted
│   │
│   ├── layout/                       # L2: Page frame — shell components (no data, take props)
│   │   ├── index.ts
│   │   ├── AdminLayout.tsx           # Top-level shell: { header, sidebar, children, background? }
│   │   │                             # Props: headerBar, sidebarNav, backgroundComponent?
│   │   ├── HeaderBar.tsx             # Fixed top bar — takes slots: logo, center, actions
│   │   │                             # Props: logo, centerContent?, actions (ReactNode[])
│   │   ├── SidebarNav.tsx            # Collapsible sidebar — menuItems: MenuItem[]
│   │   │                             # Props: menuItems, collapsed, onToggle, logoSlot?
│   │   ├── ContentArea.tsx           # Scrollable <main> with configurable padding
│   │   └── SidebarNav.types.ts       # MenuItem, MenuGroup interfaces
│   │
│   ├── effects/                      # Decorative / non-interactive visual components
│   │   ├── index.ts
│   │   ├── ParticleBackground.tsx    # Canvas particle network (moved from components/)
│   │   └── AmbientParticles.tsx      # CSS floating particles (moved from components/)
│   │
│   ├── hooks/                        # Generic hooks — no business domain
│   │   ├── index.ts                  # barrel: export { useTilt } from './useTilt'; ...
│   │   ├── useTilt.ts
│   │   ├── useRipple.ts
│   │   ├── useScrollReveal.ts
│   │   └── useMediaQuery.ts          # NEW: responsive breakpoint detection
│   │
│   ├── types/                        # Shared type definitions used across lib/
│   │   ├── index.ts
│   │   ├── menu.ts                   # MenuItem, MenuGroup, MenuConfig
│   │   └── theme.ts                  # ThemeMode, AccentColor
│   │
│   ├── utils/                        # Pure functions (no React, no hooks)
│   │   ├── index.ts
│   │   ├── cn.ts                     # className merger (simple string join for now)
│   │   └── format.ts                 # number formatting, date formatting
│   │
│   └── styles/                       # Theme CSS — copy to any project, tweak tokens.css
│       ├── tokens.css                # CSS custom properties (colors, spacing, radii, shadows)
│       ├── reset.css                 # Global reset + scrollbar styling
│       ├── glass.css                 # .glass, .glass-heavy, .glass-card utility classes
│       ├── animations.css            # All @keyframes (fadeInUp, float, breathe, count-up)
│       └── enhancements.css          # 3D transforms, glow borders, neumorphic, scroll-reveal
│
├── features/                         # L3: Business domain components
│   ├── index.ts
│   │
│   ├── dashboard/                    # Dashboard-specific UI blocks
│   │   ├── index.ts
│   │   ├── StatCard.tsx              # Single stat card (label, value, trend, icon, color)
│   │   ├── StatsGrid.tsx             # Responsive grid of StatCards
│   │   ├── ActivityFeed.tsx          # "Recent activity" list
│   │   ├── QuickActions.tsx          # Horizontal row of action buttons
│   │   ├── WelcomeBanner.tsx         # Time-aware greeting with date/weather
│   │   └── dashboard.types.ts        # StatData, ActivityItem, QuickAction interfaces
│   │
│   ├── auth/                         # Authentication / user profile
│   │   ├── index.ts
│   │   └── UserMenu.tsx              # Avatar + name + dropdown (logout, profile)
│   │
│   └── navigation/                   # Navigation rendering
│       ├── index.ts
│       └── MenuBuilder.tsx            # Renders recursive MenuItem[] → SidebarNav menus
│
├── pages/                            # L4: Route-level page components
│   ├── index.ts
│   ├── DashboardPage.tsx             # Composes WelcomeBanner + StatsGrid + QuickActions + ActivityFeed
│   ├── UserListPage.tsx              # (future)
│   └── NotFoundPage.tsx              # 404 / empty state
│
├── config/                           # ★ PROJECT IDENTITY ★ — change THIS when starting a new admin
│   ├── index.ts                      # barrel: export * from './app'; ...
│   ├── app.ts                        # Brand identity (never imported by lib/)
│   │                                 #   APP_NAME, APP_SUBTITLE, APP_VERSION, LOGO_EMOJI
│   ├── menu.ts                       # Sidebar menu tree (MenuItem[])
│   │                                 #   Complete menu config — labels, icons, routes, badges
│   └── mock-user.ts                  # Current user profile for dev/demo
│                                     #   { name, avatar, email, role }
│
├── router/                           # Client-side routing
│   └── index.tsx                     # Route definitions — maps path → page component
│
└── providers/                        # App-level providers
    └── index.tsx                     # Composes <ThemeProvider> + future <AuthProvider> + ...
```

---

## 4. What Goes in Each Directory — Detailed

### `lib/primitives/` — UI Atoms

These are the smallest reusable blocks. Every component here is **stateless or only has visual state** (hover, focus, active). No data fetching, no business logic, no config imports.

| File | Props | CSS Classes Used | Notes |
|---|---|---|---|
| `Button.tsx` | `variant: 'primary' \| 'ghost' \| 'icon'`, `onClick`, `disabled`, `children` | `.glass`, `.neo-gold-raised` | Wraps `useRipple` internally |
| `Card.tsx` | `variant: 'glass' \| '3d' \| 'glow'`, `padding`, `className`, `children` | `.glass-card`, `.card-3d`, `.glow-border-card` | Optional `onClick` for interactive cards |
| `Badge.tsx` | `count: number`, `variant: 'gold' \| 'accent' \| 'danger'`, `dot?: boolean` | Inline styles | Shows count or just a colored dot |
| `Avatar.tsx` | `src?: string`, `name: string`, `size: 'sm' \| 'md' \| 'lg'` | `.neo-gold-seal` | Falls back to initials from `name` |
| `Icon.tsx` | `name: string`, `size?: number` | Inline styles | Simple emoji wrapper — can grow into SVG icon registry later |
| `Text.tsx` | `variant: 'title' \| 'subtitle' \| 'body' \| 'muted'`, `children` | Inline styles with CSS vars | Typography normalization |

**What does NOT go here:** `StatCard` (has dashboard-specific data structure), `UserMenu` (has auth domain), `WelcomeBanner` (has time/weather logic).

---

### `lib/layout/` — Page Frame Shells

These compose primitives into the admin shell. They accept **configuration via props**, not by reading `config/` directly.

| File | Responsibility | Key Props |
|---|---|---|
| `AdminLayout.tsx` | Orchestrates the full page: fixed header + collapsible sidebar + scrollable content + optional background effect | `headerBar: ReactNode`, `sidebarNav: ReactNode`, `backgroundComponent?: ReactNode`, `children` |
| `HeaderBar.tsx` | Fixed 60px top bar with three slots: left (logo/toggle), center (breadcrumb/search), right (actions/user) | `leftSlot: ReactNode`, `centerSlot?: ReactNode`, `rightSlot: ReactNode` |
| `SidebarNav.tsx` | Fixed left sidebar, collapsible, renders menu tree with active tracking | `menuItems: MenuItem[]`, `collapsed: boolean`, `onToggle: () => void`, `logoSlot?: ReactNode` |
| `ContentArea.tsx` | `<main>` wrapper that handles the offset for header+sidebar and scrolling | `padding?: string`, `children` |

**Critical design decision:** `SidebarNav` receives `menuItems` as a prop — it does NOT import `config/menu.ts`. This keeps the layout layer reusable across any admin.

---

### `lib/effects/` — Visual Backgrounds

Pure decorative components. No interactivity, no data, no props beyond visual tuning.

| File | Current State | Changes |
|---|---|---|
| `ParticleBackground.tsx` | Move from `components/` | Rename default export, add `particleColor?: { primary, accent }` prop for theming |
| `AmbientParticles.tsx` | Move from `components/` | Add `goldColor?: string`, `blueColor?: string` props |

---

### `lib/hooks/` — Generic React Hooks

No domain logic. Pure interaction/observation primitives.

| Hook | Source | Changes |
|---|---|---|
| `useTilt` | Move as-is | None — already generic |
| `useRipple` | Move as-is | None |
| `useScrollReveal` | Move as-is | None |
| `useMediaQuery` | NEW | `(query: string) => boolean` — responsive detection |

---

### `lib/types/` — Shared Type Definitions

| File | Contents |
|---|---|
| `menu.ts` | `MenuItem { key, label, icon, route?, badge?, children? }`, `MenuGroup` |
| `theme.ts` | `ThemeMode = 'dark' \| 'light'`, `AccentColor = 'gold' \| 'blue' \| 'purple'` |

---

### `lib/styles/` — CSS Theme System

Split one 622-line `modern-enhancements.css` into focused files:

| File | Contents | Approx Lines |
|---|---|---|
| `tokens.css` | `:root { }` CSS variables (colors, spacing, radii, shadows, fonts) | ~60 |
| `reset.css` | Box-sizing, body/html, scrollbar styling | ~30 |
| `glass.css` | `.glass`, `.glass-heavy`, `.glass-card`, `.glass-header`, `.glass-sidebar` | ~60 |
| `animations.css` | All `@keyframes` (fadeInUp, float, breathe, count-up, drift-up, border-glow, gradient-shift, rotate-glow, cardReveal, titleSlide, goldShimmer, statPulse, lightRayDrift) | ~120 |
| `enhancements.css` | 3D tilt card `.tilt-card-*`, glow borders `.glow-border-*`, neumorphic `.neo-gold-*`, scroll reveal `.scroll-reveal*`, ripple `.ripple-*`, light rays, animated gradient mesh | ~220 |

---

### `features/` — Business Domain Components

These compose primitives + hooks to build meaning-specific blocks. They import from `config/` where needed.

#### `features/dashboard/`

| File | What it does | Imports from |
|---|---|---|
| `StatCard.tsx` | Single stat display: icon + value + label + trend badge | `lib/primitives/Card`, `lib/hooks/useTilt` |
| `StatsGrid.tsx` | Responsive CSS grid of `StatCard` components | `StatCard`, `dashboard.types` |
| `ActivityFeed.tsx` | Vertical list of activity items with icon + text + time | `lib/primitives/Card` |
| `QuickActions.tsx` | Horizontal row of `Button` components for common actions | `lib/primitives/Button`, `lib/hooks/useRipple` |
| `WelcomeBanner.tsx` | Time-aware greeting + date display | `lib/primitives/Card`, `config/app` |
| `dashboard.types.ts` | `StatData`, `ActivityItem`, `QuickAction` interfaces | nothing |

#### `features/auth/`

| File | What it does |
|---|---|
| `UserMenu.tsx` | Avatar + user name badge + dropdown placeholder. Reads user from `config/mock-user` or future auth context. |

#### `features/navigation/`

| File | What it does |
|---|---|
| `MenuBuilder.tsx` | Takes `MenuItem[]` and renders the collapsible menu tree with active-state tracking. Used inside `SidebarNav`. |

---

### `pages/` — Route-Level Page Components

One file per route. These are thin: they declare page-specific data (or call an API) and compose business components.

**`DashboardPage.tsx`** example (pseudocode):
```tsx
import { WelcomeBanner } from '@/features/dashboard';
import { StatsGrid } from '@/features/dashboard';
import { QuickActions } from '@/features/dashboard';
import { ActivityFeed } from '@/features/dashboard';
import { recentActivities, dashboardStats, quickActions } from './dashboard-data'; // or API call

export default function DashboardPage() {
  return (
    <>
      <WelcomeBanner />
      <StatsGrid stats={dashboardStats} />
      <QuickActions actions={quickActions} />
      <ActivityFeed activities={recentActivities} />
    </>
  );
}
```

**What does NOT go in pages:** Business logic, data fetching (use a hook or a `data/` service layer), inline component definitions.

---

### `config/` — The Project Identity Zone ★

**This is the only folder you touch when starting a new admin project.** Every hardcoded string from today's codebase moves here.

#### `config/app.ts`
```ts
export const APP_NAME = '如意';
export const APP_SUBTITLE = '吉祥如意 · 万事如意';
export const APP_VERSION = '1.0';
export const LOGO_EMOJI = '☁';
export const COPYRIGHT_YEAR = 2026;
```

#### `config/menu.ts`
```ts
import type { MenuItem } from '@/lib/types/menu';

export const menuItems: MenuItem[] = [
  { key: 'dashboard', label: '仪表盘', icon: '📊', route: '/', badge: 0 },
  { key: 'user',      label: '用户管理', icon: '👥', route: '/users' },
  { key: 'content',   label: '内容管理', icon: '📝', route: '/content' },
  { key: 'data',      label: '数据分析', icon: '📈', route: '/analytics', badge: 5 },
  {
    key: 'system', label: '系统设置', icon: '⚙',
    children: [
      { key: 'role', label: '角色权限', icon: '🔑', route: '/system/roles' },
      { key: 'menu', label: '菜单管理', icon: '📋', route: '/system/menus' },
      { key: 'log',  label: '操作日志', icon: '📄', route: '/system/logs' },
    ],
  },
  { key: 'ai', label: 'AI 助手', icon: '🤖', route: '/ai' },
];
```

#### `config/mock-user.ts`
```ts
export const mockUser = {
  name: '张大鹏',
  avatarInitial: '鹏',
  email: 'zhangdp@example.com',
  role: 'admin',
};
```

---

### `router/index.tsx`

Route definitions. Uses `react-router-dom` (add dependency) or a simple custom router.

```tsx
import { DashboardPage } from '@/pages';
import { AdminLayout } from '@/lib/layout';
// ...
```

---

### `App.tsx` — Minimal Entry Shell

```tsx
import { AdminLayout } from '@/lib/layout';
import { HeaderBar } from '@/lib/layout';
import { SidebarNav } from '@/lib/layout';
import { ParticleBackground } from '@/lib/effects';
import { UserMenu } from '@/features/auth';
import { MenuBuilder } from '@/features/navigation';
import { APP_NAME, LOGO_EMOJI, APP_SUBTITLE } from '@/config';
import { menuItems } from '@/config';
import { mockUser } from '@/config';
import { RouterProvider } from './router';

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <RouterProvider>
      <AdminLayout
        backgroundComponent={<ParticleBackground />}
        headerBar={
          <HeaderBar
            leftSlot={<Logo emoji={LOGO_EMOJI} name={APP_NAME} />}
            centerSlot={<Subtitle text={APP_SUBTITLE} />}
            rightSlot={<UserMenu user={mockUser} />}
          />
        }
        sidebarNav={
          <SidebarNav
            menuItems={menuItems}
            collapsed={collapsed}
            onToggle={() => setCollapsed(!collapsed)}
          />
        }
      >
        <Outlet />  {/* page content */}
      </AdminLayout>
    </RouterProvider>
  );
}
```

---

## 5. Component Categorization Reference

### Current → New Mapping

| Current File | New Location | Category |
|---|---|---|
| `components/Header.tsx` | Decomposed — see below | — |
| `components/Sidebar.tsx` | `lib/layout/SidebarNav.tsx` | L2: Layout shell |
| `components/Layout.tsx` | `lib/layout/AdminLayout.tsx` | L2: Layout shell |
| `components/ParticleBackground.tsx` | `lib/effects/ParticleBackground.tsx` | Effect |
| `components/AmbientParticles.tsx` | `lib/effects/AmbientParticles.tsx` | Effect |
| `pages/Dashboard.tsx` → `StatCard` | `features/dashboard/StatCard.tsx` | L3: Business |
| `pages/Dashboard.tsx` → rest | `pages/DashboardPage.tsx` + data extraction | L4: Page |
| `hooks/useTilt.ts` | `lib/hooks/useTilt.ts` | Hook |
| `hooks/useRipple.ts` | `lib/hooks/useRipple.ts` | Hook |
| `hooks/useScrollReveal.ts` | `lib/hooks/useScrollReveal.ts` | Hook |
| `styles/theme.css` | `lib/styles/tokens.css` + `reset.css` + `glass.css` + `animations.css` | CSS |
| `styles/modern-enhancements.css` | `lib/styles/enhancements.css` (trimmed) | CSS |
| Hardcoded brand strings | `config/app.ts` | Config |
| Hardcoded menu items | `config/menu.ts` | Config |
| Hardcoded user (张大鹏) | `config/mock-user.ts` | Config |

### What Gets Deleted
- `components/Header.tsx` — decomposed into `HeaderBar` + `UserMenu` + config-driven logo
- `components/` directory (empty) → archived
- `pages/Dashboard.tsx` — split into `DashboardPage.tsx` + `features/dashboard/*`
- `styles/` directory → `lib/styles/`

### What Gets Created (NEW)
- `lib/primitives/` — 6 new atom components
- `lib/layout/ContentArea.tsx` — extracted from Layout
- `lib/layout/SidebarNav.types.ts` — types extracted from Sidebar
- `lib/types/` — menu.ts, theme.ts
- `lib/utils/` — cn.ts, format.ts
- `lib/hooks/useMediaQuery.ts`
- `features/dashboard/dashboard.types.ts`
- `features/auth/UserMenu.tsx`
- `features/navigation/MenuBuilder.tsx`
- `config/` — entire directory (app.ts, menu.ts, mock-user.ts, index.ts)
- `router/index.tsx`
- `providers/index.tsx`

---

## 6. Import Path Rules

Use `@/` path alias (add to `tsconfig.app.json` + `vite.config.ts`):

```json
// tsconfig.app.json
"paths": { "@/*": ["./src/*"] }
```

```ts
// vite.config.ts
resolve: { alias: { '@': path.resolve(__dirname, 'src') } }
```

Import conventions by layer:

```
L1 Primitives:   import { Button } from '@/lib/primitives';
L2 Layout:       import { AdminLayout } from '@/lib/layout';
L3 Features:     import { StatCard } from '@/features/dashboard';
L4 Pages:        import { DashboardPage } from '@/pages';
Config:          import { APP_NAME } from '@/config';
Hooks:           import { useTilt } from '@/lib/hooks';
Types:           import type { MenuItem } from '@/lib/types';
```

**Never import:**
- A page from a feature component
- A config from a lib component (lib is config-agnostic)
- A sibling feature from another feature (no `features/dashboard` → `features/auth`)

---

## 7. Migration Path (Recommended Order)

### Phase 1 — Extract Config (no component changes, pure extraction)
1. Create `config/app.ts` — move brand strings from `Header.tsx`
2. Create `config/menu.ts` — move menu array from `Sidebar.tsx`
3. Create `config/mock-user.ts` — move user data from `Header.tsx`

### Phase 2 — Build Primitives (no impact on existing pages)
4. Create `lib/primitives/Button.tsx`, `Card.tsx`, `Badge.tsx`, `Avatar.tsx`
5. Add barrel `lib/primitives/index.ts`

### Phase 3 — Extract Business Components from Dashboard
6. Extract `StatCard` → `features/dashboard/StatCard.tsx`
7. Extract activity list → `features/dashboard/ActivityFeed.tsx`
8. Extract quick actions → `features/dashboard/QuickActions.tsx`
9. Extract welcome banner → `features/dashboard/WelcomeBanner.tsx`
10. Create `features/dashboard/dashboard.types.ts`
11. Rewrite `pages/DashboardPage.tsx` using business components

### Phase 4 — Generic Layout Shells
12. Rewrite `Header.tsx` → `lib/layout/HeaderBar.tsx` (slot-based, config-driven)
13. Rewrite `Sidebar.tsx` → `lib/layout/SidebarNav.tsx` (receives `menuItems` as prop)
14. Rewrite `Layout.tsx` → `lib/layout/AdminLayout.tsx` (composes shells + background)
15. Create `lib/layout/ContentArea.tsx`

### Phase 5 — Move Supporting Files
16. Move hooks → `lib/hooks/`
17. Split and move styles → `lib/styles/`
18. Move effects → `lib/effects/`

### Phase 6 — Plumbing
19. Add `@/` path alias to vite + tsconfig
20. Create `router/index.tsx`
21. Update `App.tsx` to use new architecture
22. Delete old `components/` directory

---

## 8. Rebuilding a Different Admin — The 5-Minute Checklist

Starting from a fresh clone of this template:

1. **`config/app.ts`** — Change `APP_NAME`, `APP_SUBTITLE`, `LOGO_EMOJI`
2. **`config/menu.ts`** — Replace menu items array with your own
3. **`config/mock-user.ts`** — Change user name, avatar
4. **`lib/styles/tokens.css`** — (optional) Tweak `--color-*` variables for your brand palette
5. **`pages/`** — Delete sample pages, add your own page components

Everything in `lib/` stays untouched. Everything in `features/` stays unless you need entirely different business components.

---

## 9. Dependency Graph (Simplified)

```
config/ ─────────────────────────────────────────────┐
                                                     │
lib/types/ ─── lib/hooks/ ─── lib/effects/          │
    │              │              │                  │
    ▼              ▼              ▼                  │
lib/primitives/ ── lib/layout/ ── features/ ── pages/
                                     │
                                     ▼
                                  config/ ◄── (only features + pages import config)
```

`config/` is the leaf — the entire tree feeds into config at the top. Change config, change the app.

---

*Document version: 1.0 | 2026-07-14*

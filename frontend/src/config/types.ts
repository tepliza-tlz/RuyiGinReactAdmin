// ============================================================
// Admin Framework — Core Type Definitions
// ============================================================
// All interfaces for the config-driven admin framework.
// Everything flows from a single AdminConfig object defined in
// admin.config.ts. To copy this framework to a new project, you
// only need to change that one file + provide page components.
// ============================================================

import type { ComponentType, LazyExoticComponent, ReactNode } from 'react';

// -----------------------------------------------------------
// 1. ROUTE & MENU
// -----------------------------------------------------------

/** How a page component is resolved */
export type ComponentSource =
  | { type: 'lazy'; loader: () => Promise<{ default: ComponentType<any> }> }
  | { type: 'eager'; component: ComponentType<any> }
  | { type: 'string'; path: string }; // resolved at runtime (e.g. 'pages/Dashboard')

/** A single route definition */
export interface RouteConfig {
  /** Unique route key, also used as menu key */
  key: string;
  /** URL path (e.g. '/users', '/users/:id') */
  path: string;
  /** Page component */
  component: ComponentSource;
  /** Page title (browser tab + breadcrumb) */
  title: string;
  /** Permission key required to access this route. Omit = public. */
  permission?: string;
  /** If true, hides from sidebar even if accessible */
  hideInMenu?: boolean;
  /** Extra metadata passed to the page */
  meta?: Record<string, unknown>;
  /** Nested child routes */
  children?: RouteConfig[];
}

/** A menu item — may or may not map 1:1 to a route */
export interface MenuItemConfig {
  /** Unique key, maps to RouteConfig.key when it represents a page */
  key: string;
  /** Display label */
  label: string;
  /** Emoji or icon component name */
  icon?: string;
  /** If provided, clicking navigates to this route path */
  route?: string;
  /** Permission key required to see this menu item */
  permission?: string;
  /** Badge config */
  badge?: MenuBadge;
  /** Nested sub-menu items */
  children?: MenuItemConfig[];
  /** Divider before this item */
  dividerBefore?: boolean;
  /** If true, this is a group header, not clickable */
  isGroup?: boolean;
}

export interface MenuBadge {
  /** Static number or a field name to fetch dynamically */
  value?: number | string;
  /** 'dot' = small dot indicator, 'count' = number badge */
  type: 'dot' | 'count';
  /** Optional color override */
  color?: string;
}

// -----------------------------------------------------------
// 2. PERMISSIONS
// -----------------------------------------------------------

export interface PermissionConfig {
  /** Unique key used in routes/menu/api guards */
  key: string;
  /** Human-readable label */
  label: string;
  /** Optional description */
  description?: string;
  /** Parent permission key for hierarchical grouping */
  parent?: string;
}

export type PermissionChecker = (permission: string) => boolean;

// -----------------------------------------------------------
// 3. THEME
// -----------------------------------------------------------

export type ThemeMode = 'dark' | 'light';

export interface ThemeDefinition {
  /** Unique theme id */
  id: string;
  /** Display name */
  name: string;
  /** Display label (i18n key or string) */
  label: string;
  /** dark | light */
  mode: ThemeMode;
  /** CSS custom properties applied to :root */
  cssVariables: Record<string, string>;
  /** Optional additional CSS to inject */
  extraCSS?: string;
}

// -----------------------------------------------------------
// 4. API
// -----------------------------------------------------------

export type ApiMode = 'mock' | 'real' | 'auto';
// 'auto' = use mock in dev, real in production (based on import.meta.env)

export interface ApiConfig {
  /** 'mock' | 'real' | 'auto' */
  mode: ApiMode;
  /** Base URL for real API (not used in mock mode) */
  baseURL: string;
  /** Request timeout in ms */
  timeout: number;
  /** Global headers added to every request */
  headers?: Record<string, string>;
  /** Mock delay in ms (simulates network latency) */
  mockDelay: number;
  /** Whether to log mock data responses to console */
  mockVerbose: boolean;
}

/** Shape of an API service definition — each "service" groups endpoints */
export interface ApiServiceDefinition {
  /** Unique service name (e.g. 'users', 'dashboard') */
  name: string;
  /** Endpoint definitions */
  endpoints: Record<string, ApiEndpointDefinition<any, any>>;
}

export interface ApiEndpointDefinition<TParams, TResponse> {
  /** HTTP method */
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** URL path relative to baseURL (e.g. '/api/users') */
  url: string | ((params: TParams) => string);
  /** Mock implementation — returns fake data */
  mock: (params: TParams) => Promise<TResponse> | TResponse;
  /** Permission key (optional gate) */
  permission?: string;
}

/** The unified API client that services use */
export interface IApiClient {
  request<TResponse>(config: {
    method: string;
    url: string;
    data?: unknown;
    params?: Record<string, string>;
  }): Promise<TResponse>;
  get<T>(url: string, params?: Record<string, string>): Promise<T>;
  post<T>(url: string, data?: unknown): Promise<T>;
  put<T>(url: string, data?: unknown): Promise<T>;
  patch<T>(url: string, data?: unknown): Promise<T>;
  delete<T>(url: string): Promise<T>;
}

// -----------------------------------------------------------
// 5. PLUGINS
// -----------------------------------------------------------

/** Context passed to plugins during installation */
export interface PluginContext {
  /** The full admin config (read-only) */
  config: Readonly<AdminConfig>;
  /** API client instance */
  api: IApiClient;
  /** Register a custom route not defined in config */
  addRoute: (route: RouteConfig) => void;
  /** Register a middleware in the request pipeline */
  addMiddleware: (mw: ApiMiddleware) => void;
  /** Get the current theme */
  getTheme: () => ThemeDefinition;
  /** Add a component to a named slot (e.g. 'header-actions') */
  addSlotComponent: (slot: string, component: ComponentType<any>, order?: number) => void;
  /** Access to the plugin registry to call other plugins */
  getPlugin: (name: string) => AdminPlugin | undefined;
}

/** An admin plugin */
export interface AdminPlugin {
  /** Unique plugin name */
  name: string;
  /** Semver version */
  version: string;
  /** Called once when the app boots */
  install: (ctx: PluginContext) => void | Promise<void>;
  /** Called on every route change */
  onRouteChange?: (from: string, to: string) => void;
  /** Cleanup when plugin is unregistered */
  uninstall?: () => void;
}

/** API middleware — intercept requests/responses */
export interface ApiMiddleware {
  name: string;
  /** Transform request before it's sent (return modified config) */
  onRequest?: (config: {
    method: string;
    url: string;
    headers: Record<string, string>;
    data?: unknown;
    params?: Record<string, string>;
  }) => typeof config | Promise<typeof config>;
  /** Transform response before it's returned */
  onResponse?: <T>(response: { data: T; status: number }) =>
    { data: T; status: number } | Promise<{ data: T; status: number }>;
  /** Handle errors */
  onError?: (error: Error) => Error | Promise<Error>;
}

// -----------------------------------------------------------
// 6. APP (top-level config)
// -----------------------------------------------------------

export interface AppInfo {
  /** Application name (shown in title bar, header) */
  name: string;
  /** Short name for favicon/tab */
  shortName: string;
  /** Version string */
  version: string;
  /** Logo text or emoji (e.g. '☁') */
  logo?: string;
  /** Description */
  description?: string;
  /** Footer text */
  footer?: string;
}

/** The single source of truth for the entire admin app */
export interface AdminConfig {
  /** App metadata */
  app: AppInfo;
  /** Menu structure (sidebar) */
  menu: MenuItemConfig[];
  /** Route definitions (auto-generated from menu if omitted) */
  routes: RouteConfig[];
  /** Permission definitions */
  permissions: PermissionConfig[];
  /** Theme configuration */
  theme: {
    /** Active theme id */
    defaultTheme: string;
    /** All available themes */
    themes: ThemeDefinition[];
  };
  /** API configuration */
  api: ApiConfig;
  /** Plugin registry */
  plugins: AdminPlugin[];
  /** Optional: user info source (for permission checks) */
  getUserPermissions?: () => string[];
}

// -----------------------------------------------------------
// 7. HELPER: typed config creator (ensures type-safety)
// -----------------------------------------------------------

/** Create a type-safe admin config */
export function defineConfig(config: AdminConfig): AdminConfig {
  return config;
}

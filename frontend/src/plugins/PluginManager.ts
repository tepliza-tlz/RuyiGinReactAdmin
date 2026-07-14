// ============================================================
// Plugin Manager — extensibility via installable plugins
// ============================================================
// Plugins can: add routes, add API middleware, inject
// components into slots, and hook into route changes.
// Define plugins in admin.config.ts > plugins array.
// ============================================================

import type { ComponentType } from 'react';
import type {
  AdminPlugin,
  PluginContext,
  ApiMiddleware,
  RouteConfig,
  ThemeDefinition,
  AdminConfig,
} from '../config/types';
import type { IApiClient } from '../api/types';

// ── Slot Registry (for injecting components) ────────
type SlotEntry = { component: ComponentType<any>; order: number };

const slotRegistry = new Map<string, SlotEntry[]>();

export function getSlotComponents(slot: string): ComponentType<any>[] {
  const entries = slotRegistry.get(slot) ?? [];
  return entries.sort((a, b) => a.order - b.order).map((e) => e.component);
}

function registerSlotComponent(
  slot: string,
  component: ComponentType<any>,
  order = 0,
): void {
  const entries = slotRegistry.get(slot) ?? [];
  entries.push({ component, order });
  slotRegistry.set(slot, entries);
}

// ── Plugin Manager ───────────────────────────────────
const pluginStore = new Map<string, AdminPlugin>();
const extraRoutes: RouteConfig[] = [];
const apiMiddlewares: ApiMiddleware[] = [];
let currentConfig: Readonly<AdminConfig> | null = null;
let currentApi: IApiClient | null = null;
let currentThemeGetter: (() => ThemeDefinition) | null = null;

/** Install all plugins from config. Call once at app boot. */
export async function installPlugins(
  plugins: AdminPlugin[],
  config: Readonly<AdminConfig>,
  api: IApiClient,
  getTheme: () => ThemeDefinition,
): Promise<void> {
  currentConfig = config;
  currentApi = api;
  currentThemeGetter = getTheme;

  const ctx: PluginContext = {
    config,
    api,
    getTheme,
    addRoute: (route) => {
      extraRoutes.push(route);
    },
    addMiddleware: (mw) => {
      apiMiddlewares.push(mw);
    },
    addSlotComponent: registerSlotComponent,
    getPlugin: (name) => pluginStore.get(name),
  };

  for (const plugin of plugins) {
    pluginStore.set(plugin.name, plugin);
    await plugin.install(ctx);
  }
}

/** Get all routes added by plugins */
export function getPluginRoutes(): RouteConfig[] {
  return [...extraRoutes];
}

/** Get all registered API middlewares */
export function getMiddlewares(): ApiMiddleware[] {
  return [...apiMiddlewares];
}

/** Call onRouteChange on all plugins */
export function notifyRouteChange(from: string, to: string): void {
  for (const plugin of pluginStore.values()) {
    plugin.onRouteChange?.(from, to);
  }
}

/** Uninstall all plugins (for hot-reload / cleanup) */
export function uninstallPlugins(): void {
  for (const plugin of pluginStore.values()) {
    plugin.uninstall?.();
  }
  pluginStore.clear();
  extraRoutes.length = 0;
  apiMiddlewares.length = 0;
  slotRegistry.clear();
}

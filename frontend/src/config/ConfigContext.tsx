// ============================================================
// ConfigContext — provides the admin config throughout the app
// ============================================================
// Wrap your app with <ConfigProvider config={adminConfig}>
// and use useConfig() anywhere to access typed config.
// ============================================================

import { createContext, useContext, type ReactNode } from 'react';
import type { AdminConfig, PermissionChecker } from './types';

interface ConfigContextValue {
  config: Readonly<AdminConfig>;
  /** Check if current user has a permission */
  hasPermission: PermissionChecker;
  /** Current user's permission keys (cached) */
  userPermissions: string[];
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

export function ConfigProvider({
  config,
  children,
}: {
  config: AdminConfig;
  children: ReactNode;
}) {
  const userPermissions = config.getUserPermissions?.() ?? [];

  const hasPermission: PermissionChecker = (permission: string): boolean => {
    // 'admin' permission grants everything
    if (userPermissions.includes('admin')) return true;
    // Direct match
    if (userPermissions.includes(permission)) return true;
    // Hierarchical match: 'user:view' matches 'user:*' or 'user'
    const parts = permission.split(':');
    for (let i = parts.length; i > 0; i--) {
      const prefix = parts.slice(0, i).join(':');
      if (userPermissions.includes(prefix + ':*') || userPermissions.includes(prefix)) {
        return true;
      }
    }
    return false;
  };

  return (
    <ConfigContext.Provider value={{ config, hasPermission, userPermissions }}>
      {children}
    </ConfigContext.Provider>
  );
}

/** Hook to access the admin config anywhere in the component tree */
export function useConfig(): ConfigContextValue {
  const ctx = useContext(ConfigContext);
  if (!ctx) {
    throw new Error('useConfig() must be used inside <ConfigProvider>');
  }
  return ctx;
}

/** Hook: get the menu items filtered by current user's permissions */
export function useMenu() {
  const { config, hasPermission } = useConfig();

  function filterMenu(items: typeof config.menu): typeof config.menu {
    return items
      .filter((item) => !item.permission || hasPermission(item.permission))
      .map((item) => ({
        ...item,
        children: item.children ? filterMenu(item.children) : undefined,
      }))
      .filter((item) => {
        // Keep groups with visible children, or regular items
        if (item.isGroup) return (item.children?.length ?? 0) > 0;
        return true;
      });
  }

  return filterMenu(config.menu);
}

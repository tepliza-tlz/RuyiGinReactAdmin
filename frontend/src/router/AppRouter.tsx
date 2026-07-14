// ============================================================
// AppRouter — config-driven routing (no react-router needed)
// ============================================================
// Renders the route from config that matches the current URL
// hash. Uses hash-based routing (e.g. #/dashboard) to avoid
// needing server-side config for client-side routing.
// ============================================================

import { useState, useEffect, useCallback, Suspense, lazy, type ComponentType } from 'react';
import { useConfig } from '../config/ConfigContext';
import { getPluginRoutes, notifyRouteChange } from '../plugins/PluginManager';
import type { RouteConfig, ComponentSource } from '../config/types';

// ── Resolve component from config ────────────────────
const componentCache = new Map<string, ComponentType<any>>();

function resolveComponent(source: ComponentSource): ComponentType<any> {
  const cacheKey =
    source.type === 'lazy'
      ? source.loader.toString()
      : source.type === 'eager'
        ? source.component.name || 'anonymous'
        : source.path;

  if (componentCache.has(cacheKey)) {
    return componentCache.get(cacheKey)!;
  }

  let Comp: ComponentType<any>;

  switch (source.type) {
    case 'lazy':
      Comp = lazy(source.loader);
      break;
    case 'eager':
      Comp = source.component;
      break;
    case 'string':
      // Dynamic import by path — only works for known paths
      Comp = lazy(() =>
        import(/* @vite-ignore */ `../${source.path}`).catch(() => ({
          default: () => <NotFound />,
        })),
      );
      break;
  }

  componentCache.set(cacheKey, Comp);
  return Comp;
}

// ── Error / Loading ──────────────────────────────────
function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <h1 style={{ fontSize: 72, fontWeight: 900, color: 'var(--color-gold)' }}>
        404
      </h1>
      <p style={{ color: 'var(--color-text-muted)', marginTop: 12 }}>
        页面未找到
      </p>
    </div>
  );
}

function Loading() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60vh',
        color: 'var(--color-text-muted)',
        fontSize: 18,
      }}
    >
      加载中...
    </div>
  );
}

// ── Router ───────────────────────────────────────────
function getHashPath(): string {
  // e.g. '#/users?page=2' → '/users'
  const hash = window.location.hash.slice(1) || '/dashboard';
  return hash.split('?')[0];
}

export function useHashRouter() {
  const { config, hasPermission } = useConfig();
  const [currentPath, setCurrentPath] = useState(getHashPath);
  const [prevPath, setPrevPath] = useState(currentPath);

  useEffect(() => {
    const onHashChange = () => {
      const newPath = getHashPath();
      setPrevPath(currentPath);
      setCurrentPath(newPath);
      notifyRouteChange(currentPath, newPath);
    };

    window.addEventListener('hashchange', onHashChange);
    // Trigger initial route
    if (getHashPath() !== currentPath) {
      setCurrentPath(getHashPath());
    }
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [currentPath]);

  const navigate = useCallback((path: string) => {
    window.location.hash = path;
  }, []);

  // Merge config routes + plugin routes
  const allRoutes = [...config.routes, ...getPluginRoutes()];

  // Find matching route
  const route = allRoutes.find((r) => {
    if (r.path === '*') return false;
    // Simple exact match (no param parsing for hash router)
    return r.path === currentPath;
  });

  // Use catch-all if no match
  const matchedRoute: RouteConfig | undefined =
    route ?? allRoutes.find((r) => r.path === '*');

  // Check permission
  if (matchedRoute?.permission && !hasPermission(matchedRoute.permission)) {
    return {
      currentPath,
      navigate,
      route: allRoutes.find((r) => r.path === '*'),
    };
  }

  return { currentPath, navigate, route: matchedRoute };
}

// ── Router Component ─────────────────────────────────
export function AppRouter() {
  const { route } = useHashRouter();

  if (!route) {
    return <NotFound />;
  }

  const PageComponent = resolveComponent(route.component);

  return (
    <Suspense fallback={<Loading />}>
      <PageComponent />
    </Suspense>
  );
}

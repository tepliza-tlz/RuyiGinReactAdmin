// ============================================================
// Example Plugin: Analytics (page view tracking)
// ============================================================
// Demonstrates the plugin pattern:
//   1. Install hook — runs at boot
//   2. onRouteChange — fires on every navigation
//   3. addSlotComponent — inject UI into named slots
//
// To disable: remove from admin.config.ts > plugins array.
// ============================================================

import type { AdminPlugin } from '../../config/types';
import { useEffect } from 'react';

// ── Plugin Definition ────────────────────────────────
export const analyticsPlugin: AdminPlugin = {
  name: 'analytics',
  version: '1.0.0',

  install(ctx) {
    console.log(`[Plugin:${this.name}] v${this.version} installed`);

    // Example: add a middleware that logs every API call
    ctx.addMiddleware({
      name: 'analytics-logger',
      onRequest(config) {
        console.log(
          `[Analytics] API ${config.method} ${config.url}`,
        );
        return config;
      },
      onError(error) {
        console.error('[Analytics] API Error:', error.message);
        return error;
      },
    });

    // Example: inject a visitor counter into the header
    ctx.addSlotComponent(
      'header-actions',
      function VisitorCounter() {
        // Simple component that can use hooks
        useEffect(() => {
          console.log('[Analytics] VisitorCounter mounted');
        }, []);
        return null; // placeholder — real one would show stats
      },
      100, // order (lower = leftmost)
    );
  },

  onRouteChange(from, to) {
    // In a real app, this would send to Google Analytics / Baidu Tongji / etc.
    console.log(`[Analytics] Page view: ${from} → ${to}`);
  },

  uninstall() {
    console.log(`[Plugin:analytics] uninstalled`);
  },
};

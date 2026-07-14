// ============================================================
// App.tsx — Framework bootstrap
// ============================================================
// 1. Loads admin config
// 2. Initializes theme system
// 3. Creates API client (mock or real based on config)
// 4. Installs plugins
// 5. Renders Layout + Config-driven Router
// ============================================================

import { useEffect, useState } from 'react';
import './styles/theme.css';
import './styles/modern-enhancements.css';
import { adminConfig, ConfigProvider } from './config';
import { ThemeProvider } from './theme';
import { createApiClient } from './api';
import { dashboardMocks } from './api';
import { usersMocks } from './api';
import { installPlugins, uninstallPlugins } from './plugins';
import { Layout } from './components/Layout';
import { AppRouter } from './router/AppRouter';

// Collect all mock endpoints from all services
const allMocks = { ...dashboardMocks, ...usersMocks };

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 1. Create API client (mock or real based on config)
    const api = createApiClient(adminConfig.api, allMocks);

    // 2. Get current theme
    const getTheme = () => {
      const saved = (() => {
        try { return localStorage.getItem('admin-theme'); } catch { return null; }
      })();
      return adminConfig.theme.themes.find(t => t.id === saved)
        ?? adminConfig.theme.themes.find(t => t.id === adminConfig.theme.defaultTheme)
        ?? adminConfig.theme.themes[0];
    };

    // 3. Install plugins
    installPlugins(adminConfig.plugins, adminConfig, api, getTheme).then(() => {
      setReady(true);
    });

    // Cleanup on unmount (hot reload)
    return () => {
      uninstallPlugins();
    };
  }, []);

  if (!ready) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0a0e1a', color: '#d4a853', fontSize: 18,
      }}>
        <span style={{ animation: 'pulse-gold 1.5s ease-in-out infinite' }}>
          ☁ 如意管理后台 · 加载中...
        </span>
      </div>
    );
  }

  return (
    <ConfigProvider config={adminConfig}>
      <ThemeProvider
        themes={adminConfig.theme.themes}
        defaultTheme={adminConfig.theme.defaultTheme}
      >
        <Layout>
          <AppRouter />
        </Layout>
      </ThemeProvider>
    </ConfigProvider>
  );
}

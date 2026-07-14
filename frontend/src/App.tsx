// ============================================================
// App.tsx — Framework bootstrap
// ============================================================
import './styles/theme.css';
import './styles/modern-enhancements.css';
import { adminConfig, ConfigProvider } from './config';
import { ThemeProvider } from './theme';
import { Layout } from './components/Layout';
import { AppRouter } from './router/AppRouter';

export default function App() {
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

import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ParticleBackground from './ParticleBackground';

interface LayoutProps { children: React.ReactNode; }

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarW = sidebarCollapsed ? 64 : 'var(--sidebar-width)';

  return (
    <div style={styles.wrapper}>
      <ParticleBackground />
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
      />
      <Sidebar collapsed={sidebarCollapsed} />

      <main style={{
        ...styles.content,
        marginLeft: sidebarW,
        width: `calc(100vw - ${sidebarCollapsed ? '64px' : 'var(--sidebar-width)'})`,
      }}>
        <div style={styles.inner}>{children}</div>
      </main>
    </div>
  );
};

export default Layout;

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    width: '100vw', height: '100vh', overflow: 'hidden',
    background: 'radial-gradient(ellipse at 20% 50%, var(--color-primary-light) 0%, var(--color-primary) 60%)',
    position: 'relative',
  },
  content: {
    marginTop: 'var(--header-height)',
    height: 'calc(100vh - var(--header-height))',
    overflowY: 'auto' as const, overflowX: 'hidden' as const,
    transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative', zIndex: 1,
  },
  inner: { padding: '24px', minHeight: '100%' },
};

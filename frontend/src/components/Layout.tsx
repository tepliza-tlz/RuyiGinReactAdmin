import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div style={styles.wrapper}>
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
      />
      <Sidebar collapsed={sidebarCollapsed} />

      {/* 主内容区 */}
      <main
        style={{
          ...styles.content,
          marginLeft: sidebarCollapsed ? 64 : 'var(--sidebar-width)',
          width: sidebarCollapsed
            ? 'calc(100vw - 64px)'
            : 'calc(100vw - var(--sidebar-width))',
        }}
      >
        <div style={styles.contentInner}>
          {children}
        </div>
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    background: 'var(--color-primary)',
  },
  content: {
    marginTop: 'var(--header-height)',
    height: 'calc(100vh - var(--header-height))',
    overflowY: 'auto',
    overflowX: 'hidden',
    transition: 'margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  contentInner: {
    padding: '24px',
    minHeight: '100%',
  },
};

export default Layout;

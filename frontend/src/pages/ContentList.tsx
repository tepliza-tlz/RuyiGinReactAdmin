import React from 'react';

const ContentList: React.FC = () => (
  <div>
    <div className="glass-heavy" style={styles.pageHeader}>
      <h1 style={styles.title}>📝 内容管理</h1>
      <p style={styles.subtitle}>占位页面 · 接入真实内容管理组件</p>
    </div>
    <div className="card-3d" style={{ marginTop: 20 }}>
      <p style={{ color: 'var(--color-text-secondary)' }}>
        路由: <code style={styles.code}>/content</code> ·
        权限: <code style={styles.code}>content:view</code>
      </p>
    </div>
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  pageHeader: {
    padding: '24px 30px', borderRadius: 'var(--radius-lg)', marginBottom: 20,
  },
  title: {
    fontSize: 22, fontWeight: 700,
    background: 'linear-gradient(135deg, var(--color-gold-light), var(--color-accent-cyan))',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  subtitle: { fontSize: 13, color: 'var(--color-text-muted)', marginTop: 6 },
  code: {
    background: 'var(--glass-bg)', padding: '1px 8px', borderRadius: 4,
    fontSize: 13, margin: '0 4px', color: 'var(--color-accent-cyan)',
  },
};

export default ContentList;

import React from 'react';
import { useConfig } from '../config';
import { useHashRouter } from '../router/AppRouter';

/**
 * Placeholder page: User List
 * Replace with your real implementation.
 * The framework already provides:
 *   - Route protection via permission: 'user:view'
 *   - API service: usersApi.list(), usersApi.create(), etc.
 *   - Menu highlighting
 */
const UserList: React.FC = () => {
  const { config } = useConfig();
  const { navigate } = useHashRouter();

  return (
    <div>
      <div className="glass-heavy" style={styles.pageHeader}>
        <h1 style={styles.title}>👥 用户管理</h1>
        <p style={styles.subtitle}>共 8 位用户 · 此处为占位页面，接入真实组件即可</p>
      </div>

      <div className="card-3d" style={{ marginTop: 20 }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          📋 此页面由路由配置自动渲染。<br />
          路由: <code style={styles.code}>/users</code> ·
          权限: <code style={styles.code}>user:view</code> ·
          组件: <code style={styles.code}>pages/UserList</code>
        </p>
        <p style={{ marginTop: 12 }}>
          API 模式: <strong style={{ color: 'var(--color-gold)' }}>{config.api.mode}</strong>
          {config.api.mode === 'mock' && '（当前使用 Mock 数据）'}
        </p>
        <button
          className="glass"
          style={styles.btn}
          onClick={() => navigate('/dashboard')}
        >
          ← 返回仪表盘
        </button>
        <button
          className="glass"
          style={{ ...styles.btn, marginLeft: 12 }}
          onClick={() => navigate('/users/create')}
        >
          ➕ 新建用户
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  pageHeader: {
    padding: '24px 30px', borderRadius: 'var(--radius-lg)',
    marginBottom: 20,
  },
  title: {
    fontSize: 22, fontWeight: 700,
    background: 'linear-gradient(135deg, var(--color-gold-light), var(--color-accent-cyan))',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  subtitle: { fontSize: 13, color: 'var(--color-text-muted)', marginTop: 6 },
  code: {
    background: 'var(--glass-bg)',
    padding: '1px 8px',
    borderRadius: 4,
    fontSize: 13,
    margin: '0 4px',
    color: 'var(--color-accent-cyan)',
  },
  btn: {
    marginTop: 16, padding: '8px 20px', borderRadius: 8,
    border: 'none', color: 'var(--color-text)', cursor: 'pointer',
    fontSize: 13,
  },
};

export default UserList;

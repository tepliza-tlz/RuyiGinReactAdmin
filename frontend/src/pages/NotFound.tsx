import React from 'react';

const NotFound: React.FC = () => (
  <div style={{ textAlign: 'center', padding: '80px 20px' }}>
    <div style={{ fontSize: 96, fontWeight: 900, color: 'var(--color-gold)', opacity: 0.3 }}>
      404
    </div>
    <h1 style={{ fontSize: 28, marginTop: 12 }}>页面未找到</h1>
    <p style={{ color: 'var(--color-text-muted)', marginTop: 8 }}>
      你访问的页面不存在或已被移除
    </p>
    <a
      href="#/dashboard"
      className="glass"
      style={{
        display: 'inline-block', marginTop: 24, padding: '10px 28px',
        borderRadius: 10, color: 'var(--color-gold)', textDecoration: 'none',
        fontSize: 14, fontWeight: 600,
      }}
    >
      ← 返回仪表盘
    </a>
  </div>
);

export default NotFound;

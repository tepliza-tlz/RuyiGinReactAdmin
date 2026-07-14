import React from 'react';

interface HeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarCollapsed, onToggleSidebar }) => {
  return (
    <header style={styles.header}>
      {/* 左侧：Logo + 折叠按钮 */}
      <div style={styles.left}>
        <button
          onClick={onToggleSidebar}
          style={styles.toggleBtn}
          title={sidebarCollapsed ? '展开侧栏' : '折叠侧栏'}
        >
          {/* 三条横线汉堡图标 */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        {/* 如意 Logo */}
        <div style={styles.logo}>
          <span style={styles.logoIcon}>☁</span>
          <span style={styles.logoText}>如意</span>
        </div>
      </div>

      {/* 中间：装饰 */}
      <div style={styles.center}>
        <div style={styles.titleDeco}>
          <span style={styles.decoLeft} />
          <span style={styles.titleText}>吉祥如意 · 万事如意</span>
          <span style={styles.decoRight} />
        </div>
      </div>

      {/* 右侧：用户区 */}
      <div style={styles.right}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>鹏</div>
          <span style={styles.userName}>张大鹏</span>
        </div>
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 'var(--header-height)',
    background: 'linear-gradient(135deg, #0f2027 0%, #16213e 40%, #1a1a2e 100%)',
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    zIndex: 100,
    backdropFilter: 'blur(10px)',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  toggleBtn: {
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: '1px solid var(--color-border)',
    borderRadius: 8,
    color: 'var(--color-gold)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    fontSize: 24,
    lineHeight: 1,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 700,
    color: 'var(--color-gold)',
    letterSpacing: 4,
  },
  center: {
    display: 'flex',
    alignItems: 'center',
  },
  titleDeco: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  decoLeft: {
    width: 60,
    height: 1,
    background: 'linear-gradient(90deg, transparent, var(--color-gold))',
    display: 'inline-block',
  },
  decoRight: {
    width: 60,
    height: 1,
    background: 'linear-gradient(270deg, transparent, var(--color-gold))',
    display: 'inline-block',
  },
  titleText: {
    fontSize: 13,
    color: 'var(--color-text-muted)',
    letterSpacing: 6,
    whiteSpace: 'nowrap',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
    color: 'var(--color-primary-dark)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 15,
    fontWeight: 700,
  },
  userName: {
    fontSize: 14,
    color: 'var(--color-text)',
    fontWeight: 500,
  },
};

export default Header;

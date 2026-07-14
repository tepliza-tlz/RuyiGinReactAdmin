import React from 'react';
import { useConfig } from '../config';

interface HeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarCollapsed, onToggleSidebar }) => {
  const { config } = useConfig();
  const { logo, shortName, description } = config.app;

  return (
    <header className="glass-heavy" style={styles.header}>
      <div style={styles.glowBorder} />

      <div style={styles.left}>
        <button
          onClick={onToggleSidebar}
          className="glass"
          style={styles.toggleBtn}
          title={sidebarCollapsed ? '展开侧栏' : '折叠侧栏'}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        <div style={styles.logo}>
          <span style={{
            ...styles.logoIcon,
            animation: 'float 3s ease-in-out infinite',
            display: 'inline-block',
          }}>{logo ?? '☁'}</span>
          <span style={styles.logoText}>{shortName}</span>
        </div>
      </div>

      <div style={styles.center}>
        <div style={styles.titleDeco}>
          <span style={styles.decoLine} />
          <span style={styles.titleText}>{description ?? ''}</span>
          <span style={{ ...styles.decoLine, transform: 'scaleX(-1)' }} />
        </div>
      </div>

      <div style={styles.right}>
        <div className="glass" style={styles.userBadge}>
          <div style={styles.avatar}>鹏</div>
          <span style={styles.userName}>管理员</span>
        </div>
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    position: 'fixed', top: 0, left: 0, right: 0,
    height: 'var(--header-height)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 20px', zIndex: 100,
  },
  glowBorder: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
    background: 'linear-gradient(90deg, transparent, var(--color-gold) 20%, var(--color-accent) 50%, var(--color-gold) 80%, transparent)',
    animation: 'border-glow 3s ease-in-out infinite',
  },
  left: { display: 'flex', alignItems: 'center', gap: 14 },
  toggleBtn: {
    width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: 'none', borderRadius: 8, color: 'var(--color-gold)', cursor: 'pointer',
  },
  logo: { display: 'flex', alignItems: 'center', gap: 8 },
  logoIcon: { fontSize: 24, lineHeight: 1 },
  logoText: {
    fontSize: 20, fontWeight: 700,
    background: 'linear-gradient(135deg, var(--color-gold-light), var(--color-gold))',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    letterSpacing: 4,
  },
  center: { display: 'flex', alignItems: 'center' },
  titleDeco: { display: 'flex', alignItems: 'center', gap: 14 },
  decoLine: {
    width: 50, height: 1,
    background: 'linear-gradient(90deg, transparent, var(--color-gold))',
    display: 'inline-block', opacity: 0.5,
  },
  titleText: {
    fontSize: 12, color: 'var(--color-text-muted)',
    letterSpacing: 5, whiteSpace: 'nowrap',
  },
  right: { display: 'flex', alignItems: 'center' },
  userBadge: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '4px 14px 4px 4px', borderRadius: 40, border: 'none',
  },
  avatar: {
    width: 34, height: 34, borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--color-gold), var(--color-accent-cyan))',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, fontWeight: 700,
  },
  userName: { fontSize: 13, color: 'var(--color-text)', fontWeight: 500 },
};

export default Header;

import React from 'react';
import { useMenu, useConfig } from '../config';
import type { MenuItemConfig } from '../config/types';

interface SidebarProps { collapsed: boolean; }

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const menuItems = useMenu();
  const { config } = useConfig();
  const [activeKey, setActiveKey] = React.useState('dashboard');
  const [expandedKeys, setExpandedKeys] = React.useState<string[]>(['system']);

  const toggleExpand = (key: string) =>
    setExpandedKeys(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);

  const handleItemClick = (item: MenuItemConfig) => {
    if (item.children) {
      toggleExpand(item.key);
    } else {
      setActiveKey(item.key);
      if (item.route) {
        window.location.hash = item.route;
      }
    }
  };

  const navWidth = collapsed ? 64 : 'var(--sidebar-width)';

  const isActive = (item: MenuItemConfig) => activeKey === item.key;
  const isExpanded = (key: string) => expandedKeys.includes(key);

  return (
    <aside className="glass-heavy" style={{ ...styles.sidebar, width: navWidth }}>
      {!collapsed && (
        <div style={styles.brand}>
          <span style={styles.brandDeco}>◆ ◇ ◆</span>
        </div>
      )}

      <nav style={styles.nav}>
        {menuItems.map((item, idx) => {
          if (item.dividerBefore && !collapsed) {
            // divider not rendered inline — handled via CSS border-top on the item
          }
          return (
            <div key={item.key} style={{ animation: `fadeInUp 0.4s ease-out ${idx * 0.05}s both` }}>
              <div
                onClick={() => handleItemClick(item)}
                className={isActive(item) && !item.children ? 'glass' : ''}
                style={{
                  ...styles.menuItem,
                  ...(item.dividerBefore ? styles.menuItemDivider : {}),
                  ...(isActive(item) && !item.children ? styles.menuItemActive : {}),
                }}
                title={collapsed ? item.label : undefined}
              >
                <span style={styles.menuIcon}>{item.icon ?? '📌'}</span>
                {!collapsed && (
                  <>
                    <span style={styles.menuLabel}>{item.label}</span>
                    {item.badge && (
                      <span style={{
                        ...styles.badge,
                        background: item.badge.color ?? 'var(--color-accent)',
                      }}>
                        {item.badge.type === 'dot' ? '' : (item.badge.value ?? '')}
                      </span>
                    )}
                    {item.children && (
                      <span style={{
                        ...styles.arrow,
                        transform: isExpanded(item.key) ? 'rotate(90deg)' : 'rotate(0deg)',
                      }}>▸</span>
                    )}
                  </>
                )}
              </div>

              {item.children && isExpanded(item.key) && !collapsed && (
                <div style={styles.subMenu}>
                  {item.children.map(child => (
                    <div
                      key={child.key}
                      onClick={() => handleItemClick(child)}
                      style={{
                        ...styles.subMenuItem,
                        ...(isActive(child) ? styles.subMenuItemActive : {}),
                      }}
                    >
                      <span style={styles.activeDot} />
                      <span style={styles.subMenuIcon}>{child.icon ?? '📌'}</span>
                      <span>{child.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {!collapsed && (
        <div style={styles.footer}>
          <div style={styles.footerDivider} />
          <div style={styles.version}>{config.app.shortName} v{config.app.version}</div>
        </div>
      )}
    </aside>
  );
};

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    position: 'fixed', top: 'var(--header-height)', left: 0, bottom: 0,
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 99,
  },
  brand: { padding: '18px 0 10px', textAlign: 'center' },
  brandDeco: { fontSize: 10, color: 'var(--color-gold)', letterSpacing: 6, opacity: 0.4 },
  nav: { flex: 1, padding: '4px 8px', overflowY: 'auto', overflowX: 'hidden' },
  menuItem: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
    borderRadius: 10, cursor: 'pointer', color: 'var(--color-text-secondary)',
    fontSize: 14, transition: 'all 0.2s', marginBottom: 2, userSelect: 'none',
    whiteSpace: 'nowrap', border: '1px solid transparent',
  },
  menuItemDivider: {
    borderTop: '1px solid rgba(255,255,255,0.05)',
    marginTop: 6, paddingTop: 14,
  },
  menuItemActive: {
    color: 'var(--color-gold-light)',
    borderColor: 'var(--glass-border)',
    textShadow: '0 0 8px var(--color-gold-glow)',
  },
  menuIcon: { fontSize: 17, lineHeight: 1, minWidth: 22, textAlign: 'center' as const },
  menuLabel: { flex: 1 },
  badge: {
    color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px',
    borderRadius: 10, minWidth: 18, textAlign: 'center' as const,
    minHeight: 4, // for dot type
  },
  arrow: { fontSize: 10, transition: 'transform 0.2s', opacity: 0.5 },
  subMenu: { paddingLeft: 46, overflow: 'hidden' },
  subMenuItem: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
    borderRadius: 8, cursor: 'pointer', color: 'var(--color-text-muted)',
    fontSize: 13, transition: 'all 0.15s', marginBottom: 1, userSelect: 'none',
  },
  subMenuItemActive: {
    color: 'var(--color-gold)',
    background: 'rgba(212, 168, 83, 0.08)',
  },
  subMenuIcon: { fontSize: 13, minWidth: 18, textAlign: 'center' as const },
  activeDot: {
    width: 5, height: 5, borderRadius: '50%',
    background: 'var(--color-gold)',
    boxShadow: '0 0 6px var(--color-gold-glow)',
  },
  footer: { padding: '8px 16px 18px', flexShrink: 0 },
  footerDivider: {
    height: 1, marginBottom: 12,
    background: 'linear-gradient(90deg, transparent, rgba(212,168,83,0.2), transparent)',
  },
  version: {
    textAlign: 'center' as const, fontSize: 11,
    color: 'var(--color-text-muted)', opacity: 0.3, letterSpacing: 2,
  },
};

export default Sidebar;

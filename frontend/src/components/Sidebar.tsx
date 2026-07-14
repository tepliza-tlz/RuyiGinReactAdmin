import React from 'react';

interface MenuItem {
  key: string;
  label: string;
  icon: string;
  children?: MenuItem[];
}

interface SidebarProps {
  collapsed: boolean;
}

const menuItems: MenuItem[] = [
  { key: 'dashboard', label: '仪表盘', icon: '📊' },
  { key: 'user', label: '用户管理', icon: '👥' },
  { key: 'content', label: '内容管理', icon: '📝' },
  { key: 'data', label: '数据分析', icon: '📈' },
  {
    key: 'system',
    label: '系统设置',
    icon: '⚙',
    children: [
      { key: 'role', label: '角色权限', icon: '🔑' },
      { key: 'menu', label: '菜单管理', icon: '📋' },
      { key: 'log', label: '操作日志', icon: '📄' },
    ],
  },
  { key: 'ai', label: 'AI 助手', icon: '🤖' },
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const [activeKey, setActiveKey] = React.useState('dashboard');
  const [expandedKeys, setExpandedKeys] = React.useState<string[]>(['system']);

  const toggleExpand = (key: string) => {
    setExpandedKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  return (
    <aside style={{
      ...styles.sidebar,
      width: collapsed ? 64 : 'var(--sidebar-width)',
    }}>
      {/* 侧栏顶部装饰 */}
      {!collapsed && (
        <div style={styles.decoBar}>
          <span style={styles.decoPattern}>◆ ◇ ◆</span>
        </div>
      )}

      {/* 导航菜单 */}
      <nav style={styles.nav}>
        {menuItems.map(item => (
          <div key={item.key}>
            {/* 一级菜单 */}
            <div
              onClick={() => {
                if (item.children) {
                  toggleExpand(item.key);
                } else {
                  setActiveKey(item.key);
                }
              }}
              style={{
                ...styles.menuItem,
                ...(activeKey === item.key && !item.children ? styles.menuItemActive : {}),
              }}
              title={collapsed ? item.label : undefined}
            >
              <span style={styles.menuIcon}>{item.icon}</span>
              {!collapsed && (
                <>
                  <span style={styles.menuLabel}>{item.label}</span>
                  {item.children && (
                    <span style={{
                      ...styles.arrow,
                      transform: expandedKeys.includes(item.key) ? 'rotate(90deg)' : 'rotate(0deg)',
                    }}>
                      ▸
                    </span>
                  )}
                </>
              )}
            </div>

            {/* 二级菜单 */}
            {item.children && expandedKeys.includes(item.key) && !collapsed && (
              <div style={styles.subMenu}>
                {item.children.map(child => (
                  <div
                    key={child.key}
                    onClick={() => setActiveKey(child.key)}
                    style={{
                      ...styles.subMenuItem,
                      ...(activeKey === child.key ? styles.subMenuItemActive : {}),
                    }}
                  >
                    <span style={styles.subMenuIcon}>{child.icon}</span>
                    <span>{child.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* 底部版本信息 */}
      {!collapsed && (
        <div style={styles.footer}>
          <div className="ruyi-divider" style={{ marginBottom: 12 }} />
          <div style={styles.version}>
            <span style={styles.versionText}>如意管理系统 v1.0</span>
          </div>
        </div>
      )}
    </aside>
  );
};

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    position: 'fixed',
    top: 'var(--header-height)',
    left: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, #0f2027 0%, #16213e 50%, #1a1a2e 100%)',
    borderRight: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 99,
  },
  decoBar: {
    padding: '16px 0 8px',
    textAlign: 'center',
  },
  decoPattern: {
    fontSize: 10,
    color: 'var(--color-gold)',
    letterSpacing: 8,
    opacity: 0.5,
  },
  nav: {
    flex: 1,
    padding: '8px 8px',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 8,
    cursor: 'pointer',
    color: 'var(--color-text-secondary)',
    fontSize: 14,
    transition: 'all 0.15s',
    marginBottom: 2,
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  menuItemActive: {
    color: 'var(--color-gold)',
    background: 'rgba(201, 169, 110, 0.1)',
  },
  menuIcon: {
    fontSize: 16,
    lineHeight: 1,
    minWidth: 20,
    textAlign: 'center',
  },
  menuLabel: {
    flex: 1,
  },
  arrow: {
    fontSize: 10,
    transition: 'transform 0.2s',
    opacity: 0.6,
  },
  subMenu: {
    paddingLeft: 44,
    overflow: 'hidden',
  },
  subMenuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    borderRadius: 6,
    cursor: 'pointer',
    color: 'var(--color-text-muted)',
    fontSize: 13,
    transition: 'all 0.15s',
    marginBottom: 1,
    userSelect: 'none',
  },
  subMenuItemActive: {
    color: 'var(--color-gold)',
    background: 'rgba(201, 169, 110, 0.06)',
  },
  subMenuIcon: {
    fontSize: 13,
    minWidth: 16,
    textAlign: 'center',
  },
  footer: {
    padding: '8px 16px 16px',
    flexShrink: 0,
  },
  version: {
    textAlign: 'center',
  },
  versionText: {
    fontSize: 11,
    color: 'var(--color-text-muted)',
    letterSpacing: 2,
    opacity: 0.4,
  },
};

export default Sidebar;

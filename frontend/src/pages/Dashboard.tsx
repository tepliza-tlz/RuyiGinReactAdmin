import React from 'react';

/** 概览统计卡片数据（mock） */
const statsCards = [
  { label: '用户总数', value: '12,846', icon: '👥', trend: '+12%', trendUp: true },
  { label: '今日活跃', value: '3,421', icon: '📈', trend: '+8%', trendUp: true },
  { label: '内容总量', value: '9,853', icon: '📝', trend: '+23%', trendUp: true },
  { label: '系统负载', value: '42%', icon: '🖥', trend: '-5%', trendUp: false },
];

/** 快捷操作 */
const quickActions = [
  { label: '新建用户', icon: '➕', color: '#3b82f6' },
  { label: '发布内容', icon: '📤', color: '#10b981' },
  { label: '数据报表', icon: '📊', color: '#f59e0b' },
  { label: 'AI 分析', icon: '🤖', color: '#8b5cf6' },
];

const Dashboard: React.FC = () => {
  const greetText = (() => {
    const hour = new Date().getHours();
    if (hour < 6) return '夜深了，注意休息 🌙';
    if (hour < 9) return '早上好，如意为您服务 ☀';
    if (hour < 12) return '上午好，精神饱满 💪';
    if (hour < 14) return '中午好，记得休息 ☕';
    if (hour < 18) return '下午好，继续加油 🚀';
    return '晚上好，如意在呢 ✨';
  })();

  return (
    <div>
      {/* 欢迎横幅 */}
      <div style={styles.banner}>
        <div style={styles.bannerContent}>
          <div>
            <h1 style={styles.bannerTitle}>{greetText}</h1>
            <p style={styles.bannerSub}>
              今日多云 26°C · 北京 · 2026年7月14日 星期二
            </p>
          </div>
          <div style={styles.bannerDeco}>
            <span style={styles.bannerRuyi}>☁</span>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div style={styles.statsGrid}>
        {statsCards.map((card) => (
          <div key={card.label} className="ruyi-card" style={styles.statCard}>
            <div style={styles.statHeader}>
              <span style={styles.statIcon}>{card.icon}</span>
              <span
                style={{
                  ...styles.statTrend,
                  color: card.trendUp ? '#10b981' : '#ef4444',
                  background: card.trendUp
                    ? 'rgba(16, 185, 129, 0.1)'
                    : 'rgba(239, 68, 68, 0.1)',
                }}
              >
                {card.trend}
              </span>
            </div>
            <div style={styles.statValue}>{card.value}</div>
            <div style={styles.statLabel}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* 快捷操作 */}
      <div className="ruyi-card" style={{ marginBottom: 24 }}>
        <h3 style={styles.sectionTitle}>快捷操作</h3>
        <div style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <button key={action.label} style={styles.actionBtn}>
              <span
                style={{
                  ...styles.actionIcon,
                  background: `${action.color}22`,
                  color: action.color,
                }}
              >
                {action.icon}
              </span>
              <span style={styles.actionLabel}>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 最近活动 */}
      <div className="ruyi-card">
        <h3 style={styles.sectionTitle}>最近活动</h3>
        <div style={styles.activityList}>
          {[
            { time: '10分钟前', text: '管理员 更新了系统配置', icon: '⚙' },
            { time: '30分钟前', text: '用户 张三 提交了内容审核申请', icon: '📄' },
            { time: '1小时前', text: 'AI 助手 完成了数据清洗任务', icon: '🤖' },
            { time: '2小时前', text: '系统 自动备份完成', icon: '💾' },
            { time: '3小时前', text: '新用户 李四 完成注册', icon: '👤' },
          ].map((item, i) => (
            <div key={i} style={styles.activityItem}>
              <span style={styles.activityIcon}>{item.icon}</span>
              <div style={styles.activityContent}>
                <span style={styles.activityText}>{item.text}</span>
                <span style={styles.activityTime}>{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  banner: {
    background: 'linear-gradient(135deg, #0f3460 0%, #16213e 40%, #0f2027 100%)',
    border: '1px solid var(--color-border)',
    borderRadius: 12,
    padding: '28px 32px',
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  bannerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: 'var(--color-gold)',
    marginBottom: 8,
  },
  bannerSub: {
    fontSize: 13,
    color: 'var(--color-text-muted)',
    letterSpacing: 1,
  },
  bannerDeco: {
    fontSize: 64,
    opacity: 0.15,
    lineHeight: 1,
  },
  bannerRuyi: {
    filter: 'grayscale(0.5)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    padding: '20px 24px',
    transition: 'transform 0.2s, border-color 0.2s',
  },
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 22,
  },
  statTrend: {
    fontSize: 11,
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: 10,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 700,
    color: 'var(--color-text)',
    marginBottom: 4,
    letterSpacing: 1,
  },
  statLabel: {
    fontSize: 13,
    color: 'var(--color-text-secondary)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: 'var(--color-gold)',
    marginBottom: 16,
  },
  actionsGrid: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 20px',
    background: 'rgba(201, 169, 110, 0.05)',
    border: '1px solid var(--color-border)',
    borderRadius: 8,
    color: 'var(--color-text)',
    cursor: 'pointer',
    fontSize: 13,
    transition: 'all 0.15s',
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
  },
  actionLabel: {
    fontWeight: 500,
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '10px 12px',
    borderRadius: 8,
    transition: 'background 0.15s',
  },
  activityIcon: {
    fontSize: 18,
    minWidth: 24,
    textAlign: 'center',
  },
  activityContent: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityText: {
    fontSize: 13,
    color: 'var(--color-text)',
  },
  activityTime: {
    fontSize: 12,
    color: 'var(--color-text-muted)',
    whiteSpace: 'nowrap',
  },
};

export default Dashboard;

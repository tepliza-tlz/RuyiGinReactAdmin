import React from 'react';

const statsCards = [
  { label: '用户总数', value: '12,846', icon: '👥', trend: '+12%', up: true, color: '#3b82f6' },
  { label: '今日活跃', value: '3,421', icon: '📈', trend: '+8%', up: true, color: '#10b981' },
  { label: '内容总量', value: '9,853', icon: '📝', trend: '+23%', up: true, color: '#f59e0b' },
  { label: '系统负载', value: '42%', icon: '🖥', trend: '-5%', up: false, color: '#8b5cf6' },
];

const quickActions = [
  { label: '新建用户', icon: '➕' },
  { label: '发布内容', icon: '📤' },
  { label: '数据报表', icon: '📊' },
  { label: 'AI 分析', icon: '🤖' },
];

const activities = [
  { time: '10分钟前', text: '管理员 更新了系统配置', icon: '⚙' },
  { time: '30分钟前', text: '用户 张三 提交了内容审核申请', icon: '📄' },
  { time: '1小时前', text: 'AI 助手 完成了数据清洗任务', icon: '🤖' },
  { time: '2小时前', text: '系统 自动备份完成', icon: '💾' },
  { time: '3小时前', text: '新用户 李四 完成注册', icon: '👤' },
];

const greetText = () => {
  const h = new Date().getHours();
  if (h < 6) return '夜深了，注意休息 🌙';
  if (h < 9) return '早上好，如意为您服务 ☀';
  if (h < 12) return '上午好，精神饱满 💪';
  if (h < 14) return '中午好，记得休息 ☕';
  if (h < 18) return '下午好，继续加油 🚀';
  return '晚上好，如意在呢 ✨';
};

/** 统计卡片组件 — 玻璃+3D */
const StatCard: React.FC<{ card: typeof statsCards[0]; idx: number }> = ({ card, idx }) => (
  <div
    className="card-3d"
    style={{ animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s both`, padding: '22px 24px' }}
  >
    <div style={styles.statTop}>
      <span style={{ ...styles.statIcon, color: card.color }}>{card.icon}</span>
      <span style={{
        ...styles.statTrend,
        color: card.up ? '#10b981' : '#ef4444',
        background: card.up ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
      }}>{card.trend}</span>
    </div>
    <div style={{
      ...styles.statValue,
      animation: `count-up 0.6s ease-out ${0.3 + idx * 0.1}s both`,
    }}>
      {card.value}
    </div>
    <div style={styles.statLabel}>{card.label}</div>
    {/* 底部渐变装饰线 */}
    <div style={{
      height: 2, marginTop: 14, borderRadius: 1,
      background: `linear-gradient(90deg, ${card.color}44, transparent)`,
    }} />
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div>
      {/* 欢迎横幅 — 玻璃 + 渐变 */}
      <div
        className="glass-heavy"
        style={{ ...styles.banner, animation: 'breathe-blue 4s ease-in-out infinite' }}
      >
        <div style={styles.bannerInner}>
          <div>
            <h1 style={styles.bannerTitle}>{greetText()}</h1>
            <p style={styles.bannerSub}>今日多云 26°C · 北京 · 2026年7月14日 星期二</p>
          </div>
          <div style={styles.bannerRuyiWrap}>
            <span style={{
              fontSize: 72, lineHeight: 1, opacity: 0.12,
              filter: 'drop-shadow(0 0 30px rgba(212,168,83,0.3))',
            }}>☁</span>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div style={styles.statsGrid}>
        {statsCards.map((card, i) => <StatCard key={card.label} card={card} idx={i} />)}
      </div>

      {/* 快捷操作 */}
      <div className="card-3d" style={{ marginBottom: 24 }}>
        <h3 style={styles.sectionTitle}>快捷操作</h3>
        <div style={styles.actionsRow}>
          {quickActions.map((a, i) => (
            <button
              key={a.label}
              className="glass"
              style={{
                ...styles.actionBtn,
                animation: `fadeInUp 0.4s ease-out ${0.1 + i * 0.08}s both`,
              }}
            >
              <span style={styles.actionIconWrap}>{a.icon}</span>
              <span>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 最近活动 */}
      <div className="card-3d">
        <h3 style={styles.sectionTitle}>最近活动</h3>
        <div style={styles.activityList}>
          {activities.map((item, i) => (
            <div key={i} className="glass" style={styles.activityItem}>
              <span style={styles.activityIcon}>{item.icon}</span>
              <div style={styles.activityBody}>
                <span>{item.text}</span>
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
    borderRadius: 'var(--radius-xl)',
    padding: '30px 36px', marginBottom: 24, overflow: 'hidden',
  },
  bannerInner: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    position: 'relative', zIndex: 1,
  },
  bannerTitle: {
    fontSize: 26, fontWeight: 700, marginBottom: 8,
    background: 'linear-gradient(135deg, var(--color-gold-light), var(--color-accent-cyan))',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  bannerSub: { fontSize: 13, color: 'var(--color-text-muted)', letterSpacing: 1 },
  bannerRuyiWrap: { flexShrink: 0 },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 16, marginBottom: 24,
  },
  statTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  statIcon: { fontSize: 24 },
  statTrend: { fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 12 },
  statValue: { fontSize: 30, fontWeight: 700, letterSpacing: 1, marginBottom: 4 },
  statLabel: { fontSize: 13, color: 'var(--color-text-secondary)' },
  sectionTitle: {
    fontSize: 16, fontWeight: 600, marginBottom: 16,
    background: 'linear-gradient(90deg, var(--color-gold), var(--color-accent-cyan))',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  actionsRow: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  actionBtn: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 22px', borderRadius: 12, border: 'none',
    color: 'var(--color-text)', cursor: 'pointer', fontSize: 13, fontWeight: 500,
    background: 'var(--glass-bg)',
  },
  actionIconWrap: {
    width: 32, height: 32, borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, background: 'rgba(59,130,246,0.15)',
  },
  activityList: { display: 'flex', flexDirection: 'column', gap: 4 },
  activityItem: {
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '10px 14px', borderRadius: 10, border: 'none',
    transition: 'all 0.2s',
  },
  activityIcon: { fontSize: 18, minWidth: 28, textAlign: 'center' as const },
  activityBody: {
    display: 'flex', flex: 1, justifyContent: 'space-between',
    alignItems: 'center', fontSize: 13,
  },
  activityTime: { color: 'var(--color-text-muted)', fontSize: 12, whiteSpace: 'nowrap' },
};

export default Dashboard;

import React from 'react';

/* ====== Mini Charts (pure inline SVG, zero deps) ====== */

/** Sparkline bar chart */
const MiniBarChart = ({ data, color = '#3b82f6', height = 64 }: { data: number[]; color?: string; height?: number }) => {
  const max = Math.max(...data, 1);
  const w = 6, gap = 4, total = data.length * (w + gap);
  return (
    <svg width={total} height={height} style={{ display: 'block' }}>
      {data.map((v, i) => {
        const h = Math.max((v / max) * (height - 4), 2);
        return <rect key={i} x={i * (w + gap)} y={height - h} width={w} height={h} rx={2} fill={color} opacity={0.85}>
          <animate attributeName="height" from={0} to={h} dur="0.6s" begin={`${i * 0.06}s`} fill="freeze" />
          <animate attributeName="y" from={height} to={height - h} dur="0.6s" begin={`${i * 0.06}s`} fill="freeze" />
        </rect>;
      })}
    </svg>
  );
};

/** Donut ring */
const DonutRing = ({ pct, size = 72, stroke = 5, color = '#10b981' }: { pct: number; size?: number; stroke?: number; color?: string }) => {
  const r = (size - stroke) / 2, c = size / 2, circ = 2 * Math.PI * r, dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ display: 'block' }}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`} transform={`rotate(-90 ${c} ${c})`}>
        <animate attributeName="stroke-dasharray" from={`0 ${circ}`} to={`${dash} ${circ}`} dur="0.8s" fill="freeze" />
      </circle>
      <text x={c} y={c + 1} textAnchor="middle" dominantBaseline="middle" fill="var(--color-text)" fontSize={13} fontWeight={700}>{pct}%</text>
    </svg>
  );
};

/** Line chart area */
const MiniLine = ({ data, color = '#3b82f6', w = 160, h = 60 }: { data: number[]; color?: string; w?: number; h?: number }) => {
  const max = Math.max(...data, 1), min = Math.min(...data, 0);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 10) - 5}`).join(' ');
  const areaPts = `0,${h} ${pts} ${w},${h}`;
  return (
    <svg width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
      <defs><linearGradient id={`lg-${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.2} /><stop offset="100%" stopColor={color} stopOpacity={0} /></linearGradient></defs>
      <polygon points={areaPts} fill={`url(#lg-${color.slice(1)})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => <circle key={i} cx={(i / (data.length - 1)) * w} cy={h - ((v - min) / range) * (h - 10) - 5} r={2.5} fill={color}><animate attributeName="r" from={0} to={2.5} dur="0.4s" begin={`${i * 0.04 + 0.5}s`} fill="freeze" /></circle>)}
    </svg>
  );
};

/* ====== Dashboard ====== */

const stats = [
  { label: '用户总数', value: '12,846', trend: '+12%', up: true,  color: '#3b82f6', data: [20,35,28,42,55,48,62,58,70,65,78,72] },
  { label: '今日活跃', value: '3,421', trend: '+8%',  up: true,  color: '#10b981', data: [15,22,18,30,25,38,35,42,38,50,45,48] },
  { label: '内容总量', value: '9,853', trend: '+23%', up: true,  color: '#f59e0b', data: [8,12,10,18,15,22,20,28,25,32,30,35] },
  { label: '系统负载', value: '42%',  trend: '-5%',  up: false, color: '#8b5cf6', data: [80,75,70,68,65,60,58,55,50,48,45,42] },
];

const weeklyData = [320, 480, 390, 520, 610, 550, 720];
const donutItems = [
  { label: 'Web', pct: 45, color: '#3b82f6' },
  { label: 'Mobile', pct: 30, color: '#10b981' },
  { label: 'API', pct: 15, color: '#f59e0b' },
  { label: 'Other', pct: 10, color: '#8b5cf6' },
];

const activities = [
  { time: '10分钟前', text: '管理员 更新了系统配置', icon: '⚙' },
  { time: '30分钟前', text: '用户 张三 提交了内容审核申请', icon: '📄' },
  { time: '1小时前',  text: 'AI 助手 完成了数据清洗任务', icon: '🤖' },
  { time: '2小时前',  text: '系统 自动备份完成', icon: '💾' },
  { time: '3小时前',  text: '新用户 李四 完成注册', icon: '👤' },
];

const greet = () => {
  const h = new Date().getHours();
  if (h < 6) return '夜深了，注意休息 🌙';
  if (h < 9) return '早上好，如意为您服务 ☀';
  if (h < 12) return '上午好，精神饱满 💪';
  if (h < 14) return '中午好，记得休息 ☕';
  if (h < 18) return '下午好，继续加油 🚀';
  return '晚上好，如意在呢 ✨';
};

/* ── StatCard with sparkline ── */
const StatCard = ({ s, i }: { s: typeof stats[0]; i: number }) => (
  <div className="glass-card" style={{ padding: '20px 22px', animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
      <div>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>{s.label}</div>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 1 }}>{s.value}</div>
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 12,
        color: s.up ? '#10b981' : '#ef4444', background: s.up ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)' }}>{s.trend}</span>
    </div>
    <MiniBarChart data={s.data} color={s.color} height={40} />
  </div>
);

export default function Dashboard() {
  return (
    <div style={{ animation: 'fadeInUp 0.4s ease-out both' }}>

      {/* ═══ Banner: glow-border + glass ═══ */}
      <div className="glow-border-gold glow-border-card glass-heavy" style={{ borderRadius: 'var(--radius-xl)', padding: '28px 36px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <h1 style={s.bannerTitle}>{greet()}</h1>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', letterSpacing: 1, marginTop: 6 }}>今日多云 26°C · 北京 · 2026年7月14日 星期二</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <MiniLine data={weeklyData} color="var(--color-gold-light)" w={200} h={56} />
            <span style={{ fontSize: 64, opacity: 0.1, filter: 'drop-shadow(0 0 24px rgba(212,168,83,0.3))' }}>☁</span>
          </div>
        </div>
      </div>

      {/* ═══ Stat cards 2×2 grid ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
        {stats.map((s, i) => <StatCard key={s.label} s={s} i={i} />)}
      </div>

      {/* ═══ Bottom row: chart + traffic sources + activity ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, marginBottom: 24 }}>
        {/* Chart card */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={s.sectionTitle}>周访问趋势</h3>
          <div style={{ marginTop: 8 }}>
            <MiniLine data={weeklyData} color="#3b82f6" w={500} h={180} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 11, color: 'var(--color-text-muted)' }}>
            {['周一','周二','周三','周四','周五','周六','周日'].map(d => <span key={d}>{d}</span>)}
          </div>
        </div>

        {/* Traffic sources */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={s.sectionTitle}>流量来源</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 12 }}>
            {donutItems.map(d => (
              <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, boxShadow: `0 0 8px ${d.color}66` }} />
                <span style={{ flex: 1, fontSize: 13, color: 'var(--color-text-secondary)' }}>{d.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{d.pct}%</span>
                <div style={{ width: 80, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{ width: `${d.pct}%`, height: '100%', borderRadius: 2, background: d.color, transition: 'width 0.8s ease-out' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Activity ═══ */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={s.sectionTitle}>最近活动</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 8 }}>
          {activities.map((a, i) => (
            <div key={i} className="glass" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', borderRadius: 10, border: 'none', transition: 'all 0.2s' }}>
              <span style={{ fontSize: 18, minWidth: 28, textAlign: 'center' as const }}>{a.icon}</span>
              <span style={{ flex: 1, fontSize: 13 }}>{a.text}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' as const }}>{a.time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

const s = {
  bannerTitle: {
    fontSize: 24, fontWeight: 700,
    background: 'linear-gradient(135deg, #e8c97a, #06b6d4)',
    WebkitBackgroundClip: 'text' as const, WebkitTextFillColor: 'transparent' as const,
  },
  sectionTitle: {
    fontSize: 15, fontWeight: 600,
    background: 'linear-gradient(90deg, var(--color-gold), var(--color-accent-cyan))',
    WebkitBackgroundClip: 'text' as const, WebkitTextFillColor: 'transparent' as const,
  },
};

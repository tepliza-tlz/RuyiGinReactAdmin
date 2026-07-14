# RuyiGin Admin Dashboard — File-by-File Upgrade Guide

This document lists the specific changes to apply to each existing file.
All new files have already been created. Follow these steps in order.

## Files Created (no action needed — already done)

| File | Purpose |
|---|---|
| `src/styles/modern-enhancements.css` | All CSS for 7 techniques |
| `src/hooks/useTilt.ts` | 3D perspective card tilt |
| `src/hooks/useScrollReveal.ts` | Scroll-triggered reveal |
| `src/hooks/useRipple.ts` | Click ripple effect |
| `src/hooks/index.ts` | Barrel export |
| `src/components/AmbientParticles.tsx` | Floating gold dust particles |

---

## STEP 1: Import modern-enhancements.css

**File: `src/main.tsx`**

Add the import after the existing theme import:

```tsx
import './styles/theme.css';
import './styles/modern-enhancements.css';   // <-- ADD THIS LINE
import App from './App';
```

---

## STEP 2: Update Layout.tsx — Animated Background + Light Rays

**File: `src/components/Layout.tsx`**

Key changes:
- Add `gradient-mesh-bg` class to wrapper
- Add `<div className="light-rays" />` before main content
- Ensure content sits above animated background (z-index)
- Import AmbientParticles

```tsx
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import AmbientParticles from './AmbientParticles';  // ADD

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div style={styles.wrapper} className="gradient-mesh-bg">
      {/* Floating gold particles */}
      <AmbientParticles count={12} blueRatio={0.35} />

      <div className="light-rays" />

      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
      />
      <Sidebar collapsed={sidebarCollapsed} />

      <main
        style={{
          ...styles.content,
          position: 'relative',
          zIndex: 1,  // ABOVE animated background
          marginLeft: sidebarCollapsed ? 64 : 'var(--sidebar-width)',
          width: sidebarCollapsed
            ? 'calc(100vw - 64px)'
            : 'calc(100vw - var(--sidebar-width))',
        }}
      >
        <div style={styles.contentInner}>
          {children}
        </div>
      </main>
    </div>
  );
};
```

---

## STEP 3: Update Header.tsx — Glass Header + Neo-Gold Seal Avatar

**File: `src/components/Header.tsx`**

Key changes:
- Change header style to use `glass-header` class (+ merge with inline styles)
- Change avatar to use `neo-gold-seal` class
- Add `click-bounce` to the toggle button

```tsx
// Replace the header style:
header: {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: 'var(--header-height)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 20px',
  zIndex: 100,
  // glass-header class handles background, blur, border, box-shadow
  // (no more inline gradient, borderBottom, backdropFilter — class does it)
},

// In the JSX:
<header style={styles.header} className="glass-header">
  {/* ... */}
  <button
    onClick={onToggleSidebar}
    style={styles.toggleBtn}
    className="click-bounce"   // ADD
    title={...}
  >
    ...
  </button>
  {/* ... */}
  <div style={styles.avatar} className="neo-gold-seal">鹏</div>  {/* ADD CLASS */}
</header>
```

---

## STEP 4: Update Sidebar.tsx — Glass Sidebar + Neumorphic Menu Items

**File: `src/components/Sidebar.tsx`**

Key changes:
- Add `glass-sidebar` class to `<aside>`
- Active menu items get `neo-gold-pressed` class
- Hoverable menu items get smooth transitions

```tsx
// Replace the sidebar style:
sidebar: {
  position: 'fixed',
  top: 'var(--header-height)',
  left: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 99,
  // glass-sidebar class handles background, blur, border, box-shadow
},

// In JSX:
<aside
  style={{
    ...styles.sidebar,
    width: collapsed ? 64 : 'var(--sidebar-width)',
  }}
  className="glass-sidebar"
>

// Active menu item:
<div
  onClick={...}
  style={{
    ...styles.menuItem,
    ...(activeKey === item.key && !item.children ? styles.menuItemActive : {}),
  }}
  className={
    activeKey === item.key && !item.children
      ? 'neo-gold-pressed'
      : ''
  }
>
```

---

## STEP 5: Update Dashboard.tsx — Full Modernization

**File: `src/pages/Dashboard.tsx`**

This is the biggest change. Apply all 7 techniques:

```tsx
import React from 'react';
import { useTilt, useRipple } from '../hooks';  // ADD

const Dashboard: React.FC = () => {
  // ... greetText stays the same ...

  return (
    <div>
      {/* Welcome Banner — glowing border + glass */}
      <div
        className="glass-card glow-border-card glow-border-gold"
        style={styles.banner}
      >
        <div style={styles.bannerContent}>
          <div>
            <h1 style={styles.bannerTitle} className="animate-title">
              {greetText}
            </h1>
            <p style={styles.bannerSub}>
              今日多云 26°C · 北京 · 2026年7月14日 星期二
            </p>
          </div>
          <div style={styles.bannerDeco}>
            <span style={styles.bannerRuyi}>☁</span>
          </div>
        </div>
      </div>

      {/* Stat Cards — glass + 3D tilt + staggered entrance */}
      <div style={styles.statsGrid}>
        {statsCards.map((card, i) => (
          <StatCard key={card.label} card={card} index={i} />
        ))}
      </div>

      {/* ... rest stays similar, add glass-card classes ... */}
    </div>
  );
};

// Extract StatCard to use hooks
const StatCard: React.FC<{ card: StatCard; index: number }> = ({ card, index }) => {
  const { ref } = useTilt<HTMLDivElement>({ maxTilt: 6, scale: 1.015 });

  return (
    <div
      className={`glass-card tilt-card animate-card-reveal delay-${index + 1}`}
      style={styles.statCard}
    >
      <div ref={ref} className="tilt-card-inner" style={{ padding: '20px 24px' }}>
        <div style={styles.statHeader}>
          <span style={styles.statIcon}>{card.icon}</span>
          <span style={{
            ...styles.statTrend,
            color: card.trendUp ? '#10b981' : '#ef4444',
            background: card.trendUp
              ? 'rgba(16, 185, 129, 0.1)'
              : 'rgba(239, 68, 68, 0.1)',
          }}>
            {card.trend}
          </span>
        </div>
        <div style={styles.statValue}>{card.value}</div>
        <div style={styles.statLabel}>{card.label}</div>
      </div>
    </div>
  );
};

// Extract ActionButton for ripple effect
const ActionButton: React.FC<{ action: QuickAction }> = ({ action }) => {
  const { ripples, createRipple } = useRipple();

  return (
    <button
      className="neo-gold-raised btn-gold-shimmer ripple-container click-bounce"
      onClick={createRipple}
      style={styles.actionBtn}
    >
      {ripples.map(r => (
        <span
          key={r.id}
          className="ripple"
          style={{
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
          }}
        />
      ))}
      <span style={{
        ...styles.actionIcon,
        background: `${action.color}22`,
        color: action.color,
      }}>
        {action.icon}
      </span>
      <span style={styles.actionLabel}>{action.label}</span>
    </button>
  );
};
```

---

## STEP 6: Add `animation-play-state: paused` to ScrollReveal elements

In any component using `useScrollReveal`:

```tsx
const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

<div
  ref={ref}
  className={`scroll-reveal ${isVisible ? 'scroll-revealed' : ''}`}
>
  {/* Content that animates in on scroll */}
</div>
```

---

## QUICK START — Minimal Changes for Immediate Impact

If you want the biggest visual upgrade with the fewest file changes:

1. **Add CSS import** in `main.tsx` — 1 line
2. **Upgrade Dashboard.tsx stat cards** to use `.glass-card` + `.animate-card-reveal` + `.tilt-card` — 10 lines changed
3. **Upgrade Layout.tsx** to add `gradient-mesh-bg` + `light-rays` — 3 lines
4. **Upgrade Header.tsx** avatar to `.neo-gold-seal` — 1 class

That's roughly 15 lines changed for a dramatic visual transformation.

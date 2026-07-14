# RuyiGin Admin Dashboard — Modern UI Upgrade Blueprint (2025-2026)

## Project Analysis

**Current state:** Deep tech-blue theme (`#1a1a2e`, `#0f3460`) with Chinese gold (`#c9a96e`) accents. Fixed header (60px) + fixed sidebar (240px) + scrollable content. CSS custom properties are well-organized. Flat card design with thin gold border accents.

**Strengths to preserve:** Gold/blue palette, Chinese decorative elements (如意纹 dividers, diamond patterns), clean CSS variable architecture, backdrop-filter already on header.

**Missing:** Depth, motion, premium "wow factor," modern glass treatments, 3D spatial effects, luminous/glow aesthetics.

---

## RANKED TECHNIQUES (highest impact first)

### 🥇 #1: Premium Glassmorphism — Frosted Glass Cards + Surfaces

**Why #1:** Single highest-impact visual change. Transforms flat `#16213e` cards into luminous, layered frosted-glass surfaces. Already have `backdrop-filter` on header — extend everywhere.

**Key CSS technique:** Layered `backdrop-filter` with inner glow borders. Modern glassmorphism in 2025-2026 uses *multi-layer* blur + subtle white tint + colored edge glow (no longer just plain blur).

```css
/* === Glassmorphism Card v2 — Premium Frosted Glass === */
.glass-card {
  /* Layered backgrounds for depth */
  background:
    radial-gradient(
      ellipse at 0% 0%,
      rgba(59, 130, 246, 0.06) 0%,
      transparent 50%
    ),
    radial-gradient(
      ellipse at 100% 100%,
      rgba(201, 169, 110, 0.04) 0%,
      transparent 50%
    ),
    rgba(22, 33, 62, 0.55); /* semi-transparent surface */

  /* Frosted glass effect */
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);

  /* Glowing border — inner + outer */
  border: 1px solid rgba(201, 169, 110, 0.12);
  border-radius: 16px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 0 0 1px rgba(59, 130, 246, 0.08);

  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.glass-card:hover {
  border-color: rgba(201, 169, 110, 0.3);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 0 0 1px rgba(59, 130, 246, 0.15),
    0 0 40px rgba(59, 130, 246, 0.06);
  transform: translateY(-2px);
}

/* Header glass upgrade */
.glass-header {
  background:
    linear-gradient(
      180deg,
      rgba(15, 32, 39, 0.85) 0%,
      rgba(22, 33, 62, 0.75) 100%
    );
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border-bottom: 1px solid rgba(201, 169, 110, 0.1);
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.3),
    inset 0 -1px 0 rgba(255, 255, 255, 0.03);
}

/* Sidebar glass upgrade */
.glass-sidebar {
  background:
    linear-gradient(
      180deg,
      rgba(15, 32, 39, 0.9) 0%,
      rgba(22, 33, 62, 0.75) 50%,
      rgba(26, 26, 46, 0.85) 100%
    );
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border-right: 1px solid rgba(201, 169, 110, 0.08);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.2);
}
```

**React usage (Dashboard.tsx):**
```tsx
<div className="glass-card" style={styles.statCard}>
  {/* card content */}
</div>
```

---

### 🥈 #2: Animated Aurora/Mesh Gradient Background

**Why #2:** Static dark background feels flat. A slow-moving, subtle gradient "aurora" behind the content area creates a living, premium, futuristic feel. This is the hallmark of 2025-2026 premium dashboards (Linear, Vercel, Arc browser).

**Key CSS technique:** CSS `@property` animated gradients + `::before` pseudo-elements with slow keyframe rotation.

```css
/* === Animated Gradient Mesh (Content Area Background) === */

/* Register custom properties for smooth animation */
@property --gradient-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

@property --gradient-x {
  syntax: '<percentage>';
  initial-value: 0%;
  inherits: false;
}

.gradient-mesh-bg {
  position: relative;
  background: var(--color-primary);
}

/* Animated orbs behind content */
.gradient-mesh-bg::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.4;

  /* Multiple animated gradient orbs */
  background:
    radial-gradient(
      ellipse 800px 600px at var(--gradient-x) 20%,
      rgba(59, 130, 246, 0.08) 0%,
      transparent 60%
    ),
    radial-gradient(
      ellipse 600px 500px at 80% calc(100% - var(--gradient-x)),
      rgba(15, 52, 96, 0.12) 0%,
      transparent 60%
    ),
    radial-gradient(
      ellipse 500px 400px at 30% 60%,
      rgba(201, 169, 110, 0.04) 0%,
      transparent 60%
    );

  animation: gradientShift 20s ease-in-out infinite alternate;
}

@keyframes gradientShift {
  0% { --gradient-x: 10%; }
  100% { --gradient-x: 90%; }
}

/* Animated light ray beams (tech-forward feel) */
.light-rays {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  opacity: 0.06;
  background:
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 200px,
      rgba(59, 130, 246, 0.3) 200px,
      rgba(59, 130, 246, 0.3) 201px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 300px,
      rgba(201, 169, 110, 0.2) 300px,
      rgba(201, 169, 110, 0.2) 301px
    );
  animation: lightRayDrift 40s linear infinite;
}

@keyframes lightRayDrift {
  0% { transform: translate(-5%, -5%) rotate(0deg); }
  100% { transform: translate(5%, 5%) rotate(5deg); }
}
```

**React implementation (Layout.tsx):**
```tsx
<div style={styles.wrapper} className="gradient-mesh-bg">
  <div className="light-rays" />
  <Header ... />
  <Sidebar ... />
  <main style={{ ...styles.content, position: 'relative', zIndex: 1 }}>
    {/* content stays above the animated bg */}
  </main>
</div>
```

---

### 🥉 #3: 3D Perspective Card Tilt with Glow Trail

**Why #3:** Converts static stat cards into interactive, spatial elements. The "Apple Card" / "Linear perspective card" effect signals premium quality immediately. Combines CSS 3D transforms with mouse-tracking.

**Key CSS technique:** `perspective` + `rotateX/Y` via JS mouse position mapping + gradient glow that follows cursor.

```css
/* === 3D Tilt Card Base === */
.tilt-card {
  perspective: 800px;
  transform-style: preserve-3d;
}

.tilt-card-inner {
  position: relative;
  transition: transform 0.1s ease-out;
  transform-style: preserve-3d;
  will-change: transform;
}

/* Glow trail that follows cursor */
.tilt-card-inner::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(59, 130, 246, 0.12),
    rgba(201, 169, 110, 0.06) 30%,
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  z-index: 2;
}

.tilt-card-inner:hover::after {
  opacity: 1;
}
```

**React utility hook (new file: `src/hooks/useTilt.ts`):**
```tsx
import { useRef, useCallback, useEffect } from 'react';

interface TiltOptions {
  maxTilt?: number;    // degrees (default 8)
  scale?: number;      // hover scale (default 1.02)
  speed?: number;      // transition speed ms (default 400)
  glare?: boolean;     // enable glow trail (default true)
}

export function useTilt<T extends HTMLElement>(options: TiltOptions = {}) {
  const { maxTilt = 8, scale = 1.02, speed = 400, glare = true } = options;
  const ref = useRef<T>(null);
  const isHovering = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovering.current) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;   // 0..1
      const y = (e.clientY - rect.top) / rect.height;   // 0..1

      // Map to tilt: center = 0, edges = ±maxTilt
      const tiltX = (y - 0.5) * -maxTilt * 2;
      const tiltY = (x - 0.5) * maxTilt * 2;

      el.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${scale}, ${scale}, ${scale})`;

      // Update glow position
      if (glare) {
        el.style.setProperty('--mouse-x', `${x * 100}%`);
        el.style.setProperty('--mouse-y', `${y * 100}%`);
      }
    };

    const handleMouseEnter = () => {
      isHovering.current = true;
      el.style.transition = `transform ${speed * 0.3}ms ease-out, box-shadow ${speed}ms ease-out`;
    };

    const handleMouseLeave = () => {
      isHovering.current = false;
      el.style.transition = `transform ${speed}ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow ${speed}ms ease-out`;
      el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      if (glare) {
        el.style.setProperty('--mouse-x', '50%');
        el.style.setProperty('--mouse-y', '50%');
      }
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [maxTilt, scale, speed, glare]);

  return { ref, className: 'tilt-card-inner' };
}
```

**Usage in Dashboard.tsx stat cards:**
```tsx
import { useTilt } from '@/hooks/useTilt';

function StatCard({ card }: { card: StatCard }) {
  const { ref } = useTilt<HTMLDivElement>({ maxTilt: 6, scale: 1.015 });

  return (
    <div className="glass-card tilt-card" style={{ perspective: '800px' }}>
      <div ref={ref} className="tilt-card-inner">
        {/* card content */}
      </div>
    </div>
  );
}
```

---

### #4: Animated Glowing Borders (Conic Gradient + Rotating Border)

**Why #4:** Animated borders that "breathe" with rotating gradient light create a sci-fi/tech-forward feel that pairs beautifully with the Chinese gold accents. This is the 2025-2026 "animated gradient border" trend seen on premium SaaS dashboards.

**Key CSS technique:** Conic-gradient borders via `::before` with rotating animation, clipped by the card's border-radius.

```css
/* === Animated Glowing Border Card === */
.glow-border-card {
  position: relative;
  border-radius: 16px;
  background: var(--color-surface);
  overflow: hidden;
}

/* Rotating border via pseudo-element */
.glow-border-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.5px; /* border thickness */
  background: conic-gradient(
    from var(--border-angle, 0deg),
    transparent 0%,
    rgba(201, 169, 110, 0.6) 15%,
    rgba(59, 130, 246, 0.5) 35%,
    transparent 50%,
    transparent 70%,
    rgba(201, 169, 110, 0.3) 85%,
    transparent 100%
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: borderSpin 8s linear infinite;
  pointer-events: none;
}

@property --border-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

@keyframes borderSpin {
  to { --border-angle: 360deg; }
}

/* Ping animation on stat cards (single glow pulse) */
@keyframes statPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
  50% { box-shadow: 0 0 20px 5px rgba(59, 130, 246, 0.08); }
}

.glow-border-card:hover {
  animation: statPulse 3s ease-in-out infinite;
}

/* Gold accent version (for Chinese elements) */
.glow-border-gold::before {
  background: conic-gradient(
    from var(--border-angle, 0deg),
    transparent 0%,
    rgba(201, 169, 110, 0.8) 20%,
    transparent 40%,
    transparent 60%,
    rgba(201, 169, 110, 0.4) 80%,
    transparent 100%
  );
}
```

**React usage for the welcome banner:**
```tsx
<div className="glow-border-card glow-border-gold" style={styles.banner}>
  {/* banner content */}
</div>
```

---

### #5: Neumorphic "Pressed" Gold Accents + Inner Glow

**Why #5:** Neumorphism's soft-shadow aesthetic has evolved. In 2025-2026, the winning approach is *limited-area neumorphism* — applying it only to interactive elements (buttons, inputs, badges) within an otherwise glassmorphic layout. Paired with Chinese gold, it creates a jade-like carved-stone feel reminiscent of traditional Chinese seal carving.

**Key CSS technique:** Dual box-shadow (outer highlight + inner shadow) with gold-tinted glow.

```css
/* === Neo-Gold Raised Element (jade/carved aesthetic) === */
.neo-gold-raised {
  background: linear-gradient(
    145deg,
    rgba(22, 33, 62, 0.9) 0%,
    rgba(26, 26, 46, 0.95) 100%
  );
  border-radius: 12px;
  border: none;
  box-shadow:
    4px 4px 8px rgba(0, 0, 0, 0.3),
    -2px -2px 6px rgba(59, 130, 246, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.neo-gold-raised:hover {
  box-shadow:
    6px 6px 12px rgba(0, 0, 0, 0.35),
    -3px -3px 8px rgba(59, 130, 246, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transform: translateY(-1px);
}

/* Neo-Gold Pressed (active/selected state) */
.neo-gold-pressed {
  background: linear-gradient(
    145deg,
    rgba(15, 32, 39, 0.95) 0%,
    rgba(22, 33, 62, 0.9) 100%
  );
  box-shadow:
    inset 3px 3px 6px rgba(0, 0, 0, 0.35),
    inset -1px -1px 3px rgba(59, 130, 246, 0.06),
    1px 1px 2px rgba(255, 255, 255, 0.02);
  transform: translateY(1px);
  color: var(--color-gold);
}

/* Gold inner glow ring (seal-impression effect) */
.neo-gold-seal {
  position: relative;
  background: linear-gradient(
    145deg,
    #1a1a2e 0%,
    #16213e 100%
  );
  border-radius: 50%;
  box-shadow:
    6px 6px 14px rgba(0, 0, 0, 0.4),
    -2px -2px 8px rgba(201, 169, 110, 0.08),
    inset 1px 1px 2px rgba(255, 255, 255, 0.03);
  border: 1.5px solid rgba(201, 169, 110, 0.25);
}
```

**React usage — Sidebar active menu items + avatar:**
```tsx
// Sidebar active item (pressed-in gold effect)
<div
  style={{
    ...styles.menuItem,
    ...(isActive ? { /* add neo-gold-pressed class */ } : {}),
  }}
  className={isActive ? 'neo-gold-pressed' : ''}
>

// Header avatar
<div className="neo-gold-seal" style={styles.avatar}>鹏</div>
```

---

### #6: Staggered Entrance + Scroll-Triggered Reveal Animations

**Why #6:** First-load impression matters enormously. Cards that animate in with staggered delays and subtle 3D transforms create a premium "orchestrated" feel. Bento-grid style content blocks appear to "assemble" on screen.

**Key technique:** CSS `@keyframes` with `animation-delay` staggering + Intersection Observer for scroll reveal.

```css
/* === Entrance Animations === */

/* Card rise-up reveal */
@keyframes cardReveal {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.96);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

.animate-card-reveal {
  animation: cardReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* Staggered delays */
.delay-1 { animation-delay: 0.05s; }
.delay-2 { animation-delay: 0.12s; }
.delay-3 { animation-delay: 0.19s; }
.delay-4 { animation-delay: 0.26s; }
.delay-5 { animation-delay: 0.33s; }
.delay-6 { animation-delay: 0.40s; }

/* Section title slide-in with gold glow */
@keyframes titleSlide {
  from {
    opacity: 0;
    transform: translateX(-16px);
    text-shadow: 0 0 40px rgba(201, 169, 110, 0);
  }
  to {
    opacity: 1;
    transform: translateX(0);
    text-shadow: 0 0 20px rgba(201, 169, 110, 0.15);
  }
}

.animate-title {
  animation: titleSlide 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* === Scroll-Triggered Reveal (via IntersectionObserver hook) === */
```

**React hook (`src/hooks/useScrollReveal.ts`):**
```tsx
import { useEffect, useRef, useState } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  initialClass?: string;
  revealedClass?: string;
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    once = true,
  } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}
```

**Usage:**
```tsx
// Each stat card gets staggered entrance
{statsCards.map((card, i) => (
  <div
    key={card.label}
    className={`glass-card tilt-card animate-card-reveal delay-${i + 1}`}
  >
    ...
  </div>
))}
```

---

### #7: Micro-Interaction Particles + Gold Dust Trail on Cursor

**Why #7:** The ultimate "premium tech-forward" touch. A subtle particle system that responds to cursor movement in the content area. Think of it as "金粉" (gold dust) that floats around interactive elements. Pure CSS can handle 80%; Canvas for advanced.

**Key CSS technique:** `@property`-animated floating dots + cursor-triggered sparkle.

```css
/* === Floating Ambient Particles (CSS-only) === */
.ambient-particle {
  position: fixed;
  pointer-events: none;
  z-index: 0;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-gold);
  opacity: 0;
  animation: floatUp 6s ease-in infinite;
}

@keyframes floatUp {
  0% {
    opacity: 0;
    transform: translateY(100vh) scale(0) rotate(0deg);
  }
  10% { opacity: 0.6; }
  90% { opacity: 0.3; }
  100% {
    opacity: 0;
    transform: translateY(-10vh) scale(1) rotate(360deg);
  }
}

/* Gold shimmer on button hover */
@keyframes goldShimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.btn-gold-shimmer {
  background: linear-gradient(
    110deg,
    rgba(201, 169, 110, 0.08) 0%,
    rgba(201, 169, 110, 0.08) 40%,
    rgba(201, 169, 110, 0.25) 50%,
    rgba(201, 169, 110, 0.08) 60%,
    rgba(201, 169, 110, 0.08) 100%
  );
  background-size: 200% 100%;
  transition: all 0.3s;
}

.btn-gold-shimmer:hover {
  animation: goldShimmer 1.5s ease-in-out infinite;
  border-color: rgba(201, 169, 110, 0.4);
}

/* Ripple effect on click */
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0.5;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

.ripple-effect {
  position: relative;
  overflow: hidden;
}

.ripple-effect .ripple {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201, 169, 110, 0.4), transparent);
  animation: ripple 0.7s ease-out;
  pointer-events: none;
}
```

**React ripple hook (`src/hooks/useRipple.ts`):**
```tsx
import { useCallback, useState, useRef } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const counter = useRef(0);

  const createRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const id = ++counter.current;
    setRipples(prev => [...prev, { id, x, y, size }]);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 700);
  }, []);

  return { ripples, createRipple };
}
```

**Usage on buttons:**
```tsx
function ActionButton({ action }: { action: QuickAction }) {
  const { ripples, createRipple } = useRipple();

  return (
    <button
      className="neo-gold-raised btn-gold-shimmer ripple-effect"
      onClick={createRipple}
      style={styles.actionBtn}
    >
      {ripples.map(r => (
        <span
          key={r.id}
          className="ripple"
          style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
        />
      ))}
      <span className={styles.actionIcon}>{action.icon}</span>
      <span>{action.label}</span>
    </button>
  );
}
```

---

## IMPLEMENTATION ROADMAP (Priority Order)

### Phase 1 — Immediate (1-2 days, high visual ROI)
1. **#1 Glassmorphism cards** — Replace all `.ruyi-card` with `.glass-card`
2. **#2 Animated gradient background** — Add to Layout wrapper
3. **#6 Entrance animations** — Add staggered delays to Dashboard cards

### Phase 2 — Core Polish (2-4 days)
4. **#3 3D Tilt cards** — Apply to stat cards + key metric tiles
5. **#4 Glowing borders** — Apply to banner + primary content blocks

### Phase 3 — Premium Detail (3-5 days)
6. **#5 Neumorphic accents** — Apply to sidebar items, buttons, avatar
7. **#7 Particle effects + ripple** — Add to interactive elements + ambient background

---

## CSS VARIABLE EXTENSIONS (add to theme.css)

```css
:root {
  /* === New additions for modern techniques === */

  /* Glass surface transparency levels */
  --glass-bg-strong: rgba(22, 33, 62, 0.75);
  --glass-bg-medium: rgba(22, 33, 62, 0.55);
  --glass-bg-light: rgba(22, 33, 62, 0.35);
  --glass-blur: 20px;
  --glass-blur-heavy: 28px;

  /* Glow colors */
  --glow-blue: rgba(59, 130, 246, 0.15);
  --glow-gold: rgba(201, 169, 110, 0.1);
  --glow-white: rgba(255, 255, 255, 0.05);

  /* Neumorphic shadows */
  --neo-shadow-dark: rgba(0, 0, 0, 0.35);
  --neo-shadow-light: rgba(59, 130, 246, 0.06);
  --neo-highlight: rgba(255, 255, 255, 0.03);

  /* Animation speeds */
  --anim-fast: 0.15s;
  --anim-normal: 0.25s;
  --anim-slow: 0.4s;
  --anim-glacial: 0.6s;
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Z-index layers */
  --z-particles: 0;
  --z-content: 1;
  --z-overlay: 10;
  --z-sidebar: 99;
  --z-header: 100;
  --z-modal: 1000;
}
```

---

## COLOR PALETTE REFERENCE (with Chinese aesthetic notes)

| Token | Hex | Usage | Chinese Context |
|---|---|---|---|
| `--color-primary` | `#1a1a2e` | Deepest bg | 墨色 (ink) |
| `--color-primary-light` | `#16213e` | Card surface | 青底 (cyan base) |
| `--color-primary-lighter` | `#0f3460` | Accent surface | 蓝染 (indigo dye) |
| `--color-gold` | `#c9a96e` | Primary accent | 鎏金 (gilded gold) |
| `--color-accent` | `#3b82f6` | Tech blue | 科技蓝 (tech blue) |
| `--color-text` | `#e2e8f0` | Primary text | 素白 (plain white) |
| `--color-text-muted` | `#64748b` | Muted text | 灰墨 (gray ink) |

---

## KEY DECISIONS SUMMARY

| Decision | Rationale |
|---|---|
| Glassmorphism BEFORE neumorphism | Glass works on cards/surfaces universally; neumorphism is best as accent detail |
| `@property` animations over JS animations | GPU-composited, 60fps guaranteed, less bundle weight |
| CSS-only particles over Canvas | No runtime cost, simpler, sufficient for ambient effect |
| `backdrop-filter` everywhere | Requires semi-transparent backgrounds; already usable on header |
| IntersectionObserver for scroll reveals | Native, performant, no library dependency |
| Custom hooks for tilt/ripple/reveal | Reusable, isolated, easy to test |
| Preserve existing CSS variable architecture | Add extensions, don't rewrite — minimal regression risk |

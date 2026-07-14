// Ruyi 国风科技蓝 — the original theme extracted to a definition
import type { ThemeDefinition } from '../../config/types';

export const ruyiTheme: ThemeDefinition = {
  id: 'ruyi',
  name: '如意国风科技蓝',
  label: '如意国风（默认）',
  mode: 'dark',

  cssVariables: {
    // ── Primary palette ──
    '--color-primary': '#0a0e1a',
    '--color-primary-light': '#0f1629',
    '--color-primary-lighter': '#162240',
    '--color-primary-dark': '#060912',

    // ── Gold accent ──
    '--color-gold': '#d4a853',
    '--color-gold-light': '#e8c97a',
    '--color-gold-dark': '#b8923a',
    '--color-gold-glow': 'rgba(212, 168, 83, 0.35)',

    // ── Tech blue ──
    '--color-accent': '#3b82f6',
    '--color-accent-cyan': '#06b6d4',
    '--color-accent-purple': '#8b5cf6',
    '--color-accent-glow': 'rgba(59, 130, 246, 0.45)',

    // ── Glass morphism ──
    '--glass-bg': 'rgba(255, 255, 255, 0.03)',
    '--glass-bg-hover': 'rgba(255, 255, 255, 0.06)',
    '--glass-border': 'rgba(255, 255, 255, 0.07)',
    '--glass-border-hover': 'rgba(255, 255, 255, 0.14)',
    '--glass-blur': '16px',
    '--glass-blur-heavy': '30px',

    // ── Text ──
    '--color-text': '#e8ecf2',
    '--color-text-secondary': '#8899b4',
    '--color-text-muted': '#556680',

    // ── Shadows ──
    '--shadow-sm': '0 1px 3px rgba(0,0,0,0.3)',
    '--shadow-md': '0 4px 16px rgba(0,0,0,0.4)',
    '--shadow-lg': '0 8px 40px rgba(0,0,0,0.5)',
    '--shadow-glow-gold': '0 0 20px var(--color-gold-glow)',
    '--shadow-glow-blue': '0 0 20px var(--color-accent-glow)',

    // ── Layout ──
    '--header-height': '60px',
    '--sidebar-width': '240px',
    '--radius-sm': '6px',
    '--radius-md': '10px',
    '--radius-lg': '16px',
    '--radius-xl': '24px',

    // ── Fonts ──
    '--font-family': "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Helvetica, Arial, sans-serif",
    '--font-mono': "'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace",
  },
};

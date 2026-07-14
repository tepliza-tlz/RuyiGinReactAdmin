// Clean light theme — switch via header dropdown
import type { ThemeDefinition } from '../../config/types';

export const lightTheme: ThemeDefinition = {
  id: 'light',
  name: '清雅白',
  label: '清雅白（浅色）',
  mode: 'light',

  cssVariables: {
    // ── Primary palette ──
    '--color-primary': '#f8f9fc',
    '--color-primary-light': '#ffffff',
    '--color-primary-lighter': '#eef1f6',
    '--color-primary-dark': '#e2e6ed',

    // ── Gold accent (kept but brighter) ──
    '--color-gold': '#b8860b',
    '--color-gold-light': '#d4a017',
    '--color-gold-dark': '#8b6508',
    '--color-gold-glow': 'rgba(184, 134, 11, 0.25)',

    // ── Tech blue (kept) ──
    '--color-accent': '#2563eb',
    '--color-accent-cyan': '#0891b2',
    '--color-accent-purple': '#7c3aed',
    '--color-accent-glow': 'rgba(37, 99, 235, 0.3)',

    // ── Glass morphism (subtle on light bg) ──
    '--glass-bg': 'rgba(0, 0, 0, 0.02)',
    '--glass-bg-hover': 'rgba(0, 0, 0, 0.04)',
    '--glass-border': 'rgba(0, 0, 0, 0.06)',
    '--glass-border-hover': 'rgba(0, 0, 0, 0.12)',
    '--glass-blur': '12px',
    '--glass-blur-heavy': '24px',

    // ── Text ──
    '--color-text': '#1a1c2e',
    '--color-text-secondary': '#4a5568',
    '--color-text-muted': '#8899aa',

    // ── Shadows (lighter) ──
    '--shadow-sm': '0 1px 3px rgba(0,0,0,0.08)',
    '--shadow-md': '0 4px 12px rgba(0,0,0,0.1)',
    '--shadow-lg': '0 8px 30px rgba(0,0,0,0.12)',
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

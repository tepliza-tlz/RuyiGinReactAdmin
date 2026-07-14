// ============================================================
// Theme System — multi-theme support with zero code changes
// ============================================================
// To add a new theme: create a ThemeDefinition, add it to
// admin.config.ts > theme.themes array. That's it.
// Switch themes at runtime with useTheme().setTheme('id').
// ============================================================

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
  type ReactNode,
} from 'react';
import type { ThemeDefinition, ThemeMode } from '../config/types';

// ── Theme Context ────────────────────────────────────
interface ThemeContextValue {
  theme: ThemeDefinition;
  themes: ThemeDefinition[];
  setTheme: (id: string) => void;
  mode: ThemeMode;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ── CSS variable applier ─────────────────────────────
function applyTheme(theme: ThemeDefinition): void {
  const root = document.documentElement;

  // Apply all CSS variables
  for (const [key, value] of Object.entries(theme.cssVariables)) {
    root.style.setProperty(key, value);
  }

  // Set data attribute for conditional CSS
  root.setAttribute('data-theme', theme.id);
  root.setAttribute('data-theme-mode', theme.mode);

  // Apply extra CSS if provided
  const styleId = 'theme-extra-css';
  let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
  if (theme.extraCSS) {
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = theme.extraCSS;
  } else if (styleEl) {
    styleEl.remove();
  }

  // Persist user preference
  try {
    localStorage.setItem('admin-theme', theme.id);
  } catch {
    // localStorage not available (SSR, incognito, etc.)
  }
}

// ── Provider ─────────────────────────────────────────
export function ThemeProvider({
  themes,
  defaultTheme,
  children,
}: {
  themes: ThemeDefinition[];
  defaultTheme: string;
  children: ReactNode;
}) {
  const [activeId, setActiveId] = useState<string>(() => {
    // 1. Saved preference
    try {
      const saved = localStorage.getItem('admin-theme');
      if (saved && themes.some((t) => t.id === saved)) return saved;
    } catch { /* ignore */ }
    // 2. Config default
    return defaultTheme;
  });

  const theme = themes.find((t) => t.id === activeId) ?? themes[0];

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback(
    (id: string) => {
      if (themes.some((t) => t.id === id)) {
        setActiveId(id);
      }
    },
    [themes],
  );

  return (
    <ThemeContext.Provider value={{ theme, themes, setTheme, mode: theme.mode }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme() must be used inside <ThemeProvider>');
  }
  return ctx;
}

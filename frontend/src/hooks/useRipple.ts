import { useCallback, useState, useRef } from 'react';

/**
 * Click Ripple Hook
 *
 * Creates a Material Design-style ripple effect on click. Ripples expand
 * from the click point and fade out. Gold-tinted for the Chinese aesthetic.
 *
 * CSS class required in your stylesheet:
 *   .ripple-container { position: relative; overflow: hidden; }
 *   .ripple { animation: rippleBurst 0.7s ease-out forwards; pointer-events: none; }
 *
 * @example
 *   const { ripples, createRipple } = useRipple();
 *   <button className="ripple-container" onClick={createRipple}>
 *     {ripples.map(r => <span key={r.id} className="ripple" style={{...}} />)}
 *     Click Me
 *   </button>
 */

export interface Ripple {
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
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const id = ++counter.current;

    setRipples((prev) => [...prev, { id, x, y, size }]);

    // Clean up after animation completes
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 700);
  }, []);

  return { ripples, createRipple };
}

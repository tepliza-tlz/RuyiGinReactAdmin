import { useRef, useEffect } from 'react';

/**
 * 3D Perspective Card Tilt Hook
 *
 * Creates a mouse-tracking 3D tilt effect (Apple Card / Linear style).
 * Attach the returned ref to a card container; the element tilts toward
 * the cursor and resets on mouse leave.
 *
 * @example
 *   const { ref } = useTilt<HTMLDivElement>({ maxTilt: 6, scale: 1.015 });
 *   <div className="tilt-card"><div ref={ref} className="tilt-card-inner">...</div></div>
 */

interface TiltOptions {
  /** Maximum tilt angle in degrees (default: 8) */
  maxTilt?: number;
  /** Scale factor on hover (default: 1.02) */
  scale?: number;
  /** Transition speed in ms when leaving (default: 400) */
  speed?: number;
  /** Enable the glow trail behind cursor (default: true) */
  glare?: boolean;
}

export function useTilt<T extends HTMLElement>(options: TiltOptions = {}) {
  const {
    maxTilt = 8,
    scale = 1.02,
    speed = 400,
    glare = true,
  } = options;

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

      // Map to tilt: center = 0°, edges = ±maxTilt
      const tiltX = (y - 0.5) * -maxTilt * 2;
      const tiltY = (x - 0.5) * maxTilt * 2;

      el.style.transform =
        `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${scale}, ${scale}, ${scale})`;

      // Update glow trail position (consumed by ::after pseudo-element)
      if (glare) {
        el.style.setProperty('--mouse-x', `${x * 100}%`);
        el.style.setProperty('--mouse-y', `${y * 100}%`);
      }
    };

    const handleMouseEnter = () => {
      isHovering.current = true;
      el.style.transition =
        `transform ${speed * 0.3}ms ease-out, box-shadow ${speed}ms ease-out`;
    };

    const handleMouseLeave = () => {
      isHovering.current = false;
      el.style.transition =
        `transform ${speed}ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow ${speed}ms ease-out`;
      el.style.transform =
        'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';

      if (glare) {
        el.style.setProperty('--mouse-x', '50%');
        el.style.setProperty('--mouse-y', '50%');
      }
    };

    el.addEventListener('mousemove', handleMouseMove, { passive: true });
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [maxTilt, scale, speed, glare]);

  return { ref };
}

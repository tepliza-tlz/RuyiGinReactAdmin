import { useEffect, useRef, useState } from 'react';

/**
 * Scroll-Triggered Reveal Hook
 *
 * Uses IntersectionObserver to detect when an element enters the viewport,
 * then toggles a CSS class for reveal animations. Supports one-shot or
 * repeatable reveals.
 *
 * CSS classes expected in your stylesheet:
 *   .scroll-reveal     — hidden state (opacity: 0, translateY, blur)
 *   .scroll-revealed   — visible state (opacity: 1, translateY: 0, blur: 0)
 *
 * @example
 *   const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
 *   <div ref={ref} className={`scroll-reveal ${isVisible ? 'scroll-revealed' : ''}`}>
 *     Content that slides in on scroll
 *   </div>
 */

interface ScrollRevealOptions {
  /** Intersection ratio to trigger reveal (0-1, default: 0.1) */
  threshold?: number;
  /** IntersectionObserver rootMargin (default: '0px 0px -50px 0px') */
  rootMargin?: string;
  /** If true, only reveal once. If false, toggle on enter/exit (default: true) */
  once?: boolean;
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {},
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
      { threshold, rootMargin },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}

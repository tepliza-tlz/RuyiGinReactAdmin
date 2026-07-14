import React, { useEffect, useRef } from 'react';

/**
 * Ambient Particles Component
 *
 * Renders a set of floating, animated CSS-only particles that drift upward
 * across the viewport. Adds subtle "gold dust" / "金粉" atmosphere.
 *
 * Each particle is a <span> with randomized position, animation duration,
 * and delay. Uses the .ambient-particle class from modern-enhancements.css.
 *
 * @example
 *   <AmbientParticles count={15} />
 */

interface AmbientParticlesProps {
  /** Number of particles to render (default: 12) */
  count?: number;
  /** Fraction of particles that are blue accent instead of gold (default: 0.3) */
  blueRatio?: number;
}

interface ParticleConfig {
  id: number;
  left: string;
  delay: string;
  duration: string;
  isBlue: boolean;
}

function generateParticles(count: number, blueRatio: number): ParticleConfig[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 7}s`,
    duration: `${6 + Math.random() * 8}s`, // 6–14s
    isBlue: Math.random() < blueRatio,
  }));
}

// Store configs in module scope so they don't regenerate on every render
let cachedConfigs: ParticleConfig[] | null = null;

const AmbientParticles: React.FC<AmbientParticlesProps> = ({
  count = 12,
  blueRatio = 0.3,
}) => {
  const configsRef = useRef<ParticleConfig[]>(
    cachedConfigs ?? generateParticles(count, blueRatio)
  );

  useEffect(() => {
    if (!cachedConfigs) {
      cachedConfigs = configsRef.current;
    }
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {configsRef.current.map((p) => (
        <span
          key={p.id}
          className={`ambient-particle${p.isBlue ? ' blue' : ''}`}
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
};

export default AmbientParticles;

import React, { useEffect, useRef } from 'react';

/**
 * 科技感粒子背景 — Canvas 实现网格 + 飘浮粒子
 */
const ParticleBackground: React.FC<{ count?: number }> = ({ count = 80 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    interface Particle {
      x: number; y: number; vx: number; vy: number;
      size: number; alpha: number; alphaDir: number;
    }

    // 初始化粒子
    const init = () => {
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.1,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        alphaDir: Math.random() > 0.5 ? 0.003 : -0.003,
      }));
    };
    init();

    // 连线
    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const a = (1 - dist / 120) * 0.08;
            ctx.strokeStyle = `rgba(59, 130, 246, ${a})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawLines();
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        // 边界回弹
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        // 透明度呼吸
        p.alpha += p.alphaDir;
        if (p.alpha > 0.5 || p.alpha < 0.05) p.alphaDir *= -1;

        // 金色粒子
        const isGold = Math.random() < 0.15;
        const color = isGold
          ? `rgba(212, 168, 83, ${p.alpha})`
          : `rgba(59, 130, 246, ${p.alpha})`;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // 发光粒子放大光晕
        if (p.size > 1.5) {
          ctx.fillStyle = isGold
            ? `rgba(212, 168, 83, ${p.alpha * 0.4})`
            : `rgba(59, 130, 246, ${p.alpha * 0.4})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default React.memo(ParticleBackground);

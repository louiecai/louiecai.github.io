import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  radius: number;
  color: string;
}

interface Ripple {
  x: number;
  y: number;
  r: number;
  alpha: number;
}

const REPEL_RADIUS = 140;
const CONNECTION_DIST = 110;
const BASE_SPEED = 0.35;

function createParticle(w: number, h: number): Particle {
  const angle = Math.random() * Math.PI * 2;
  const speed = BASE_SPEED * (0.5 + Math.random() * 0.5);
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx,
    vy,
    baseVx: vx,
    baseVy: vy,
    radius: 1.5 + Math.random() * 1.5,
    color: Math.random() < 0.7 ? '#00e5ff' : '#b388ff',
  };
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    const ripples: Ripple[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const count = Math.min(
        Math.floor((canvas.width * canvas.height) / 10000),
        130
      );
      particles = Array.from({ length: count }, () =>
        createParticle(canvas.width, canvas.height)
      );
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onMouseLeave = () => {
      mouseRef.current = { x: null, y: null };
    };

    const onClick = (e: MouseEvent) => {
      const cx = e.offsetX;
      const cy = e.offsetY;
      ripples.push({ x: cx, y: cy, r: 0, alpha: 0.6 });

      // Give nearby particles a velocity kick away from click point
      for (const p of particles) {
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL_RADIUS && dist > 0) {
          const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
          p.vx += (dx / dist) * force * 3;
          p.vy += (dy / dist) * force * 3;
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of particles) {
        if (mx !== null && my !== null) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < REPEL_RADIUS && dist > 0) {
            const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
            p.vx = p.baseVx + (dx / dist) * force * 2.5;
            p.vy = p.baseVy + (dy / dist) * force * 2.5;
          } else {
            p.vx += (p.baseVx - p.vx) * 0.04;
            p.vy += (p.baseVy - p.vy) * 0.04;
          }
        } else {
          p.vx += (p.baseVx - p.vx) * 0.04;
          p.vy += (p.baseVy - p.vy) * 0.04;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.25;
            const lineColor =
              particles[i].color === particles[j].color
                ? particles[i].color
                : '#00e5ff';
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle =
              lineColor === '#00e5ff'
                ? `rgba(0,229,255,${alpha})`
                : `rgba(179,136,255,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Cursor constellation — brighter lines from cursor to nearby particles
      if (mx !== null && my !== null) {
        for (const p of particles) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.5;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,229,255,${alpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(mx, my);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
        }
      }

      // Draw particle dots
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        const isViolet = p.color === '#b388ff';
        ctx.fillStyle = isViolet
          ? 'rgba(179,136,255,0.55)'
          : 'rgba(0,229,255,0.55)';
        ctx.fill();
      }

      // Draw and update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.r += 3;
        rip.alpha -= 0.018;
        if (rip.alpha <= 0) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,229,255,${rip.alpha.toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animRef.current);
      } else {
        animRef.current = requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('click', onClick);
    document.addEventListener('visibilitychange', onVisibilityChange);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('click', onClick);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at 25% 50%, rgba(0,229,255,0.07) 0%, transparent 55%), ' +
            'radial-gradient(ellipse at 75% 30%, rgba(179,136,255,0.07) 0%, transparent 55%)',
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-10 w-full h-full"
      aria-hidden="true"
    />
  );
}

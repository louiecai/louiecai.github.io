import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { getTilt } from '../lib/deviceTilt';

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
  speed: number;
}

interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
}

const REPEL_RADIUS = 140;
const CONNECTION_DIST = 110;
const BASE_SPEED = 0.35;
const PARALLAX = 16; // px of drift from device tilt / mouse

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
  const pointerRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    const ripples: Ripple[] = [];
    const trail: TrailPoint[] = [];

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

    const onPointerMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };
      // Build a fading trail behind the finger / cursor
      const last = trail[trail.length - 1];
      if (!last || Math.hypot(e.clientX - last.x, e.clientY - last.y) > 4) {
        trail.push({ x: e.clientX, y: e.clientY, alpha: 1 });
        if (trail.length > 22) trail.shift();
      }
    };

    const onPointerLeave = () => {
      pointerRef.current = { x: null, y: null };
    };

    // Tap / click shockwave — works for both touch and mouse via Pointer Events
    const onPointerDown = (e: PointerEvent) => {
      const cx = e.clientX;
      const cy = e.clientY;
      pointerRef.current = { x: cx, y: cy };
      ripples.push({ x: cx, y: cy, r: 0, alpha: 0.7, speed: 5 });
      ripples.push({ x: cx, y: cy, r: 0, alpha: 0.4, speed: 8 });

      // Kick nearby particles outward from the tap point
      for (const p of particles) {
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL_RADIUS && dist > 0) {
          const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
          p.vx += (dx / dist) * force * 4.5;
          p.vy += (dy / dist) * force * 4.5;
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gyro / mouse parallax drift of the whole field
      const tilt = getTilt();
      ctx.save();
      ctx.translate(tilt.x * PARALLAX, tilt.y * PARALLAX);

      const mx = pointerRef.current.x;
      const my = pointerRef.current.y;

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

      // Pointer constellation — brighter lines from finger/cursor to nearby particles
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

      // Glowing pointer trail (finger drag on mobile, cursor on desktop)
      for (let i = trail.length - 1; i >= 0; i--) {
        const t = trail[i];
        t.alpha -= 0.05;
        if (t.alpha <= 0) {
          trail.splice(i, 1);
          continue;
        }
        if (i > 0) {
          const prev = trail[i - 1];
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(t.x, t.y);
          ctx.strokeStyle = `rgba(0,229,255,${(t.alpha * 0.5).toFixed(3)})`;
          ctx.lineWidth = t.alpha * 3;
          ctx.lineCap = 'round';
          ctx.stroke();
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

      // Draw and update ripples (tap / click shockwaves)
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.r += rip.speed;
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

      ctx.restore();
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
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div
        className="fixed inset-0 -z-10"
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
      className="fixed inset-0 -z-10 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}

import { useRef, useEffect } from 'react';
import { useScroll, useTransform, useSpring, motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const SECTION_IDS = ['about', 'experience', 'projects', 'skills', 'activities', 'education'];

// Star Y target for each section, evenly distributed across the viewport
const Y_STOPS = SECTION_IDS.map((_, i) => 8 + (i / (SECTION_IDS.length - 1)) * 80);
// → [8, 24, 40, 56, 72, 88] vh

// 24-point sine wave for X: 2 full cycles, ±80px from center
const T_STEPS = Array.from({ length: 25 }, (_, i) => i / 24);
const X_WAVE = T_STEPS.map(t => Math.sin(t * Math.PI * 4) * 80);

export function ScrollCompanion() {
  const reduced = usePrefersReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();

  // Ref so the transform callback always reads the latest measured values
  const topsRef = useRef<number[]>([]);

  useEffect(() => {
    const measure = () => {
      topsRef.current = SECTION_IDS.map(id => document.getElementById(id)?.offsetTop ?? 0);
    };
    measure();
    // Re-measure after images/fonts may have shifted layout
    const t = setTimeout(measure, 400);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(t); window.removeEventListener('resize', measure); };
  }, []);

  // Y: arrive at each section's Y_STOP when its heading enters view,
  // pause for 20vh of scroll, then glide to the next section.
  const rawY = useTransform(scrollY, (sy) => {
    const tops = topsRef.current;
    if (tops.length === 0) {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      return `${8 + (sy / max) * 80}vh`;
    }
    const n = tops.length;
    const hold = window.innerHeight * 0.2; // 20vh pause after each section enters

    for (let i = 0; i < n - 1; i++) {
      if (sy <= tops[i + 1]) {
        const holdEnd = tops[i] + hold;
        if (sy <= holdEnd) return `${Y_STOPS[i]}vh`;
        const t = Math.min(1, (sy - holdEnd) / Math.max(1, tops[i + 1] - holdEnd));
        return `${Y_STOPS[i] + t * (Y_STOPS[i + 1] - Y_STOPS[i])}vh`;
      }
    }
    return `${Y_STOPS[n - 1]}vh`;
  });

  // X: smooth sine-wave S-curve across the center
  const rawX = useTransform(scrollYProgress, T_STEPS, X_WAVE);

  // Slow continuous spin
  const rawRotate = useTransform(scrollYProgress, [0, 1], [0, 720]);

  const y = useSpring(rawY, { stiffness: 50, damping: 18 });
  const x = useSpring(rawX, { stiffness: 50, damping: 18 });
  const rotate = useSpring(rawRotate, { stiffness: 30, damping: 20 });

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-1/2 z-30 pointer-events-none"
      style={{ x, y, rotate, marginLeft: '-9px' }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter:
            'drop-shadow(0 0 5px rgba(0,229,255,0.95)) drop-shadow(0 0 12px rgba(179,136,255,0.6))',
        }}
      >
        <path
          d="M9 0 L10.2 7.8 L18 9 L10.2 10.2 L9 18 L7.8 10.2 L0 9 L7.8 7.8 Z"
          fill="url(#starGrad)"
        />
        <defs>
          <radialGradient id="starGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#00e5ff" />
            <stop offset="100%" stopColor="#b388ff" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

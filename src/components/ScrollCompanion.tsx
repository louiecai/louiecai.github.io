import { useScroll, useTransform, useSpring, motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export function ScrollCompanion() {
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();

  // Vertical position: top 4vh → bottom 92vh as page scrolls 0→100%
  const rawY = useTransform(scrollYProgress, [0, 1], ['4vh', '92vh']);
  // Horizontal S-curve sway in the right gutter (px)
  const rawX = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [12, 44, 8, 44, 12]
  );
  // Subtle rotation to "bank" into the sway direction
  const rawRotate = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [-18, 18, -18, 18, -18]
  );

  // Spring smoothing: lag + settle
  const y = useSpring(rawY, { stiffness: 60, damping: 18 });
  const x = useSpring(rawX, { stiffness: 60, damping: 18 });
  const rotate = useSpring(rawRotate, { stiffness: 80, damping: 22 });

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed right-4 top-0 z-40 pointer-events-none"
      style={{ y, x, rotate }}
    >
      {/* Tail — blurred gradient streak behind the head */}
      <div
        style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '2px',
          height: '24px',
          background: 'linear-gradient(to bottom, transparent, rgba(0,229,255,0.4), rgba(179,136,255,0.6))',
          filter: 'blur(1px)',
        }}
      />
      {/* Head — glowing dot */}
      <div
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #ffffff 0%, #00e5ff 50%, #b388ff 100%)',
          boxShadow:
            '0 0 6px 2px rgba(0,229,255,0.8), 0 0 16px 6px rgba(179,136,255,0.4)',
        }}
      />
    </motion.div>
  );
}

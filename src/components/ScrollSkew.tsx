import { useScroll, useVelocity, useTransform, useSpring, motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface ScrollSkewProps {
  children: React.ReactNode;
}

export function ScrollSkew({ children }: ScrollSkewProps) {
  const reduced = usePrefersReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);

  // Map velocity (px/s) to a tiny skew angle, capped at ±1.5°
  const rawSkew = useTransform(velocity, [-1500, 0, 1500], [1.5, 0, -1.5]);
  const skewY = useSpring(rawSkew, { stiffness: 400, damping: 40 });

  if (reduced) {
    return <>{children}</>;
  }

  return (
    <motion.div style={{ skewY }}>
      {children}
    </motion.div>
  );
}

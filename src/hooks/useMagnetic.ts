// src/hooks/useMagnetic.ts
import { useRef, useCallback } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const SPRING = { stiffness: 300, damping: 25, mass: 0.5 };

export function useMagnetic(strength = 0.4) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const coarse =
    typeof window !== 'undefined'
      ? window.matchMedia('(pointer: coarse)').matches
      : false;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (reduced || coarse || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      // Cap at 12px
      rawX.set(Math.max(-12, Math.min(12, dx)));
      rawY.set(Math.max(-12, Math.min(12, dy)));
    },
    [reduced, coarse, rawX, rawY, strength]
  );

  const onMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return { ref, x, y, onMouseMove, onMouseLeave };
}

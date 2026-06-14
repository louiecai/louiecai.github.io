// src/hooks/useTilt.ts
import { useRef, useCallback } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export interface TiltHandlers {
  ref: React.RefObject<HTMLDivElement | null>;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
}

export function useTilt(maxAngle = 6): TiltHandlers {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const coarse =
    typeof window !== 'undefined'
      ? window.matchMedia('(pointer: coarse)').matches
      : false;

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduced || coarse || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;   // 0..1
      const py = (e.clientY - rect.top) / rect.height;   // 0..1
      const rotateY = (px - 0.5) * maxAngle * 2;
      const rotateX = -(py - 0.5) * maxAngle * 2;
      ref.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      ref.current.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      ref.current.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      ref.current.style.setProperty('--glow-opacity', '1');
    },
    [reduced, coarse, maxAngle]
  );

  const onMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = '';
    ref.current.style.setProperty('--glow-opacity', '0');
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}

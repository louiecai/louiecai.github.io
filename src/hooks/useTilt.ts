// src/hooks/useTilt.ts
import { useRef, useCallback, useEffect } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';
import { subscribeTilt } from '../lib/deviceTilt';

export interface TiltHandlers {
  ref: React.RefObject<HTMLDivElement | null>;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
}

export function useTilt(maxAngle = 9): TiltHandlers {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const coarse =
    typeof window !== 'undefined'
      ? window.matchMedia('(pointer: coarse)').matches
      : false;

  // Mobile / touch: drive the tilt + glass specular from the device gyroscope.
  // Every card reacts together as the phone is tilted; the highlight scales with
  // tilt magnitude so a flat phone shows almost nothing.
  useEffect(() => {
    if (reduced || !coarse) return;
    return subscribeTilt((x, y) => {
      const el = ref.current;
      if (!el) return;
      const mag = Math.min(1, Math.hypot(x, y));
      el.style.transform = `perspective(700px) rotateX(${(-y * maxAngle).toFixed(2)}deg) rotateY(${(x * maxAngle).toFixed(2)}deg) scale(${(1 + 0.02 * mag).toFixed(3)})`;
      el.style.setProperty('--mx', `${(50 + x * 50).toFixed(1)}%`);
      el.style.setProperty('--my', `${(50 + y * 50).toFixed(1)}%`);
      el.style.setProperty('--glow-opacity', (0.85 * mag).toFixed(2));
    });
  }, [reduced, coarse, maxAngle]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduced || coarse || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;   // 0..1
      const py = (e.clientY - rect.top) / rect.height;   // 0..1
      const rotateY = (px - 0.5) * maxAngle * 2;
      const rotateX = -(py - 0.5) * maxAngle * 2;
      ref.current.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
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

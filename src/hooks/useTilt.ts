// src/hooks/useTilt.ts
import { useRef, useCallback } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export interface TiltHandlers {
  ref: React.RefObject<HTMLDivElement | null>;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerLeave: () => void;
  onPointerCancel: () => void;
  onPointerUp: () => void;
}

export function useTilt(maxAngle = 9): TiltHandlers {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  // Drive tilt from pointer position relative to each card — works for both
  // mouse (desktop) and touch (mobile) via Pointer Events. Each card tracks
  // only its own pointer, so touching one card never affects another.
  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reduced || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;   // 0..1
      const py = (e.clientY - rect.top) / rect.height;   // 0..1
      // Scale the angle down for larger panels so the perceived edge motion is
      // consistent: a wide/tall card at the same angle displaces its edges much
      // further in pixels than a small one. REF = size at which full angle applies.
      const REF = 360;
      const wFactor = Math.min(1, REF / rect.width);
      const hFactor = Math.min(1, REF / rect.height);
      const rotateY = (px - 0.5) * maxAngle * 2 * wFactor;
      const rotateX = -(py - 0.5) * maxAngle * 2 * hFactor;
      ref.current.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      ref.current.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      ref.current.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      ref.current.style.setProperty('--glow-opacity', '1');
    },
    [reduced, maxAngle]
  );

  const reset = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = '';
    ref.current.style.setProperty('--glow-opacity', '0');
  }, []);

  return { ref, onPointerMove, onPointerLeave: reset, onPointerCancel: reset, onPointerUp: reset };
}

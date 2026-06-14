import { useEffect, useRef } from 'react';
import { subscribeTilt } from '../lib/deviceTilt';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Translates an element based on the shared tilt signal (mouse on desktop,
 * gyroscope on mobile). `depth` is the max travel in px; `invert` moves it
 * opposite to the tilt for a counter-parallax (foreground) feel.
 */
export function useTiltParallax<T extends HTMLElement>(depth = 20, invert = false) {
  const ref = useRef<T>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const sign = invert ? -1 : 1;
    return subscribeTilt((x, y) => {
      const el = ref.current;
      if (!el) return;
      el.style.transform = `translate3d(${(x * depth * sign).toFixed(2)}px, ${(y * depth * sign).toFixed(2)}px, 0)`;
    });
  }, [depth, invert, reduced]);

  return ref;
}

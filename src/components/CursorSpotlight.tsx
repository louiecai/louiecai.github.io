import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export function CursorSpotlight() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const coarse =
    typeof window !== 'undefined'
      ? window.matchMedia('(pointer: coarse)').matches
      : false;

  useEffect(() => {
    if (reduced || coarse || !ref.current) return;
    const el = ref.current;

    const onMove = (e: MouseEvent) => {
      el.style.setProperty('--cx', `${e.clientX}px`);
      el.style.setProperty('--cy', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reduced, coarse]);

  if (reduced || coarse) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: -5,
        background:
          'radial-gradient(circle 380px at var(--cx, 50%) var(--cy, 50%), rgba(0,229,255,0.055), transparent 70%)',
      }}
    />
  );
}

import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const DURATION = 1200; // ms

/** Parse "2.8M+ downloads" → { num: 2.8, suffix: 'M+ downloads', decimals: 1 } */
function parse(value: string): { num: number; suffix: string; decimals: number } | null {
  const m = value.match(/^(\d+(?:\.\d+)?)(.*)/);
  if (!m) return null;
  const raw = m[1];
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
  return { num: parseFloat(raw), suffix: m[2], decimals };
}

interface CountUpProps {
  value: string;
}

export function CountUp({ value }: CountUpProps) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [displayed, setDisplayed] = useState(value);
  const rafRef = useRef<number>(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    const parsed = parse(value);
    if (!parsed || reduced || !inView || hasStarted.current) return;
    hasStarted.current = true;
    const { num, suffix, decimals } = parsed;
    const startTime = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / DURATION, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const current = (eased * num).toFixed(decimals);
      setDisplayed(`${current}${suffix}`);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayed(value);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView, value, reduced]);

  return <span ref={ref}>{displayed}</span>;
}

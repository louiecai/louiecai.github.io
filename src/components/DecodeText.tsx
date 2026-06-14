import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';
const DURATION = 600; // ms

interface DecodeTextProps {
  text: string;
  /** If provided, controls when the scramble runs. If omitted, self-triggers on scroll into view. */
  start?: boolean;
  className?: string;
}

export function DecodeText({ text, start, className = 'font-mono' }: DecodeTextProps) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const selfInView = useInView(ref, { once: true, margin: '-60px' });
  const active = start ?? selfInView;

  const [displayed, setDisplayed] = useState(text);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    // Reset when text changes
    setDisplayed(text);
    hasStarted.current = false;
  }, [text]);

  useEffect(() => {
    if (!active || reduced || hasStarted.current) return;
    hasStarted.current = true;
    startTimeRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / DURATION, 1);
      const resolved = Math.floor(progress * text.length);

      setDisplayed(
        text
          .split('')
          .map((char, i) => {
            if (i < resolved) return char;
            if (char === ' ') return ' ';
            return CHARSET[Math.floor(Math.random() * CHARSET.length)];
          })
          .join('')
      );

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayed(text);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, text, reduced]);

  return <span ref={ref} className={className}>{displayed}</span>;
}

import { useState, useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';
const DURATION = 600; // ms

interface DecodeTextProps {
  text: string;
  start: boolean;
}

export function DecodeText({ text, start }: DecodeTextProps) {
  const reduced = usePrefersReducedMotion();
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
    if (!start || reduced || hasStarted.current) return;
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
  }, [start, text, reduced]);

  return <span className="font-mono">{displayed}</span>;
}

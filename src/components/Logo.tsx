import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface LogoProps {
  size?: number;
  className?: string;
}

// Abstract LC monogram: geometric paths with a diagonal cyan→violet gradient.
// L = vertical bar + foot. C = top bar + left bar + bottom bar (open right).
// On hover the two glyphs spread apart, mirroring a code bracket expansion.
export function Logo({ size = 36, className = '' }: LogoProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.svg
      width={size}
      height={(size * 36) / 52}
      viewBox="0 0 52 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={reduced ? undefined : 'hover'}
      initial="rest"
    >
      <defs>
        <linearGradient
          id="logo-grad"
          x1="0" y1="0" x2="52" y2="36"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="rgb(var(--c-cyan))"   />
          <stop offset="100%" stopColor="rgb(var(--c-violet))" />
        </linearGradient>
      </defs>

      {/* L glyph — shifts left on hover */}
      <motion.g
        fill="url(#logo-grad)"
        variants={{ rest: { x: 0 }, hover: { x: -2.5 } }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        {/* vertical bar */}
        <rect x="2" y="2"  width="5" height="32" rx="2.5" />
        {/* foot */}
        <rect x="2" y="29" width="19" height="5"  rx="2.5" />
      </motion.g>

      {/* C glyph — shifts right on hover */}
      <motion.g
        fill="url(#logo-grad)"
        variants={{ rest: { x: 0 }, hover: { x: 2.5 } }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        {/* top bar */}
        <rect x="26" y="2"  width="24" height="5" rx="2.5" />
        {/* left bar */}
        <rect x="26" y="2"  width="5"  height="32" rx="2.5" />
        {/* bottom bar */}
        <rect x="26" y="29" width="24" height="5" rx="2.5" />
      </motion.g>
    </motion.svg>
  );
}

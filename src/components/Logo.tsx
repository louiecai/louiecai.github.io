import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 36, className = '' }: LogoProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 72 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={reduced ? undefined : 'hover'}
      initial="rest"
    >
      {/* Left bracket < */}
      <motion.text
        x="7"
        y="27"
        fontFamily="'JetBrains Mono', 'Fira Code', monospace"
        fontSize="24"
        fontWeight="700"
        fill="rgb(var(--c-cyan))"
        variants={{
          rest: { x: 0 },
          hover: { x: -3 },
        }}
        transition={{ duration: 0.2 }}
      >
        {'<'}
      </motion.text>

      {/* Initials LC */}
      <text
        x="23"
        y="27"
        fontFamily="'JetBrains Mono', 'Fira Code', monospace"
        fontSize="22"
        fontWeight="700"
        fill="rgb(var(--c-cyan))"
      >
        LC
      </text>

      {/* Right bracket > */}
      <motion.text
        x="51"
        y="27"
        fontFamily="'JetBrains Mono', 'Fira Code', monospace"
        fontSize="24"
        fontWeight="700"
        fill="rgb(var(--c-cyan))"
        variants={{
          rest: { x: 0 },
          hover: { x: 3 },
        }}
        transition={{ duration: 0.2 }}
      >
        {'>'}
      </motion.text>
    </motion.svg>
  );
}

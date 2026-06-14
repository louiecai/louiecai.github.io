// src/components/TiltCard.tsx
import { useTilt } from '../hooks/useTilt';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export function TiltCard({ children, className = '' }: TiltCardProps) {
  const { ref, onMouseMove, onMouseLeave } = useTilt();

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`relative ${className}`}
      style={{
        transition: 'transform 0.1s ease, box-shadow 0.3s ease',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        boxShadow: '0 24px 48px rgb(var(--c-cyan) / calc(var(--glow-opacity, 0) * 0.20))',
        // CSS vars for the spotlight glow + holographic sheen
        ['--mx' as string]: '50%',
        ['--my' as string]: '50%',
        ['--glow-opacity' as string]: '0',
        ['--holo-opacity' as string]: '0',
      }}
    >
      {children}
      {/* Spotlight glow overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          opacity: 'var(--glow-opacity)',
          transition: 'opacity 0.3s ease',
          background:
            'radial-gradient(circle at var(--mx) var(--my), rgb(var(--c-cyan) / 0.14), transparent 60%)',
        }}
      />
      {/* Holographic foil sheen — shifts with cursor / device tilt */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          opacity: 'var(--holo-opacity)',
          transition: 'opacity 0.3s ease',
          mixBlendMode: 'color-dodge',
          backgroundSize: '200% 200%',
          backgroundPosition: 'var(--mx) var(--my)',
          background:
            'linear-gradient(115deg, transparent 18%, rgb(var(--c-cyan) / 0.22) 38%, rgb(var(--c-violet) / 0.22) 50%, rgba(255,255,255,0.18) 62%, transparent 82%)',
        }}
      />
    </div>
  );
}

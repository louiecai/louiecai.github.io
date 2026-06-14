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
        transition: 'transform 0.1s ease',
        willChange: 'transform',
        // CSS vars for the spotlight glow
        ['--mx' as string]: '50%',
        ['--my' as string]: '50%',
        ['--glow-opacity' as string]: '0',
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
            'radial-gradient(circle at var(--mx) var(--my), rgba(0,229,255,0.12), transparent 60%)',
        }}
      />
    </div>
  );
}

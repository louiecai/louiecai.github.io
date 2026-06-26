// src/components/TiltCard.tsx
import { useTilt } from '../hooks/useTilt';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Liquid-glass card: translucent, backdrop-blurred surface with a glass rim
 * highlight and a specular sheen that tracks the cursor (or device tilt). The
 * `glass` utility class supplies the blur/translucency; this component layers
 * the cursor-reactive highlights on top.
 */
export function TiltCard({ children, className = '' }: TiltCardProps) {
  const { ref, onPointerMove, onPointerLeave, onPointerCancel, onPointerUp } = useTilt();

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerCancel={onPointerCancel}
      onPointerUp={onPointerUp}
      className={`glass relative overflow-hidden ${className}`}
      style={{
        transition: 'transform 0.12s ease, box-shadow 0.3s ease',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        boxShadow:
          'inset 0 1px 0 0 rgb(255 255 255 / 0.10), 0 24px 48px rgb(var(--c-cyan) / calc(var(--glow-opacity, 0) * 0.16))',
        ['--mx' as string]: '50%',
        ['--my' as string]: '50%',
        ['--glow-opacity' as string]: '0',
      }}
    >
      {children}
      {/* Specular highlight — a soft light reflection that follows the cursor */}
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
            'radial-gradient(220px circle at var(--mx) var(--my), rgb(var(--c-cyan) / 0.16), rgba(255,255,255,0.06) 28%, transparent 60%)',
        }}
      />
    </div>
  );
}

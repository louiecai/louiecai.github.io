// src/components/AuroraBackground.tsx
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export function AuroraBackground() {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-20 overflow-hidden pointer-events-none"
    >
      {/* Blob 1 — cyan, top-left region */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,229,255,0.10) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: reduced ? 'none' : 'aurora-1 22s ease-in-out infinite alternate',
        }}
      />
      {/* Blob 2 — violet, bottom-right region */}
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: '55vw',
          height: '55vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(179,136,255,0.08) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: reduced ? 'none' : 'aurora-2 28s ease-in-out infinite alternate',
        }}
      />
      {/* Blob 3 — mixed, center */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '30%',
          width: '40vw',
          height: '40vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,229,255,0.05) 0%, rgba(179,136,255,0.04) 50%, transparent 70%)',
          filter: 'blur(60px)',
          animation: reduced ? 'none' : 'aurora-1 35s ease-in-out infinite alternate-reverse',
        }}
      />
    </div>
  );
}

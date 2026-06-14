// src/components/ScrollRail.tsx
import { useScroll, useTransform, motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useActiveSection } from '../hooks/useActiveSection';
import { SECTION_IDS, SECTION_LABELS } from '../lib/sections';

const SECTIONS = [...SECTION_IDS];

export function ScrollRail() {
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();
  const activeSection = useActiveSection(SECTIONS);

  // scaleY from 0 to 1 as page scrolls
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      aria-hidden="true"
      className="hidden md:flex fixed left-5 top-1/2 -translate-y-1/2 h-[60vh] z-40 pointer-events-none"
      style={{ flexDirection: 'column', alignItems: 'center', gap: 0 }}
    >
      {/* Track */}
      <div className="relative w-px h-full bg-border/50 overflow-visible">
        {/* Fill bar */}
        <motion.div
          className="absolute top-0 left-0 w-full origin-top"
          style={{
            scaleY: reduced ? 1 : scaleY,
            height: '100%',
            background: 'linear-gradient(to bottom, rgb(var(--c-cyan)), rgb(var(--c-violet)))',
          }}
        />

        {/* Section dots */}
        {SECTIONS.map((id, i) => {
          const isActive = activeSection === id;
          const pct = (i / (SECTIONS.length - 1)) * 100;
          return (
            <button
              key={id}
              aria-label={`Scroll to ${SECTION_LABELS[id]}`}
              onClick={() => scrollTo(id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group"
              style={{ top: `${pct}%`, left: '50%', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
            >
              <div
                style={{
                  width: isActive ? '8px' : '5px',
                  height: isActive ? '8px' : '5px',
                  borderRadius: '50%',
                  background: isActive ? 'rgb(var(--c-cyan))' : 'rgb(var(--c-muted))',
                  boxShadow: isActive ? '0 0 6px 2px rgb(var(--c-cyan) / 0.6)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

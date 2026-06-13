import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export function Section({ id, title, children }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id={id} ref={ref} className="py-20 max-w-5xl mx-auto px-4">
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
        animate={prefersReducedMotion ? {} : (inView ? { opacity: 1, y: 0 } : {})}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold mb-10 pl-4 border-l-2 border-cyan text-white">
          {title}
        </h2>
        {children}
      </motion.div>
    </section>
  );
}

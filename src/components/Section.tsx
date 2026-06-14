import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { staggerContainer, fadeUpItem } from '../lib/variants';
import { DecodeText } from './DecodeText';

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
      {/* Divider: draws in from the left when section enters view */}
      <motion.div
        className="w-full h-px mb-12 origin-left"
        style={{
          background: 'linear-gradient(to right, #00e5ff, rgba(179,136,255,0.4), transparent)',
        }}
        initial={{ scaleX: 0 }}
        animate={prefersReducedMotion ? { scaleX: 1 } : (inView ? { scaleX: 1 } : { scaleX: 0 })}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      <motion.div
        variants={prefersReducedMotion ? undefined : staggerContainer}
        initial={prefersReducedMotion ? false : 'hidden'}
        animate={prefersReducedMotion ? {} : (inView ? 'show' : 'hidden')}
      >
        <motion.h2
          variants={prefersReducedMotion ? undefined : fadeUpItem}
          className="text-2xl font-bold mb-10 pl-4 border-l-2 border-cyan text-white"
        >
          <DecodeText text={title} start={inView} />
        </motion.h2>
        {children}
      </motion.div>
    </section>
  );
}

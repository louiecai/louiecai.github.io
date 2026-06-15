import { motion } from 'framer-motion';
import { Section } from './Section';
import { DecodeText } from './DecodeText';
import { TiltCard } from './TiltCard';
import { profile } from '../data/profile';
import { fadeUpItem, popItem } from '../lib/variants';

export function Experience() {
  return (
    <Section id="experience" title="Experience">
      <div className="relative border-l border-border pl-8 space-y-6">
        {profile.experience.map((job, i) => (
          <motion.div key={i} variants={fadeUpItem} className="relative">
            {/* Timeline dot — stays on the rail while the glass panel tilts */}
            <motion.span
              variants={popItem}
              className="absolute -left-[2.15rem] top-7 w-3 h-3 rounded-full bg-cyan border-2 border-bg z-10"
            />

            <TiltCard className="rounded-xl p-5">
              <div className="flex flex-wrap items-baseline gap-2 mb-1">
                <h3 className="text-fg font-semibold text-lg">
                  <DecodeText text={job.company} className="" />
                </h3>
              </div>
              <p className="text-muted text-sm mb-1">{job.role}</p>
              <p className="font-mono text-xs text-muted mb-3">{job.period}</p>
              <ul className="space-y-1.5 list-none">
                {job.bullets.map((b, j) => (
                  <li key={j} className="text-sm text-muted leading-relaxed flex gap-2">
                    <span className="text-cyan leading-relaxed">▸</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

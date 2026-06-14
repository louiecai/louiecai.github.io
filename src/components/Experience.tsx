import { motion } from 'framer-motion';
import { Section } from './Section';
import { profile } from '../data/profile';
import { fadeUpItem, popItem } from '../lib/variants';

export function Experience() {
  return (
    <Section id="experience" title="Experience">
      <div className="relative border-l border-border pl-8 space-y-12">
        {profile.experience.map((job, i) => (
          <motion.div key={i} variants={fadeUpItem} className="relative">
            {/* Timeline dot */}
            <motion.span
              variants={popItem}
              className="absolute -left-[2.15rem] top-1.5 w-3 h-3 rounded-full bg-cyan border-2 border-bg"
            />

            <div className="flex flex-wrap items-baseline gap-2 mb-1">
              <h3 className="text-white font-semibold text-lg">{job.company}</h3>
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
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

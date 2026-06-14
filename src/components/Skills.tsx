import { motion } from 'framer-motion';
import { Section } from './Section';
import { DecodeText } from './DecodeText';
import { profile } from '../data/profile';
import { fadeUpItem, popItem } from '../lib/variants';

export function Skills() {
  return (
    <Section id="skills" title="Skills">
      <div className="space-y-8">
        {profile.skillGroups.map((group) => (
          <motion.div key={group.category} variants={fadeUpItem}>
            <h3 className="text-xs font-mono text-cyan uppercase tracking-widest mb-3">
              <DecodeText text={group.category} className="" />
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <motion.span
                  key={skill}
                  variants={popItem}
                  className="text-sm font-mono text-muted border border-border rounded px-3 py-1 hover:border-cyan/50 hover:text-white transition-colors"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

import { Section } from './Section';
import { profile } from '../data/profile';

export function Skills() {
  return (
    <Section id="skills" title="Skills">
      <div className="space-y-8">
        {profile.skillGroups.map((group) => (
          <div key={group.category}>
            <h3 className="text-xs font-mono text-cyan uppercase tracking-widest mb-3">
              {group.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-sm font-mono text-muted border border-border rounded px-3 py-1 hover:border-cyan/50 hover:text-white transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

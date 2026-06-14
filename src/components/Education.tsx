import { Section } from './Section';
import { profile } from '../data/profile';
import { TiltCard } from './TiltCard';
import { DecodeText } from './DecodeText';

export function Education() {
  return (
    <Section id="education" title="Education">
      {profile.education.map((edu, i) => (
        <TiltCard key={i} className="bg-surface border border-border rounded-lg p-6">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
            <h3 className="text-white font-semibold text-lg">
              <DecodeText text={edu.school} className="" />
            </h3>
            {edu.gpa && <span className="font-mono text-sm text-cyan">GPA {edu.gpa}</span>}
          </div>
          <p className="text-muted">{edu.degree}</p>
          <p className="font-mono text-xs text-muted mt-1">{edu.graduation}</p>
          {edu.minor && <p className="text-sm text-muted mt-2">Minor: {edu.minor}</p>}
        </TiltCard>
      ))}
    </Section>
  );
}

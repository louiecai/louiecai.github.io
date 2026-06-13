import { Section } from './Section';
import { profile } from '../data/profile';

export function Activities() {
  return (
    <Section id="activities" title="Activities">
      <div className="space-y-4">
        {profile.activities.map((act, i) => (
          <div key={i} className="bg-surface border border-border rounded-lg p-6">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <h3 className="text-white font-semibold">{act.name}</h3>
              {act.highlight && (
                <span className="text-xs font-mono text-violet border border-violet/30 rounded px-1.5 py-0.5">
                  {act.highlight}
                </span>
              )}
            </div>
            <p className="font-mono text-xs text-muted mb-3">{act.date}</p>
            <ul className="space-y-1">
              {act.bullets.map((bullet, j) => (
                <li key={j} className="flex gap-2 text-sm text-muted">
                  <span className="text-cyan mt-0.5 shrink-0">▸</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

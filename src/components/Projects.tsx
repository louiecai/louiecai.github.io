import { Section } from './Section';
import { profile } from '../data/profile';
import type { ProjectItem } from '../data/profile';

function ProjectCard({ project }: { project: ProjectItem }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-5 flex flex-col gap-3 hover:border-cyan/40 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-white font-semibold">{project.name}</h3>
        {project.highlight && (
          <span className="text-xs font-mono text-cyan border border-cyan/30 rounded px-1.5 py-0.5 whitespace-nowrap">
            {project.highlight}
          </span>
        )}
      </div>
      <p className="text-muted text-sm leading-relaxed flex-1">{project.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((t) => (
          <span key={t} className="text-xs font-mono text-muted border border-border rounded px-1.5 py-0.5">
            {t}
          </span>
        ))}
      </div>
      {project.links && project.links.length > 0 && (
        <div className="flex gap-3">
          {project.links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-cyan hover:text-white transition-colors font-mono"
            >
              {link.label} →
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export function Projects() {
  const professional = profile.projects.filter((p) => p.type === 'professional');
  const personal = profile.projects.filter((p) => p.type === 'personal');

  return (
    <Section id="projects" title="Projects">
      {professional.length > 0 && (
        <div className="mb-10">
          <h3 className="text-sm font-mono text-muted uppercase tracking-widest mb-4">Professional</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {professional.map((p) => (
              <ProjectCard key={p.name} project={p} />
            ))}
          </div>
        </div>
      )}
      <div>
        <h3 className="text-sm font-mono text-muted uppercase tracking-widest mb-4">Side Projects</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {personal.map((p) => (
            <ProjectCard key={p.name} project={p} />
          ))}
        </div>
      </div>
    </Section>
  );
}

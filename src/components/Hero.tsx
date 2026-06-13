import { ParticleField } from './ParticleField';
import { profile } from '../data/profile';

const SOCIAL_LABELS = ['GitHub', 'LinkedIn', 'Twitter', 'Email'];

export function Hero() {
  const scrollToWork = () =>
    document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });

  const currentRole = profile.experience[0].role;
  const currentCompany = profile.experience[0].company;

  return (
    <div
      id="about"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <ParticleField />

      <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
        {/* Eyebrow label */}
        <p className="font-mono text-cyan text-sm tracking-widest mb-4 uppercase">
          Hello, I'm
        </p>

        {/* Name */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
          {profile.name}
        </h1>

        {/* Role */}
        <p className="text-xl md:text-2xl text-muted mb-6">
          {currentRole} <span className="text-violet">@</span>{' '}
          <span className="text-white font-semibold">{currentCompany}</span>
        </p>

        {/* Tagline */}
        <p className="text-muted max-w-xl mx-auto mb-10 leading-relaxed">
          {profile.tagline}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 justify-center mb-10">
          <button
            onClick={scrollToWork}
            className="px-6 py-3 bg-cyan text-bg font-semibold rounded hover:bg-white transition-colors"
          >
            View My Work
          </button>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-cyan text-cyan rounded hover:bg-cyan hover:text-bg transition-colors"
          >
            Resume
          </a>
        </div>

        {/* Socials */}
        <div className="flex gap-4 justify-center">
          {profile.socials
            .filter(s => SOCIAL_LABELS.includes(s.label))
            .map(social => (
              <a
                key={social.label}
                href={social.url}
                target={social.label === 'Email' ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className="text-muted hover:text-cyan transition-colors text-sm font-mono"
                aria-label={social.label}
              >
                {social.label}
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}

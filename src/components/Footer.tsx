import { profile } from '../data/profile';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-20 py-12 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Get in Touch</h2>
        <p className="text-muted mb-6 max-w-md mx-auto">
          Open to interesting conversations and opportunities.
        </p>

        {/* Email CTA */}
        <a
          href={`mailto:${profile.email}`}
          className="inline-block px-6 py-3 bg-cyan text-bg font-semibold rounded hover:bg-white transition-colors mb-10"
        >
          {profile.email}
        </a>

        {/* Social links */}
        <div className="flex flex-wrap gap-4 justify-center mb-10">
          {profile.socials.map((social) => (
            <a
              key={social.label}
              href={social.url}
              target={social.url.startsWith('mailto') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              className="text-muted hover:text-cyan transition-colors text-sm font-mono"
            >
              {social.label}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-xs font-mono text-muted">
          © {year} {profile.name} · Built with React + Vite
        </p>
      </div>
    </footer>
  );
}

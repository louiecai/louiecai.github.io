import { motion } from 'framer-motion';
import { MagneticButton } from './MagneticButton';
import { DecodeText } from './DecodeText';
import { useTiltParallax } from '../hooks/useTiltParallax';
import { profile } from '../data/profile';
import { staggerContainer, fadeUpItem } from '../lib/variants';

const SOCIAL_LABELS = ['GitHub', 'LinkedIn', 'Twitter', 'Email'];

export function Hero() {
  const scrollToWork = () =>
    document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });

  const currentRole = profile.experience[0].role;
  const currentCompany = profile.experience[0].company;
  const parallaxRef = useTiltParallax<HTMLDivElement>(14, true);

  return (
    <div
      id="about"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <motion.div
        ref={parallaxRef}
        className="relative z-10 text-center max-w-3xl mx-auto px-4 will-change-transform"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {/* Eyebrow label */}
        <motion.p
          variants={fadeUpItem}
          className="font-mono text-cyan text-sm tracking-widest mb-4 uppercase"
        >
          <DecodeText text="Hello, I'm" start className="" />
        </motion.p>

        {/* Name with sheen */}
        <motion.h1
          variants={fadeUpItem}
          className="text-5xl md:text-7xl font-bold mb-4"
        >
          <DecodeText text={profile.name} start className="text-sheen" />
        </motion.h1>

        {/* Role */}
        <motion.p variants={fadeUpItem} className="text-xl md:text-2xl text-muted mb-6">
          {currentRole} <span className="text-violet">@</span>{' '}
          <span className="text-white font-semibold">{currentCompany}</span>
        </motion.p>

        {/* Tagline */}
        <motion.p variants={fadeUpItem} className="text-muted max-w-xl mx-auto mb-10 leading-relaxed">
          {profile.tagline}
        </motion.p>

        {/* CTAs */}
        <motion.div variants={fadeUpItem} className="flex flex-wrap gap-4 justify-center items-center mb-10">
          <MagneticButton>
            <button
              onClick={scrollToWork}
              className="px-6 py-3 bg-cyan text-bg font-semibold rounded hover:bg-white transition-colors"
            >
              View My Work
            </button>
          </MagneticButton>
          <MagneticButton>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-cyan text-cyan rounded hover:bg-cyan hover:text-bg transition-colors"
            >
              Resume
            </a>
          </MagneticButton>
        </motion.div>

        {/* Socials */}
        <motion.div variants={fadeUpItem} className="flex gap-4 justify-center mb-16">
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
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="flex justify-center text-muted"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}

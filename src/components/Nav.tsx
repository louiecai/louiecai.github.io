import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActiveSection } from '../hooks/useActiveSection';
import { Logo } from './Logo';
import { SECTION_IDS, SECTION_LABELS } from '../lib/sections';

export function Nav() {
  const activeSection = useActiveSection([...SECTION_IDS]);
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur border-b border-border"
          aria-label="Main navigation"
        >
          <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
            <button
              onClick={() => scrollTo('about')}
              className="font-mono text-cyan font-bold tracking-widest text-sm hover:text-white transition-colors"
              aria-label="Back to top"
            >
              <Logo />
            </button>

            {/* Desktop nav */}
            <ul className="hidden md:flex gap-6 list-none m-0 p-0">
              {SECTION_IDS.map((id) => (
                <li key={id}>
                  <button
                    onClick={() => scrollTo(id)}
                    className={`text-sm font-medium transition-colors ${
                      activeSection === id ? 'text-cyan' : 'text-muted hover:text-white'
                    }`}
                  >
                    {SECTION_LABELS[id]}
                  </button>
                </li>
              ))}
            </ul>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col gap-1 p-1 text-muted hover:text-white transition-colors"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span className="block w-5 h-0.5 bg-current" />
              <span className="block w-5 h-0.5 bg-current" />
              <span className="block w-5 h-0.5 bg-current" />
            </button>
          </div>

          {/* Mobile dropdown */}
          <AnimatePresence>
            {menuOpen && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden overflow-hidden bg-surface border-b border-border px-4 pb-3 list-none m-0 p-0"
              >
                {SECTION_IDS.map((id) => (
                  <li key={id}>
                    <button
                      onClick={() => scrollTo(id)}
                      className={`block w-full text-left py-2 text-sm font-medium transition-colors ${
                        activeSection === id ? 'text-cyan' : 'text-muted hover:text-white'
                      }`}
                    >
                      {SECTION_LABELS[id]}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

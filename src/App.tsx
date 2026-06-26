import { AuroraBackground } from './components/AuroraBackground';
import { CursorSpotlight } from './components/CursorSpotlight';
import { ScrollRail } from './components/ScrollRail';
import { ParticleField } from './components/ParticleField';
import { ThemeToggle } from './components/ThemeToggle';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Activities } from './components/Activities';
import { Education } from './components/Education';
import { Footer } from './components/Footer';
import { Terminal } from './components/Terminal';
import { useTheme } from './hooks/useTheme';

function App() {
  const { toggle } = useTheme();

  return (
    <>
      <AuroraBackground />      {/* -z-20, behind particles */}
      <ParticleField />         {/* -z-10 */}
      <CursorSpotlight />       {/* -z-[5] */}
      <ScrollRail />            {/* z-40, left edge */}
      <ThemeToggle />           {/* z-[60], top-right */}
      <Nav />
      <main>
        <Hero />
        <Experience />
        <Projects />
        <Skills />
        <Activities />
        <Education />
      </main>
      <Footer />
      <Terminal onThemeToggle={toggle} />  {/* z-[80] overlay, z-[60] launcher */}
    </>
  );
}

export default App;

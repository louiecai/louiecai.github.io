import { AuroraBackground } from './components/AuroraBackground';
import { CursorSpotlight } from './components/CursorSpotlight';
import { ScrollCompanion } from './components/ScrollCompanion';
import { ScrollRail } from './components/ScrollRail';
import { ScrollSkew } from './components/ScrollSkew';
import { ParticleField } from './components/ParticleField';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Activities } from './components/Activities';
import { Education } from './components/Education';
import { Footer } from './components/Footer';

function App() {
  return (
    <>
      <AuroraBackground />      {/* -z-20, behind particles */}
      <ParticleField />         {/* -z-10 */}
      <CursorSpotlight />       {/* -z-[5] */}
      <ScrollRail />            {/* z-40, left edge */}
      <ScrollCompanion />       {/* z-40, right edge comet */}
      <Nav />
      <main>
        <ScrollSkew>
          <Hero />
          <Experience />
          <Projects />
          <Skills />
          <Activities />
          <Education />
        </ScrollSkew>
      </main>
      <Footer />
    </>
  );
}

export default App;

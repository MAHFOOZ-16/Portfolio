import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { AnimatePresence } from 'framer-motion';
import Preloader from './components/Preloader';
import ScrollyHero from './components/ScrollyHero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import TechStack from './components/TechStack';
import PreFooter from './components/PreFooter';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import GradientSpheres from './components/Hero/GradientSpheres';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Smooth Scrolling (Lenis)
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // The Preloader component now controls when to set loading to false via the onComplete callback


    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main>
      <AnimatePresence mode='wait'>
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <div className="portfolio-content relative">
          <GradientSpheres
            sphere1Class={"gradient-sphere sphere-1"}
            sphere2Class={"gradient-sphere sphere-2"}
          />
          <ScrollyHero />
          <About />
          <Experience />
          <Projects />
          <Achievements />
          <TechStack />
          <PreFooter />
          <Footer />
          <Chatbot />
        </div>
      )}
    </main>
  );
}

export default App;

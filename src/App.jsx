import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';


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
import ProjectDetail from './components/ProjectDetail';

// Helper component to handle scrolling and initialization
const ScrollHandler = ({ isReady }) => {
  const { pathname, hash, search } = useLocation();
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    // Only initialize Lenis for the main landing pages
    let lenis;
    const isHomeRoute = pathname === '/' || pathname === '/projects' || (pathname.startsWith('/projects/') && pathname.split('/').length === 3);

    if (isHomeRoute) {
      lenis = new Lenis({
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

      window.lenis = lenis;

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
    } else {
      // For detail pages, standard scroll is fine, but we must scroll to top
      window.scrollTo(0, 0);
    }

    return () => {
      if (lenis) {
        lenis.destroy();
        window.lenis = null;
      }
    };
  }, [pathname]);

  // Handle hash scrolling when the hash changes OR when the app becomes ready
  useEffect(() => {
    if (!isReady || !window.lenis) return;

    // Use explicit hash, or infer hash if we are on a projects route
    const isProjectsRoute = pathname === '/projects' || (pathname.startsWith('/projects/') && pathname.split('/').length === 3);
    const targetHash = hash || (isProjectsRoute ? '#projects' : null);

    if (targetHash) {
      // Only auto-scroll to category on INITIAL pageload (not when just clicking filters locally)
      if (!hash && isProjectsRoute && hasScrolledRef.current) {
        return; 
      }

      setTimeout(() => {
        const element = document.querySelector(targetHash);
        if (element) {
          window.lenis.scrollTo(element, { offset: 0, duration: 1.5 });
          hasScrolledRef.current = true;
        }
      }, 600); // 600ms gives enough time for DOM & animations to settle
    } else if (pathname === '/' && !hasScrolledRef.current) {
      window.scrollTo(0, 0);
      hasScrolledRef.current = true;
    }
  }, [hash, search, isReady, pathname]);

  // Track page views on route, hash, and search param changes
  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', 'G-CG961CHMCQ', {
        page_path: pathname + search + hash,
      });
    }
  }, [pathname, search, hash]);

  return null;
};

const Home = () => {
  return (
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
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Router>
      <ScrollHandler isReady={!isLoading} />
      <main>
        <AnimatePresence mode='wait'>
          {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
        </AnimatePresence>

        {!isLoading && (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Home />} />
            <Route path="/projects/:category" element={<Home />} />
            <Route path="/projects/:category/:slug" element={<ProjectDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>
    </Router>
  );
}

export default App;

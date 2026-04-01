import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';

const CategoryRedirect = () => {
  const { category } = useParams();
  return <Navigate to={`/?category=${category}#projects`} replace />;
};
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
const ScrollHandler = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Only initialize Lenis for the main landing page
    let lenis;
    if (pathname === '/') {
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

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      if (hash) {
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            lenis.scrollTo(element, { offset: 0, duration: 1.5 });
          }
        }, 400);
      } else {
        window.scrollTo(0, 0);
      }
    } else {
      // For detail pages, standard scroll is fine, but we must scroll to top
      window.scrollTo(0, 0);
    }

    return () => {
      if (lenis) lenis.destroy();
    };
  }, [pathname, hash]);

  // Track page views on route and hash changes
  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', 'G-CG961CHMCQ', {
        page_path: pathname + hash,
      });
    }
  }, [pathname, hash]);

  return null;
};

const Home = ({ scrollToHash }) => {
  useEffect(() => {
    if (scrollToHash) {
      // Wait for all components to render, then scroll
      const timer = setTimeout(() => {
        const element = document.querySelector(scrollToHash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [scrollToHash]);

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
  // Capture the hash at initial page load (before React clears it)
  const initialHash = useRef(window.location.hash || null);

  return (
    <Router>
      <ScrollHandler />
      <main>
        <AnimatePresence mode='wait'>
          {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
        </AnimatePresence>

        {!isLoading && (
          <Routes>
            <Route path="/" element={<Home scrollToHash={initialHash.current} />} />
            <Route path="/projects" element={<Navigate to="/#projects" replace />} />
            <Route path="/projects/:category" element={<CategoryRedirect />} />
            <Route path="/projects/:category/:slug" element={<ProjectDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>
    </Router>
  );
}

export default App;

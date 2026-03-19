import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { initJellySlider } from './jellyRunner';
import './style.css';

const slideUp = {
  initial: { top: 0 },
  exit: {
    top: "-100vh",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }
  }
};

const introWords = [
  "Ahmed Mahfooz Ali Khan",
  "AI/ML Engineer",
  "Cyber Security Specialist",
  "Welcome",
];

const PHASE = {
  JELLY: 'jelly',
  FADE_OUT: 'fade_out',
  TEXT_CYCLE: 'text_cycle',
  DONE: 'done',
};

export default function Preloader({ onComplete }) {
  const canvasRef = useRef(null);
  const hasInitRef = useRef(false);
  const [_IsMobile] = useState(() => window.innerWidth <= 768);
  const [phase, setPhase] = useState(PHASE.JELLY);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [dimension] = useState({ width: window.innerWidth, height: window.innerHeight });



  // Safety timeout: if jelly phase hangs (WebGPU init stalls), force transition
  useEffect(() => {
    if (phase !== PHASE.JELLY) return undefined;

    // Give WebGPU 8 seconds max before forcing transition
    const fallback = setTimeout(() => {
      console.warn('Jelly preloader timed out — skipping to text cycle');
      setPhase(PHASE.FADE_OUT);
    }, 8000);
    return () => clearTimeout(fallback);
  }, [phase]);

  // Phase 1: Jelly slider
  useEffect(() => {
    let cancel = null;
    let isMounted = true;
    if (canvasRef.current) {
      // Reset ref so Strict Mode re-mount can re-init
      hasInitRef.current = true;
      (async () => {
        try {
          if (!isMounted || !canvasRef.current) return;
          cancel = await initJellySlider(canvasRef.current, () => {
            if (isMounted) setPhase(PHASE.FADE_OUT);
          });
        } catch (e) {
          console.error("WebGPU setup failed", e);
          if (isMounted) setPhase(PHASE.FADE_OUT);
        }
      })();
    }
    return () => {
      isMounted = false;
      hasInitRef.current = false;
      if (cancel) cancel();
    };
  }, []);

  // Phase 2: Canvas fade out → text cycle
  useEffect(() => {
    if (phase !== PHASE.FADE_OUT) return;
    const t = setTimeout(() => {
      setPhase(PHASE.TEXT_CYCLE);
      setCurrentWordIndex(0);
    }, 800);
    return () => clearTimeout(t);
  }, [phase]);

  // Phase 3: Each word advances after a delay
  useEffect(() => {
    if (phase !== PHASE.TEXT_CYCLE) return;

    const isLast = currentWordIndex === introWords.length - 1;
    const displayDuration = isLast ? 1800 : 1200;

    const t = setTimeout(() => {
      if (isLast) {
        setPhase(PHASE.DONE);
        if (onComplete) onComplete();
        document.body.style.cursor = 'default';
        window.scrollTo(0, 0);
      } else {
        setCurrentWordIndex(i => i + 1);
      }
    }, displayDuration);

    return () => clearTimeout(t);
  }, [phase, currentWordIndex, onComplete]);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height}  L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height}  L0 0`;

  const curve = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] }
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 }
    }
  };



  const showCanvas = phase === PHASE.JELLY || phase === PHASE.FADE_OUT;
  const showText = phase === PHASE.TEXT_CYCLE;
  const isWelcome = currentWordIndex === introWords.length - 1;

  return (
    <motion.div variants={slideUp} initial="initial" exit="exit" className="introduction">
      {dimension.width > 0 && (
        <>
            <canvas
              id="jelly-canvas"
              ref={canvasRef}
              className={`jelly-slider-canvas ${phase === PHASE.FADE_OUT ? 'jelly-fading' : ''} ${!showCanvas ? 'jelly-hidden' : ''}`}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                zIndex: 10,
                background: '#141516',
              }}
            />

          <div className="intro-content-layer">
            {showText && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`word-${currentWordIndex}`}
                  className="intro-single-word-wrapper"
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -25 }}
                  transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
                >
                  <span className="intro-dot" />
                  <span className={`intro-word ${isWelcome ? 'welcome-word' : ''}`}>
                    {introWords[currentWordIndex]}
                  </span>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          <svg>
            <motion.path variants={curve} initial="initial" exit="exit" />
          </svg>
        </>
      )}
    </motion.div>
  );
}

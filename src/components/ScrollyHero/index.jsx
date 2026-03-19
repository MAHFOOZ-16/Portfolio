import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import './ScrollyHero.css';

const TOTAL_FRAMES = 60;
const FRAME_PATHS = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
  const idx = String(i).padStart(2, '0');
  return `/sequence/frame_${idx}_delay-0.067s.png`;
});

/* ── Mobile Hero (static, clean) ── */
function MobileHero() {
  return (
    <section className="scrolly-mobile-hero" id="home">
      <div className="scrolly-mobile-img">
        <img src="/sequence/frame_00_delay-0.067s.png" alt="Ahmed Mahfooz Ali Khan" />
        <div className="scrolly-mobile-gradient" />
      </div>
      <div className="scrolly-mobile-content">
        <div className="scrolly-mobile-line" />
        <h1 className="scrolly-mobile-statement">
          Where machines think<br />& shields never break.
        </h1>
        <div className="scrolly-mobile-tags">
          <div className="scrolly-mobile-tag-group">
            <span className="scrolly-mobile-label scrolly-mobile-label--cyan">AI / ML</span>
            <span className="scrolly-mobile-detail">TensorFlow · LangChain · RAG</span>
          </div>
          <div className="scrolly-mobile-tag-group">
            <span className="scrolly-mobile-label scrolly-mobile-label--green">Cybersecurity</span>
            <span className="scrolly-mobile-detail">Pen Testing · IoT · OWASP</span>
          </div>
        </div>
        <div className="scrolly-mobile-scroll">
          <ChevronDown size={16} />
        </div>
      </div>
    </section>
  );
}

export default function ScrollyHero() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [_IsMobile, setIsMobile] = useState(false);
  const currentFrameRef = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const drawFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imagesRef.current[frameIndex];
    if (!canvas || !ctx || !img) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, w, h);

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = w / h;
    const isMobilePortrait = canvasAspect < 0.85;
    let drawW, drawH, offsetX, offsetY;

    if (isMobilePortrait) {
      // Mobile portrait: show head-to-chest, leave bottom 30% for text
      // Scale image to fill width, then position vertically so face is centered in top 65%
      const visibleH = h * 0.65;       // top 65% for image
      drawW = w * 1.05;                // slight overflow for edge coverage
      drawH = drawW / imgAspect;
      // If image isn't tall enough to fill the visible zone, scale up
      if (drawH < visibleH) {
        drawH = visibleH;
        drawW = drawH * imgAspect;
      }
      offsetX = (w - drawW) / 2;
      // Center face in top portion (shift up slightly)
      offsetY = (visibleH - drawH) / 2 - (drawH * 0.05);

      // Clip to top 65% so the bottom 35% stays pure dark
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, w, visibleH);
      ctx.clip();
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
      ctx.restore();
      return;
    } else {
      // Desktop/tablet: cover with slight zoom
      const zoom = 1.12;
      if (canvasAspect > imgAspect) {
        drawW = w * zoom;
        drawH = drawW / imgAspect;
      } else {
        drawH = h * zoom;
        drawW = drawH * imgAspect;
      }
      offsetX = (w - drawW) / 2 - (drawW * 0.01);
      offsetY = (h - drawH) / 2 - (drawH * 0.02);
    }

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  }, []);

  // Preload all images
  useEffect(() => {
    let loadedCount = 0;
    const images = [];

    FRAME_PATHS.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          imagesRef.current = images;
          setImagesLoaded(true);
          drawFrame(0);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          imagesRef.current = images;
          setImagesLoaded(true);
        }
      };
      images[i] = img;
    });
  }, [drawFrame]);

  useEffect(() => {
    const handleResize = () => {
      if (imagesLoaded) drawFrame(currentFrameRef.current);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [imagesLoaded, drawFrame]);

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (!imagesLoaded) return;
    const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * TOTAL_FRAMES));
    if (frameIndex !== currentFrameRef.current) {
      currentFrameRef.current = frameIndex;
      drawFrame(frameIndex);
    }
  });

  /* ── Scroll-linked transforms ── */

  // Section 1: Statement (0–25%)
  const s1Opacity = useTransform(scrollYProgress, [0, 0.05, 0.2, 0.28], [0, 1, 1, 0]);
  const s1Y = useTransform(scrollYProgress, [0, 0.05, 0.2, 0.28], [30, 0, 0, -40]);

  // Section 2: AI/ML — top-left (30–55%)
  const s2Opacity = useTransform(scrollYProgress, [0.28, 0.35, 0.5, 0.58], [0, 1, 1, 0]);
  const s2Y = useTransform(scrollYProgress, [0.28, 0.35, 0.5, 0.58], [40, 0, 0, -40]);

  // Section 3: Cybersecurity — bottom-right (60–85%)
  const s3Opacity = useTransform(scrollYProgress, [0.58, 0.65, 0.8, 0.88], [0, 1, 1, 0]);
  const s3Y = useTransform(scrollYProgress, [0.58, 0.65, 0.8, 0.88], [40, 0, 0, -40]);

  // Scroll hint
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  return (
    <section ref={containerRef} className="scrolly-container" id="home">
      <div className="scrolly-sticky">
        <canvas ref={canvasRef} className="scrolly-canvas" />
        <div className="scrolly-vignette" />
        <div className="scrolly-bottom-mask" />

        {/* ── Section 1: Minimal bottom statement ── */}
        <motion.div
          className="scrolly-overlay scrolly-overlay--s1"
          style={{ opacity: s1Opacity, y: s1Y }}
        >
          <div className="scrolly-s1">
            <div className="scrolly-s1-line" />
            <h1 className="scrolly-s1-text">
              Where machines think<br />& shields never break.
            </h1>
            <p className="scrolly-s1-sub">Scroll to explore</p>
          </div>
        </motion.div>

        {/* ── Section 2: AI/ML — TOP LEFT ── */}
        <motion.div
          className="scrolly-overlay scrolly-overlay--s2"
          style={{ opacity: s2Opacity, y: s2Y }}
        >
          <div className="scrolly-block">
            <span className="scrolly-block-label scrolly-block-label--cyan">AI / ML</span>
            <h2 className="scrolly-block-heading">
              Engineering<br />
              <span className="scrolly-accent--cyan">intelligent systems</span><br />
              that learn & evolve.
            </h2>
            <div className="scrolly-block-tags">
              <span>TensorFlow</span>
              <span>LangChain</span>
              <span>RAG</span>
              <span>Scikit-learn</span>
            </div>
          </div>
        </motion.div>

        {/* ── Section 3: Cybersecurity — BOTTOM RIGHT ── */}
        <motion.div
          className="scrolly-overlay scrolly-overlay--s3"
          style={{ opacity: s3Opacity, y: s3Y }}
        >
          <div className="scrolly-block">
            <span className="scrolly-block-label scrolly-block-label--green">Cybersecurity</span>
            <h2 className="scrolly-block-heading">
              Fortifying<br />
              <span className="scrolly-accent--green">digital frontiers</span><br />
              against threats.
            </h2>
            <div className="scrolly-block-tags">
              <span>Pen Testing</span>
              <span>IoT Security</span>
              <span>OWASP</span>
            </div>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div className="scrolly-scroll-hint" style={{ opacity: scrollHintOpacity }}>
          <ChevronDown size={16} className="scrolly-scroll-arrow" />
        </motion.div>
      </div>
    </section>
  );
}

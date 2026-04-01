import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Trophy, Award, Medal, Shield, Brain, Code, FileText, Users, Star, Presentation } from 'lucide-react';
import portfolioData from '../../data/portfolio_content.json';
import './Achievements.css';

const ICON_MAP = {
  shield: Shield,
  brain: Brain,
  code: Code,
  medal: Medal,
  award: Award,
  file: FileText,
  users: Users,
  star: Star,
  presentation: Presentation,
};

const CATEGORIES = [
  { key: 'achievements', label: 'Achievements', icon: Trophy, color: '#fbbf24', glow: 'rgba(251,191,36,0.35)' },
  { key: 'certifications', label: 'Certifications', icon: Shield, color: '#3b82f6', glow: 'rgba(59,130,246,0.35)' },
  { key: 'extracurricular', label: 'Extracurricular', icon: Star, color: '#a855f7', glow: 'rgba(168,85,247,0.35)' },
];

/* ── Section-wide Spotlight that follows cursor ── */
const SectionSpotlight = ({ containerRef, color }) => {
  const spotRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const move = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (spotRef.current) {
        spotRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, ${color}, transparent 60%)`;
      }
    };
    container.addEventListener('mousemove', move);
    return () => container.removeEventListener('mousemove', move);
  }, [containerRef, color]);

  return <div ref={spotRef} className="section-spotlight" />;
};

/* ── 3D Tilt Glass Card with glow ring icon ── */
const GlassCard = ({ item, index, color }) => {
  const cardRef = useRef(null);
  const inViewRef = useRef(null);
  const isInView = useInView(inViewRef, { once: true, margin: '-40px' });
  const Icon = ICON_MAP[item.icon] || Award;

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card || window.innerWidth < 768) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    // Move inner glow
    card.style.setProperty('--glow-x', `${x}px`);
    card.style.setProperty('--glow-y', `${y}px`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (card) {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    }
  }, []);

  return (
    <motion.div
      ref={inViewRef}
      initial={{ opacity: 0, y: 60, scale: 0.9, filter: 'blur(8px)' }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.8, 0.25, 1] }}
    >
      <div
        ref={cardRef}
        className="glass-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ '--card-accent': color }}
      >
        {/* Animated gradient border */}
        <div className="glass-card__animated-border" />
        {/* Inner glow that follows mouse */}
        <div className="glass-card__inner-glow" />

        {/* Icon with animated ring */}
        <div className="glass-card__icon-wrap">
          <div className="glass-card__icon-ring" />
          <div className="glass-card__icon" style={{ color }}>
            <Icon size={26} />
          </div>
        </div>

        <h3 className="glass-card__title">{item.title}</h3>

        {item.issuer && (
          <span className="glass-card__issuer" style={{ color }}>
            {item.issuer}
          </span>
        )}

        {item.description && (
          <p className="glass-card__desc">{item.description}</p>
        )}

        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card__link"
            style={{ color }}
            onClick={(e) => {
              e.stopPropagation();
              if (window.gtag) {
                window.gtag('event', 'achievement_click', {
                  'title': item.title,
                  'type': item.issuer ? 'certification' : 'achievement'
                });
              }
            }}
          >
            View Project ↗
          </a>
        )}

        {/* Bottom accent line */}
        <div className="glass-card__accent-line" />
      </div>
    </motion.div>
  );
};

/* ── Shelf Line Decoration ── */
const ShelfLine = () => (
  <div className="shelf-line">
    <div className="shelf-line__surface" />
    <div className="shelf-line__reflection" />
  </div>
);

/* ── Animated Tab Pill ── */
const TabPill = ({ categories, active, onChange }) => {
  const pillRef = useRef(null);
  const tabRefs = useRef({});

  useEffect(() => {
    const activeTab = tabRefs.current[active];
    const pill = pillRef.current;
    if (activeTab && pill) {
      const { offsetLeft, offsetWidth } = activeTab;
      pill.style.transform = `translateX(${offsetLeft}px)`;
      pill.style.width = `${offsetWidth}px`;
    }
  }, [active]);

  return (
    <div className="trophy-tabs">
      <div ref={pillRef} className="trophy-tabs__pill" />
      {categories.map((cat) => {
        const CatIcon = cat.icon;
        return (
          <button
            key={cat.key}
            ref={(el) => (tabRefs.current[cat.key] = el)}
            className={`trophy-tab ${active === cat.key ? 'trophy-tab--active' : ''}`}
            onClick={() => onChange(cat.key)}
            style={{ '--tab-color': cat.color }}
          >
            <CatIcon size={16} />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default function Achievements() {
  const [activeCategory, setActiveCategory] = useState('achievements');
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-80px' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const activeData = portfolioData[activeCategory] || [];
  const activeMeta = CATEGORIES.find((c) => c.key === activeCategory);

  return (
    <section id="achievements" className="achievements-section" ref={sectionRef}>
      {/* Section-wide spotlight */}
      <SectionSpotlight containerRef={sectionRef} color={activeMeta.glow} />

      <div className="achievements-container">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="section-header text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag justify-center">
            <Trophy size={18} /> Trophy Shelf
          </span>
          <h2 className="section-title">
            Achievements <span className="text-highlight">& Beyond</span>
          </h2>
        </motion.div>

        {/* Animated Tab Switcher */}
        <TabPill categories={CATEGORIES} active={activeCategory} onChange={setActiveCategory} />

        {/* Glass Card Grid */}
        <motion.div style={{ y: parallaxY }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className="trophy-grid"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
            >
              {activeData.map((item, index) => (
                <GlassCard
                  key={item.title}
                  item={item}
                  index={index}
                  color={activeMeta.color}
                  categoryKey={activeCategory}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <ShelfLine />
      </div>
    </section>
  );
}

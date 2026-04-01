import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Briefcase, Calendar, Shield, Code, Target } from 'lucide-react';
import portfolioData from '../../data/portfolio_content.json';
import './Experience.css';

const SPACING_FACTOR = 3.0;

const iconsList = [Briefcase, Shield, Target, Code, Shield];
const colorsList = ['#ffaa00', '#00ff88', '#00d4ff', '#bd00ff', '#ff6b6b'];

const useIsMobile = () => {
    const [mobile, setMobile] = useState(
        typeof window !== 'undefined' && window.innerWidth < 1024
    );
    useEffect(() => {
        const handler = () => setMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);
    return mobile;
};

// Desktop wave card with scroll-driven animation
const WaveCard = ({ exp, index, totalItems, scrollYProgress }) => {
    const Icon = iconsList[index % iconsList.length];
    const color = colorsList[index % colorsList.length];
    const lastIndex = totalItems - 1;
    const totalTravelDistance = lastIndex * SPACING_FACTOR;

    const phase = useTransform(scrollYProgress, (val) => {
        const cameraPosition = val * Math.max(1, totalTravelDistance);
        const itemStartOffset = index * SPACING_FACTOR;
        return cameraPosition - itemStartOffset;
    });

    const y = useTransform(phase, (p) => {
        const climb = p * 150;
        const dip = Math.abs(Math.sin(p)) * 80;
        return -(climb - dip);
    });

    const x = useTransform(phase, (p) => -Math.sin(p) * 200);

    const scale = useTransform(phase, (p) => {
        const depth = Math.cos(p);
        return 0.65 + (depth + 1) * 0.35;
    });

    const opacity = useTransform(phase, (p) => {
        const dist = Math.abs(p);
        if (dist > 3) return 0;
        return 1 - (dist / 4);
    });

    const zIndex = useTransform(phase, (p) => 100 - Math.round(Math.abs(p) * 10));

    const springConfig = { damping: 20, stiffness: 90, mass: 0.5 };
    const springY = useSpring(y, springConfig);
    const springX = useSpring(x, springConfig);
    const springScale = useSpring(scale, springConfig);

    return (
        <motion.div
            className="wave-card"
            style={{
                y: springY,
                x: springX,
                scale: springScale,
                opacity,
                zIndex,
                borderColor: color,
                boxShadow: `0 20px 40px rgba(0,0,0,0.5), 0 0 30px ${color}20`
            }}
            whileHover={{
                boxShadow: `0 30px 60px rgba(0,0,0,0.7), 0 0 60px ${color}40`,
                scale: 1.05
            }}
        >
            <CardContent exp={exp} index={index} color={color} />
        </motion.div>
    );
};

// Mobile card with simple reveal animation
const MobileCard = ({ exp, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const Icon = iconsList[index % iconsList.length];
    const color = colorsList[index % colorsList.length];

    return (
        <motion.div
            ref={ref}
            className="mobile-exp-card"
            style={{ borderColor: color, boxShadow: `0 10px 30px rgba(0,0,0,0.4), 0 0 20px ${color}15` }}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <CardContent exp={exp} index={index} color={color} />
        </motion.div>
    );
};

// Shared card content
const CardContent = ({ exp, index, color }) => {
    const Icon = iconsList[index % iconsList.length];
    return (
        <>
            <div className="card-top">
                <div className="card-icon" style={{ color: color, borderColor: `${color}50` }}>
                    <Icon size={24} />
                </div>
                <span className="card-date" style={{ color: color }}>
                    <Calendar size={14} className="inline mr-1"/> {exp.period}
                </span>
            </div>
            <h3 className="card-role">{exp.title}</h3>
            <p className="card-company">{exp.company} - {exp.location}</p>
            <ul className="card-bullets">
                {exp.bullets.slice(0, 2).map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                ))}
            </ul>
        </>
    );
};

export default function Experience() {
    const containerRef = useRef(null);
    const { experience } = portfolioData;
    const isMobile = useIsMobile();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    });

    const clampedProgress = useTransform(scrollYProgress, [0, 0.9], [0, 1]);
    const smoothProgress = useSpring(clampedProgress, {
        damping: 15,
        stiffness: 90,
        mass: 0.2
    });

    if (isMobile) {
        return (
            <section id="experience" className="experience-mobile" ref={containerRef}>
                <div className="section-header mobile-exp-header">
                    <span className="section-tag"><Briefcase size={18}/> Career Path</span>
                    <h2 className="section-title"><span className="text-highlight">Professional Experience</span></h2>
                </div>
                <div className="mobile-cards-stack">
                    {experience.map((exp, index) => (
                        <MobileCard key={index} exp={exp} index={index} />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section id="experience" className="experience-wrapper" ref={containerRef}>
            <div className="sticky-container">
                <div className="section-header fixed-header">
                    <span className="section-tag"><Briefcase size={18}/> Career Path</span>
                    <h2 className="section-title"><span className="text-highlight">Professional Experience</span></h2>
                </div>

                <div className="wave-container">
                    {experience.map((exp, index) => (
                        <WaveCard
                            key={index}
                            exp={exp}
                            index={index}
                            totalItems={experience.length}
                            scrollYProgress={smoothProgress}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

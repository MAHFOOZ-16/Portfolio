import { Mail, Github, Linkedin, Phone, Download } from 'lucide-react';
import portfolioData from '../../data/portfolio_content.json';
import HeroExperience from './HeroExperience';
import GradientSpheres from './GradientSpheres';
import './Hero.css';

export default function Hero() {
  const { personal, education } = portfolioData;
  const currentDegree = education[0]; // Master's in CS

  return (
    <section className="hero-section" id="home">
      <div className="hero-container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 2 }} // Wait for preloader
        >
          <div className="hero-badge">
            <span className="pulse-dot"></span>
            Open to AI & Cybersecurity Roles
          </div>

          <h2 className="hero-subtitle">
            {personal.name} | {currentDegree.degree}
          </h2>

          <h1 className="hero-title">
            Architecting <span className="text-highlight">Secure Systems</span> & <br/>
            Intelligent <span className="text-highlight">AI Frameworks</span>
          </h1>

          <p className="hero-description">
            A distinguished professional in AI and ML specializing in high performance machine learning models, fortifying IoT ecosystems against vulnerabilities, and architecting efficient APIs.
          </p>

          <div className="hero-actions">
            <a href={`mailto:${personal.email}`} className="btn-primary">
              <Mail size={18} /> Let's Connect
            </a>
            <a href="/resume.pdf" download className="btn-secondary btn-resume">
              <Download size={18} /> Download Resume
            </a>
            <a href="#projects" className="btn-secondary">
              View My Work
            </a>
          </div>

          <div className="hero-socials">
            <a href={personal.github} target="_blank" rel="noopener noreferrer">
              <Github size={24} />
            </a>
            <a href={personal.linkedin} target="_blank" rel="noopener noreferrer">
              <Linkedin size={24} />
            </a>
            <a href={`tel:${personal.phone}`} target="_blank" rel="noopener noreferrer">
              <Phone size={24} />
            </a>
          </div>
        </motion.div>

        {/* 3D CHARACTER ABSOLUTE */}
        <div className="absolute-hero-character">
          <HeroExperience />
        </div>
      </div>
    </section>
  );
}

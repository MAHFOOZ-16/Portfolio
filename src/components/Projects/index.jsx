import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Code2, Globe } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import portfolioData from '../../data/portfolio_content.json';
import ComputersCanvas from '../canvas/ComputersCanvas';
import './Projects.css';

const ProjectCard = ({ project }) => {
  return (
    <motion.div
      layout
      className="project-card"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -10 }}
    >
      <div className="project-content">
        {project.category && (
          <span className="project-category-tag">{project.category}</span>
        )}
        <h3 className="project-title">{project.title}</h3>
        {project.period && <span className="project-date">{project.period}</span>}
        
        {project.description && (
          <p className="project-desc">{project.description}</p>
        )}

        {project.tech && (
          <div className="project-tech">
            {project.tech.split(',').map((t, idx) => (
              <span key={idx} className="tech-badge">{t.trim()}</span>
            ))}
          </div>
        )}

        <div className="project-links">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link highlight">
              <Globe size={16} /> View Live
            </a>
          )}
          {project.reportUrl && (
            <a href={project.reportUrl} target="_blank" rel="noopener noreferrer" className="project-link">
              <ExternalLink size={16} /> View Report
            </a>
          )}
          {project.codeUrl && (
            <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" className="project-link">
              <Code2 size={16} /> View Code
            </a>
          )}
          {project.videoUrl && (
            <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="project-link outline">
              Watch Video
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function Projects() {
  const { projects } = portfolioData;
  const [activeCategory, setActiveCategory] = useState('All');

  const uniqueCategories = [...new Set(projects.map(p => p.category).filter(Boolean))];
  const sortedCategories = uniqueCategories.sort((a, b) => {
    if (a === 'Other') return 1;
    if (b === 'Other') return -1;
    return a.localeCompare(b);
  });
  const categories = ['All', ...sortedCategories];

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="projects" className="projects-section">
      <div className="projects-container">
        
        <div className="section-header text-center">
          <span className="section-tag justify-center">Portfolio</span>
          <h2 className="section-title">Featured <span className="text-highlight">Projects</span></h2>
        </div>

        {/* 3D Computer Model Container */}
        <motion.div 
          className="computer-canvas-container"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <ErrorBoundary fallback={<div className="text-center text-white p-10 border border-red-500 rounded">Failed to load 3D Computer Model. WebGL Context may be lost.</div>}>
            <ComputersCanvas />
          </ErrorBoundary>
        </motion.div>

        <p className="projects-intro">
          The following projects showcase my skills and experience through real-world examples. 
          Each project demonstrates my ability to solve complex problems, work with different technologies, 
          and manage projects effectively.
        </p>

        <div className="project-categories">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <motion.div layout className="projects-grid">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <ProjectCard key={project.title + idx} project={project} index={idx} />
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}

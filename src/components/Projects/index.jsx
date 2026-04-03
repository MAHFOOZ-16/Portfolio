import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Code2, Globe } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import portfolioData from '../../data/portfolio_content.json';
import ComputersCanvas from '../canvas/ComputersCanvas';
import './Projects.css';

const ProjectCard = ({ project }) => {
  const categorySlug = project.category 
    ? project.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') 
    : 'general';
  
  const trackProjectClick = (linkType) => {
    if (window.gtag) {
      window.gtag('event', 'project_click', {
        'project_name': project.title,
        'link_type': linkType,
        'category': project.category || 'general'
      });
    }
  };

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
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="project-link highlight"
              onClick={() => trackProjectClick('live_demo')}
            >
              <Globe size={16} /> View Live
            </a>
          )}
          {project.reportUrl && (
            project.slug ? (
              <Link 
                to={`/projects/${categorySlug}/${project.slug}`} 
                className="project-link"
                onClick={() => trackProjectClick('report_detail')}
              >
                <ExternalLink size={16} /> View Report
              </Link>
            ) : (
              <a 
                href={project.reportUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="project-link"
                onClick={() => trackProjectClick('report_external')}
              >
                <ExternalLink size={16} /> View Report
              </a>
            )
          )}
          {project.codeUrl && (
            <a 
              href={project.codeUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="project-link"
              onClick={() => trackProjectClick('github_code')}
            >
              <Code2 size={16} /> View Code
            </a>
          )}
          {project.publicationUrl && (
            <a 
              href={project.publicationUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="project-link publication"
              onClick={() => trackProjectClick('publication')}
            >
              <ExternalLink size={16} /> View Publication
            </a>
          )}
          {project.videoUrl && (
            <a 
              href={project.videoUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="project-link outline"
              onClick={() => trackProjectClick('video_demo')}
            >
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
  const { category: routeCategory } = useParams();

  const uniqueCategories = [...new Set(projects.map(p => p.category).filter(Boolean))];

  useEffect(() => {
    if (routeCategory) {
      const match = uniqueCategories.find(c => 
        c.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === routeCategory
      );
      if (match) setActiveCategory(match);
    } else {
      setActiveCategory('All');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeCategory]);

  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (category === 'All') {
      navigate('/projects', { replace: true });
    } else {
      const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      navigate(`/projects/${slug}`, { replace: true });
    }
  };

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
              onClick={() => handleCategoryClick(category)}
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

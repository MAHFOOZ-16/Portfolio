import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, FileText, Share2, Info, ChevronRight, LayoutGrid } from 'lucide-react';
import portfolioData from '../../data/portfolio_content.json';
import './ProjectDetail.css';

const ProjectDetail = () => {
    const { category, slug } = useParams();
    const [project, setProject] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Find the project based on the slug
        const foundProject = portfolioData.projects.find(p => p.slug === slug);
        setProject(foundProject);
        
        // Window scroll to top on enter
        window.scrollTo(0, 0);
        
        // Add a slight delay for smooth entry
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, [slug]);

    if (!project) {
        return (
            <div className="not-found-container">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="not-found-content">
                    <h1>Project Not Found</h1>
                    <p>The "classified" report you are looking for does not exist or has been moved.</p>
                    <Link to="/" className="back-home-btn">
                        <ArrowLeft size={18} /> Back to Portfolio
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={`project-detail-page ${isLoaded ? 'loaded' : ''}`}>
            {/* Background Elements */}
            <div className="detail-bg-blobs">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>

            <main className="detail-container">
                {/* Header / Breadcrumbs */}
                <nav className="detail-nav">
                    <Link to="/" className="nav-back-link">
                        <ArrowLeft size={18} /> Back to Portfolio
                    </Link>
                    <div className="breadcrumbs">
                        <span>Projects</span>
                        <ChevronRight size={14} />
                        <span className="breadcrumb-category">{project.category || 'General'}</span>
                        <ChevronRight size={14} />
                        <span className="current-page">{project.title}</span>
                    </div>
                </nav>

                <div className="detail-grid">
                    {/* Sidebar / Info */}
                    <aside className="detail-sidebar">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="sidebar-card"
                        >
                            <div className="project-type-tag">
                                <FileText size={14} /> Official Report
                            </div>
                            <h1 className="detail-title">{project.title}</h1>
                            
                            <div className="project-meta-pills">
                                {project.period && <span className="meta-pill">{project.period}</span>}
                                {project.tech && project.tech.split(',').map((t, idx) => (
                                    <span key={idx} className="meta-pill tech">{t.trim()}</span>
                                ))}
                            </div>

                            <div className="project-summary">
                                <h3><Info size={16} /> Executive Summary</h3>
                                <p>{project.description || "Detailed analysis and research findings for the specified project domain."}</p>
                            </div>

                            <div className="action-buttons">
                                {project.reportUrl && (
                                    <a href={project.reportUrl} download className="download-btn">
                                        <Download size={18} /> Download Report
                                    </a>
                                )}
                                <button className="share-btn" onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert("Link copied to clipboard!");
                                }}>
                                    <Share2 size={18} /> Share Case Study
                                </button>
                            </div>
                        </motion.div>

                        {/* Additional Meta (Optional) */}
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="sidebar-card small"
                        >
                            <h3>Classified Domain</h3>
                            <p className="domain-url">ahmedmahfooz.com/projects/{category}/{slug}</p>
                        </motion.div>
                    </aside>

                    {/* Viewer Section */}
                    <section className="detail-viewer-section">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="viewer-container"
                        >
                            <div className="viewer-header">
                                <LayoutGrid size={16} /> Document Viewer
                            </div>
                            
                            <div className="pdf-wrapper">
                                {project.reportUrl ? (
                                    project.reportUrl.endsWith('.pdf') ? (
                                        <iframe 
                                            src={`${project.reportUrl}#toolbar=0&navpanes=0`} 
                                            title={project.title}
                                            className="pdf-iframe"
                                        />
                                    ) : (
                                        <div className="no-viewer" style={{ textAlign: 'center', padding: '2rem' }}>
                                            <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.7 }} />
                                            <p style={{ marginBottom: '1.5rem' }}>This document requires a dedicated spreadsheet application to view.</p>
                                            <a href={project.reportUrl} download className="download-btn" style={{ width: 'fit-content', margin: '0 auto' }}>
                                                <Download size={18} /> Download Spreadsheet
                                            </a>
                                        </div>
                                    )
                                ) : (
                                    <div className="no-viewer">
                                        <FileText size={48} />
                                        <p>No preview available for this project.</p>
                                    </div>
                                )}
                            </div>
                            
                            <p className="viewer-footer">
                                Restricted Access | Prepared by {portfolioData.personal.name}
                            </p>
                        </motion.div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default ProjectDetail;

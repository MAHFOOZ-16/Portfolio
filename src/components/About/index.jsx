import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Shield, Target, Code, Download, GraduationCap } from 'lucide-react';
import portfolioData from '../../data/portfolio_content.json';
import './About.css';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { personal, education, skills } = portfolioData;

  const highlights = [
    {
      icon: <Target className="highlight-icon" />,
      title: 'Problem Solver',
      description: 'Advanced optimization & AI research',
      color: 'primary'
    },
    {
      icon: <Shield className="highlight-icon" />,
      title: 'Security Expert',
      description: 'IoT Security & Penetration Testing',
      color: 'accent'
    },
    {
      icon: <Code className="highlight-icon" />,
      title: 'Software Engineer',
      description: 'Full-Stack Web & API Architect',
      color: 'warning'
    },
    {
      icon: <GraduationCap className="highlight-icon" />,
      title: 'Education',
      description: (
        <>
          M.Sc. CS Graduate • BTH Sweden<br/>
          B.Tech. CSE Graduate • JNTUH India
        </>
      ),
      color: 'danger'
    }
  ];

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <motion.div
          ref={ref}
          className="about-grid"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Terminal Side */}
          <motion.div
            className="terminal-wrapper"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="terminal-window">
              <div className="terminal-header">
                <span className="terminal-dot red"></span>
                <span className="terminal-dot yellow"></span>
                <span className="terminal-dot green"></span>
                <span className="terminal-title">~/about-me</span>
              </div>
              <div className="terminal-body">
                <span className="terminal-line">
                  <span className="terminal-prompt">$ </span>
                  <span className="terminal-command">cat profile.txt</span>
                </span>
                <br /><br />
                <span className="output-section">
                  <span className="output-key">Name:</span> {personal.name}<br />
                  <span className="output-key">Role:</span> AI & Security Engineer<br />
                  <span className="output-key">Education:</span> M.Sc. CS & B.Tech. CSE<br />
                  <span className="output-key">University:</span> BTH Sweden & JNTUH India<br />
                  <span className="output-key">Core Skills:</span> {skills.languages.slice(0, 6).join(', ')}<br />
                </span>
                <br />
                <span className="terminal-line">
                  <span className="terminal-prompt">$ </span>
                  <span className="terminal-command">cat quote.txt</span>
                </span>
                <br /><br />
                <span className="terminal-output text-gray-400">
                  "Security is a process, not a product. <br/>
                   AI optimizes the process."
                </span>
              </div>
            </div>

            <div className="exp-badge-wrapper">
              <motion.div
                className="exp-badge"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.6 }}
              >
                <span className="exp-number">4+</span>
                <span className="exp-label">Industry<br />Internships & Theses</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            className="about-content"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="section-header">
              <span className="section-tag">
                <Shield size={18} />
                About Me
              </span>
              <h2 className="section-title">
                <span className="text-highlight">AI Researcher &<br />Security Engineer</span>
              </h2>
            </div>

            <motion.div
              className="bio-floating-card"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="bio-text">
                I am {personal.name}, currently pursuing my Master's at Blekinge Institute of Technology, Sweden. My expertise bridges the gap between Advanced Artificial Intelligence models and resilient Cyber Security infrastructures. Having worked with organizations like Volvo CE and PwC, I develop solutions that are not only highly intelligent but verifiably secure.
              </p>
            </motion.div>

            {/* Highlights Grid */}
            <div className="highlights-grid">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.title}
                  className={`highlight-card highlight-${item.color}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="highlight-icon-wrapper">
                    {item.icon}
                  </div>
                  <div className="highlight-text">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="about-resume-container">
              <motion.a
                href="/resume.pdf"
                download="Ahmed_Mahfooz_Ali_Khan_Resume.pdf"
                className="about-resume-btn"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => window.gtag && window.gtag('event', 'resume_click', { 'location': 'about' })}
              >
                <Download size={18} /> Download Resume
              </motion.a>
            </div>
            
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

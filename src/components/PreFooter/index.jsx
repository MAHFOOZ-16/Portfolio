import React from 'react';
import { motion } from 'framer-motion';
import portfolioData from '../../data/portfolio_content.json';
import LetsConnectCanvas from './LetsConnectCanvas';
import './PreFooter.css';

export default function PreFooter() {
  const { personal } = portfolioData;


  return (
    <section className="prefooter-section" style={{ padding: 0 }}>
      {/* Cool animated Let's Connect Canvas replaces the plain text marquee */}
      <LetsConnectCanvas />


      <div className="prefooter-cta">
        <motion.a 
          href={`mailto:${personal.email}`}
          className="connect-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.gtag && window.gtag('event', 'social_click', { 'platform': 'email', 'location': 'prefooter' })}
        >
           Send a Message
        </motion.a>
      </div>
    </section>
  );
}

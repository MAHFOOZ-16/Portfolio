import React from "react";
import { Github, Linkedin, Phone } from "lucide-react";
import portfolioData from "../../data/portfolio_content.json";
import "./Footer.css";

const Footer = () => {
  const { personal } = portfolioData;

  const socials = [
    {
      name: "GitHub",
      icon: <Github size={20} />,
      link: personal.github,
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={20} />,
      link: personal.linkedin,
    },
    {
      name: "Phone",
      icon: <Phone size={20} />,
      link: `tel:${personal.phone.replace(/\s+/g, '')}`,
    },
  ];

  return (
    <footer className="footer-section">
      <div className="footer-container">
        <p className="footer-copyright">
          &copy; {new Date().getFullYear()} {personal.name}. All rights reserved.
        </p>

        <ul className="footer-socials">
          {socials.map((social) => (
            <li key={social.name} className="social-item">
              <a 
                href={social.link} 
                target="_blank" 
                rel="noreferrer noopener"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;

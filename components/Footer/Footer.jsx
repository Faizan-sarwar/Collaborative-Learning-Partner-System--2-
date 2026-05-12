import React from 'react';
import { motion } from 'framer-motion';
import styles from './Footer.module.css';
import { useSettings } from '../../src/context/SettingsContext';
import { Link } from 'react-router-dom';
import {
  staggerContainer,
  fadeUpItem,
  viewportRise,
  springs,
} from '../../src/motion/motion';

const Footer = () => {
  const { settings } = useSettings();

  const quickLinks = [
    { name: 'Home', to: '/' },
    { name: 'Features', to: '/#features' },
    { name: 'FAQ', to: '/help' }
  ];

  const helpLinks = [
    { name: 'Help Center', to: '/help' },
    { name: 'Contact Us', to: '/contact' },
    { name: 'FAQs', to: '/help' },
    { name: 'Tutorials', to: '/help' }
  ];

  const companyLinks = [
    { name: 'About Us', to: '/about' },
    { name: 'Careers', to: '/' },
    { name: 'Blog', to: '/' },
    { name: 'Press', to: '/' }
  ];

  const socialLinks = [
    {
      name: 'Twitter',
      href: 'https://twitter.com',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M23 3C22.0424 3.67548 20.9821 4.19211 19.86 4.53C19.2577 3.83751 18.4573 3.34669 17.567 3.12393C16.6767 2.90116 15.7395 2.9572 14.8821 3.28445C14.0247 3.61171 13.2884 4.1944 12.773 4.95372C12.2575 5.71303 11.9877 6.61234 12 7.53V8.53C10.2426 8.57557 8.50127 8.18581 6.93101 7.39545C5.36074 6.60508 4.01032 5.43864 3 4C3 4 -1 13 8 17C5.94053 18.398 3.48716 19.0989 1 19C10 24 21 19 21 7.5C20.9991 7.22145 20.9723 6.94359 20.92 6.67C21.9406 5.66349 22.6608 4.39271 23 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
          <circle cx="18" cy="6" r="1" fill="currentColor" />
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="2" y="9" width="4" height="12" stroke="currentColor" strokeWidth="2" />
          <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    },
    {
      name: 'GitHub',
      href: 'https://github.com',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M9 19C4 20.5 4 16.5 2 16M16 22V18.13C16.0375 17.6532 15.9731 17.1738 15.811 16.7238C15.6489 16.2738 15.3929 15.8634 15.06 15.52C18.2 15.17 21.5 13.98 21.5 8.52C21.4997 7.12383 20.9627 5.7812 20 4.77C20.4559 3.54851 20.4236 2.19835 19.91 1C19.91 1 18.73 0.650001 16 2.48C13.708 1.85882 11.292 1.85882 9 2.48C6.27 0.650001 5.09 1 5.09 1C4.57638 2.19835 4.54414 3.54851 5 4.77C4.03013 5.7887 3.49252 7.14346 3.5 8.55C3.5 13.97 6.8 15.16 9.94 15.55C9.611 15.89 9.35726 16.2954 9.19531 16.7399C9.03335 17.1844 8.96681 17.6581 9 18.13V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  ];

  // Renders one of the link columns with staggered children
  const LinksColumn = ({ title, links }) => (
    <motion.div className={styles.linksColumn} variants={fadeUpItem}>
      <h4 className={styles.columnTitle}>{title}</h4>
      <motion.ul
        className={styles.linksList}
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        {links.map((link, i) => (
          <motion.li key={i} variants={fadeUpItem}>
            <Link to={link.to} className={styles.link}>{link.name}</Link>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );

  return (
    <motion.footer
      className={styles.footer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      variants={viewportRise}
    >
      <div className={styles.container}>
        <motion.div
          className={styles.grid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Brand */}
          <motion.div className={styles.brand} variants={fadeUpItem}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#footerGrad)" />
                  <path d="M2 17L12 22L22 17" stroke="url(#footerGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12L12 17L22 12" stroke="url(#footerGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id="footerGrad" x1="2" y1="2" x2="22" y2="22">
                      <stop stopColor="#3b82f6" />
                      <stop offset="1" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className={styles.logoText}>{settings?.platformName || 'Loading...'}</span>
            </div>
            <p className={styles.brandDescription}>
              Empowering students worldwide to achieve academic excellence through collaborative learning and intelligent study tools.
            </p>
            <motion.div
              className={styles.socialLinks}
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={link.name}
                  variants={fadeUpItem}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  transition={springs.snappy}
                >
                  {link.icon}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          <LinksColumn title="Quick Links" links={quickLinks} />
          <LinksColumn title="Help" links={helpLinks} />
          <LinksColumn title="Company" links={companyLinks} />
        </motion.div>

        <motion.div className={styles.bottom} variants={fadeUpItem}>
          <div className={styles.divider}></div>
          <div className={styles.bottomContent}>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} {settings?.platformName || 'Loading...'}. All rights reserved.
            </p>
            <div className={styles.legalLinks}>
              <Link to="/privacy" className={styles.legalLink}>Privacy Policy</Link>
              <span className={styles.dot}>•</span>
              <Link to="/terms" className={styles.legalLink}>Terms of Service</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
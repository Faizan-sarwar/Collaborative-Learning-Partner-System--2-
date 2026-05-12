import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './Navbar.module.css';
import { useSettings } from '../../src/context/SettingsContext';
import {
  staggerContainer,
  fadeUpItem,
  springs,
} from '../../src/motion/motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useSettings();
  const location = useLocation();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide navbar when scrolling down past 50px
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      setScrolled(currentScrollY > 20);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <motion.nav
      className={styles.navWrap}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: hidden ? -100 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ ...springs.soft, delay: 0.1 }}
    >
      <motion.div
        className={`${styles.pill} ${scrolled ? styles.scrolled : ''}`}
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {/* Logo */}
        <motion.div variants={fadeUpItem} className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#grad1)" />
              <path d="M2 17L12 22L22 17" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="grad1" x1="2" y1="2" x2="22" y2="22">
                  <stop stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#8b7cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className={styles.logoText}>{settings?.platformName || 'AcademyNc'}</span>
        </motion.div>

        {/* Desktop links */}
        <motion.ul
          variants={fadeUpItem}
          className={`${styles.navLinks} ${mobileMenuOpen ? styles.mobileOpen : ''}`}
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {/* Active background pill */}
                  {isActive && (
                    <motion.span
                      layoutId="activePill"
                      className={styles.activePill}
                      transition={springs.soft}
                    />
                  )}
                  <span className={styles.linkLabel}>{link.name}</span>
                </Link>
              </li>
            );
          })}

          {/* Mobile-only auth buttons inside menu */}
          <li className={styles.mobileOnlyActions}>
            <Link to="/login" className={styles.loginLink} onClick={() => setMobileMenuOpen(false)}>
              Log in
            </Link>
          </li>
        </motion.ul>

        {/* Divider + auth buttons (desktop only) */}
        <motion.div variants={fadeUpItem} className={styles.actions}>
          <span className={styles.divider} aria-hidden />
          <Link to="/login" className={styles.loginLink}>Log in</Link>
        </motion.div>

        {/* Mobile hamburger */}
        <motion.button
          className={styles.mobileToggle}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle menu"
        >
          <motion.span animate={mobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} transition={springs.snappy} />
          <motion.span animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }} transition={springs.snappy} />
          <motion.span animate={mobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} transition={springs.snappy} />
        </motion.button>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
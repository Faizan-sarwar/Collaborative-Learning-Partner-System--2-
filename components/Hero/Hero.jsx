import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './Hero.module.css';
import { Link } from 'react-router-dom';
import { useSettings } from '../../src/context/SettingsContext';
import {
  staggerHero,
  fadeUpItem,
  slideInRight,
  scaleInItem,
  springs,
} from '../../src/motion/motion';
import MotionButton from '../../src/motion/MotionButton';
const Hero = () => {
  const { settings } = useSettings();

  // Scroll-driven parallax for hero artwork
  const { scrollY } = useScroll();
  const yArt = useTransform(scrollY, [0, 600], [0, -60]);
  const yCard1 = useTransform(scrollY, [0, 600], [0, -90]);
  const yCard2 = useTransform(scrollY, [0, 600], [0, -40]);
  const orbScl = useTransform(scrollY, [0, 600], [1, 1.2]);
  const orbOpa = useTransform(scrollY, [0, 600], [1, 0.4]);

  return (
    <section className={styles.hero}>
      {/* Background orb — slow parallax */}
      <motion.div
        className={styles.backgroundGlow}
        aria-hidden
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className={styles.container}>
        <motion.div
          className={styles.content}
          variants={staggerHero}
          initial="hidden"
          animate="show"
        >
          {/* ─── LEFT COLUMN ─────────────────────────────────────────── */}
          <div className={styles.left}>
            <motion.div variants={fadeUpItem} className={styles.badge}>
              <motion.span
                className={styles.badgeDot}
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span>The Future of Learning</span>
            </motion.div>

            <motion.h1 variants={fadeUpItem} className={styles.title}>
              <span className={styles.gradientBlue}>Connect,</span>{' '}
              <span className={styles.gradientPurple}>Learn,</span>{' '}
              <span className={styles.gradientPink}>Excel</span>
              <br />
              <span className={styles.white}>Together</span>
            </motion.h1>

            <motion.p variants={fadeUpItem} className={styles.description}>
              Join with students on {settings?.platformName || 'our collaborative platform'}.
              Share knowledge, stay motivated, and achieve your academic goals
              with our intelligent learning system.
            </motion.p>

            <motion.div variants={fadeUpItem} className={styles.ctas}>
              <MotionButton variant="primary" magnetic glow>
                <Link to="/signup" className={styles.ctaLink}>
                  Get Started
                </Link>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </MotionButton>
            </motion.div>
          </div>

          {/* ─── RIGHT COLUMN ────────────────────────────────────────── */}
          <motion.div variants={slideInRight} className={styles.right}>
            <motion.div className={styles.imageWrapper} style={{ y: yArt }}>
              {/* Pulsing glow orb */}
              <motion.div
                className={styles.glowOrb}
                aria-hidden
                style={{ scale: orbScl, opacity: orbOpa }}
              />

              {/* Main image */}
              <motion.div
                className={styles.mainImage}
                whileHover={{ scale: 1.02, rotateY: -2 }}
                transition={springs.snappy}
              >
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                  alt="Students collaborating"
                />
              </motion.div>

              {/* Floating "Next Session" card — top right */}
              <motion.div
                className={styles.floatingCard}
                variants={scaleInItem}
                style={{ y: yCard1 }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{ scale: 1.05, transition: springs.snappy }}
              >
                <div className={styles.cardHeader}>
                  <motion.div
                    className={styles.cardDot}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span>Live Study Session</span>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.avatarGroup}>
                    {[
                      { c: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', l: 'J' },
                      { c: 'linear-gradient(135deg, #ec4899, #8b5cf6)', l: 'M' },
                      { c: 'linear-gradient(135deg, #10b981, #06b6d4)', l: 'S' },
                    ].map((a, i) => (
                      <motion.div
                        key={i}
                        className={styles.avatar}
                        style={{ background: a.c }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ ...springs.bouncy, delay: 0.8 + i * 0.1 }}
                      >
                        {a.l}
                      </motion.div>
                    ))}
                  </div>
                  <span className={styles.cardLabel} />
                </div>
              </motion.div>

              {/* Screenshot card — bottom left */}
              <motion.div
                className={styles.screenshotCard}
                variants={scaleInItem}
                style={{ y: yCard2 }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                whileHover={{ scale: 1.04, transition: springs.snappy }}
              >
                <div className={styles.screenshotHeader}>
                  <div className={styles.windowDots}>
                    <span /><span /><span />
                  </div>
                </div>
                <div className={styles.screenshotContent}>
                  <div className={styles.screenshotSidebar}>
                    <div className={styles.sidebarItem} />
                    <div className={styles.sidebarItem} />
                    <div className={styles.sidebarItem} />
                  </div>
                  <div className={styles.screenshotMain}>
                    {[60, 80, 45, 90, 70].map((h, i) => (
                      <motion.div
                        key={i}
                        className={styles.chartBar}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{
                          ...springs.bouncy,
                          delay: 1.2 + i * 0.08,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
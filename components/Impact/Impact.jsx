import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import styles from './Impact.module.css';
import { staggerContainer, fadeUpItem, viewportRise, springs } from '../../src/motion/motion';

// Counter that animates from 0 to target when scrolled into view
const AnimatedPercent = ({ target }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => `${Math.round(v)}%`);

  useEffect(() => {
    if (inView) {
      const controls = animate(count, target, { duration: 1.8, ease: [0.16, 1, 0.3, 1] });
      return () => controls.stop();
    }
  }, [inView, target, count]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

const Impact = () => {
  const stats = [
    { percentage: 83, description: 'Students improved their grades within the first semester', color: 'blue' },
    { percentage: 76, description: 'Found better focus and reduced procrastination', color: 'purple' },
    { percentage: 92, description: 'Recommend the platform to fellow students', color: 'cyan' },
  ];

  return (
    <section className={styles.impact}>
      <div className={styles.container}>
        <motion.div className={styles.header} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}>
          <motion.span className={styles.badge} variants={fadeUpItem}>Impact</motion.span>
          <motion.h2 className={styles.title} variants={fadeUpItem}>
            Real Results, <span className={styles.gradient}>Real Success</span>
          </motion.h2>
          <motion.p className={styles.subtitle} variants={fadeUpItem}>
            Our platform has helped thousands of students achieve their academic goals
          </motion.p>
        </motion.div>

        <motion.div className={styles.statsGrid} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}>
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className={`${styles.statCard} ${styles[stat.color]}`}
              variants={viewportRise}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={springs.snappy}
            >
              <motion.div className={styles.cardGlow} animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
              <div className={styles.cardContent}>
                <span className={styles.percentage}>
                  <AnimatedPercent target={stat.percentage} />
                </span>
                <p className={styles.description}>{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Impact;
import React from 'react';
import { motion } from 'framer-motion';
import styles from './WhyGroupStudy.module.css';
import { staggerContainer, fadeUpItem, slideInLeft, slideInRight, springs } from '../../src/motion/motion';

const WhyGroupStudy = () => {
  const benefits = [
    { icon: (<svg viewBox="0 0 24 24" fill="none"><path d="M9.663 17H4.929C3.302 17 2 15.698 2 14.071V9.929C2 8.302 3.302 7 4.929 7H9.663" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M14.337 7H19.071C20.698 7 22 8.302 22 9.929V14.071C22 15.698 20.698 17 19.071 17H14.337" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>), title: 'Knowledge Sharing', description: 'Learn from peers' },
    { icon: (<svg viewBox="0 0 24 24" fill="none"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" /><path d="M8 12L10.5 14.5L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>), title: 'Accountability', description: 'Stay on track' },
    { icon: (<svg viewBox="0 0 24 24" fill="none"><path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>), title: 'Diverse Perspectives', description: 'Broaden your view' },
    { icon: (<svg viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>), title: 'Motivation Boost', description: 'Stay energized' },
    { icon: (<svg viewBox="0 0 24 24" fill="none"><path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>), title: 'Better Communication', description: 'Improve skills' },
  ];

  return (
    <section className={styles.whyGroupStudy}>
      <div className={styles.container}>
        <div className={styles.content}>
          <motion.div className={styles.left} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}>
            <motion.span className={styles.badge} variants={fadeUpItem}>Benefits</motion.span>
            <motion.h2 className={styles.title} variants={fadeUpItem}>
              Why <span className={styles.gradient}>Group Study</span> Works
            </motion.h2>
            <div className={styles.benefitsList}>
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  className={styles.benefitItem}
                  variants={fadeUpItem}
                  whileHover={{ x: 8, transition: springs.snappy }}
                >
                  <motion.div className={styles.benefitIcon} whileHover={{ rotate: 10, scale: 1.1 }} transition={springs.bouncy}>
                    {b.icon}
                  </motion.div>
                  <div className={styles.benefitText}>
                    <h4 className={styles.benefitTitle}>{b.title}</h4>
                    <p className={styles.benefitDescription}>{b.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div className={styles.right} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={slideInRight}>
            <motion.div className={styles.glowCard} whileHover={{ scale: 1.03 }} transition={springs.snappy}>
              <motion.div className={styles.cardGlow} animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
              <div className={styles.cardInner}>
                <motion.div className={styles.cardIcon} animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
                <h3 className={styles.cardTitle}>Community Building</h3>
                <p className={styles.cardDescription}>
                  Join a thriving community of learners who support each other.
                  Build lasting connections, share experiences, and grow together
                  in a collaborative environment designed for success.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyGroupStudy;
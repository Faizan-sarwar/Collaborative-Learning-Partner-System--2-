import React from 'react';
import { motion } from 'framer-motion';
import styles from './HowItWorks.module.css';
import { staggerContainer, fadeUpItem, viewportRise, scaleInItem, springs } from '../../src/motion/motion';

const HowItWorks = () => {
  const steps = [
    { number: '01', icon: (<svg viewBox="0 0 24 24" fill="none"><path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>), title: 'Create Your Profile', description: 'Set up your account and tell us about your learning goals' },
    { number: '02', icon: (<svg viewBox="0 0 24 24" fill="none"><path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>), title: 'Get Matched', description: 'Our AI finds the perfect study partners for you' },
    { number: '03', icon: (<svg viewBox="0 0 24 24" fill="none"><path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>), title: 'Join Study Rooms', description: 'Participate in live study sessions with your group' },
    { number: '04', icon: (<svg viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>), title: 'Track & Excel', description: 'Monitor progress and achieve your academic goals' },
  ];

  const featureCards = [
    { icon: (<svg viewBox="0 0 24 24" fill="none"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" /><path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>), title: 'Personalized Learning', description: 'Get customized study plans based on your learning patterns and goals. Our AI adapts to your pace.', color: 'cyan' },
    { icon: (<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" /><path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M3 10H21" stroke="currentColor" strokeWidth="2" /></svg>), title: 'Modern Scheduling Solutions', description: 'Smart calendar integration that syncs across devices. Never miss a study session again.', color: 'purple' },
  ];

  return (
    <section className={styles.howItWorks}>
      <div className={styles.container}>
        <motion.div className={styles.header} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}>
          <motion.span className={styles.badge} variants={fadeUpItem}>Process</motion.span>
          <motion.h2 className={styles.title} variants={fadeUpItem}>
            How It <span className={styles.gradient}>Works</span>
          </motion.h2>
          <motion.p className={styles.subtitle} variants={fadeUpItem}>
            Get started in minutes and transform your learning experience
          </motion.p>
        </motion.div>

        <motion.div className={styles.timeline} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}>
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className={styles.step}
              variants={viewportRise}
              whileHover={{ y: -8 }}
              transition={springs.snappy}
            >
              <motion.div className={styles.stepIcon} whileHover={{ rotate: 8, scale: 1.1 }} transition={springs.bouncy}>
                {step.icon}
              </motion.div>
              <motion.div className={styles.stepNumber} variants={scaleInItem}>{step.number}</motion.div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
              {i < steps.length - 1 && <div className={styles.connector}></div>}
            </motion.div>
          ))}
        </motion.div>

        <motion.div className={styles.featureCards} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}>
          {featureCards.map((card, i) => (
            <motion.div
              key={i}
              className={`${styles.featureCard} ${styles[card.color]}`}
              variants={viewportRise}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={springs.snappy}
            >
              <motion.div className={styles.cardIcon} whileHover={{ rotate: -5, scale: 1.1 }} transition={springs.bouncy}>
                {card.icon}
              </motion.div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDescription}>{card.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
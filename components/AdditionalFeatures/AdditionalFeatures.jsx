import React from 'react';
import { motion } from 'framer-motion';
import styles from './AdditionalFeatures.module.css';
import { staggerContainer, fadeUpItem, scaleInItem, viewportRise, springs } from '../../src/motion/motion';

const AdditionalFeatures = () => {
  const miniFeatures = [
    { icon: '', text: 'Goal Setting' },
    { icon: '', text: 'Analytics Dashboard' },
    { icon: '', text: 'Smart Notifications' },
    { icon: '', text: 'Mobile App' },
    { icon: '', text: 'Gamification' },
    { icon: '', text: 'Resource Library' },
    { icon: '', text: 'Achievements' },
    { icon: '', text: 'Privacy Controls' },
    { icon: '', text: 'Voice Chat' },
    { icon: '', text: 'Note Taking' },
  ];

  return (
    <section className={styles.additionalFeatures}>
      <div className={styles.container}>
        <motion.div
          className={styles.box}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={viewportRise}
        >
          <motion.div
            className={styles.glowBorder}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className={styles.content}>
            <motion.h3 className={styles.title} variants={fadeUpItem}>
              Everything You Need to Succeed
            </motion.h3>
            <motion.div
              className={styles.featuresGrid}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
            >
              {miniFeatures.map((f, i) => (
                <motion.div
                  key={i}
                  className={styles.featureItem}
                  variants={scaleInItem}
                  whileHover={{ y: -4, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={springs.snappy}
                >
                  <motion.span
                    className={styles.icon}
                    whileHover={{ rotate: [0, -15, 15, 0], scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                  >
                    {f.icon}
                  </motion.span>
                  <span className={styles.text}>{f.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AdditionalFeatures;
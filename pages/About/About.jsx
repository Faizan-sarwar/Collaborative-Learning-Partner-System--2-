import React from 'react';
import { motion } from 'framer-motion';
import styles from './About.module.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { useSettings } from '../../src/context/SettingsContext'; //  Added

const About = () => {
  const { settings } = useSettings(); //  Dynamic Settings
  const platformName = settings?.platformName || 'Collaborative Learning Partner System';

  const values = [
    { title: 'Collaborative Learning', description: `We believe the best learning happens together on ${platformName}.` },
    { title: 'Accessibility First', description: `Education should be free. Every feature on ${platformName} is available at no cost.` }
  ];

  return (
    <div className={styles.page}>
      <Navbar />
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <motion.span className={styles.badge}>About {platformName}</motion.span>
          <motion.h1 className={styles.heroTitle}>
            Transforming How Students <span className={styles.gradient}>Learn Together</span>
          </motion.h1>
          <motion.p className={styles.heroSubtitle}>
            {platformName} was born from a simple idea: learning is better when it's shared.
          </motion.p>
        </div>
      </section>

      <section className={styles.missionSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Mission</h2>
          <p className={styles.missionText}>
            We built {platformName} because technology can bridge the gap in finding the right study partners.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;
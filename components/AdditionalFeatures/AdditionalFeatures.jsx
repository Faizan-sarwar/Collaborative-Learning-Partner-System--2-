import React from 'react';
import styles from './AdditionalFeatures.module.css';

const AdditionalFeatures = () => {
  const miniFeatures = [
    { icon: '🎯', text: 'Goal Setting' },
    { icon: '📊', text: 'Analytics Dashboard' },
    { icon: '🔔', text: 'Smart Notifications' },
    { icon: '📱', text: 'Mobile App' },
    { icon: '🎮', text: 'Gamification' },
    { icon: '📚', text: 'Resource Library' },
    { icon: '🏆', text: 'Achievements' },
    { icon: '🔐', text: 'Privacy Controls' },
    { icon: '💬', text: 'Voice Chat' },
    { icon: '📝', text: 'Note Taking' }
  ];

  return (
    <section className={styles.additionalFeatures}>
      <div className={styles.container}>
        <div className={styles.box}>
          <div className={styles.glowBorder}></div>
          <div className={styles.content}>
            <h3 className={styles.title}>Everything You Need to Succeed</h3>
            <div className={styles.featuresGrid}>
              {miniFeatures.map((feature, index) => (
                <div key={index} className={styles.featureItem}>
                  <span className={styles.icon}>{feature.icon}</span>
                  <span className={styles.text}>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdditionalFeatures;

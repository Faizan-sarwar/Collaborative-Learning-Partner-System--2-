import React from 'react';
import styles from './Impact.module.css';

const Impact = () => {
  const stats = [
    {
      percentage: '83%',
      description: 'Students improved their grades within the first semester',
      color: 'blue'
    },
    {
      percentage: '76%',
      description: 'Found better focus and reduced procrastination',
      color: 'purple'
    },
    {
      percentage: '92%',
      description: 'Recommend the platform to fellow students',
      color: 'cyan'
    }
  ];

  return (
    <section className={styles.impact}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>Impact</span>
          <h2 className={styles.title}>Real Results, <span className={styles.gradient}>Real Success</span></h2>
          <p className={styles.subtitle}>Our platform has helped thousands of students achieve their academic goals</p>
        </div>
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={`${styles.statCard} ${styles[stat.color]}`}>
              <div className={styles.cardGlow}></div>
              <div className={styles.cardContent}>
                <span className={styles.percentage}>{stat.percentage}</span>
                <p className={styles.description}>{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Impact;

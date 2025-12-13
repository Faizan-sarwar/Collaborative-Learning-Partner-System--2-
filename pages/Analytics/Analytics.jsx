import React from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './Analytics.module.css';

const Analytics = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout title="Analytics">
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className={styles.header} variants={itemVariants}>
          <h1 className={styles.title}>Learning Analytics</h1>
          <p className={styles.subtitle}>Track your progress and identify areas for improvement</p>
        </motion.div>

        <div className={styles.statsGrid}>
          <motion.div className={styles.statCard} variants={itemVariants}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>0</span>
              <span className={styles.statLabel}>Total Study Hours</span>
            </div>
          </motion.div>

          <motion.div className={styles.statCard} variants={itemVariants}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>0</span>
              <span className={styles.statLabel}>Tasks Completed</span>
            </div>
          </motion.div>

          <motion.div className={styles.statCard} variants={itemVariants}>
            <div className={styles.statIcon}>🎯</div>
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>0%</span>
              <span className={styles.statLabel}>Goals Achieved</span>
            </div>
          </motion.div>

          <motion.div className={styles.statCard} variants={itemVariants}>
            <div className={styles.statIcon}>⚡</div>
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>--</span>
              <span className={styles.statLabel}>Productivity Score</span>
            </div>
          </motion.div>
        </div>

        <div className={styles.chartsGrid}>
          <motion.div className={styles.chartCard} variants={itemVariants}>
            <h2>Weekly Study Time</h2>
            <div className={styles.chartPlaceholder}>
              <div className={styles.barChart}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className={styles.barContainer}>
                    <div className={styles.bar} style={{ height: '20%' }} />
                    <span>{day}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div className={styles.chartCard} variants={itemVariants}>
            <h2>Subject Distribution</h2>
            <div className={styles.chartPlaceholder}>
              <div className={styles.pieChart}>
                <div className={styles.pieCenter}>
                  <span>No Data</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div className={styles.insightsCard} variants={itemVariants}>
          <h2>📈 Insights & Recommendations</h2>
          <div className={styles.insightsList}>
            <div className={styles.insight}>
              <span className={styles.insightIcon}>💡</span>
              <div>
                <strong>Start tracking your study time</strong>
                <p>Use the Study Time tracker to log your sessions and see patterns emerge.</p>
              </div>
            </div>
            <div className={styles.insight}>
              <span className={styles.insightIcon}>🎯</span>
              <div>
                <strong>Set your first goal</strong>
                <p>Define weekly study goals to stay motivated and track progress.</p>
              </div>
            </div>
            <div className={styles.insight}>
              <span className={styles.insightIcon}>👥</span>
              <div>
                <strong>Join a study group</strong>
                <p>Collaborative learning can improve retention by up to 50%.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Analytics;

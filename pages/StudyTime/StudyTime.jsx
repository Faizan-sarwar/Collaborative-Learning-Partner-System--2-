import React from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './StudyTime.module.css';

const StudyTime = () => {
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
    <DashboardLayout title="Study Time">
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className={styles.header} variants={itemVariants}>
          <h1 className={styles.title}>Study Time Tracker</h1>
          <p className={styles.subtitle}>Track your study sessions and improve productivity</p>
        </motion.div>

        <div className={styles.grid}>
          <motion.div className={styles.card} variants={itemVariants}>
            <div className={styles.cardIcon}>⏱️</div>
            <h3>Today's Study Time</h3>
            <p className={styles.bigNumber}>0h 0m</p>
            <span className={styles.label}>Start your first session!</span>
          </motion.div>

          <motion.div className={styles.card} variants={itemVariants}>
            <div className={styles.cardIcon}>📅</div>
            <h3>This Week</h3>
            <p className={styles.bigNumber}>0h 0m</p>
            <span className={styles.label}>Weekly goal: 20 hours</span>
          </motion.div>

          <motion.div className={styles.card} variants={itemVariants}>
            <div className={styles.cardIcon}>🎯</div>
            <h3>Focus Score</h3>
            <p className={styles.bigNumber}>--</p>
            <span className={styles.label}>Complete sessions to see score</span>
          </motion.div>

          <motion.div className={styles.card} variants={itemVariants}>
            <div className={styles.cardIcon}>🔥</div>
            <h3>Current Streak</h3>
            <p className={styles.bigNumber}>0 days</p>
            <span className={styles.label}>Study daily to build streak</span>
          </motion.div>
        </div>

        <motion.div className={styles.timerCard} variants={itemVariants}>
          <h2>Start a Study Session</h2>
          <div className={styles.timer}>
            <span className={styles.timerDisplay}>00:00:00</span>
          </div>
          <div className={styles.timerActions}>
            <button className={styles.startBtn}>Start Session</button>
            <button className={styles.pauseBtn}>Pause</button>
            <button className={styles.stopBtn}>Stop</button>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default StudyTime;

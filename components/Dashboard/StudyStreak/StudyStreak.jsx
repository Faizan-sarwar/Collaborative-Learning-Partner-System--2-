import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './StudyStreak.module.css';

const StudyStreak = () => {
  const [streakData, setStreakData] = useState({
    current: 0,
    longest: 0,
    weeklyProgress: 0,
    last14Days: Array(14).fill(false)
  });

  useEffect(() => {
    const saved = localStorage.getItem('streakData');
    if (saved) {
      setStreakData(JSON.parse(saved));
    }
  }, []);

  const markTodayComplete = () => {
    const today = new Date().toDateString();
    const lastStudyDate = localStorage.getItem('lastStudyDate');
    
    if (lastStudyDate !== today) {
      const newStreak = lastStudyDate === new Date(Date.now() - 86400000).toDateString() 
        ? streakData.current + 1 
        : 1;
      
      const newLongest = Math.max(newStreak, streakData.longest);
      const newLast14Days = [...streakData.last14Days.slice(1), true];
      const completedDays = newLast14Days.filter(Boolean).length;
      const weeklyProgress = Math.round((completedDays / 7) * 100);

      const updated = {
        current: newStreak,
        longest: newLongest,
        weeklyProgress,
        last14Days: newLast14Days
      };

      setStreakData(updated);
      localStorage.setItem('streakData', JSON.stringify(updated));
      localStorage.setItem('lastStudyDate', today);
    }
  };

  const getLast14DaysDates = () => {
    const dates = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.getDate());
    }
    return dates;
  };

  const dates = getLast14DaysDates();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.icon}>🔥</span>
        <div>
          <h3 className={styles.title}>Study Streak Tracker</h3>
          <p className={styles.subtitle}>Track your study consistency</p>
        </div>
        <span className={styles.newBadge}>NEW</span>
      </div>

      <div className={styles.content}>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{streakData.current}</span>
            <span className={styles.statLabel}>Current Streak</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{streakData.longest}</span>
            <span className={styles.statLabel}>Longest Streak</span>
          </div>
        </div>

        <div className={styles.weeklyProgress}>
          <div className={styles.progressHeader}>
            <span>Weekly Goal Progress</span>
            <span>{streakData.weeklyProgress}%</span>
          </div>
          <div className={styles.progressBar}>
            <motion.div 
              className={styles.progressFill}
              initial={{ width: 0 }}
              animate={{ width: `${streakData.weeklyProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className={styles.calendar}>
          <span className={styles.calendarLabel}>Last 14 Days</span>
          <div className={styles.daysGrid}>
            {dates.map((date, index) => (
              <motion.div
                key={index}
                className={`${styles.dayCell} ${streakData.last14Days[index] ? styles.completed : ''}`}
                whileHover={{ scale: 1.1 }}
                title={`Day ${date}`}
              >
                {date}
              </motion.div>
            ))}
          </div>
        </div>

        <button className={styles.markBtn} onClick={markTodayComplete}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Mark Today Complete
        </button>
      </div>
    </div>
  );
};

export default StudyStreak;

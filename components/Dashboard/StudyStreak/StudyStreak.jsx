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

  const [isTodayComplete, setIsTodayComplete] = useState(false);

  // 🔹 Load Data on Mount (Fetch from DB + LocalStorage Fallback)
  useEffect(() => {
    const fetchData = async () => {
        // 1. Try fetching from DB first
        try {
            const token = sessionStorage.getItem('token') || localStorage.getItem('token');
            if (token) {
                const res = await fetch('http://localhost:5000/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                
                if (data.success && data.user) {
                    const dbStreak = {
                        current: data.user.streak || 0,
                        longest: data.user.longestStreak || 0,
                        weeklyProgress: 0, // Recalculate below
                        last14Days: data.user.streakHistory && data.user.streakHistory.length === 14 
                                    ? data.user.streakHistory 
                                    : Array(14).fill(false)
                    };

                    // Calculate progress
                    const last7Days = dbStreak.last14Days.slice(7);
                    const completedDays = last7Days.filter(Boolean).length;
                    dbStreak.weeklyProgress = Math.round((completedDays / 7) * 100);

                    setStreakData(dbStreak);
                    
                    // Check if today is done based on DB
                    const todayString = new Date().toDateString();
                    if (data.user.lastStudyDate === todayString) {
                        setIsTodayComplete(true);
                    }
                    
                    // Sync local storage as backup
                    localStorage.setItem('streakData', JSON.stringify(dbStreak));
                    localStorage.setItem('lastStudyDate', data.user.lastStudyDate || '');
                    return; // Exit if DB fetch successful
                }
            }
        } catch (err) {
            console.error("Failed to fetch streak from DB, falling back to local", err);
        }

        // 2. Fallback to Local Storage if DB fails or no token
        const saved = localStorage.getItem('streakData');
        const lastDate = localStorage.getItem('lastStudyDate');
        const today = new Date().toDateString();

        if (saved) {
            setStreakData(JSON.parse(saved));
        }

        if (lastDate === today) {
            setIsTodayComplete(true);
        }
    };

    fetchData();
  }, []);

  // 🔹 Handle Marking Complete
  const markTodayComplete = async () => {
    if (isTodayComplete) return;

    const today = new Date();
    const todayString = today.toDateString();

    // Calculate Yesterday correctly
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();

    const lastStudyDate = localStorage.getItem('lastStudyDate');

    let newStreak = 1;

    // Logic: If last study date was yesterday, increment. If it was today (redundant check), keep same. Else reset to 1.
    if (lastStudyDate === yesterdayString) {
      newStreak = streakData.current + 1;
    } else if (lastStudyDate === todayString) {
      newStreak = streakData.current; 
    }

    const newLongest = Math.max(newStreak, streakData.longest);

    // Update the visual grid (Shift left, add true at the end)
    const newLast14Days = [...streakData.last14Days.slice(1), true];

    // Calculate weekly progress based on last 7 entries of the grid
    const last7Days = newLast14Days.slice(7); 
    const completedDays = last7Days.filter(Boolean).length;
    const weeklyProgress = Math.round((completedDays / 7) * 100);

    const updated = {
      current: newStreak,
      longest: newLongest,
      weeklyProgress,
      last14Days: newLast14Days,
      lastDate: todayString // Include date for DB update
    };

    // Optimistic Update
    setStreakData(updated);
    setIsTodayComplete(true);
    localStorage.setItem('streakData', JSON.stringify(updated));
    localStorage.setItem('lastStudyDate', todayString);

    // 🟢 SAVE TO DB
    try {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        if (token) {
            await fetch('http://localhost:5000/api/auth/update-stats', {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ streakData: updated })
            });
        }
    } catch (err) {
        console.error("Failed to save streak to DB", err);
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

        <button 
            className={`${styles.markBtn} ${isTodayComplete ? styles.disabled : ''}`} 
            onClick={markTodayComplete}
            disabled={isTodayComplete}
        >
          {isTodayComplete ? (
             <>
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                 <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                 <polyline points="22 4 12 14.01 9 11.01"></polyline>
               </svg>
               Completed for Today
             </>
          ) : (
             <>
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                 <polyline points="20 6 9 17 4 12" />
               </svg>
               Mark Today Complete
             </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StudyStreak;
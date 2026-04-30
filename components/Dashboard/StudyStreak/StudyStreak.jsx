import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, CheckCircle2, CalendarDays } from 'lucide-react';
import styles from './StudyStreak.module.css';

const StudyStreak = () => {
  const [streakData, setStreakData] = useState({
    current: 0,
    longest: 0,
    weeklyProgress: 0,
    last14Days: Array(14).fill(false)
  });

  const [isTodayComplete, setIsTodayComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchStreakData = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`http://${window.location.hostname}:5000/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success && data.user) {
        const history = data.user.streakHistory?.length === 14 
            ? data.user.streakHistory 
            : Array(14).fill(false);
            
        // Calculate weekly progress based on the last 7 days of the history array
        const last7Days = history.slice(7);
        const completedDays = last7Days.filter(Boolean).length;
        const weeklyProgress = Math.round((completedDays / 7) * 100);

        const newStreakData = {
          current: data.user.streak || 0,
          longest: data.user.longestStreak || 0,
          weeklyProgress,
          last14Days: history
        };

        setStreakData(newStreakData);
        
        // Sync to local storage for quick fallback
        localStorage.setItem('streakData', JSON.stringify(newStreakData));
        localStorage.setItem('lastStudyDate', data.user.lastStudyDate || '');

        const todayString = new Date().toDateString();
        if (data.user.lastStudyDate === todayString) {
          setIsTodayComplete(true);
        }
      }
    } catch (err) {
      console.error("Failed to fetch streak from DB", err);
      // Fallback
      const saved = localStorage.getItem('streakData');
      if (saved) setStreakData(JSON.parse(saved));
      if (localStorage.getItem('lastStudyDate') === new Date().toDateString()) setIsTodayComplete(true);
    }
  };

  useEffect(() => {
    fetchStreakData();
    window.addEventListener('userUpdated', fetchStreakData);
    return () => window.removeEventListener('userUpdated', fetchStreakData);
  }, []);

  const markTodayComplete = async () => {
    if (isTodayComplete || loading) return;
    setLoading(true);

    const today = new Date();
    const todayString = today.toDateString();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();

    const lastStudyDate = localStorage.getItem('lastStudyDate');

    let newStreak = 1;
    if (lastStudyDate === yesterdayString) {
      newStreak = streakData.current + 1;
    } else if (lastStudyDate === todayString) {
      newStreak = streakData.current; 
    }

    const newLongest = Math.max(newStreak, streakData.longest);
    const newLast14Days = [...streakData.last14Days.slice(1), true];
    
    const last7Days = newLast14Days.slice(7); 
    const completedDays = last7Days.filter(Boolean).length;
    const weeklyProgress = Math.round((completedDays / 7) * 100);

    const updated = {
      current: newStreak,
      longest: newLongest,
      weeklyProgress,
      last14Days: newLast14Days,
      lastDate: todayString
    };

    // Optimistic UI Update
    setStreakData(updated);
    setIsTodayComplete(true);
    localStorage.setItem('streakData', JSON.stringify(updated));
    localStorage.setItem('lastStudyDate', todayString);

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        await fetch(`http://${window.location.hostname}:5000/api/auth/update-stats`, {
          method: 'PUT',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ streakData: updated })
        });

        // 🟢 Tell the rest of the dashboard that we updated user stats
        window.dispatchEvent(new Event('userUpdated'));
      }
    } catch (err) {
      console.error("Failed to save streak to DB", err);
    } finally {
      setLoading(false);
    }
  };

  // Generate the dates for the last 14 days grid
  const dates = Array.from({length: 14}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.getDate();
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <div className={styles.iconWrapper}>
            <Flame size={20} className={styles.icon} />
          </div>
          <div>
            <h3 className={styles.title}>Study Streak</h3>
            <p className={styles.subtitle}>Consistency builds mastery</p>
          </div>
        </div>
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
            <span>7-Day Consistency</span>
            <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{streakData.weeklyProgress}%</span>
          </div>
          <div className={styles.progressBar}>
            <motion.div 
              className={styles.progressFill}
              initial={{ width: 0 }}
              animate={{ width: `${streakData.weeklyProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className={styles.calendar}>
          <span className={styles.calendarLabel}>
            <CalendarDays size={14} /> Last 14 Days
          </span>
          <div className={styles.daysGrid}>
            {dates.map((date, index) => (
              <motion.div
                key={index}
                className={`${styles.dayCell} ${streakData.last14Days[index] ? styles.completed : ''}`}
                whileHover={{ scale: 1.05 }}
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
            disabled={isTodayComplete || loading}
        >
          {isTodayComplete ? (
             <>
               <CheckCircle2 size={18} />
               Logged for Today
             </>
          ) : (
             <>
               <Flame size={18} />
               Mark Today Complete
             </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StudyStreak;
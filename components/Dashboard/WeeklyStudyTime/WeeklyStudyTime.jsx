import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './WeeklyStudyTime.module.css';

const WeeklyStudyTime = () => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [showPomodoroModal, setShowPomodoroModal] = useState(false);
  const [logTime, setLogTime] = useState({ hours: '', minutes: '', subject: '' });

  const handleLogTime = () => {
    if (logTime.hours || logTime.minutes) {
      const totalMinutes = (parseInt(logTime.hours) || 0) * 60 + (parseInt(logTime.minutes) || 0);
      const savedTime = parseInt(localStorage.getItem('weeklyStudyTime') || '0');
      localStorage.setItem('weeklyStudyTime', String(savedTime + totalMinutes));
      setLogTime({ hours: '', minutes: '', subject: '' });
      setShowLogModal(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <span className={styles.icon}>📊</span>
          <div>
            <h2 className={styles.title}>Weekly Study Time</h2>
            <p className={styles.subtitle}>Track your study hours and progress</p>
          </div>
        </div>
        <div className={styles.actions}>
          <button className={styles.actionBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
            Goal
          </button>
          <button className={styles.actionBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </button>
          <button className={styles.actionBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
          <button className={styles.logTimeBtn} onClick={() => setShowLogModal(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Log Time
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.journeySection}>
          <h3 className={styles.journeyTitle}>Your weekly study journey</h3>
          
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <h4 className={styles.emptyTitle}>Kick off your weekly progress 🚀</h4>
            <p className={styles.emptyText}>
              Start tracking your progress to see your weekly study trend here.
            </p>
            <ul className={styles.instructions}>
              <li>
                <span className={styles.bullet}>1</span>
                Click "<strong>Log Time</strong>" to add a session manually
              </li>
              <li>
                <span className={styles.bullet}>2</span>
                Or use the <strong>Pomodoro Timer</strong> to track automatically
              </li>
            </ul>
            
            <div className={styles.emptyActions}>
              <button className={styles.logBtn} onClick={() => setShowLogModal(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Log Time
              </button>
              <button className={styles.pomodoroBtn} onClick={() => setShowPomodoroModal(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Open Pomodoro
              </button>
            </div>
            
            <p className={styles.note}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              The Pomodoro timer will automatically log your study time when you select a course
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showLogModal && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLogModal(false)}
          >
            <motion.div 
              className={styles.modal}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Log Study Time</h3>
              <div className={styles.modalInputs}>
                <div className={styles.inputGroup}>
                  <label>Hours</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="24"
                    value={logTime.hours}
                    onChange={(e) => setLogTime({ ...logTime, hours: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Minutes</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="59"
                    value={logTime.minutes}
                    onChange={(e) => setLogTime({ ...logTime, minutes: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label>Subject (optional)</label>
                <input 
                  type="text"
                  value={logTime.subject}
                  onChange={(e) => setLogTime({ ...logTime, subject: e.target.value })}
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div className={styles.modalActions}>
                <button onClick={() => setShowLogModal(false)}>Cancel</button>
                <button className={styles.primaryBtn} onClick={handleLogTime}>Log Time</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showPomodoroModal && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPomodoroModal(false)}
          >
            <motion.div 
              className={styles.modal}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>🍅 Pomodoro Timer</h3>
              <p className={styles.modalText}>
                The Pomodoro Timer helps you focus in 25-minute intervals with 5-minute breaks.
              </p>
              <div className={styles.timerDisplay}>25:00</div>
              <div className={styles.modalActions}>
                <button onClick={() => setShowPomodoroModal(false)}>Close</button>
                <button className={styles.primaryBtn}>Start Timer</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeeklyStudyTime;

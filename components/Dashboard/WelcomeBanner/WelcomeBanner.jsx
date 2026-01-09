import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './WelcomeBanner.module.css';

const WelcomeBanner = () => {
  const [user, setUser] = useState(null);
  const [showLevelTooltip, setShowLevelTooltip] = useState(false);

  // 🟢 Helper to load user
  const loadUser = () => {
      const storedUser = sessionStorage.getItem('user') || localStorage.getItem('user');
      if (storedUser) {
          setUser(JSON.parse(storedUser));
      }
  };

  useEffect(() => {
    // 1. Initial Load
    loadUser();

    // 2. Fetch fresh data to ensure reliability score is synced
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setUser(data.user);
          sessionStorage.setItem('user', JSON.stringify(data.user)); 
        }
      })
      .catch(err => console.error("Banner sync failed", err));
    }

    // 🟢 3. LISTEN FOR UPDATES (XP Page, Gamification Page)
    window.addEventListener('userUpdated', loadUser);
    return () => window.removeEventListener('userUpdated', loadUser);

  }, []);

  const username = user?.fullName || 'Student';
  const reliabilityScore = user?.reliability || 0;
  const currentHours = user?.studyHours || 0;
  const currentLevel = user?.level || 1;

  // 🔹 LEVEL LOGIC & COLORS
  const getLevelInfo = () => {
      if (currentLevel === 1) {
          return {
              bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', // Blue
              shadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
              nextLevel: 2,
              remaining: (5 - currentHours).toFixed(1) // Assuming lvl 2 needs 5h
          };
      }
      if (currentLevel === 2) {
          return {
              bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', // Purple
              shadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
              nextLevel: 3,
              remaining: (15 - currentHours).toFixed(1)
          };
      }
      return {
          bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', // Gold
          shadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
          nextLevel: null,
          remaining: 0
      };
  };

  const levelInfo = getLevelInfo();

  const getBarColor = (score) => {
      if (score >= 80) return '#10b981'; 
      if (score >= 50) return '#f59e0b'; 
      return '#ef4444'; 
  };

  return (
    <motion.div 
      className={styles.banner}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.content}>
        <div className={styles.leftContent}>
          <h1 className={styles.title}>
            Welcome, {username}!
          </h1>
          
          <div 
            className={styles.levelBadge}
            style={{ background: levelInfo.bg, boxShadow: levelInfo.shadow, cursor: 'pointer', position: 'relative' }}
            onMouseEnter={() => setShowLevelTooltip(true)}
            onMouseLeave={() => setShowLevelTooltip(false)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            Level {currentLevel}

            <AnimatePresence>
                {showLevelTooltip && (
                    <motion.div 
                        className={styles.tooltip}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                    >
                        {levelInfo.nextLevel ? (
                            <span>{levelInfo.remaining}h to Level {currentLevel + 1} 🚀</span>
                        ) : (
                            <span>Max Level Reached! 👑</span>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
          </div>

          <p className={styles.subtitle}>
            This week's progress is still in progress. You've got this!
          </p>
          
          <div className={styles.progressSection}>
            <div className={styles.progressBar}>
              <motion.div 
                className={styles.progressFill}
                initial={{ width: 0 }}
                animate={{ width: `${reliabilityScore}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{ backgroundColor: getBarColor(reliabilityScore) }}
              />
            </div>
            <span className={styles.progressText}>{reliabilityScore}% Reliability</span>
          </div>
        </div>

        <div className={styles.rightContent}>
          <div className={styles.planCard}>
            <div className={styles.planIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div className={styles.planInfo}>
              <span className={styles.planLabel}>Plan Type</span>
              <span className={styles.planType}>{user?.plan || 'Pro Trial'}</span>
              <span className={styles.planExpiry}>Expiry: 1/10/2026 (88 days left)</span>
            </div>
            <div className={styles.onlineStatus}>
              <span className={styles.onlineDot}></span>
              Online
            </div>
          </div>
        </div>
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${styles.active}`}>Overview</button>
        <button className={styles.tab}>Study Time</button>
        <button className={styles.tab}>Courses</button>
        <button className={styles.tab}>Social</button>
        <button className={styles.tab}>Analytics</button>
      </div>
    </motion.div>
  );
};

export default WelcomeBanner;
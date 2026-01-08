import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './WelcomeBanner.module.css';

const WelcomeBanner = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. Try Session Storage first (most up-to-date after quiz)
    let storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
        // Fallback to local storage
        storedUser = localStorage.getItem('user');
    }

    const token = sessionStorage.getItem('token') || localStorage.getItem('token');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // 2. Fetch fresh data to ensure reliability score is synced
  if (token) {
      fetch('http://localhost:5000/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setUser(data.user);
          setReliability(data.user.reliability || 0); // Update state from DB
          
          // Update storage silently to sync for next time
          sessionStorage.setItem('user', JSON.stringify(data.user)); 
        }
      })
      .catch(err => console.error("Banner sync failed", err));
    }
  }, []);

  const username = user?.fullName || 'Student';
  
  // 🔹 DYNAMIC RELIABILITY LOGIC
  const reliabilityScore = user?.reliability || 0;
  
  // Determine color based on score
  const getBarColor = (score) => {
      if (score >= 80) return '#10b981'; // Green
      if (score >= 50) return '#f59e0b'; // Orange
      return '#ef4444'; // Red
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
          <div className={styles.levelBadge}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            Level {user?.level || 1}
          </div>
          <p className={styles.subtitle}>
            This week's progress is still in progress. You've got this!
          </p>
          
          <div className={styles.progressSection}>
            <div className={styles.progressBar}>
              {/* 🔹 DYNAMIC WIDTH & COLOR */}
              <motion.div 
                className={styles.progressFill}
                initial={{ width: 0 }}
                animate={{ width: `${reliabilityScore}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{ backgroundColor: getBarColor(reliabilityScore) }}
              />
            </div>
            {/* 🔹 DYNAMIC TEXT */}
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
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Zap, Clock, Flame, ArrowRight, CheckCircle2, TrendingUp, Users } from 'lucide-react';
import styles from './WelcomeBanner.module.css';
import { useNotification } from '../../../src/context/NotificationContext';

const WelcomeBanner = () => {
  const [user, setUser] = useState(null);
  const [showTips, setShowTips] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const loadUser = () => {
    const storedUser = (localStorage.getItem('user') || sessionStorage.getItem('user')) || localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // First-time login floating notification
      if (parsedUser && parsedUser._id) {
        const welcomeKey = `hasSeenWelcome_${parsedUser._id}`;
        if (!localStorage.getItem(welcomeKey)) {
          setTimeout(() => {
            addNotification(`Welcome aboard, ${parsedUser.fullName.split(' ')[0]}! 🎉 Let's get started.`, 'achievement', 0);
          }, 500);
          localStorage.setItem(welcomeKey, 'true');
        }
      }
    }
  };

  useEffect(() => {
    loadUser();

    const token = (localStorage.getItem('token') || sessionStorage.getItem('token')) || localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            setUser(data.user);
            const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
            storage.setItem('user', JSON.stringify(data.user));
          }
        })
        .catch(err => console.error("Banner sync failed", err));
    }

    window.addEventListener('userUpdated', loadUser);
    return () => window.removeEventListener('userUpdated', loadUser);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const username = user?.fullName?.split(' ')[0] || 'Student';
  const reliabilityScore = user?.reliability || 0;
  const currentHours = user?.studyHours || 0;
  const currentLevel = user?.level || 1;
  const currentStreak = user?.streak || 0;

  // 🟢 TRUST TIER HELPER
  const getTrustTier = (score) => {
    if (score >= 90) return { label: 'Elite Scholar', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
    if (score >= 75) return { label: 'Trusted Partner', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' };
    if (score >= 60) return { label: 'Average', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' };
    return { label: 'Needs Improvement', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' };
  };

  const tier = getTrustTier(reliabilityScore);

  return (
    <motion.div
      className={styles.bannerContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 🟢 HERO SECTION */}
      <div className={styles.heroSection}>
        <div className={styles.greeting}>
          <h1 className={styles.title}>Welcome back, {username}! 👋</h1>
          <p className={styles.subtitle}>Here is your learning command center. Let's make today productive.</p>
        </div>
        <div className={styles.heroActions}>
          <button className={styles.primaryBtn} onClick={() => navigate('/study-time')}>
            <Clock size={16} /> Start Focus Session
          </button>
          <button className={styles.secondaryBtn} onClick={() => navigate('/study-matches')}>
            <Users size={16} /> Find Partners
          </button>
        </div>
      </div>

      {/* 🟢 EXECUTIVE STATS GRID */}
      <div className={styles.statsGrid}>
        
        {/* Trust Score Card */}
        <div className={styles.statCard} style={{ borderColor: tier.color, background: `linear-gradient(135deg, var(--bg-tertiary) 0%, ${tier.bg} 100%)` }}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}><Shield size={16} color={tier.color}/> Trust Score</span>
            <span className={styles.tierBadge} style={{ color: tier.color, backgroundColor: tier.bg }}>{tier.label}</span>
          </div>
          <div className={styles.statBody}>
            <span className={styles.statValue} style={{ color: tier.color }}>{reliabilityScore}%</span>
            <button className={styles.insightBtn} onClick={() => setShowTips(!showTips)}>
              How to improve <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Level & XP Card */}
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}><Zap size={16} color="#8b5cf6"/> Current Level</span>
          </div>
          <div className={styles.statBody}>
            <span className={styles.statValue}>Lvl {currentLevel}</span>
            <span className={styles.statSubtext}>{user?.xp || 0} Total XP</span>
          </div>
        </div>

        {/* Study Time Card */}
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}><Clock size={16} color="#3b82f6"/> Lifetime Focus</span>
          </div>
          <div className={styles.statBody}>
            <span className={styles.statValue}>{currentHours.toFixed(1)}h</span>
            <span className={styles.statSubtext}>Hours Logged</span>
          </div>
        </div>

        {/* Streak Card */}
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}><Flame size={16} color="#f59e0b"/> Active Streak</span>
          </div>
          <div className={styles.statBody}>
            <span className={styles.statValue}>{currentStreak} <span style={{fontSize:'1rem', color:'var(--text-muted)'}}>Days</span></span>
            <span className={styles.statSubtext}>Log in daily to grow!</span>
          </div>
        </div>

      </div>

      {/* 🟢 HOW TO IMPROVE TRUST SCORE (Collapsible or always visible based on logic) */}
      <AnimatePresence>
        {showTips && (
          <motion.div 
            className={styles.improvementSection}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className={styles.improvementHeader}>
              <h3>Path to Elite Scholar</h3>
              <p>Your Trust Score determines where you rank in Study Matches. Here is how the algorithm works:</p>
            </div>
            
            <div className={styles.tipsGrid}>
              <div className={styles.tipCard}>
                <div className={styles.tipIcon} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}><TrendingUp size={20}/></div>
                <div>
                  <h4>Maintain Streaks</h4>
                  <p>Hitting a 7-day login streak automatically awards a <strong>+2% Reliability Bonus</strong>.</p>
                </div>
              </div>
              
              <div className={styles.tipCard}>
                <div className={styles.tipIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><Users size={20}/></div>
                <div>
                  <h4>Connect & Network</h4>
                  <p>Successfully accepting a study request gives both users a <strong>+0.5% Reliability Boost</strong>.</p>
                </div>
              </div>

              <div className={styles.tipCard}>
                <div className={styles.tipIcon} style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}><CheckCircle2 size={20}/></div>
                <div>
                  <h4>Complete Assessments</h4>
                  <p>Taking skill quizzes accurately places you in the matchmaking algorithm.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🟢 NAVIGATION TABS */}
      <div className={styles.tabs}>
        <Link className={`${styles.tab} ${styles.active}`} to="/dashboard">Overview</Link>
        <Link className={styles.tab} to="/study-time">Study Time</Link>
        <Link className={styles.tab} to="/study-matches">Matches</Link>
        <Link className={styles.tab} to="/analytics">Analytics</Link>
        <Link className={styles.tab} to="/gamification">Avatar & Rewards</Link>
      </div>

    </motion.div>
  );
};

export default WelcomeBanner;
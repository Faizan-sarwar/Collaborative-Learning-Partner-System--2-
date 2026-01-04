import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './Gamification.module.css';

// Import avatars
import maleLevel1 from '../../src/assets/gamification/male-level-1.png';
import maleLevel2 from '../../src/assets/gamification/male-level-2.png';
import maleLevel3 from '../../src/assets/gamification/male-level-3.png';
import maleLevel4 from '../../src/assets/gamification/male-level-4.png';
import maleLevel5 from '../../src/assets/gamification/male-level-5.png';
import maleLevel6 from '../../src/assets/gamification/male-level-6.png';
import maleLevel7 from '../../src/assets/gamification/male-level-7.png';

import femaleLevel1 from '../../src/assets/gamification/female-level-1.png';
import femaleLevel2 from '../../src/assets/gamification/female-level-2.png';
import femaleLevel3 from '../../src/assets/gamification/female-level-3.png';
import femaleLevel4 from '../../src/assets/gamification/female-level-4.png';
import femaleLevel5 from '../../src/assets/gamification/female-level-5.png';
import femaleLevel6 from '../../src/assets/gamification/female-level-6.png';
import femaleLevel7 from '../../src/assets/gamification/female-level-7.png';

// Gender-separated avatar catalog
const maleAvatars = { 1: maleLevel1, 2: maleLevel2, 3: maleLevel3, 4: maleLevel4, 5: maleLevel5, 6: maleLevel6, 7: maleLevel7 };
const femaleAvatars = { 1: femaleLevel1, 2: femaleLevel2, 3: femaleLevel3, 4: femaleLevel4, 5: femaleLevel5, 6: femaleLevel6, 7: femaleLevel7 };
const avatars = { male: maleAvatars, female: femaleAvatars };

const levels = [
  { level: 1, name: 'Newcomer', description: 'Taking the first step into learning', hoursRequired: 0, xpRequired: 0, tier: 'basic' },
  { level: 2, name: 'Novice Learner', description: 'Getting familiar with the basics', hoursRequired: 5, xpRequired: 200, tier: 'basic' },
  { level: 3, name: 'Dedicated Student', description: 'Building consistent study habits', hoursRequired: 15, xpRequired: 500, tier: 'intermediate' },
  { level: 4, name: 'Rising Scholar', description: 'Knowledge is becoming your strength', hoursRequired: 30, xpRequired: 1000, tier: 'intermediate' },
  { level: 5, name: 'Expert Learner', description: 'Mastering the art of learning', hoursRequired: 60, xpRequired: 2000, tier: 'advanced' },
  { level: 6, name: 'Knowledge Master', description: 'A beacon of wisdom and dedication', hoursRequired: 100, xpRequired: 4000, tier: 'master' },
  { level: 7, name: 'Legendary Scholar', description: 'The pinnacle of academic excellence', hoursRequired: 200, xpRequired: 8000, tier: 'legendary' },
];

const achievements = [
  { id: 1, name: 'First Step', icon: '🎯', requirement: 'Complete your first study session (1 hour)' },
  { id: 2, name: 'Early Bird', icon: '🌅', requirement: 'Study before 8 AM' },
  { id: 3, name: 'Streak Master', icon: '🔥', requirement: 'Maintain a 7-day study streak' },
  { id: 4, name: 'Quiz Champion', icon: '🧠', requirement: 'Score 100% on any quiz' },
  { id: 5, name: 'Social Learner', icon: '👥', requirement: 'Join 3 study groups' },
  { id: 6, name: 'Knowledge Sharer', icon: '📚', requirement: 'Help 5 students' },
  { id: 7, name: 'Legend', icon: '👑', requirement: 'Reach Level 7' },
];

const Gamification = () => {
  const [loading, setLoading] = useState(true);
  
  // State for user data
  const [gender, setGender] = useState('male');
  const [useAvatar, setUseAvatar] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);
  const [userId, setUserId] = useState(null);
  
  const [userStats, setUserStats] = useState({
    studyHours: 0,
    xp: 0,
    currentLevel: 1,
    streak: 0,
  });
  
  const [earnedAchievements, setEarnedAchievements] = useState([]);

  // 🔹 FETCH REAL USER DATA
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        if (!token) return;

        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.success) {
          const user = data.user;
          setUserId(user._id);
          
          setUserStats({
            studyHours: user.studyHours || 0,
            xp: user.xp || 0,
            currentLevel: user.level || 1,
            streak: user.streak || 0,
          });

          if (user.gender) setGender(user.gender.toLowerCase());
          if (user._id) setProfilePicture(`http://localhost:5000/api/auth/student/${user._id}/picture`);
          setEarnedAchievements(user.achievements || []);
          
          // Set initial toggle state from user settings
          if (user.settings?.showAvatar !== undefined) {
            setUseAvatar(user.settings.showAvatar);
          }
        }
      } catch (err) {
        console.error("Failed to fetch gamification data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // 🔹 TOGGLE LOGIC (Updates Backend & Local Storage)
  const handleToggleAvatar = async (showAvatar) => {
    setUseAvatar(showAvatar); // Optimistic UI update

    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      
      // Update Backend
      await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' // Important for JSON body
        },
        // We are sending a partial update for settings
        body: JSON.stringify({
          settings: { showAvatar } 
        })
      });

      // Update Local Storage so Header updates immediately
      const storedUser = JSON.parse(sessionStorage.getItem('user'));
      if (storedUser) {
        // Ensure settings object exists
        if (!storedUser.settings) storedUser.settings = {};
        
        storedUser.settings.showAvatar = showAvatar;
        sessionStorage.setItem('user', JSON.stringify(storedUser));
        
        // Dispatch Custom Event for Header to listen
        window.dispatchEvent(new Event('userUpdated'));
      }

    } catch (err) {
      console.error("Failed to update avatar preference", err);
    }
  };

  // Helpers
  const getCurrentLevelData = () => levels.find((l) => l.level === userStats.currentLevel) || levels[0];
  const getNextLevelData = () => levels.find((l) => l.level === userStats.currentLevel + 1);

  const calculateXpProgress = () => {
    const currentLevel = getCurrentLevelData();
    const nextLevel = getNextLevelData();
    if (!nextLevel) return 100;
    const xpInCurrentLevel = userStats.xp - currentLevel.xpRequired;
    const xpNeededForNext = nextLevel.xpRequired - currentLevel.xpRequired;
    if (xpNeededForNext <= 0) return 100;
    return Math.min(Math.max((xpInCurrentLevel / xpNeededForNext) * 100, 0), 100);
  };

  const getTierColor = (tier) => {
    const colors = { basic: '#9ca3af', intermediate: '#60a5fa', advanced: '#fbbf24', master: '#f87171', legendary: '#a78bfa' };
    return colors[tier] || '#9ca3af';
  };

  const currentAvatar = avatars[gender]?.[userStats.currentLevel] || avatars['male'][1];

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  if (loading) return <DashboardLayout title="Gamification"><div style={{color:'white', padding:'20px'}}>Loading progress...</div></DashboardLayout>;

  return (
    <DashboardLayout title="Gamification">
      <motion.div className={styles.container} variants={containerVariants} initial="hidden" animate="visible">
        
        <motion.div className={styles.header} variants={itemVariants}>
          <h1 className={styles.title}>Your Learning Journey</h1>
          <p className={styles.subtitle}>Level up to unlock new avatars!</p>
        </motion.div>

        <div className={styles.mainGrid}>
          
          <motion.div className={styles.avatarCard} variants={itemVariants}>
            <h3>Your Avatar</h3>
            
            <div className={styles.avatarDisplay}>
              <motion.img
                key={`${useAvatar ? 'avatar' : 'profile'}-${gender}-${userStats.currentLevel}`}
                src={useAvatar ? currentAvatar : (profilePicture || 'https://via.placeholder.com/200')}
                alt="Current Avatar"
                className={styles.avatarImage}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/200'; }}
              />
              <span className={styles.levelBadge} style={{ background: getTierColor(getCurrentLevelData()?.tier) }}>
                Level {userStats.currentLevel}
              </span>
            </div>

            {/* 🔹 Updated Toggle Controls */}
            <div className={styles.controlGroup}>
              <div className={styles.avatarToggle}>
                <button className={`${styles.toggleBtn} ${useAvatar ? styles.active : ''}`} onClick={() => handleToggleAvatar(true)}>🎭 Avatar</button>
                <button className={`${styles.toggleBtn} ${!useAvatar ? styles.active : ''}`} onClick={() => handleToggleAvatar(false)}>📷 Photo</button>
              </div>
            </div>

            <div className={styles.xpInfo}>
              <div className={styles.xpBar}>
                <motion.div 
                  className={styles.xpFill} 
                  initial={{ width: 0 }} 
                  animate={{ width: `${calculateXpProgress()}%` }} 
                  transition={{ duration: 0.8 }}
                />
              </div>
              <p className={styles.xpText}>{userStats.xp} XP / {getNextLevelData()?.xpRequired || 'MAX'} XP</p>
            </div>
          </motion.div>

          <div className={styles.rightSection}>
            <motion.div className={styles.statsGrid} variants={itemVariants}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>⏱️</div>
                <div className={styles.statValue}>{userStats.studyHours}h</div>
                <div className={styles.statLabel}>Study Hours</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>⚡</div>
                <div className={styles.statValue}>{userStats.xp}</div>
                <div className={styles.statLabel}>Total XP</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🔥</div>
                <div className={styles.statValue}>{userStats.streak}</div>
                <div className={styles.statLabel}>Day Streak</div>
              </div>
            </motion.div>

            <motion.div className={styles.levelsCard} variants={itemVariants}>
              <h3>Level Progression</h3>
              <div className={styles.levelsList}>
                {levels.map((level) => {
                  const isUnlocked = level.level <= userStats.currentLevel;
                  const isCurrent = level.level === userStats.currentLevel;
                  return (
                    <motion.div 
                      key={level.level} 
                      className={`${styles.levelItem} ${isCurrent ? styles.currentLevel : ''} ${!isUnlocked ? styles.lockedLevel : ''}`}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className={styles.levelAvatarContainer}>
                        <img 
                          src={avatars[gender][level.level]} 
                          alt={`Level ${level.level}`} 
                          className={styles.levelListAvatar} 
                          style={{ filter: isUnlocked ? 'none' : 'grayscale(100%) blur(2px)', opacity: isUnlocked ? 1 : 0.6 }}
                        />
                        {!isUnlocked && <span className={styles.lockIcon}>🔒</span>}
                      </div>
                      <div className={styles.levelInfo}>
                        <h4>{level.name} <span className={styles.tierBadge} style={{ background: getTierColor(level.tier) }}>{level.tier}</span></h4>
                        <p>{level.description}</p>
                        <span className={styles.levelReq}>📚 {level.hoursRequired}h • ⚡ {level.xpRequired} XP</span>
                      </div>
                      <div className={styles.levelStatus}>
                        {isCurrent ? <span className={styles.statusCurrent}>Current</span> : 
                         isUnlocked ? <span className={styles.statusUnlocked}>✓ Unlocked</span> : 
                         <span className={styles.statusLocked}>Locked</span>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div className={styles.achievementsCard} variants={itemVariants}>
              <h3>Achievements</h3>
              <div className={styles.achievementsGrid}>
                {achievements.map((achievement) => {
                  const isEarned = earnedAchievements.includes(achievement.id);
                  return (
                    <motion.div key={achievement.id} className={`${styles.achievement} ${isEarned ? styles.earned : ''}`} whileHover={{ scale: 1.05 }}>
                      <span className={styles.achievementIcon}>{achievement.icon}</span>
                      <div className={styles.achievementTooltip}>
                        <strong>{achievement.name}</strong>
                        <p>{achievement.requirement}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Gamification;
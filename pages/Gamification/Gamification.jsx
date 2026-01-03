import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './Gamification.module.css';

import maleLevel1 from '@/assets/gamification/male-level-1.png';
import maleLevel2 from '@/assets/gamification/male-level-2.png';
import maleLevel3 from '@/assets/gamification/male-level-3.png';
import maleLevel4 from '@/assets/gamification/male-level-4.png';
import maleLevel5 from '@/assets/gamification/male-level-5.png';
import maleLevel6 from '@/assets/gamification/male-level-6.png';
import maleLevel7 from '@/assets/gamification/male-level-7.png';

import femaleLevel1 from '@/assets/gamification/female-level-1.png';
import femaleLevel2 from '@/assets/gamification/female-level-2.png';
import femaleLevel3 from '@/assets/gamification/female-level-3.png';
import femaleLevel4 from '@/assets/gamification/female-level-4.png';
import femaleLevel5 from '@/assets/gamification/female-level-5.png';
import femaleLevel6 from '@/assets/gamification/female-level-6.png';
import femaleLevel7 from '@/assets/gamification/female-level-7.png';

// Gender-separated avatar catalog (data-level enforcement)
const maleAvatars = Object.freeze({
  1: maleLevel1,
  2: maleLevel2,
  3: maleLevel3,
  4: maleLevel4,
  5: maleLevel5,
  6: maleLevel6,
  7: maleLevel7,
});

const femaleAvatars = Object.freeze({
  1: femaleLevel1,
  2: femaleLevel2,
  3: femaleLevel3,
  4: femaleLevel4,
  5: femaleLevel5,
  6: femaleLevel6,
  7: femaleLevel7,
});

const avatars = Object.freeze({
  male: maleAvatars,
  female: femaleAvatars,
});

const levels = [
  {
    level: 1,
    name: 'Newcomer',
    description: 'Taking the first step into learning',
    hoursRequired: 0,
    xpRequired: 0,
    tier: 'basic',
  },
  {
    level: 2,
    name: 'Novice Learner',
    description: 'Getting familiar with the basics',
    hoursRequired: 5,
    xpRequired: 200,
    tier: 'basic',
  },
  {
    level: 3,
    name: 'Dedicated Student',
    description: 'Building consistent study habits',
    hoursRequired: 15,
    xpRequired: 500,
    tier: 'intermediate',
  },
  {
    level: 4,
    name: 'Rising Scholar',
    description: 'Knowledge is becoming your strength',
    hoursRequired: 30,
    xpRequired: 1000,
    tier: 'intermediate',
  },
  {
    level: 5,
    name: 'Expert Learner',
    description: 'Mastering the art of learning',
    hoursRequired: 60,
    xpRequired: 2000,
    tier: 'advanced',
  },
  {
    level: 6,
    name: 'Knowledge Master',
    description: 'A beacon of wisdom and dedication',
    hoursRequired: 100,
    xpRequired: 4000,
    tier: 'master',
  },
  {
    level: 7,
    name: 'Legendary Scholar',
    description: 'The pinnacle of academic excellence',
    hoursRequired: 200,
    xpRequired: 8000,
    tier: 'legendary',
  },
];

// 7 achievements matching 7 levels
const achievements = [
  { id: 1, name: 'First Step', icon: '🎯', requirement: 'Complete your first study session (1 hour)', howTo: 'Start a study session in the Study Time page and complete at least 1 hour of focused study.' },
  { id: 2, name: 'Early Bird', icon: '🌅', requirement: 'Study before 8 AM', howTo: 'Log a study session that starts before 8:00 AM. Early morning study boosts memory!' },
  { id: 3, name: 'Streak Master', icon: '🔥', requirement: 'Maintain a 7-day study streak', howTo: 'Study at least 30 minutes every day for 7 consecutive days without breaking the chain.' },
  { id: 4, name: 'Quiz Champion', icon: '🧠', requirement: 'Score 100% on any quiz', howTo: 'Take a quiz in the Quiz section and answer all questions correctly to earn this badge.' },
  { id: 5, name: 'Social Learner', icon: '👥', requirement: 'Join 3 study groups', howTo: 'Find and join at least 3 different study groups from the Study Matches page.' },
  { id: 6, name: 'Knowledge Sharer', icon: '📚', requirement: 'Help 5 students with their questions', howTo: 'Answer questions from other students in the Messages or Social section. Quality help counts!' },
  { id: 7, name: 'Legend', icon: '👑', requirement: 'Reach Level 7 - Legendary Scholar', howTo: 'Accumulate 8000 XP and 200+ study hours to unlock the ultimate Legendary Scholar status.' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Gamification = () => {
  const [gender, setGender] = useState('male');
  const [useAvatar, setUseAvatar] = useState(true);
  const [profilePicture] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face');
  const [userStats, setUserStats] = useState({
    studyHours: 35,
    xp: 1200,
    currentLevel: 4,
    streak: 5,
    quizzesCompleted: 8,
  });
  const [earnedAchievements, setEarnedAchievements] = useState([1, 4, 5]);

  // Calculate XP progress to next level
  const getCurrentLevelData = () => levels.find((l) => l.level === userStats.currentLevel);
  const getNextLevelData = () => levels.find((l) => l.level === userStats.currentLevel + 1);

  const calculateXpProgress = () => {
    const currentLevel = getCurrentLevelData();
    const nextLevel = getNextLevelData();
    
    if (!nextLevel) return 100; // Max level
    
    const xpInCurrentLevel = userStats.xp - currentLevel.xpRequired;
    const xpNeededForNext = nextLevel.xpRequired - currentLevel.xpRequired;
    
    return Math.min((xpInCurrentLevel / xpNeededForNext) * 100, 100);
  };

  const getLevelStatus = (level) => {
    if (level < userStats.currentLevel) return 'unlocked';
    if (level === userStats.currentLevel) return 'current';
    return 'locked';
  };

  const getTierColor = (tier) => {
    const colors = {
      basic: '#9ca3af',
      intermediate: '#60a5fa',
      advanced: '#fbbf24',
      master: '#f87171',
      legendary: '#a78bfa',
    };
    return colors[tier] || '#9ca3af';
  };

  return (
    <DashboardLayout title="Gamification">
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className={styles.header} variants={itemVariants}>
          <h1 className={styles.title}>Your Learning Journey</h1>
          <p className={styles.subtitle}>Level up by studying more and unlock amazing avatars!</p>
        </motion.div>

        <div className={styles.mainGrid}>
          {/* Avatar Section */}
          <motion.div className={styles.avatarCard} variants={itemVariants}>
            <h3>Your Avatar</h3>
            
            <div className={styles.avatarDisplay}>
              <motion.img
                key={`${useAvatar ? 'avatar' : 'profile'}-${gender}-${userStats.currentLevel}`}
                src={useAvatar ? avatars[gender][userStats.currentLevel] : profilePicture}
                alt="User Avatar"
                className={styles.avatarImage}
                initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ duration: 0.4 }}
              />
              <span className={styles.levelBadge} style={{ background: `linear-gradient(135deg, ${getTierColor(getCurrentLevelData()?.tier)}, ${getTierColor(getCurrentLevelData()?.tier)}dd)` }}>
                Level {userStats.currentLevel}
              </span>
            </div>

            {/* Avatar/Profile Toggle */}
            <div className={styles.avatarToggle}>
              <button
                className={`${styles.toggleBtn} ${useAvatar ? styles.active : ''}`}
                onClick={() => setUseAvatar(true)}
              >
                🎭 Avatar
              </button>
              <button
                className={`${styles.toggleBtn} ${!useAvatar ? styles.active : ''}`}
                onClick={() => setUseAvatar(false)}
              >
                📷 Profile Pic
              </button>
            </div>

            {useAvatar && (
              <div className={styles.genderSelector}>
                <button
                  className={`${styles.genderBtn} ${gender === 'male' ? styles.active : ''}`}
                  onClick={() => setGender('male')}
                >
                👨 Male
              </button>
                <button
                  className={`${styles.genderBtn} ${gender === 'female' ? styles.active : ''}`}
                  onClick={() => setGender('female')}
                >
                  👩 Female
                </button>
              </div>
            )}

            <div className={styles.xpInfo}>
              <div className={styles.xpBar}>
                <motion.div
                  className={styles.xpFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${calculateXpProgress()}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <p className={styles.xpText}>
                {userStats.xp} XP / {getNextLevelData()?.xpRequired || 'MAX'} XP
              </p>
            </div>
          </motion.div>

          {/* Right Section */}
          <div className={styles.rightSection}>
            {/* Stats Grid */}
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

            {/* Levels Card */}
            <motion.div className={styles.levelsCard} variants={itemVariants}>
              <h3>Level Progression</h3>
              <div className={styles.levelsTableHeader}>
                <div className={styles.levelsTableHeaderAvatars}>
                  <span className={styles.levelsTableHeaderLabel}>Male</span>
                  <span className={styles.levelsTableHeaderLabel}>Female</span>
                </div>
                <span className={styles.levelsTableHeaderLabel}>Level</span>
                <span className={styles.levelsTableHeaderStatus}>Status</span>
              </div>
              <div className={styles.levelsList}>
                {levels.map((level) => {
                  const status = getLevelStatus(level.level);
                  const isLocked = status === 'locked';
                  return (
                    <motion.div
                      key={level.level}
                      className={`${styles.levelItem} ${styles[status]}`}
                      whileHover={{ scale: 1.01 }}
                      style={{ borderLeftColor: status !== 'locked' ? getTierColor(level.tier) : undefined, borderLeftWidth: status !== 'locked' ? '3px' : undefined }}
                    >
                      <div className={styles.avatarPair}>
                        <div className={styles.avatarWithLabel} aria-disabled={isLocked}>
                          <img
                            src={avatars.male[level.level]}
                            alt={`Collaborative Learning male avatar level ${level.level} - ${level.name}`}
                            className={`${styles.levelAvatar} ${isLocked ? styles.lockedAvatar : ''}`}
                            loading="lazy"
                            decoding="async"
                          />
                          <span className={`${styles.genderLabel} ${isLocked ? styles.genderLabelLocked : ''}`}>♂</span>
                        </div>
                        <div className={styles.avatarWithLabel} aria-disabled={isLocked}>
                          <img
                            src={avatars.female[level.level]}
                            alt={`Collaborative Learning female avatar level ${level.level} - ${level.name}`}
                            className={`${styles.levelAvatar} ${isLocked ? styles.lockedAvatar : ''}`}
                            loading="lazy"
                            decoding="async"
                          />
                          <span className={`${styles.genderLabel} ${isLocked ? styles.genderLabelLocked : ''}`}>♀</span>
                        </div>
                      </div>
                      <div className={styles.levelInfo}>
                        <h4>
                          {level.name}
                          <span className={styles.tierBadge} style={{ background: getTierColor(level.tier), color: 'white' }}>
                            {level.tier}
                          </span>
                        </h4>
                        <p>{level.description}</p>
                        <span className={styles.levelRequirement}>
                          📚 {level.hoursRequired}+ hours • ⚡ {level.xpRequired} XP
                        </span>
                      </div>
                      <span className={`${styles.levelStatus} ${styles[status]}`}>
                        {status === 'current' ? 'Current' : status === 'unlocked' ? '✓ Unlocked' : '🔒 Locked'}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div className={styles.achievementsCard} variants={itemVariants}>
              <h3>Achievements ({earnedAchievements.length}/{achievements.length})</h3>
              <div className={styles.achievementsGrid}>
                {achievements.map((achievement) => {
                  const isEarned = earnedAchievements.includes(achievement.id);
                  return (
                    <motion.div
                      key={achievement.id}
                      className={`${styles.achievement} ${isEarned ? styles.earned : ''}`}
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className={styles.achievementIcon}>{achievement.icon}</span>
                      <span className={styles.achievementName}>{achievement.name}</span>
                      <div className={styles.achievementTooltip}>
                        <strong>{achievement.requirement}</strong>
                        <p>{achievement.howTo}</p>
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

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './XP.module.css';

const xpActivities = [
  { id: 1, icon: '📚', title: 'Complete a Study Session', xp: 50, description: 'Finish a 25-minute Pomodoro session', action: '/study-time' },
  { id: 2, icon: '✅', title: 'Complete Daily Tasks', xp: 30, description: 'Check off your daily to-do items', action: '/dashboard' },
  { id: 3, icon: '🎓', title: 'Attend a Study Room', xp: 100, description: 'Join and participate in a live study room session', action: '/study-room' },
  { id: 4, icon: '🤝', title: 'Connect with Peers', xp: '75/user', description: 'Earn 75 XP for every new study partner you connect with', action: '/connections' },
  { id: 5, icon: '🔥', title: 'Maintain Study Streak', xp: 40, description: 'Log in and study daily', action: '/study-time' },
  { id: 6, icon: '📖', title: 'Complete a Course Module', xp: 200, description: 'Finish an entire course section', action: '/courses' },
  { id: 7, icon: '🎯', title: 'Achieve Weekly Goals', xp: 150, description: 'Hit your 10-hour weekly study target', action: '/analytics' },
  { id: 8, icon: '⭐', title: 'Daily Login Bonus', xp: 10, description: 'Earn 10 XP for your first login of the day', action: null },
];

// 🟢 SYNCED WITH GAMIFICATION.JSX
const milestones = [
  { level: 1, xp: 0, hours: 0, name: 'Newcomer' },
  { level: 2, xp: 200, hours: 5, name: 'Novice Learner' },
  { level: 3, xp: 500, hours: 15, name: 'Dedicated Student' },
  { level: 4, xp: 1000, hours: 30, name: 'Rising Scholar' },
  { level: 5, xp: 2000, hours: 60, name: 'Expert Learner' },
  { level: 6, xp: 4000, hours: 100, name: 'Knowledge Master' },
  { level: 7, xp: 8000, hours: 200, name: 'Legendary Scholar' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const XP = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [userXp, setUserXp] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [studyHours, setStudyHours] = useState(0);
  const [recentHistory, setRecentHistory] = useState([]);

  // 🔹 FETCH & SYNC DATA
  useEffect(() => {
    const fetchData = async () => {
        try {
            const token = (localStorage.getItem('token') || sessionStorage.getItem('token')) || localStorage.getItem('token');
            if(!token) return;

            const res = await fetch('http://localhost:5000/api/auth/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (data.success && data.user) {
                let currentXp = data.user.xp || 0;
                let currentLevel = data.user.level || 1;
                const hours = data.user.studyHours || 0;
                const tasks = data.user.tasksCompleted || 0;

                // 1. Retroactive XP Sync (Hours + Tasks)
                const calculatedMinXP = Math.floor((hours * 120) + (tasks * 30));
                let needsUpdate = false;

                if (currentXp < calculatedMinXP) {
                    currentXp = calculatedMinXP;
                    needsUpdate = true;
                }

                // 2. Level Calculation (Must match Gamification Logic: XP AND Hours)
                // Find the highest level where User meets BOTH requirements
                const qualifiedLevelObj = [...milestones].reverse().find(m => currentXp >= m.xp && hours >= m.hours);
                const qualifiedLevel = qualifiedLevelObj ? qualifiedLevelObj.level : 1;

                if (qualifiedLevel > currentLevel) {
                    currentLevel = qualifiedLevel;
                    needsUpdate = true;
                    // Trigger Level Up Notification
                    const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
                    notifs.unshift({
                        id: Date.now(), title: "Level Up! 🚀", 
                        message: `You reached Level ${currentLevel}: ${qualifiedLevelObj.name}`, 
                        type: 'success', read: false, timestamp: new Date()
                    });
                    localStorage.setItem('notifications', JSON.stringify(notifs));
                    window.dispatchEvent(new Event('notificationAdded'));
                }

                // 3. Save Sync to DB
                if (needsUpdate) {
                    await fetch('http://localhost:5000/api/auth/update-stats', {
                        method: 'PUT',
                        headers: { 
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ xp: currentXp, level: currentLevel })
                    });
                    
                    const updatedUser = { ...data.user, xp: currentXp, level: currentLevel };
                    sessionStorage.setItem('user', JSON.stringify(updatedUser));
                    window.dispatchEvent(new Event('userUpdated'));
                }

                setUserXp(currentXp);
                setUserLevel(currentLevel);
                setStreak(data.user.streak || 0);
                setStudyHours(hours);
            }

            // Load History
            const storedNotifs = JSON.parse(localStorage.getItem('notifications') || '[]');
            const xpNotifs = storedNotifs.filter(n => 
                n.title.includes('XP') || n.title.includes('Level') || n.title.includes('Bonus') || n.title.includes('Achievement')
            );
            
            const formattedHistory = xpNotifs.slice(0, 5).map((n, i) => ({
                id: i,
                activity: n.title,
                xp: n.message.match(/(\d+)\s*XP/) ? n.message.match(/(\d+)\s*XP/)[1] : '10', 
                time: new Date(n.timestamp).toLocaleDateString() === new Date().toDateString() ? 'Today' : new Date(n.timestamp).toLocaleDateString(),
                icon: n.title.includes('Level') ? '🚀' : n.title.includes('Bonus') ? '⭐' : '🏆'
            }));

            if(formattedHistory.length > 0) setRecentHistory(formattedHistory);
            else setRecentHistory([{ id: 1, activity: 'Welcome Bonus', xp: 10, time: 'Joined', icon: '⭐' }]);

        } catch(err) {
            console.error("Failed to load XP data", err);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  // 🔹 CALCULATE PROGRESS
  const currentLevelObj = milestones.find(m => m.level === userLevel) || milestones[0];
  const nextLevelObj = milestones.find(m => m.level === userLevel + 1); 
  
  const currentLevelXp = currentLevelObj.xp;
  const nextLevelXp = nextLevelObj ? nextLevelObj.xp : userXp * 1.2;
  
  let progressToNextLevel = 100;
  let xpToNextLevel = 0;

  if (nextLevelObj) {
      const xpNeeded = nextLevelXp - currentLevelXp;
      const xpGained = userXp - currentLevelXp;
      progressToNextLevel = Math.min(Math.max((xpGained / xpNeeded) * 100, 0), 100);
      xpToNextLevel = Math.max(nextLevelXp - userXp, 0);
  } else {
      // Max level reached
      xpToNextLevel = 0;
      progressToNextLevel = 100;
  }

  const handleActivityClick = (action) => {
    if (action) navigate(action);
  };

  if (loading) return <DashboardLayout title="XP & Rewards"><div style={{color:'white', padding:'20px'}}>Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout title="XP & Rewards">
      <motion.div className={styles.container} variants={containerVariants} initial="hidden" animate="visible">
        
        {/* XP Overview Card */}
        <motion.div className={styles.overviewCard} variants={itemVariants}>
          <div className={styles.xpHeader}>
            <div className={styles.xpIcon}>⚡</div>
            <div className={styles.xpInfo}>
              <h2 className={styles.xpTitle}>Your XP</h2>
              <div className={styles.xpValue}>{userXp.toLocaleString()} XP</div>
            </div>
            <div className={styles.levelBadge}>
              <span className={styles.levelNumber}>Level {userLevel}</span>
              <span className={styles.levelName}>{currentLevelObj.name}</span>
            </div>
          </div>
          
          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span>Progress to Level {userLevel + 1}</span>
              {nextLevelObj ? (
                  <span>{xpToNextLevel.toLocaleString()} XP to go</span>
              ) : (
                  <span>Max Level Reached!</span>
              )}
            </div>
            <div className={styles.progressBar}>
              <motion.div 
                className={styles.progressFill}
                initial={{ width: 0 }}
                animate={{ width: `${progressToNextLevel}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className={styles.progressLabels}>
              <span>{currentLevelXp.toLocaleString()} XP</span>
              <span>{nextLevelXp.toLocaleString()} XP</span>
            </div>
            {/* Show Hours Requirement if XP is met but Hours aren't */}
            {userXp >= nextLevelXp && studyHours < nextLevelObj?.hours && (
                <div style={{fontSize:'0.8rem', color:'#f59e0b', marginTop:'5px'}}>
                    ⚠️ You have enough XP, but need {nextLevelObj.hours} total study hours to level up (Current: {studyHours.toFixed(1)}h)
                </div>
            )}
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{userXp.toLocaleString()}</span>
              <span className={styles.statLabel}>Total XP Earned</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{userLevel}</span>
              <span className={styles.statLabel}>Current Level</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{streak}</span>
              <span className={styles.statLabel}>Day Streak</span>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className={styles.mainGrid}>
          {/* Ways to Earn XP */}
          <motion.div className={styles.earnCard} variants={itemVariants}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🚀</span>
              <h3 className={styles.cardTitle}>Ways to Earn XP</h3>
            </div>
            <div className={styles.activitiesGrid}>
              {xpActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  className={styles.activityCard}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleActivityClick(activity.action)}
                >
                  <div className={styles.activityIcon}>{activity.icon}</div>
                  <div className={styles.activityContent}>
                    <h4 className={styles.activityTitle}>{activity.title}</h4>
                    <p className={styles.activityDesc}>{activity.description}</p>
                  </div>
                  <div className={styles.activityXp}>+{activity.xp} XP</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className={styles.rightColumn}>
            {/* Recent XP History */}
            <motion.div className={styles.historyCard} variants={itemVariants}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>📊</span>
                <h3 className={styles.cardTitle}>Recent Activity</h3>
              </div>
              <div className={styles.historyList}>
                {recentHistory.map((item) => (
                  <div key={item.id} className={styles.historyItem}>
                    <span className={styles.historyIcon}>{item.icon}</span>
                    <div className={styles.historyContent}>
                      <span className={styles.historyActivity}>{item.activity}</span>
                      <span className={styles.historyTime}>{item.time}</span>
                    </div>
                    <span className={styles.historyXp}>+{item.xp}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Level Milestones */}
            <motion.div className={styles.milestonesCard} variants={itemVariants}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>🎯</span>
                <h3 className={styles.cardTitle}>Level Milestones</h3>
              </div>
              <div className={styles.milestonesList}>
                {milestones.map((milestone) => {
                  const isAchieved = milestone.level <= userLevel;
                  return (
                    <div 
                        key={milestone.level} 
                        className={`${styles.milestoneItem} ${isAchieved ? styles.achieved : ''} ${milestone.level === userLevel ? styles.current : ''}`}
                    >
                        <div className={styles.milestoneIcon}>
                        {isAchieved ? '✅' : milestone.level === userLevel + 1 ? '🔓' : '🔒'}
                        </div>
                        <div className={styles.milestoneInfo}>
                        <span className={styles.milestoneName}>Level {milestone.level}: {milestone.name}</span>
                        <span className={styles.milestoneXp}>
                            {milestone.xp.toLocaleString()} XP • {milestone.hours}h
                        </span>
                        </div>
                        {milestone.level === userLevel && (
                        <span className={styles.currentBadge}>Current</span>
                        )}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div className={styles.quickCard} variants={itemVariants}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>⚡</span>
                <h3 className={styles.cardTitle}>Quick Earn</h3>
              </div>
              <div className={styles.quickActions}>
                <motion.button 
                  className={styles.quickBtn}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/study-time')}
                >
                  <span>🍅</span> Start Study Session (+50 XP)
                </motion.button>
                <motion.button 
                  className={styles.quickBtn}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/study-room')}
                >
                  <span>🎓</span> Join Study Room (+100 XP)
                </motion.button>
                <motion.button 
                  className={styles.quickBtn}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/connections')}
                >
                  <span>🤝</span> Connect with Peers (+75 XP)
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default XP;
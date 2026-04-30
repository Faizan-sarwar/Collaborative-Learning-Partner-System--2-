import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './Analytics.module.css';

const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes of no mouse/keyboard = Idle
const SYNC_INTERVAL_MS = 5 * 60 * 1000; // Save to DB every 5 minutes

const Analytics = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 🟢 DISPLAY STATES
  const [dbTotalHours, setDbTotalHours] = useState(0); 
  const [localSessionSeconds, setLocalSessionSeconds] = useState(0);
  const [isIdle, setIsIdle] = useState(false);

  // 🟢 HIDDEN TRACKERS (Refs don't trigger re-renders)
  const lastActiveTime = useRef(Date.now());
  const unsavedSeconds = useRef(0); // Time accumulated that hasn't been sent to the server yet

  // 1. LOAD INITIAL DATA
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if(!token) return;

        const res = await fetch(`http://${window.location.hostname}:5000/api/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success) {
            setUserData(data.user);
            setDbTotalHours(data.user.studyHours || 0);
        }
      } catch(err) { 
        console.error("Failed to load analytics data", err); 
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // 2. THE SYNC FUNCTION: Sends accumulated delta to server
  const syncTimeToServer = useCallback(async () => {
    if (unsavedSeconds.current < 60) return; // Don't bother saving less than a minute

    const minutesToSave = unsavedSeconds.current / 60;
    unsavedSeconds.current = 0; // Reset immediately to prevent double-saving

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`http://${window.location.hostname}:5000/api/auth/track-time`, {
          method: 'PUT',
          headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ minutes: minutesToSave })
      });
      
      const data = await res.json();
      if (data.success) {
          setDbTotalHours(data.totalHours); // Update UI with true server source of truth
      }
    } catch(err) { 
      // If network fails, add the time back so we can try again later
      unsavedSeconds.current += (minutesToSave * 60);
      console.error("Auto-save failed", err); 
    }
  }, []);

  // 3. IDLE DETECTION & CORE TIMER
  useEffect(() => {
    // Reset activity timer on interaction
    const updateActivity = () => {
      lastActiveTime.current = Date.now();
      if (isIdle) setIsIdle(false);
    };

    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity);

    // The Core Tick (Runs every 1 second)
    const tickInterval = setInterval(() => {
      const now = Date.now();
      
      // Check if user walked away from keyboard
      if (now - lastActiveTime.current > IDLE_TIMEOUT_MS) {
        setIsIdle(true);
        return; // Stop counting time!
      }

      // If active, increment time
      setLocalSessionSeconds(prev => prev + 1);
      unsavedSeconds.current += 1;
    }, 1000);

    // The Sync Tick (Runs every 5 minutes)
    const syncInterval = setInterval(syncTimeToServer, SYNC_INTERVAL_MS);

    // 🟢 CRITICAL: Save data if user suddenly closes the tab
    const handleBeforeUnload = (e) => {
        if (unsavedSeconds.current >= 60) {
            // Using navigator.sendBeacon guarantees the request fires even as the tab dies
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const blob = new Blob([JSON.stringify({ minutes: unsavedSeconds.current / 60 })], { type: 'application/json' });
            navigator.sendBeacon(`http://${window.location.hostname}:5000/api/auth/track-time`, blob);
        }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(tickInterval);
      clearInterval(syncInterval);
      syncTimeToServer(); // Final sync when leaving the page component
    };
  }, [isIdle, syncTimeToServer]);

  // 🟢 CALCULATE DISPLAY TOTALS
  // Local session minutes is just for the UI
  const sessionMinutes = Math.floor(localSessionSeconds / 60);
  
  // Grand total combines DB hours + unsaved local minutes
  const totalDisplayHours = dbTotalHours + (unsavedSeconds.current / 3600);
  const displayH = Math.floor(totalDisplayHours);
  const displayM = Math.floor((totalDisplayHours * 60) % 60);
  const totalHoursString = `${displayH}h ${displayM}m`;

  const weeklyGoalMinutes = 600; // 10 hours
  const currentTotalMinutes = totalDisplayHours * 60;
  const goalProgress = Math.min(Math.round((currentTotalMinutes / weeklyGoalMinutes) * 100), 100);

  let productivityScore = 'N/A';
  let productivityColor = '#666';
  if (sessionMinutes > 60) { productivityScore = 'High ⚡'; productivityColor = '#10b981'; }
  else if (sessionMinutes > 20) { productivityScore = 'Medium 📈'; productivityColor = '#f59e0b'; }
  else { productivityScore = 'Warming Up ☕'; productivityColor = '#3b82f6'; }

  // MOCK CHART DATA
  const weeklyData = [
    { day: 'Mon', hours: 2 },
    { day: 'Tue', hours: 3.5 },
    { day: 'Wed', hours: 1.5 },
    { day: 'Thu', hours: 4 },
    { day: 'Fri', hours: 3 }, 
    { day: 'Sat', hours: parseFloat(totalDisplayHours.toFixed(1)) },
    { day: 'Sun', hours: 0 },
  ];

  const subjectData = userData?.subjectsOfDifficulty?.length > 0 
    ? userData.subjectsOfDifficulty.map((subject, index) => ({
        name: subject,
        value: 10 + (index * 5)
      }))
    : [
        { name: 'Calculus', value: 30 },
        { name: 'Data Structures', value: 45 },
        { name: 'Physics', value: 25 },
      ];

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) return <DashboardLayout title="Analytics"><div style={{padding:'20px'}}>Loading metrics...</div></DashboardLayout>;

  return (
    <DashboardLayout title="Analytics">
      <motion.div className={styles.container} variants={containerVariants} initial="hidden" animate="visible">
        
        <motion.div className={styles.header} variants={itemVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
              <h1 className={styles.title}>Learning Analytics</h1>
              <p className={styles.subtitle}>
                Real-time tracking active. 
                {isIdle && <span style={{color: '#ef4444', marginLeft: '10px', fontWeight: 'bold'}}>⚠️ Paused (Idle Detected)</span>}
              </p>
          </div>
          <div style={{ background: '#1e293b', padding: '8px 16px', borderRadius: '8px', border: '1px solid #334155' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'block', textTransform: 'uppercase' }}>Current Session</span>
              <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem' }}>{sessionMinutes} min</span>
          </div>
        </motion.div>

        {/* STATS GRID */}
        <div className={styles.statsGrid}>
          <motion.div className={styles.statCard} variants={itemVariants}>
            <div className={styles.statIcon}>⏱️</div>
            <div className={styles.statInfo}>
              <span className={styles.statNumber} style={{color: '#6366f1'}}>{totalHoursString}</span>
              <span className={styles.statLabel}>Total Study Time</span>
            </div>
          </motion.div>

          <motion.div className={styles.statCard} variants={itemVariants}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>{userData?.tasksCompleted || 0}</span>
              <span className={styles.statLabel}>Tasks Completed</span>
            </div>
          </motion.div>

          <motion.div className={styles.statCard} variants={itemVariants}>
            <div className={styles.statIcon}>🎯</div>
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>{goalProgress}%</span>
              <span className={styles.statLabel}>Weekly Goal (10h)</span>
              <div className={styles.miniProgressBar}>
                 <div style={{width: `${goalProgress}%`, background: goalProgress > 50 ? '#10b981' : '#f59e0b'}}></div>
              </div>
            </div>
          </motion.div>

          <motion.div className={styles.statCard} variants={itemVariants}>
            <div className={styles.statIcon}>⚡</div>
            <div className={styles.statInfo}>
              <span className={styles.statNumber} style={{color: productivityColor, fontSize: '1.2rem'}}>
                {productivityScore}
              </span>
              <span className={styles.statLabel}>Productivity Level</span>
            </div>
          </motion.div>
        </div>

        {/* CHARTS GRID */}
        <div className={styles.chartsGrid}>
          <motion.div className={styles.chartCard} variants={itemVariants}>
            <h2>Weekly Activity</h2>
            <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={weeklyData}>
                        <XAxis dataKey="day" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '8px' }}
                            cursor={{fill: 'rgba(255,255,255,0.05)'}}
                        />
                        <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div className={styles.chartCard} variants={itemVariants}>
            <h2>Subject Focus (Weak Areas)</h2>
            <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie data={subjectData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {subjectData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '8px' }} />
                    </PieChart>
                </ResponsiveContainer>
                <div className={styles.chartLegend}>
                    {subjectData.slice(0, 3).map((entry, index) => (
                        <div key={index} className={styles.legendItem}>
                            <span className={styles.legendDot} style={{background: COLORS[index % COLORS.length]}}></span>
                            <span>{entry.name}</span>
                        </div>
                    ))}
                </div>
            </div>
          </motion.div>
        </div>

        {/* INSIGHTS */}
        <motion.div className={styles.insightsCard} variants={itemVariants}>
          <h2>📈 Insights & Recommendations</h2>
          <div className={styles.insightsList}>
            <div className={styles.insight}>
              <span className={styles.insightIcon}>💡</span>
              <div>
                <strong>Great start!</strong>
                <p>You've logged {totalHoursString} total. Keep pushing!</p>
              </div>
            </div>
            <div className={styles.insight}>
              <span className={styles.insightIcon}>⚠️</span>
              <div>
                <strong>Break Reminder</strong>
                <p>Ideally, take a 5-minute break every 25 minutes (Pomodoro technique).</p>
              </div>
            </div>
            {userData?.subjectsOfDifficulty?.length > 0 && (
                <div className={styles.insight}>
                <span className={styles.insightIcon}>📚</span>
                <div>
                    <strong>Focus Area</strong>
                    <p>Your analytics suggest dedicating more time to: <strong>{userData.subjectsOfDifficulty[0]}</strong></p>
                </div>
                </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Analytics;
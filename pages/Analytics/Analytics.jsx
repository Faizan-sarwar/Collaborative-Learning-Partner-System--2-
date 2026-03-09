import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './Analytics.module.css';

const Analytics = () => {
  // Current session time in minutes (starts at 0 on refresh)
  const [studyTime, setStudyTime] = useState(0); 
  
  // Total historical time from Database in minutes
  const [totalDatabaseHours, setTotalDatabaseHours] = useState(0); 
  
  const [userData, setUserData] = useState(null);
  const [tasksCompleted, setTasksCompleted] = useState(0); 
  
  // 🔹 1. LOAD DATA FROM DATABASE ON MOUNT
  useEffect(() => {
    const fetchStats = async () => {
        try {
            const token = (localStorage.getItem('token') || sessionStorage.getItem('token')) || localStorage.getItem('token');
            if(!token) return;

            const res = await fetch('http://localhost:5000/api/auth/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (data.success) {
                setUserData(data.user);
                
                // DB stores hours (e.g., 5.5). Convert to minutes for local math.
                const dbMinutes = (data.user.studyHours || 0) * 60;
                setTotalDatabaseHours(dbMinutes);
                
                setTasksCompleted(data.user.tasksCompleted || 0);
            }
        } catch(err) { 
            console.error("Failed to load analytics data", err); 
        }
    };
    fetchStats();
  }, []);

  // 🔹 2. REAL-TIME TRACKING & AUTO-SAVE TO DB
  useEffect(() => {
    // Session timer logic
    const storedStart = sessionStorage.getItem('sessionStartTime');
    let startTime = storedStart ? parseInt(storedStart) : Date.now();
    if (!storedStart) sessionStorage.setItem('sessionStartTime', startTime.toString());

    const interval = setInterval(() => {
        const now = Date.now();
        const sessionMinutes = Math.floor((now - startTime) / 1000 / 60);
        setStudyTime(sessionMinutes);

        // 🟢 AUTO-SAVE TO DB EVERY 1 MINUTE
        // We save the Grand Total (DB Previous + Current Session)
        if (sessionMinutes > 0 && sessionMinutes % 1 === 0) {
            const currentTotalMinutes = totalDatabaseHours + sessionMinutes;
            saveToDatabase(currentTotalMinutes);
        }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [totalDatabaseHours]); // Re-run if DB base hours change

  const saveToDatabase = async (totalMinutes) => {
      try {
        const token = (localStorage.getItem('token') || sessionStorage.getItem('token')) || localStorage.getItem('token');
        const totalHours = (totalMinutes / 60).toFixed(2); // Convert back to hours for DB

        await fetch('http://localhost:5000/api/auth/update-stats', {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ studyHours: totalHours })
        });
      } catch(err) { 
          console.error("Auto-save failed", err); 
      }
  };

  // 🔹 CALCULATE DISPLAY TOTALS (DB + Current Session)
  const grandTotalMinutes = totalDatabaseHours + studyTime;
  const hours = Math.floor(grandTotalMinutes / 60);
  const minutes = Math.floor(grandTotalMinutes % 60);
  const totalHoursDisplay = `${hours}h ${minutes}m`;

  // Logic: Goal is 10 hours/week. 
  const weeklyGoalMinutes = 600; // 10 hours
  const goalProgress = Math.min(Math.round((grandTotalMinutes / weeklyGoalMinutes) * 100), 100);

  // Logic: Productivity Score based on session duration
  let productivityScore = 'N/A';
  let productivityColor = '#666';
  if (studyTime > 60) { productivityScore = 'High ⚡'; productivityColor = '#10b981'; }
  else if (studyTime > 20) { productivityScore = 'Medium 📈'; productivityColor = '#f59e0b'; }
  else { productivityScore = 'Warming Up ☕'; productivityColor = '#3b82f6'; }

  // 🔹 MOCK CHART DATA (Dynamic based on total time)
  // In a real app, you would store daily breakdowns in the DB.
  // For now, we update 'Sat' (or current day) with the grand total.
  const weeklyData = [
    { day: 'Mon', hours: 2 },
    { day: 'Tue', hours: 3.5 },
    { day: 'Wed', hours: 1.5 },
    { day: 'Thu', hours: 4 },
    { day: 'Fri', hours: 3 }, 
    { day: 'Sat', hours: (grandTotalMinutes / 60).toFixed(1) }, // Showing total as today's activity for demo
    { day: 'Sun', hours: 0 },
  ];

  // Subject Distribution based on WEAK SUBJECTS (subjectsOfDifficulty)
  const subjectData = userData?.subjectsOfDifficulty?.length > 0 
    ? userData.subjectsOfDifficulty.map((subject, index) => ({
        name: subject,
        value: 10 + (index * 5) // Mock distribution logic
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

  return (
    <DashboardLayout title="Analytics">
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className={styles.header} variants={itemVariants}>
          <h1 className={styles.title}>Learning Analytics</h1>
          <p className={styles.subtitle}>
             Real-time session tracking active. Data saves automatically.
          </p>
        </motion.div>

        {/* 🔹 STATS GRID */}
        <div className={styles.statsGrid}>
          <motion.div className={styles.statCard} variants={itemVariants}>
            <div className={styles.statIcon}>⏱️</div>
            <div className={styles.statInfo}>
              <span className={styles.statNumber} style={{color: '#6366f1'}}>
                {totalHoursDisplay}
              </span>
              <span className={styles.statLabel}>Total Study Time</span>
            </div>
          </motion.div>

          <motion.div className={styles.statCard} variants={itemVariants}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statInfo}>
              {/* Fetched from DB */}
              <span className={styles.statNumber}>{tasksCompleted}</span>
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

        {/* 🔹 CHARTS GRID */}
        <div className={styles.chartsGrid}>
          {/* Weekly Bar Chart */}
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

          {/* Subject Pie Chart */}
          <motion.div className={styles.chartCard} variants={itemVariants}>
            <h2>Subject Focus (Weak Areas)</h2>
            <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={subjectData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {subjectData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                             contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '8px' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                {/* Legend */}
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

        {/* 🔹 INSIGHTS */}
        <motion.div className={styles.insightsCard} variants={itemVariants}>
          <h2>📈 Insights & Recommendations</h2>
          <div className={styles.insightsList}>
            <div className={styles.insight}>
              <span className={styles.insightIcon}>💡</span>
              <div>
                <strong>Great start!</strong>
                <p>You've logged {totalHoursDisplay} total. Keep pushing!</p>
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
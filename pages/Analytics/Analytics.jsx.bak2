import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './Analytics.module.css';
import sessionTracker from './sessionTracker.js';

const API = `http://${window.location.hostname}:5000/api/auth`;
const WEEKLY_GOAL_H = 10;

const MILESTONES = [
  { level: 1, xp: 0, hours: 0, name: 'Newcomer' },
  { level: 2, xp: 200, hours: 5, name: 'Novice Learner' },
  { level: 3, xp: 500, hours: 15, name: 'Dedicated Student' },
  { level: 4, xp: 1000, hours: 30, name: 'Rising Scholar' },
  { level: 5, xp: 2000, hours: 60, name: 'Expert Learner' },
  { level: 6, xp: 4000, hours: 100, name: 'Knowledge Master' },
  { level: 7, xp: 8000, hours: 200, name: 'Legendary Scholar' },
];

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

const formatTime = (totalSecs) => {
  if (!totalSecs || isNaN(totalSecs)) return "0h 0m";
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = Math.floor(totalSecs % 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${s}s`;
};

const fmtSeconds = (secs) => formatTime(secs);
const fmtHours = (hours) => formatTime(hours * 3600);

const buildStreakDisplay = (streakHistory = []) => {
  const today = new Date();
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (13 - i));
    const label = d.toLocaleDateString('en', { weekday: 'short' }).slice(0, 2);
    const active = streakHistory[i] === true;
    const isToday = i === 13;
    return { label, active, isToday };
  });
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1e1e2e', border: '1px solid #334155', borderRadius: '10px',
      padding: '10px 14px', fontSize: '0.82rem', color: '#e2e8f0'
    }}>
      <p style={{ margin: '0 0 4px', fontWeight: '700', color: '#a5b4fc' }}>{label}</p>
      <p style={{ margin: 0 }}>{payload[0].value} {payload[0].name}</p>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub, accent, progress }) => (
  <motion.div
    className={styles.statCard}
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    whileHover={{ y: -2, transition: { duration: 0.15 } }}
  >
    <div className={styles.statIcon}>{icon}</div>
    <div className={styles.statInfo}>
      <span className={styles.statNumber} style={accent ? { color: accent } : {}}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
      {sub && <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>{sub}</span>}
      {progress !== undefined && (
        <div className={styles.miniProgressBar}>
          <div style={{
            width: `${Math.min(progress, 100)}%`,
            background: progress >= 80 ? '#10b981' : progress >= 40 ? '#f59e0b' : '#6366f1',
            borderRadius: '4px', height: '100%', transition: 'width 0.6s ease'
          }} />
        </div>
      )}
    </div>
  </motion.div>
);

const Analytics = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackerState, setTrackerState] = useState(sessionTracker.getState());

  // Subscribe to the global session tracker
  useEffect(() => {
    sessionTracker.loadInitialHours();
    const unsubscribe = sessionTracker.subscribe(setTrackerState);
    return unsubscribe;
  }, []);

  // Fetch static user profile data
  useEffect(() => {
    const fetchUserData = async () => {
      const token = getToken();
      if (!token) { setLoading(false); return; }
      try {
        const res = await fetch(`${API}/me`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data.success) setUserData(data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Streak update logic
  const streakUpdated = useRef(false);
  useEffect(() => {
    if (streakUpdated.current || trackerState.sessionSeconds < 60 || !userData) return;
    streakUpdated.current = true;

    const today = new Date().toISOString().split('T')[0];
    const last = userData.lastStudyDate;
    const history = [...(userData.streakHistory || [])];
    while (history.length < 14) history.unshift(false);
    history.push(true);
    const last14Days = history.slice(-14);

    let newStreak = userData.streak || 0;
    if (last !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().split('T')[0];
      newStreak = (last === yStr) ? newStreak + 1 : 1;
    }
    const newLongest = Math.max(newStreak, userData.longestStreak || 0);

    const token = getToken();
    if (!token) return;
    fetch(`${API}/update-stats`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ streakData: { current: newStreak, longest: newLongest, last14Days, lastDate: today } })
    }).then(r => r.json()).then(d => { if (d.success) setUserData(d.user); }).catch(() => { });
  }, [trackerState.sessionSeconds, userData]);

  // Derived calculations mapped directly to the unified tracker state
  const liveHours = trackerState.totalHours;
  const totalAllTimeSeconds = trackerState.totalHours * 3600;

  const totalHoursStr = formatTime(totalAllTimeSeconds);
  const sessionStr = formatTime(trackerState.sessionSeconds);
  const goalProgress = Math.min(Math.round((liveHours / WEEKLY_GOAL_H) * 100), 100);

  const currentXP = userData?.xp || 0;
  const currentLevel = userData?.level || 1;
  const currentMilestone = MILESTONES.find(m => m.level === currentLevel) || MILESTONES[0];
  const nextMilestone = MILESTONES.find(m => m.level === currentLevel + 1);
  const xpProgress = nextMilestone ? Math.max(0, Math.round(((currentXP - currentMilestone.xp) / (nextMilestone.xp - currentMilestone.xp)) * 100)) : 100;

  const streak = userData?.streak || 0;
  const longestStreak = userData?.longestStreak || 0;
  const streakDays = useMemo(() => buildStreakDisplay(userData?.streakHistory), [userData?.streakHistory]);

  const sessionMinutes = Math.floor(trackerState.sessionSeconds / 60);
  const { score: prodScore, color: prodColor } = useMemo(() => {
    if (sessionMinutes > 60) return { score: 'High ⚡', color: '#10b981' };
    if (sessionMinutes > 20) return { score: 'Medium 📈', color: '#f59e0b' };
    return { score: 'Warming Up ☕', color: '#3b82f6' };
  }, [sessionMinutes]);

  const reliability = userData?.reliability || 0;

  const weeklyData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const todayIdx = (new Date().getDay() + 6) % 7;
    return days.map((day, i) => ({ day, hours: i === todayIdx ? parseFloat(liveHours.toFixed(2)) : 0, isToday: i === todayIdx }));
  }, [liveHours]);

  const subjectData = useMemo(() => {
    const subjects = userData?.subjectsOfDifficulty;
    if (subjects?.length > 0) return subjects.map((name, i) => ({ name, value: 25 + i * 10 }));
    return [{ name: 'No subjects set', value: 100 }];
  }, [userData]);

  const strengthData = useMemo(() => {
    return userData?.academicStrengths?.map(name => ({ name })) || [];
  }, [userData]);

  const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  if (loading) return (
    <DashboardLayout title="Analytics">
      <div style={{ padding: '40px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '20px', height: '20px', border: '2px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        Loading your analytics...
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout title="Analytics">
      <motion.div className={styles.container} variants={container} initial="hidden" animate="visible">

        {/* ── HEADER ── */}
        <motion.div variants={item} className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className={styles.title}>Learning Analytics</h1>
            <p className={styles.subtitle} style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ color: '#10b981', fontSize: '0.78rem', fontWeight: '600' }}>● Auto-save on</span>
              {trackerState.isIdle && (
                <span style={{ color: '#ef4444', fontWeight: '700', fontSize: '0.82rem' }}>⚠️ Timer paused — idle detected</span>
              )}
              <span style={{ color: '#475569', fontSize: '0.73rem' }}>(Tracking continues across all pages)</span>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', padding: '10px 18px', borderRadius: '12px', textAlign: 'center', minWidth: '110px' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Session</span>
              <span style={{ color: '#a5b4fc', fontWeight: '800', fontSize: '1.3rem', fontVariantNumeric: 'tabular-nums' }}>{sessionStr}</span>
            </div>
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', padding: '10px 18px', borderRadius: '12px', textAlign: 'center', minWidth: '110px' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>All Time</span>
              <span style={{ color: '#34d399', fontWeight: '800', fontSize: '1.3rem' }}>{totalHoursStr}</span>
            </div>
          </div>
        </motion.div>

        {/* ── STAT CARDS ── */}
        <div className={styles.statsGrid}>
          <StatCard icon="⏱️" label="Total Study Time" value={totalHoursStr} sub={`${fmtSeconds(trackerState.sessionSeconds)} this session`} accent="#6366f1" />
          <StatCard icon="✅" label="Tasks Completed" value={userData?.tasksCompleted ?? 0} sub={`${userData?.completedModules ?? 0} modules done`} />
          <StatCard icon="🎯" label={`Weekly Goal (${WEEKLY_GOAL_H}h)`} value={`${goalProgress}%`} sub={`${fmtHours(liveHours)} / ${WEEKLY_GOAL_H}h`} progress={goalProgress} />
          <StatCard icon="🔥" label="Current Streak" value={`${streak} day${streak !== 1 ? 's' : ''}`} sub={`Longest: ${longestStreak} days`} accent="#f59e0b" />
          <StatCard icon="⚡" label="XP Points" value={currentXP.toLocaleString()} sub={`Level ${currentLevel} — ${currentMilestone.name}`} accent="#8b5cf6" progress={xpProgress} />
          <StatCard icon="🛡️" label="Reliability Score" value={`${reliability}%`} sub="Based on quiz & engagement" accent={reliability >= 70 ? '#10b981' : reliability >= 40 ? '#f59e0b' : '#ef4444'} progress={reliability} />
          <StatCard icon="📈" label="Productivity" value={prodScore} sub={`${sessionMinutes}m active this session`} accent={prodColor} />
          <StatCard icon="🤝" label="Connections" value={userData?.connections?.length ?? 0} sub="Study partners" />
        </div>

        {/* ── LEVEL PROGRESS BAR ── */}
        <motion.div variants={item} style={{ background: 'var(--bg-secondary)', borderRadius: '16px', padding: '20px 24px', border: '1px solid var(--border-color)', marginBottom: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Level {currentLevel} — {currentMilestone.name}</span>
              <span style={{ color: '#6366f1', fontWeight: '600', fontSize: '0.82rem', marginLeft: '10px' }}>{currentXP.toLocaleString()} XP</span>
            </div>
            {nextMilestone ? <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{(nextMilestone.xp - currentXP).toLocaleString()} XP to Level {nextMilestone.level}</span> : <span style={{ color: '#10b981', fontWeight: '700', fontSize: '0.82rem' }}>MAX LEVEL 🏆</span>}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${xpProgress}%` }} transition={{ duration: 1, ease: 'easeOut' }} style={{ height: '100%', borderRadius: '8px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            {MILESTONES.map(m => (
              <div key={m.level} style={{ textAlign: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', margin: '0 auto 3px', background: m.level <= currentLevel ? '#6366f1' : 'rgba(255,255,255,0.1)' }} />
                <span style={{ fontSize: '0.6rem', color: m.level <= currentLevel ? '#a5b4fc' : '#475569' }}>L{m.level}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── STREAK CALENDAR ── */}
        <motion.div variants={item} style={{ background: 'var(--bg-secondary)', borderRadius: '16px', padding: '20px 24px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>🔥 Study Streak — Last 14 Days</h2>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '0.88rem' }}>{streak} day{streak !== 1 ? 's' : ''} 🔥</span>
          </div>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'space-between' }}>
            {streakDays.map((d, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ height: '32px', borderRadius: '6px', background: d.active ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : d.isToday ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.05)', border: d.isToday ? '1px solid rgba(99,102,241,0.5)' : '1px solid transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                  {d.active ? '🔥' : d.isToday ? '📍' : ''}
                </div>
                <span style={{ fontSize: '0.62rem', color: '#64748b', display: 'block', marginTop: '4px' }}>{d.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── CHARTS GRID ── */}
        <div className={styles.chartsGrid}>
          <motion.div className={styles.chartCard} variants={item}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <h2 style={{ margin: 0 }}>Weekly Activity</h2>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Live — updates in real-time</span>
            </div>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weeklyData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="day" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} unit="h" />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="hours" name="hours" radius={[6, 6, 0, 0]} barSize={28}>
                    {weeklyData.map((entry, i) => <Cell key={i} fill={entry.isToday ? '#6366f1' : 'rgba(99,102,241,0.3)'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div className={styles.chartCard} variants={item}>
            <h2 style={{ margin: '0 0 4px' }}>Weak Areas (from Profile)</h2>
            <div className={styles.chartContainer}>
              {subjectData[0]?.name === 'No subjects set' ? (
                <div style={{ height: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: '0.85rem', gap: '8px' }}><span style={{ fontSize: '2rem' }}>📚</span><p style={{ margin: 0 }}>No difficulty subjects set.</p></div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={subjectData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                        {subjectData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip content={({ active, payload }) => active && payload?.length ? <div style={{ background: '#1e1e2e', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', fontSize: '0.8rem', color: '#e2e8f0' }}>{payload[0].name}</div> : null} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className={styles.chartLegend}>
                    {subjectData.map((s, i) => (
                      <div key={i} className={styles.legendItem}><span className={styles.legendDot} style={{ background: COLORS[i % COLORS.length] }} /><span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{s.name}</span></div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>

      </motion.div>
    </DashboardLayout>
  );
};

export default Analytics;
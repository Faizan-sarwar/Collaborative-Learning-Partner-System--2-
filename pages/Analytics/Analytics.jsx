import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './Analytics.module.css';

// ─── Constants ────────────────────────────────────────────────────────────────
const API             = `http://${window.location.hostname}:5000/api/auth`;
const IDLE_TIMEOUT_MS = 5 * 60 * 1000;   // 5 min idle → pause timer
const SYNC_INTERVAL   = 5 * 60 * 1000;   // sync to DB every 5 min
const WEEKLY_GOAL_H   = 10;              // hours

// localStorage keys — shared across ALL pages
const LS_SESSION_START  = 'st_session_start';   // timestamp of session start
const LS_UNSAVED_SECS   = 'st_unsaved_secs';    // seconds not yet synced to DB
const LS_LAST_ACTIVE    = 'st_last_active';      // last activity timestamp

// Must match backend MILESTONES
const MILESTONES = [
  { level: 1, xp: 0,    hours: 0,   name: 'Newcomer'          },
  { level: 2, xp: 200,  hours: 5,   name: 'Novice Learner'    },
  { level: 3, xp: 500,  hours: 15,  name: 'Dedicated Student' },
  { level: 4, xp: 1000, hours: 30,  name: 'Rising Scholar'    },
  { level: 5, xp: 2000, hours: 60,  name: 'Expert Learner'    },
  { level: 6, xp: 4000, hours: 100, name: 'Knowledge Master'  },
  { level: 7, xp: 8000, hours: 200, name: 'Legendary Scholar' },
];

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

// ─── localStorage helpers ─────────────────────────────────────────────────────
const lsGet     = (key, fallback = 0) => parseFloat(localStorage.getItem(key) ?? fallback) || fallback;
const lsSet     = (key, val)          => localStorage.setItem(key, String(val));

// Initialise session start if this is a fresh login (no existing key)
const ensureSessionStart = () => {
  if (!localStorage.getItem(LS_SESSION_START)) {
    lsSet(LS_SESSION_START, Date.now());
    lsSet(LS_UNSAVED_SECS, 0);
    lsSet(LS_LAST_ACTIVE, Date.now());
  }
};
ensureSessionStart();

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtHours = (totalHours) => {
  const h = Math.floor(totalHours);
  const m = Math.floor((totalHours - h) * 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const fmtSeconds = (secs) => {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

// Session seconds = time since session start (clamped at 24h to prevent stale data)
const getSessionSeconds = () =>
  Math.min(
    Math.floor((Date.now() - lsGet(LS_SESSION_START, Date.now())) / 1000),
    24 * 3600
  );

// Build last-14-day streak display from boolean array stored in DB
const buildStreakDisplay = (streakHistory = []) => {
  const today = new Date();
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (13 - i));
    const label  = d.toLocaleDateString('en', { weekday: 'short' }).slice(0, 2);
    const active = streakHistory[i] === true;
    const isToday = i === 13;
    return { label, active, isToday };
  });
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
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

// ─── Stat Card ────────────────────────────────────────────────────────────────
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

// ─── Main Component ───────────────────────────────────────────────────────────
const Analytics = () => {
  // ── Server data ────────────────────────────────────────────────────────────
  const [userData,     setUserData]     = useState(null);
  const [dbStudyHours, setDbStudyHours] = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [syncStatus,   setSyncStatus]   = useState('idle'); // 'idle'|'syncing'|'saved'|'error'

  // ── Live timer display (reads from localStorage, not internal ref) ──────────
  const [sessionSeconds,  setSessionSeconds]  = useState(getSessionSeconds);
  const [unsavedDisplay,  setUnsavedDisplay]  = useState(() => lsGet(LS_UNSAVED_SECS));
  const [isIdle,          setIsIdle]          = useState(false);

  // Internal ref for the tight sync loop — avoids stale closures
  const unsavedRef = useRef(lsGet(LS_UNSAVED_SECS));

  // ── 1. Load user data from /me ─────────────────────────────────────────────
  useEffect(() => {
    const fetch_ = async () => {
      const token = getToken();
      if (!token) { setLoading(false); return; }
      try {
        const res  = await fetch(`${API}/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.success) {
          setUserData(data.user);
          setDbStudyHours(data.user.studyHours || 0);
        }
      } catch (err) {
        console.error('[Analytics] load:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, []);

  // ── 2. Sync accumulated time to /track-time ────────────────────────────────
  const syncTimeToServer = useCallback(async () => {
    const current = unsavedRef.current;
    if (current < 60) return; // don't bother for < 1 min

    const minutesToSave    = current / 60;
    unsavedRef.current     = 0;
    lsSet(LS_UNSAVED_SECS, 0);
    setUnsavedDisplay(0);
    setSyncStatus('syncing');

    try {
      const token = getToken();
      if (!token) throw new Error('no token');
      const res  = await fetch(`${API}/track-time`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ minutes: minutesToSave })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success) {
        setDbStudyHours(data.totalHours);
        setSyncStatus('saved');
        setTimeout(() => setSyncStatus('idle'), 2500);
      }
    } catch (err) {
      // Restore unsaved time on failure
      unsavedRef.current += minutesToSave * 60;
      lsSet(LS_UNSAVED_SECS, unsavedRef.current);
      setUnsavedDisplay(unsavedRef.current);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
      console.error('[Analytics] sync:', err);
    }
  }, []);

  // ── 3. Global idle detection + 1-second tick ───────────────────────────────
  // Activity listeners write to localStorage so ANY page can update lastActive.
  // The tick here reads from localStorage, so it correctly pauses even if the
  // user is on a different page that has no mouse movement tracked here.
  useEffect(() => {
    const onActivity = () => {
      lsSet(LS_LAST_ACTIVE, Date.now());
      setIsIdle(false);
    };

    ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(ev =>
      window.addEventListener(ev, onActivity, { passive: true })
    );

    // 1-second tick — reads lastActive from localStorage (cross-page aware)
    const tick = setInterval(() => {
      const lastActive = lsGet(LS_LAST_ACTIVE, Date.now());
      const idleNow    = Date.now() - lastActive > IDLE_TIMEOUT_MS;

      setIsIdle(idleNow);

      if (!idleNow) {
        // Increment unsaved counter in both ref and localStorage
        unsavedRef.current += 1;
        lsSet(LS_UNSAVED_SECS, unsavedRef.current);

        // Update display state every second
        setUnsavedDisplay(unsavedRef.current);
        setSessionSeconds(getSessionSeconds());
      }
    }, 1000);

    // Periodic DB sync
    const syncTick = setInterval(syncTimeToServer, SYNC_INTERVAL);

    // Save on tab close via sendBeacon — guaranteed to fire even as tab dies
    const onUnload = () => {
      const toSave = unsavedRef.current;
      if (toSave < 60) return;
      const token = getToken();
      if (!token) return;
      const blob = new Blob(
        [JSON.stringify({ minutes: toSave / 60 })],
        { type: 'application/json' }
      );
      navigator.sendBeacon(`${API}/track-time`, blob);
      // Clear localStorage immediately — beacon handles it
      lsSet(LS_UNSAVED_SECS, 0);
    };
    window.addEventListener('beforeunload', onUnload);

    // Sync on visibility change (user switches tab and comes back)
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        // Resync unsaved ref from localStorage (another tab may have updated it)
        unsavedRef.current = lsGet(LS_UNSAVED_SECS);
        setUnsavedDisplay(unsavedRef.current);
        setSessionSeconds(getSessionSeconds());
      } else {
        // Tab is hidden — flush anything > 1min to server
        syncTimeToServer();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(ev =>
        window.removeEventListener(ev, onActivity)
      );
      window.removeEventListener('beforeunload', onUnload);
      document.removeEventListener('visibilitychange', onVisibility);
      clearInterval(tick);
      clearInterval(syncTick);
      syncTimeToServer(); // final sync when leaving the Analytics page
    };
  }, [syncTimeToServer]);

  // ── 4. Update streak in DB after 60s of active study ──────────────────────
  const streakUpdated = useRef(false);
  useEffect(() => {
    if (streakUpdated.current || sessionSeconds < 60 || !userData) return;
    streakUpdated.current = true;

    const today     = new Date().toISOString().split('T')[0];
    const last      = userData.lastStudyDate;
    const history   = [...(userData.streakHistory || [])];
    while (history.length < 14) history.unshift(false);
    history.push(true);
    const last14Days = history.slice(-14);

    let newStreak = userData.streak || 0;
    if (last !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr  = yesterday.toISOString().split('T')[0];
      newStreak   = (last === yStr) ? newStreak + 1 : 1;
    }
    const newLongest = Math.max(newStreak, userData.longestStreak || 0);

    const token = getToken();
    if (!token) return;
    fetch(`${API}/update-stats`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        streakData: { current: newStreak, longest: newLongest, last14Days, lastDate: today }
      })
    })
      .then(r => r.json())
      .then(d => { if (d.success) setUserData(d.user); })
      .catch(err => console.error('[Analytics] updateStreak:', err));
  }, [sessionSeconds, userData]);

  // ── Derived values ──────────────────────────────────────────────────────────
  // Grand total = confirmed DB hours + unsaved local seconds
  const liveHours     = dbStudyHours + unsavedDisplay / 3600;
  const totalHoursStr = fmtHours(liveHours);
  const goalProgress  = Math.min(Math.round((liveHours / WEEKLY_GOAL_H) * 100), 100);
  const sessionStr    = fmtSeconds(sessionSeconds);

  // XP / Level
  const currentXP        = userData?.xp || 0;
  const currentLevel     = userData?.level || 1;
  const currentMilestone = MILESTONES.find(m => m.level === currentLevel) || MILESTONES[0];
  const nextMilestone    = MILESTONES.find(m => m.level === currentLevel + 1);
  const xpProgress       = nextMilestone
    ? Math.max(0, Math.round(((currentXP - currentMilestone.xp) / (nextMilestone.xp - currentMilestone.xp)) * 100))
    : 100;

  // Streak
  const streak        = userData?.streak || 0;
  const longestStreak = userData?.longestStreak || 0;
  const streakDays    = useMemo(
    () => buildStreakDisplay(userData?.streakHistory),
    [userData?.streakHistory]
  );

  // Productivity score (based on live session)
  const sessionMinutes = Math.floor(sessionSeconds / 60);
  const { score: prodScore, color: prodColor } = useMemo(() => {
    if (sessionMinutes > 60) return { score: 'High ⚡',       color: '#10b981' };
    if (sessionMinutes > 20) return { score: 'Medium 📈',     color: '#f59e0b' };
    return                          { score: 'Warming Up ☕', color: '#3b82f6' };
  }, [sessionMinutes]);

  // Reliability
  const reliability = userData?.reliability || 0;

  // Weekly chart — today's bar is live, others show 0 (backend stores total, not per-day)
  const weeklyData = useMemo(() => {
    const days     = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const todayIdx = (new Date().getDay() + 6) % 7; // 0 = Mon
    return days.map((day, i) => ({
      day,
      hours:   i === todayIdx ? parseFloat(liveHours.toFixed(2)) : 0,
      isToday: i === todayIdx
    }));
  }, [liveHours]);

  // Subject focus — real subjectsOfDifficulty from DB
  const subjectData = useMemo(() => {
    const subjects = userData?.subjectsOfDifficulty;
    if (subjects?.length > 0) return subjects.map((name, i) => ({ name, value: 25 + i * 10 }));
    return [{ name: 'No subjects set', value: 100 }];
  }, [userData]);

  // Academic strengths
  const strengthData = useMemo(() => {
    const strengths = userData?.academicStrengths;
    if (strengths?.length > 0) return strengths.map((name) => ({ name }));
    return [];
  }, [userData]);

  // ── Animations ──────────────────────────────────────────────────────────────
  const container = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  // ── Sync status badge ───────────────────────────────────────────────────────
  const syncBadge = {
    idle:    { text: '● Auto-save on',  color: '#475569' },
    syncing: { text: '↑ Saving...',     color: '#f59e0b' },
    saved:   { text: '✓ Saved to DB',   color: '#10b981' },
    error:   { text: '⚠ Save failed',   color: '#ef4444' },
  }[syncStatus];

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) return (
    <DashboardLayout title="Analytics">
      <div style={{ padding: '40px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '20px', height: '20px', border: '2px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        Loading your analytics...
      </div>
    </DashboardLayout>
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout title="Analytics">
      <motion.div className={styles.container} variants={container} initial="hidden" animate="visible">

        {/* ── HEADER ── */}
        <motion.div
          variants={item}
          className={styles.header}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}
        >
          <div>
            <h1 className={styles.title}>Learning Analytics</h1>
            <p className={styles.subtitle} style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ color: syncBadge.color, fontSize: '0.78rem', fontWeight: '600' }}>{syncBadge.text}</span>
              {isIdle && (
                <span style={{ color: '#ef4444', fontWeight: '700', fontSize: '0.82rem' }}>
                  ⚠️ Timer paused — idle detected
                </span>
              )}
              <span style={{ color: '#475569', fontSize: '0.73rem' }}>
                (Tracking continues across all pages)
              </span>
            </p>
          </div>

          {/* Live pills */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{
              background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)',
              padding: '10px 18px', borderRadius: '12px', textAlign: 'center', minWidth: '110px'
            }}>
              <span style={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Session</span>
              <span style={{ color: '#a5b4fc', fontWeight: '800', fontSize: '1.3rem', fontVariantNumeric: 'tabular-nums' }}>{sessionStr}</span>
            </div>
            <div style={{
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
              padding: '10px 18px', borderRadius: '12px', textAlign: 'center', minWidth: '110px'
            }}>
              <span style={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>All Time</span>
              <span style={{ color: '#34d399', fontWeight: '800', fontSize: '1.3rem' }}>{totalHoursStr}</span>
            </div>
          </div>
        </motion.div>

        {/* ── STAT CARDS ── */}
        <div className={styles.statsGrid}>
          <StatCard
            icon="⏱️" label="Total Study Time" value={totalHoursStr}
            sub={`${fmtSeconds(sessionSeconds)} this session`}
            accent="#6366f1"
          />
          <StatCard
            icon="✅" label="Tasks Completed" value={userData?.tasksCompleted ?? 0}
            sub={`${userData?.completedModules ?? 0} modules done`}
          />
          <StatCard
            icon="🎯" label={`Weekly Goal (${WEEKLY_GOAL_H}h)`} value={`${goalProgress}%`}
            sub={`${fmtHours(liveHours)} / ${WEEKLY_GOAL_H}h`}
            progress={goalProgress}
          />
          <StatCard
            icon="🔥" label="Current Streak" value={`${streak} day${streak !== 1 ? 's' : ''}`}
            sub={`Longest: ${longestStreak} days`}
            accent="#f59e0b"
          />
          <StatCard
            icon="⚡" label="XP Points" value={currentXP.toLocaleString()}
            sub={`Level ${currentLevel} — ${currentMilestone.name}`}
            accent="#8b5cf6"
            progress={xpProgress}
          />
          <StatCard
            icon="🛡️" label="Reliability Score" value={`${reliability}%`}
            sub="Based on quiz & engagement"
            accent={reliability >= 70 ? '#10b981' : reliability >= 40 ? '#f59e0b' : '#ef4444'}
            progress={reliability}
          />
          <StatCard
            icon="📈" label="Productivity" value={prodScore}
            sub={`${sessionMinutes}m active this session`}
            accent={prodColor}
          />
          <StatCard
            icon="🤝" label="Connections" value={userData?.connections?.length ?? 0}
            sub="Study partners"
          />
        </div>

        {/* ── LEVEL PROGRESS BAR ── */}
        <motion.div variants={item} style={{
          background: 'var(--bg-secondary)', borderRadius: '16px', padding: '20px 24px',
          border: '1px solid var(--border-color)', marginBottom: '4px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                Level {currentLevel} — {currentMilestone.name}
              </span>
              <span style={{ color: '#6366f1', fontWeight: '600', fontSize: '0.82rem', marginLeft: '10px' }}>
                {currentXP.toLocaleString()} XP
              </span>
            </div>
            {nextMilestone ? (
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                {(nextMilestone.xp - currentXP).toLocaleString()} XP to Level {nextMilestone.level}
              </span>
            ) : (
              <span style={{ color: '#10b981', fontWeight: '700', fontSize: '0.82rem' }}>MAX LEVEL 🏆</span>
            )}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ height: '100%', borderRadius: '8px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            {MILESTONES.map(m => (
              <div key={m.level} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%', margin: '0 auto 3px',
                  background: m.level <= currentLevel ? '#6366f1' : 'rgba(255,255,255,0.1)'
                }} />
                <span style={{ fontSize: '0.6rem', color: m.level <= currentLevel ? '#a5b4fc' : '#475569' }}>
                  L{m.level}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── STREAK CALENDAR — last 14 days ── */}
        <motion.div variants={item} style={{
          background: 'var(--bg-secondary)', borderRadius: '16px', padding: '20px 24px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              🔥 Study Streak — Last 14 Days
            </h2>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '0.88rem' }}>
              {streak} day{streak !== 1 ? 's' : ''} 🔥
            </span>
          </div>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'space-between' }}>
            {streakDays.map((d, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  height: '32px', borderRadius: '6px',
                  background: d.active
                    ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
                    : d.isToday
                      ? 'rgba(99,102,241,0.25)'
                      : 'rgba(255,255,255,0.05)',
                  border: d.isToday ? '1px solid rgba(99,102,241,0.5)' : '1px solid transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem'
                }}>
                  {d.active ? '🔥' : d.isToday ? '📍' : ''}
                </div>
                <span style={{ fontSize: '0.62rem', color: '#64748b', display: 'block', marginTop: '4px' }}>
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── CHARTS GRID ── */}
        <div className={styles.chartsGrid}>

          {/* Weekly Activity */}
          <motion.div className={styles.chartCard} variants={item}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <h2 style={{ margin: 0 }}>Weekly Activity</h2>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Live — today's bar updates in real-time</span>
            </div>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weeklyData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="day" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} unit="h" />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="hours" name="hours" radius={[6, 6, 0, 0]} barSize={28}>
                    {weeklyData.map((entry, i) => (
                      <Cell key={i} fill={entry.isToday ? '#6366f1' : 'rgba(99,102,241,0.3)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Subject Difficulty Pie */}
          <motion.div className={styles.chartCard} variants={item}>
            <h2 style={{ margin: '0 0 4px' }}>Weak Areas (from Profile)</h2>
            <div className={styles.chartContainer}>
              {subjectData[0]?.name === 'No subjects set' ? (
                <div style={{ height: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: '0.85rem', gap: '8px' }}>
                  <span style={{ fontSize: '2rem' }}>📚</span>
                  <p style={{ margin: 0 }}>No difficulty subjects set in your profile.</p>
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={subjectData} cx="50%" cy="50%"
                        innerRadius={55} outerRadius={80}
                        paddingAngle={4} dataKey="value"
                      >
                        {subjectData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) =>
                          active && payload?.length
                            ? <div style={{ background: '#1e1e2e', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', fontSize: '0.8rem', color: '#e2e8f0' }}>{payload[0].name}</div>
                            : null
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className={styles.chartLegend}>
                    {subjectData.map((s, i) => (
                      <div key={i} className={styles.legendItem}>
                        <span className={styles.legendDot} style={{ background: COLORS[i % COLORS.length] }} />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{s.name}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── ACADEMIC STRENGTHS ── */}
        {strengthData.length > 0 && (
          <motion.div variants={item} className={styles.chartCard}>
            <h2 style={{ margin: '0 0 16px' }}>💪 Academic Strengths</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {strengthData.map((s, i) => (
                <div key={i} style={{
                  padding: '6px 16px', borderRadius: '999px',
                  background: `${COLORS[i % COLORS.length]}22`,
                  border: `1px solid ${COLORS[i % COLORS.length]}55`,
                  color: COLORS[i % COLORS.length],
                  fontSize: '0.85rem', fontWeight: '600'
                }}>
                  {s.name}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── INSIGHTS ── */}
        <motion.div className={styles.insightsCard} variants={item}>
          <h2>📈 Insights & Recommendations</h2>
          <div className={styles.insightsList}>

            <div className={styles.insight}>
              <span className={styles.insightIcon}>{liveHours >= WEEKLY_GOAL_H ? '🏆' : '💡'}</span>
              <div>
                <strong>{liveHours >= WEEKLY_GOAL_H ? 'Weekly goal reached!' : 'Keep it up!'}</strong>
                <p>
                  {liveHours >= WEEKLY_GOAL_H
                    ? `You've hit your ${WEEKLY_GOAL_H}h weekly goal with ${totalHoursStr} total. Excellent work!`
                    : `You've logged ${totalHoursStr} total. ${fmtHours(Math.max(WEEKLY_GOAL_H - liveHours, 0))} left to hit your weekly goal.`}
                </p>
              </div>
            </div>

            <div className={styles.insight}>
              <span className={styles.insightIcon}>{streak >= 7 ? '🔥' : '⚡'}</span>
              <div>
                <strong>{streak >= 7 ? `${streak}-day streak! You're on fire!` : 'Build your streak'}</strong>
                <p>
                  {streak >= 7
                    ? `Your longest streak is ${longestStreak} days. Keep it alive!`
                    : streak > 0
                      ? `You're on a ${streak}-day streak! Log in tomorrow to keep it going.`
                      : 'Study for at least 1 minute today to start a streak.'}
                </p>
              </div>
            </div>

            <div className={styles.insight}>
              <span className={styles.insightIcon}>⭐</span>
              <div>
                <strong>Level {currentLevel} — {currentMilestone.name}</strong>
                <p>
                  {nextMilestone
                    ? `Earn ${(nextMilestone.xp - currentXP).toLocaleString()} more XP and reach ${nextMilestone.hours}h study time to unlock Level ${nextMilestone.level}: ${nextMilestone.name}.`
                    : "You've reached the highest level. You're a legend! 🏆"}
                </p>
              </div>
            </div>

            <div className={styles.insight}>
              <span className={styles.insightIcon}>🛡️</span>
              <div>
                <strong>Reliability: {reliability}%</strong>
                <p>
                  {reliability >= 80
                    ? 'Excellent reliability! Study partners trust you.'
                    : reliability >= 50
                      ? 'Good score. Complete more sessions and activities to improve.'
                      : 'Take the reliability quiz and engage more to boost your score.'}
                </p>
              </div>
            </div>

            <div className={styles.insight}>
              <span className={styles.insightIcon}>⏰</span>
              <div>
                <strong>Break Reminder</strong>
                <p>Take a 5-minute break every 25 minutes (Pomodoro technique) to stay sharp.</p>
              </div>
            </div>

            {userData?.subjectsOfDifficulty?.length > 0 && (
              <div className={styles.insight}>
                <span className={styles.insightIcon}>📚</span>
                <div>
                  <strong>Focus Area</strong>
                  <p>
                    Your profile shows difficulty with <strong>{userData.subjectsOfDifficulty[0]}</strong>
                    {userData.subjectsOfDifficulty.length > 1 && ` and ${userData.subjectsOfDifficulty.length - 1} other subject(s)`}.
                    Consider finding a study partner for these areas.
                  </p>
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
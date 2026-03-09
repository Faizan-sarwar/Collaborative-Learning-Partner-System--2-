import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './StudyTime.module.css';

const StudyTime = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Database Stats
  const [totalStudyHours, setTotalStudyHours] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0); // 🟢 Track XP

  // 🔹 1. LOAD INITIAL DATA
  useEffect(() => {
    const initData = async () => {
        // A. Fetch DB Stats
        try {
            const token = (localStorage.getItem('token') || sessionStorage.getItem('token')) || localStorage.getItem('token');
            if (token) {
                const res = await fetch('http://localhost:5000/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success && data.user) {
                    setTotalStudyHours(data.user.studyHours || 0);
                    setStreak(data.user.streak || 0);
                    setTotalXP(data.user.xp || 0); // 🟢 Load XP
                }
            }
        } catch (err) { console.error("Fetch stats error", err); }

        // B. Restore Timer State from LocalStorage
        const savedState = localStorage.getItem('studyTimerState');
        if (savedState) {
            const { isRunning, startTime, accumulatedTime } = JSON.parse(savedState);
            
            if (isRunning) {
                // Calculate time elapsed while user was away
                const now = Date.now();
                const elapsedSinceStart = Math.floor((now - startTime) / 1000);
                setSeconds(Math.floor(accumulatedTime / 1000) + elapsedSinceStart);
                setIsActive(true);
                setIsPaused(false);
            } else {
                // Was paused
                setSeconds(Math.floor(accumulatedTime / 1000));
                setIsActive(false);
                setIsPaused(true);
            }
        }
    };
    initData();
  }, []);

  // 🔹 2. THE TIMER ENGINE
  useEffect(() => {
    let interval = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  // 🔹 3. HELPER: UPDATE STORAGE
  const updateStorage = (running, start, accumulated) => {
    const state = {
        isRunning: running,
        startTime: start, 
        accumulatedTime: accumulated 
    };
    localStorage.setItem('studyTimerState', JSON.stringify(state));
  };

  // 🔹 4. BUTTON HANDLERS
  const handleStart = () => {
    const now = Date.now();
    const accumulatedMS = seconds * 1000;
    
    setIsActive(true);
    setIsPaused(false);
    updateStorage(true, now, accumulatedMS);
  };

  const handlePause = () => {
    setIsActive(false);
    setIsPaused(true);
    const accumulatedMS = seconds * 1000;
    updateStorage(false, null, accumulatedMS);
  };

  const handleStop = async () => {
    // 1. Stop Timer Visuals immediately
    setIsActive(false);
    setIsPaused(false);
    localStorage.removeItem('studyTimerState'); 

    const finalSeconds = seconds;
    setSeconds(0); 

    // 2. Save to DB if session > 5 seconds
    if (finalSeconds > 5) {
        try {
            const token = (localStorage.getItem('token') || sessionStorage.getItem('token')) || localStorage.getItem('token');
            
            // Calculate Hours
            const currentSessionHours = finalSeconds / 3600;
            const newTotalHours = (totalStudyHours + currentSessionHours).toFixed(2);
            
            // 🟢 Calculate XP (2 XP per minute)
            const earnedXP = Math.floor((finalSeconds / 60) * 2);
            const newTotalXP = totalXP + earnedXP;

            const res = await fetch('http://localhost:5000/api/auth/update-stats', {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                // Send Hours AND XP
                body: JSON.stringify({ 
                    studyHours: newTotalHours,
                    xp: newTotalXP 
                })
            });

            if (res.ok) {
                setTotalStudyHours(parseFloat(newTotalHours));
                setTotalXP(newTotalXP);
                
                // Sync Session Storage
                const storedUser = JSON.parse((localStorage.getItem('user') || sessionStorage.getItem('user')) || '{}');
                storedUser.studyHours = parseFloat(newTotalHours);
                storedUser.xp = newTotalXP;
                sessionStorage.setItem('user', JSON.stringify(storedUser));
                
                // Notify App
                window.dispatchEvent(new Event('userUpdated'));

                // Add Notification if XP earned
                if (earnedXP > 0) {
                    const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
                    const newNotif = {
                        id: Date.now(), 
                        title: "Session Complete! 🍅", 
                        message: `You earned ${earnedXP} XP for studying.`, 
                        type: 'success', 
                        read: false, 
                        timestamp: new Date()
                    };
                    localStorage.setItem('notifications', JSON.stringify([newNotif, ...notifs]));
                    window.dispatchEvent(new Event('notificationAdded'));
                }
            }
        } catch (err) { console.error("Save failed", err); }
    }
  };

  // 🔹 HELPERS
  const formatTime = (totalSeconds) => {
    const getSeconds = `0${(totalSeconds % 60)}`.slice(-2);
    const minutes = `${Math.floor(totalSeconds / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(totalSeconds / 3600)}`.slice(-2);
    return `${getHours}:${getMinutes}:${getSeconds}`;
  };

  const sessionHours = Math.floor(seconds / 3600);
  const sessionMinutes = Math.floor((seconds % 3600) / 60);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <DashboardLayout title="Study Time">
      <motion.div className={styles.container} variants={containerVariants} initial="hidden" animate="visible">
        <motion.div className={styles.header} variants={itemVariants}>
          <h1 className={styles.title}>Study Time Tracker</h1>
          <p className={styles.subtitle}>Timer runs in the background while you navigate.</p>
        </motion.div>

        <div className={styles.grid}>
          <motion.div className={styles.card} variants={itemVariants}>
            <div className={styles.cardIcon}>⏱️</div>
            <h3>Current Session</h3>
            <p className={styles.bigNumber}>{sessionHours}h {sessionMinutes}m</p>
            <span className={styles.label}>{isActive ? 'Recording...' : isPaused ? 'Paused' : 'Ready'}</span>
          </motion.div>

          <motion.div className={styles.card} variants={itemVariants}>
            <div className={styles.cardIcon}>📅</div>
            <h3>Total Study Time</h3>
            <p className={styles.bigNumber}>{totalStudyHours}h</p>
            <span className={styles.label}>Lifetime total</span>
          </motion.div>

          <motion.div className={styles.card} variants={itemVariants}>
            <div className={styles.cardIcon}>🎯</div>
            <h3>Focus Score</h3>
            <p className={styles.bigNumber}>{seconds > 1800 ? 'High' : seconds > 300 ? 'Medium' : '--'}</p>
            <span className={styles.label}>Based on session length</span>
          </motion.div>

          <motion.div className={styles.card} variants={itemVariants}>
            <div className={styles.cardIcon}>🔥</div>
            <h3>Current Streak</h3>
            <p className={styles.bigNumber}>{streak} days</p>
            <span className={styles.label}>Log in daily to boost streak!</span>
          </motion.div>
        </div>

        <motion.div className={styles.timerCard} variants={itemVariants}>
          <h2>{isActive ? 'Session in Progress' : isPaused ? 'Session Paused' : 'Start a Study Session'}</h2>
          
          <div className={styles.timer}>
            <span className={styles.timerDisplay}>{formatTime(seconds)}</span>
          </div>
          
          <div className={styles.timerActions}>
            {!isActive && !isPaused ? (
                <button className={styles.startBtn} onClick={handleStart}>Start Session</button>
            ) : (
                <>
                    {!isPaused ? (
                        <button className={styles.pauseBtn} onClick={handlePause}>Pause</button>
                    ) : (
                        <button className={styles.startBtn} onClick={handleStart}>Resume</button>
                    )}
                    <button className={styles.stopBtn} onClick={handleStop}>Stop & Save</button>
                </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default StudyTime;
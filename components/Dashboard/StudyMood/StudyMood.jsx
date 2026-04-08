import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, BarChart2, CheckCircle2 } from 'lucide-react';
import styles from './StudyMood.module.css';

const moods = [
  { id: 'great', emoji: '😊', label: 'Great', color: '#10b981' }, // Emerald
  { id: 'good', emoji: '🙂', label: 'Good', color: '#3b82f6' },   // Blue
  { id: 'okay', emoji: '😐', label: 'Okay', color: '#f59e0b' },   // Amber
  { id: 'tired', emoji: '😴', label: 'Tired', color: '#ef4444' }, // Red
];

const StudyMood = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // 1. LOAD MOOD FROM DATABASE / CACHE
  useEffect(() => {
    const today = new Date().toDateString();
    const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    
    // Check if the database says we already logged a mood today
    if (storedUser.lastMoodDate === today && storedUser.dailyMood) {
      setSelectedMood(storedUser.dailyMood);
    } else {
      // Fallback to local storage
      const saved = localStorage.getItem('studyMood');
      if (saved) {
        const { mood, date } = JSON.parse(saved);
        if (date === today) setSelectedMood(mood);
      }
    }
  }, []);

  // 2. SAVE MOOD TO DATABASE
  const selectMood = async (moodId) => {
    if (selectedMood === moodId || isSaving) return;
    
    setIsSaving(true);
    setSelectedMood(moodId);
    
    const today = new Date().toDateString();

    // Optimistic Local Save
    localStorage.setItem('studyMood', JSON.stringify({ mood: moodId, date: today }));

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        // Send to your backend stats route
        await fetch('http://localhost:5000/api/auth/update-stats', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ dailyMood: moodId, lastMoodDate: today })
        });

        // Update local user object so it persists across navigations
        const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
        const currentUser = JSON.parse(storage.getItem('user') || '{}');
        currentUser.dailyMood = moodId;
        currentUser.lastMoodDate = today;
        storage.setItem('user', JSON.stringify(currentUser));
        
        // Notify other components if needed
        window.dispatchEvent(new Event('userUpdated'));
      }
    } catch (err) {
      console.error("Failed to sync mood to DB", err);
    } finally {
      setIsSaving(false);
    }
  };

  const activeMoodObj = moods.find(m => m.id === selectedMood);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <div className={styles.iconWrapper}>
            <Smile size={20} className={styles.icon} />
          </div>
          <div>
            <h3 className={styles.title}>Study Mood</h3>
            <p className={styles.subtitle}>Track your energy levels</p>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedMood || 'empty'}
            className={styles.moodDisplay}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            style={{ borderColor: activeMoodObj ? activeMoodObj.color : 'var(--border-color)' }}
          >
            <span className={styles.largeEmoji}>{activeMoodObj ? activeMoodObj.emoji : '😶'}</span>
          </motion.div>
        </AnimatePresence>
        
        <p className={styles.question}>
            {selectedMood ? "Mood logged for today!" : "How are you feeling today?"}
        </p>
        
        <div className={styles.moodOptions}>
          {moods.map((mood) => (
            <motion.button
              key={mood.id}
              className={`${styles.moodBtn} ${selectedMood === mood.id ? styles.selected : ''}`}
              onClick={() => selectMood(mood.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              style={selectedMood === mood.id ? { borderColor: mood.color, backgroundColor: `${mood.color}15` } : {}}
              disabled={isSaving}
            >
              <span className={styles.moodEmoji}>{mood.emoji}</span>
              <span className={styles.moodLabel} style={selectedMood === mood.id ? { color: mood.color, fontWeight: '700' } : {}}>
                {mood.label}
              </span>
              {selectedMood === mood.id && (
                  <motion.div className={styles.checkMark} initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <CheckCircle2 size={14} color={mood.color} />
                  </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <button className={styles.analyticsBtn}>
        <BarChart2 size={16} /> View Mood Analytics
      </button>
    </div>
  );
};

export default StudyMood;
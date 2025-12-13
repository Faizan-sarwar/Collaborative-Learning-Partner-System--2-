import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './StudyMood.module.css';

const moods = [
  { id: 'great', emoji: '😊', label: 'Great', color: '#22c55e' },
  { id: 'good', emoji: '🙂', label: 'Good', color: '#3b82f6' },
  { id: 'okay', emoji: '😐', label: 'Okay', color: '#eab308' },
  { id: 'tired', emoji: '😴', label: 'Tired', color: '#ef4444' },
];

const StudyMood = () => {
  const [selectedMood, setSelectedMood] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('studyMood');
    if (saved) {
      const { mood, date } = JSON.parse(saved);
      if (date === new Date().toDateString()) {
        setSelectedMood(mood);
      }
    }
  }, []);

  const selectMood = (moodId) => {
    setSelectedMood(moodId);
    localStorage.setItem('studyMood', JSON.stringify({
      mood: moodId,
      date: new Date().toDateString()
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.icon}>😊</span>
        <div>
          <h3 className={styles.title}>Study Mood</h3>
          <p className={styles.subtitle}>Track your study mood and energy levels</p>
        </div>
        <span className={styles.newBadge}>NEW</span>
      </div>

      <div className={styles.content}>
        <div className={styles.moodIcon}>
          <span>{selectedMood ? moods.find(m => m.id === selectedMood)?.emoji : '😶'}</span>
        </div>
        
        <p className={styles.question}>How are you feeling today?</p>
        
        <div className={styles.moodOptions}>
          {moods.map((mood) => (
            <motion.button
              key={mood.id}
              className={`${styles.moodBtn} ${selectedMood === mood.id ? styles.selected : ''}`}
              onClick={() => selectMood(mood.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={selectedMood === mood.id ? { borderColor: mood.color } : {}}
            >
              <span className={styles.moodEmoji} style={{ color: mood.color }}>{mood.emoji}</span>
              <span className={styles.moodLabel}>{mood.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <button className={styles.analyticsBtn}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
        View Mood Analytics
      </button>
    </div>
  );
};

export default StudyMood;

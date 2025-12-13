import React from 'react';
import { motion } from 'framer-motion';
import styles from './QuickActions.module.css';

const actions = [
  { id: 'ai-tutor', icon: '🤖', label: 'AI Tutor' },
  { id: 'focus-rooms', icon: '🍅', label: 'Focus Rooms (Shared Pomodoro)' },
  { id: 'study-feed', icon: '📰', label: 'Study Feed' },
];

const QuickActions = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.icon}>⚡</span>
        <h3 className={styles.title}>Quick Actions</h3>
      </div>
      
      <div className={styles.actions}>
        {actions.map((action) => (
          <motion.button
            key={action.id}
            className={styles.actionBtn}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className={styles.actionIcon}>{action.icon}</span>
            <span className={styles.actionLabel}>{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;

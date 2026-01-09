import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './QuickActions.module.css';

const actions = [
  { id: 'ai-tutor', icon: '🤖', label: 'AI Tutor', path: '/messages' },
  { id: 'focus-rooms', icon: '🍅', label: 'Focus Rooms', path: '/study-room' },
  { id: 'study-feed', icon: '📰', label: 'Study Feed', path: '/social' },
  { id: 'find-partners', icon: '🤝', label: 'Find Study Partners', path: '/study-matches' },
  { id: 'track-time', icon: '⏱️', label: 'Track Study Time', path: '/analytics' },
];

const QuickActions = () => {
  const navigate = useNavigate();

  const handleAction = (path) => {
    navigate(path);
  };

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
            onClick={() => handleAction(action.path)}
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

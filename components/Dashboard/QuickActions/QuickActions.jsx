import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Timer, Newspaper, Users, BarChart3, Zap } from 'lucide-react';
import styles from './QuickActions.module.css';

const actions = [
  { 
    id: 'ai-tutor', 
    icon: <Bot size={24} />, 
    label: 'AI Tutor', 
    path: '/messages',
    color: '#8b5cf6' // Purple
  },
  { 
    id: 'focus-rooms', 
    icon: <Timer size={24} />, 
    label: 'Focus Rooms', 
    path: '/study-room',
    color: '#ef4444' // Red
  },
  { 
    id: 'study-feed', 
    icon: <Newspaper size={24} />, 
    label: 'Study Feed', 
    path: '/social',
    color: '#3b82f6' // Blue
  },
  { 
    id: 'find-partners', 
    icon: <Users size={24} />, 
    label: 'Find Partners', 
    path: '/study-matches',
    color: '#10b981' // Emerald
  },
  { 
    id: 'track-time', 
    icon: <BarChart3 size={24} />, 
    label: 'Analytics', 
    path: '/analytics',
    color: '#f59e0b' // Amber
  },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <Zap size={20} className={styles.icon} />
        </div>
        <h3 className={styles.title}>Quick Actions</h3>
      </div>
      
      <div className={styles.actions}>
        {actions.map((action) => (
          <motion.button
            key={action.id}
            className={styles.actionBtn}
            onClick={() => navigate(action.path)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div 
              className={styles.actionIconWrapper}
              style={{ color: action.color, backgroundColor: `${action.color}15` }}
            >
              {action.icon}
            </div>
            <span className={styles.actionLabel}>{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
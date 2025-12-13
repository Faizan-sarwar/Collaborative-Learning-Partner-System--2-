import React from 'react';
import { motion } from 'framer-motion';
import styles from './QuickLinks.module.css';

const links = [
  { id: 'find-match', icon: '🔍', label: 'Find New Match' },
  { id: 'create-session', icon: '📝', label: 'Create Study Session' },
  { id: 'resources', icon: '📚', label: 'Access Resources' },
];

const QuickLinks = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.icon}>⚡</span>
        <h3 className={styles.title}>Quick Links</h3>
      </div>

      <div className={styles.links}>
        {links.map((link) => (
          <motion.button
            key={link.id}
            className={styles.linkBtn}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className={styles.linkIcon}>{link.icon}</span>
            <span className={styles.linkLabel}>{link.label}</span>
            <svg className={styles.arrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;

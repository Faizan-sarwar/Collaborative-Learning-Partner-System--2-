import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Search, MonitorPlay, BookOpen, ChevronRight } from 'lucide-react';
import styles from './QuickLinks.module.css';

const QuickLinks = () => {
  const navigate = useNavigate();

  // Define links with exact paths matching your router
  const links = [
    { 
      id: 'find-match', 
      icon: <Search size={18} />, 
      label: 'Find New Match',
      path: '/study-matches',
      color: '#3b82f6' // Blue
    },
    { 
      id: 'create-session', 
      icon: <MonitorPlay size={18} />, 
      label: 'Create Study Session',
      path: '/study-time', // Or wherever your focus rooms are
      color: '#10b981' // Emerald
    },
    { 
      id: 'resources', 
      icon: <BookOpen size={18} />, 
      label: 'Access Resources',
      path: '/courses',
      color: '#8b5cf6' // Purple
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <Zap size={20} className={styles.icon} />
        </div>
        <h3 className={styles.title}>Quick Links</h3>
      </div>

      <div className={styles.links}>
        {links.map((link) => (
          <motion.button
            key={link.id}
            className={styles.linkBtn}
            onClick={() => navigate(link.path)}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div 
              className={styles.linkIconWrapper} 
              style={{ color: link.color, backgroundColor: `${link.color}15` }}
            >
              {link.icon}
            </div>
            
            <span className={styles.linkLabel}>{link.label}</span>
            
            <ChevronRight size={18} className={styles.arrow} />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;
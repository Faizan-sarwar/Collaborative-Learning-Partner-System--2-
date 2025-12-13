import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './UpcomingDeadlines.module.css';

const UpcomingDeadlines = () => {
  const [deadlines, setDeadlines] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeadline, setNewDeadline] = useState({ title: '', date: '', subject: '' });

  useEffect(() => {
    const saved = localStorage.getItem('deadlines');
    if (saved) setDeadlines(JSON.parse(saved));
  }, []);

  const addDeadline = () => {
    if (newDeadline.title && newDeadline.date) {
      const updated = [...deadlines, { ...newDeadline, id: Date.now() }];
      setDeadlines(updated);
      localStorage.setItem('deadlines', JSON.stringify(updated));
      setNewDeadline({ title: '', date: '', subject: '' });
      setShowAddModal(false);
    }
  };

  const removeDeadline = (id) => {
    const updated = deadlines.filter(d => d.id !== id);
    setDeadlines(updated);
    localStorage.setItem('deadlines', JSON.stringify(updated));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <span className={styles.icon}>📋</span>
          <div>
            <h2 className={styles.title}>Upcoming Deadlines</h2>
            <p className={styles.subtitle}>Assignment Tracker - Keep track of your assessments and assignments</p>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {deadlines.length === 0 ? (
          <motion.div 
            className={styles.emptyState}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={styles.emptyIcon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h4 className={styles.emptyTitle}>No upcoming deadlines</h4>
            <p className={styles.emptyText}>
              Stay organized and on top of your studies by adding your deadlines here.
            </p>
            <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add your first deadline
            </button>
          </motion.div>
        ) : (
          <div className={styles.deadlinesList}>
            <AnimatePresence>
              {deadlines.map((deadline) => (
                <motion.div
                  key={deadline.id}
                  className={styles.deadlineItem}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className={styles.deadlineInfo}>
                    <h4>{deadline.title}</h4>
                    <span>{deadline.subject}</span>
                    <span className={styles.date}>{deadline.date}</span>
                  </div>
                  <button 
                    className={styles.removeBtn}
                    onClick={() => removeDeadline(deadline.id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            <button className={styles.addMoreBtn} onClick={() => setShowAddModal(true)}>
              + Add Deadline
            </button>
          </div>
        )}
      </div>

      <button className={styles.manageBtn}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        Manage Deadlines
      </button>

      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
          >
            <motion.div 
              className={styles.modal}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Add Deadline</h3>
              <div className={styles.inputGroup}>
                <label>Title</label>
                <input 
                  type="text"
                  value={newDeadline.title}
                  onChange={(e) => setNewDeadline({ ...newDeadline, title: e.target.value })}
                  placeholder="e.g., Math Assignment"
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Subject</label>
                <input 
                  type="text"
                  value={newDeadline.subject}
                  onChange={(e) => setNewDeadline({ ...newDeadline, subject: e.target.value })}
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Due Date</label>
                <input 
                  type="date"
                  value={newDeadline.date}
                  onChange={(e) => setNewDeadline({ ...newDeadline, date: e.target.value })}
                />
              </div>
              <div className={styles.modalActions}>
                <button onClick={() => setShowAddModal(false)}>Cancel</button>
                <button className={styles.primaryBtn} onClick={addDeadline}>Add Deadline</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UpcomingDeadlines;

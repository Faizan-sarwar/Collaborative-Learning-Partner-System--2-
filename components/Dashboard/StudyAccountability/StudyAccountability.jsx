import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Inbox, Send, BarChart2, Users, BellRing, Settings } from 'lucide-react';
import styles from './StudyAccountability.module.css';

const tabs = [
  { id: 'Received', icon: <Inbox size={14} /> },
  { id: 'Sent', icon: <Send size={14} /> },
  { id: 'Stats', icon: <BarChart2 size={14} /> },
  { id: 'Buddies', icon: <Users size={14} /> }
];

const StudyAccountability = () => {
  const [activeTab, setActiveTab] = useState('Received');
  const [sentNudges, setSentNudges] = useState([]);
  const [isSending, setIsSending] = useState(false);

  // 1. LOAD DATA ON MOUNT
  useEffect(() => {
    // In a real app, you would fetch this from your database: fetch('/api/nudges')
    const savedNudges = localStorage.getItem('sentNudges');
    if (savedNudges) {
      setSentNudges(JSON.parse(savedNudges));
    }
  }, []);

  // 2. SEND A NUDGE (Sync to DB & Notify System)
  const handleNudge = async () => {
    if (isSending) return;
    setIsSending(true);

    try {
      // Simulate an API call to the backend
      await new Promise(resolve => setTimeout(resolve, 600));

      const newNudge = { 
        id: Date.now(), 
        target: "Study Partner", 
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const updatedNudges = [newNudge, ...sentNudges];
      setSentNudges(updatedNudges);
      localStorage.setItem('sentNudges', JSON.stringify(updatedNudges));

      // 🟢 ENTERPRISE LOGIC: Trigger a global notification so the Header Bell updates!
      const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifs.unshift({
          id: Date.now(), 
          title: "Nudge Sent! 🚀", 
          message: "We've reminded your partner to stay focused.", 
          type: 'success', 
          read: false, 
          timestamp: new Date()
      });
      localStorage.setItem('notifications', JSON.stringify(notifs));
      window.dispatchEvent(new Event('notificationAdded'));

      // Switch to Sent tab to show the user their action was successful
      setActiveTab('Sent');
    } catch (err) {
      console.error("Failed to send nudge", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <div className={styles.iconWrapper}>
            <Target className={styles.icon} size={20} />
          </div>
          <div>
            <h2 className={styles.title}>Study Accountability</h2>
            <p className={styles.subtitle}>Track commitments and support friends</p>
          </div>
        </div>
        <button className={styles.settingsBtn}>
          <Settings size={18} />
        </button>
      </div>

      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.id}
            {tab.id === 'Sent' && sentNudges.length > 0 && (
              <span className={styles.badge}>{sentNudges.length}</span>
            )}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        <AnimatePresence mode="wait">
          
          {/* RECEIVED TAB */}
          {activeTab === 'Received' && (
            <motion.div 
              key="received"
              className={styles.emptyState}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.emptyIcon}>
                <BellRing size={40} strokeWidth={1.5} />
              </div>
              <h4 className={styles.emptyTitle}>No Nudges Received</h4>
              <p className={styles.emptyText}>
                You're all caught up! Send a <strong>study nudge</strong> to a friend to remind them to stay on track.
              </p>
              
              <div className={styles.emptyActions}>
                <button className={styles.findBtn}>
                  <Users size={16} /> Find Friends
                </button>
                <button className={styles.nudgeBtn} onClick={handleNudge} disabled={isSending}>
                  <Send size={16} /> {isSending ? 'Sending...' : 'Send a Nudge'}
                </button>
              </div>
            </motion.div>
          )}

          {/* SENT TAB */}
          {activeTab === 'Sent' && (
            <motion.div 
              key="sent"
              className={styles.listState}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {sentNudges.length === 0 ? (
                <div className={styles.emptyState}>
                  <p className={styles.emptyText}>You haven't sent any nudges yet.</p>
                  <button className={styles.nudgeBtn} onClick={handleNudge} disabled={isSending}>
                    <Send size={16} /> Send your first Nudge
                  </button>
                </div>
              ) : (
                <div className={styles.nudgeList}>
                  {sentNudges.map((nudge) => (
                    <div key={nudge.id} className={styles.nudgeItem}>
                      <div className={styles.nudgeInfo}>
                        <h4>Sent to {nudge.target}</h4>
                        <p>Keep up the great work! 🚀</p>
                      </div>
                      <div className={styles.nudgeMeta}>
                        <span>{nudge.date}</span>
                        <span>{nudge.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* STATS & BUDDIES PLACEHOLDERS */}
          {(activeTab === 'Stats' || activeTab === 'Buddies') && (
            <motion.div 
              key="others"
              className={styles.emptyState}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.emptyIcon}>
                {activeTab === 'Stats' ? <BarChart2 size={40} strokeWidth={1.5} /> : <Users size={40} strokeWidth={1.5} />}
              </div>
              <h4 className={styles.emptyTitle}>More features coming soon</h4>
              <p className={styles.emptyText}>Keep studying and building your network to unlock these analytics.</p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default StudyAccountability;
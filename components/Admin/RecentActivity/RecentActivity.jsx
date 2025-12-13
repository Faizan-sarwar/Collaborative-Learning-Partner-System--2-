import React from 'react';
import styles from './RecentActivity.module.css';

const activities = [
  { id: 1, action: 'New student registered', user: 'John Smith', time: '2 min ago', type: 'registration' },
  { id: 2, action: 'Course published', user: 'Admin User', time: '15 min ago', type: 'course' },
  { id: 3, action: 'Student blocked', user: 'Super Admin', time: '1 hour ago', type: 'moderation' },
  { id: 4, action: 'Settings updated', user: 'Admin User', time: '2 hours ago', type: 'settings' },
  { id: 5, action: 'Bulk notification sent', user: 'Super Admin', time: '3 hours ago', type: 'notification' },
  { id: 6, action: 'New admin created', user: 'Super Admin', time: '5 hours ago', type: 'admin' },
];

const RecentActivity = () => {
  const getTypeIcon = (type) => {
    const icons = {
      registration: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
      ),
      course: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
      moderation: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        </svg>
      ),
      settings: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
      notification: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
      admin: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    };
    return icons[type] || null;
  };

  const getTypeColor = (type) => {
    const colors = {
      registration: 'green',
      course: 'blue',
      moderation: 'red',
      settings: 'purple',
      notification: 'orange',
      admin: 'teal',
    };
    return colors[type] || 'blue';
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>Recent Activity</h3>
        <button className={styles.viewAllBtn}>View All</button>
      </div>

      <div className={styles.activityList}>
        {activities.map((activity) => (
          <div key={activity.id} className={styles.activityItem}>
            <div className={`${styles.activityIcon} ${styles[getTypeColor(activity.type)]}`}>
              {getTypeIcon(activity.type)}
            </div>
            <div className={styles.activityContent}>
              <p className={styles.activityAction}>{activity.action}</p>
              <div className={styles.activityMeta}>
                <span className={styles.activityUser}>{activity.user}</span>
                <span className={styles.activityTime}>{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;

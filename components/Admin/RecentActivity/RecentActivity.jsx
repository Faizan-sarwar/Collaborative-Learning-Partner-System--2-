import React, { useEffect, useState } from 'react';
import styles from './RecentActivity.module.css';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ================= FETCH ACTIVITY =================
  const fetchRecentActivity = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/auth/admin/recent-activity');
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch activity');
      }

      setActivities(data.activities);
      setError(null);
    } catch (err) {
      console.error('Activity fetch error:', err);
      setError('Unable to load recent activity');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentActivity();

    // Auto refresh every 30 seconds
    const interval = setInterval(fetchRecentActivity, 30000);
    return () => clearInterval(interval);
  }, []);

  // ================= TIME FORMAT =================
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const intervals = [
      { label: 'hour', seconds: 3600 },
      { label: 'min', seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
      }
    }
    return 'Just now';
  };

  // ================= ICONS =================
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
    };
    return icons[type] || icons.registration;
  };

  const getTypeColor = (type) => {
    const colors = {
      registration: 'green',
      course: 'blue',
      moderation: 'red',
    };
    return colors[type] || 'blue';
  };

  // ================= LOADING / ERROR =================
  if (loading) {
    return <div className={styles.card}>Loading recent activity...</div>;
  }

  if (error) {
    return <div className={styles.card}>{error}</div>;
  }

  // ================= RENDER =================
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>Recent Activity</h3>
        <button className={styles.viewAllBtn}>View All</button>
      </div>

      <div className={styles.activityList}>
        {activities.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No recent activity</p>
        ) : (
          activities.map((activity, index) => (
            <div key={index} className={styles.activityItem}>
              <div className={`${styles.activityIcon} ${styles[getTypeColor(activity.type)]}`}>
                {getTypeIcon(activity.type)}
              </div>
              <div className={styles.activityContent}>
                <p className={styles.activityAction}>{activity.action}</p>
                <div className={styles.activityMeta}>
                  <span className={styles.activityUser}>{activity.user}</span>
                  <span className={styles.activityTime}>
                    {timeAgo(activity.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity;

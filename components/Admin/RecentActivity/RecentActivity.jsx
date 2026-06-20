import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, BookOpen, ShieldAlert, Settings, LogIn, Loader2, Activity } from 'lucide-react';
import styles from './RecentActivity.module.css';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ================= FETCH ACTIVITY SECURELY =================
  const fetchRecentActivity = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) throw new Error('Authentication token missing.');

      const res = await fetch(`http://${window.location.hostname}:5000/api/auth/admin/recent-activity`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch activity');
      }

      setActivities(data.activities || []);
      setError(null);
    } catch (err) {
      console.error('Activity fetch error:', err);
      // Only set error if we don't already have data, to prevent wiping out the UI on a failed background poll
      if (activities.length === 0) setError('Unable to load recent activity');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentActivity();
    const interval = setInterval(fetchRecentActivity, 30000); // 30s background poll
    return () => clearInterval(interval);
  }, []);

  // ================= ENTERPRISE TIME FORMAT =================
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = [
      { label: 'day', seconds: 86400 },
      { label: 'hr', seconds: 3600 },
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

  // ================= SMART FILTERING =================
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  
  // Filter for 7 days AND slice to top 8 so it doesn't break the dashboard layout
  const filteredActivities = activities
    .filter(activity => (new Date() - new Date(activity.createdAt)) <= SEVEN_DAYS_MS)
    .slice(0, 8); 

  // ================= ICONOGRAPHY =================
  const getTypeConfig = (type) => {
    const configs = {
      registration: { icon: UserPlus, colorClass: 'green' },
      course: { icon: BookOpen, colorClass: 'blue' },
      moderation: { icon: ShieldAlert, colorClass: 'red' },
      settings: { icon: Settings, colorClass: 'purple' },
      login: { icon: LogIn, colorClass: 'teal' }
    };
    return configs[type] || { icon: Activity, colorClass: 'blue' };
  };

  // ================= LOADING / ERROR STATES =================
  if (loading && activities.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.centerState}>
           <Loader2 size={28} className={styles.spinner} />
           <p>Syncing activity feed...</p>
        </div>
      </div>
    );
  }

  if (error && activities.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.centerState}>
           <ShieldAlert size={28} color="#ef4444" />
           <p className={styles.errorText}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3>Recent Activity</h3>
          <span className={styles.subtitle}>Platform events from the last 7 days</span>
        </div>
        <button className={styles.viewAllBtn} onClick={() => navigate('/admin/logs')}>
          View All
        </button>
      </div>

      <div className={styles.activityList}>
        {filteredActivities.length === 0 ? (
          <div className={styles.emptyState}>
             <Activity size={32} />
             <p>No recent activity detected.</p>
          </div>
        ) : (
          filteredActivities.map((activity, index) => {
            const { icon: Icon, colorClass } = getTypeConfig(activity.type);
            const isLast = index === filteredActivities.length - 1;
            
            return (
              <div key={index} className={styles.activityItem}>
                {/*  Vertical Timeline Line */}
                {!isLast && <div className={styles.timelineLine}></div>}
                
                <div className={`${styles.activityIcon} ${styles[colorClass]}`}>
                  <Icon size={16} />
                </div>
                
                <div className={styles.activityContent}>
                  <p className={styles.activityAction}>{activity.action}</p>
                  <div className={styles.activityMeta}>
                    <span className={styles.activityUser}>{activity.user}</span>
                    <span className={styles.activityTime}>{timeAgo(activity.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
import React, { useEffect, useState } from 'react';
import { 
  Users, UserCheck, UserX, UserPlus, BookOpen, Shield, 
  Loader2, AlertCircle, TrendingUp, TrendingDown, Minus 
} from 'lucide-react';
import styles from './StatsCards.module.css';

const StatsCards = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ================= SECURE FETCH =================
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) throw new Error("Authentication token missing.");

      const res = await fetch(`http://${window.location.hostname}:5000/api/auth/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch stats');
      }

      setStats(data.stats);
      setError(null);
    } catch (err) {
      console.error('Stats fetch error:', err);
      // Prevent wiping existing data on a failed background poll
      if (!stats) setError('Unable to load statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // ================= LOADING / ERROR STATES =================
  if (loading && !stats) {
    return (
      <div className={styles.centerStateCard}>
        <Loader2 className={styles.spinner} size={28} />
        <p>Loading platform metrics...</p>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className={styles.centerStateCard}>
        <AlertCircle size={28} color="#ef4444" />
        <p className={styles.errorText}>{error}</p>
      </div>
    );
  }

  // ================= MAP DATA TO CARDS =================
  const cards = [
    {
      id: 'total-students',
      label: 'Total Students',
      value: stats?.totalStudents || 0,
      change: 'Live',
      isPositive: true,
      icon: Users,
      color: 'blue',
    },
    {
      id: 'active-students',
      label: 'Active Students',
      value: stats?.activeStudents || 0,
      change: 'Live',
      isPositive: true,
      icon: UserCheck,
      color: 'green',
    },
    {
      id: 'blocked-students',
      label: 'Blocked Students',
      value: stats?.blockedStudents || 0,
      change: 'Live',
      isPositive: false,
      icon: UserX,
      color: 'red',
    },
    {
      id: 'new-today',
      label: 'New Today',
      value: stats?.newToday || 0,
      change: 'Today',
      isPositive: true,
      icon: UserPlus,
      color: 'purple',
    },
    {
      id: 'total-courses',
      label: 'Total Courses',
      value: stats?.totalCourses || 0,
      change: 'Live',
      isPositive: true,
      icon: BookOpen,
      color: 'teal',
    },
    {
      id: 'total-admins',
      label: 'Total Admins',
      value: stats?.totalAdmins || 0,
      change: 'Stable',
      isPositive: null,
      icon: Shield,
      color: 'orange',
    },
  ];

  return (
    <div className={styles.statsGrid}>
      {cards.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <div key={stat.id} className={`${styles.statCard} ${styles[stat.color]}`}>
            <div className={styles.statIcon}>
              <IconComponent size={24} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>{stat.label}</span>
              <span className={styles.statValue}>
                {stat.value.toLocaleString()}
              </span>
              
              {/*  Enterprise Trend Indicators */}
              <div className={`${styles.statChangeWrapper} ${
                stat.isPositive === true ? styles.positive : 
                stat.isPositive === false ? styles.negative : styles.neutral
              }`}>
                {stat.isPositive === true && <TrendingUp size={14} />}
                {stat.isPositive === false && <TrendingDown size={14} />}
                {stat.isPositive === null && <Minus size={14} />}
                <span className={styles.statChangeText}>{stat.change}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
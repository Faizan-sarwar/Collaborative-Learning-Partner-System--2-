import React from 'react';
import styles from './StatsCards.module.css';

const stats = [
  {
    id: 'total-students',
    label: 'Total Students',
    value: '2,847',
    change: '+12.5%',
    isPositive: true,
    icon: 'students',
    color: 'blue',
  },
  {
    id: 'active-students',
    label: 'Active Students',
    value: '2,156',
    change: '+8.2%',
    isPositive: true,
    icon: 'active',
    color: 'green',
  },
  {
    id: 'blocked-students',
    label: 'Blocked Students',
    value: '23',
    change: '-5.1%',
    isPositive: true,
    icon: 'blocked',
    color: 'red',
  },
  {
    id: 'new-today',
    label: 'New Today',
    value: '47',
    change: '+23.1%',
    isPositive: true,
    icon: 'new',
    color: 'purple',
  },
  {
    id: 'total-courses',
    label: 'Total Courses',
    value: '128',
    change: '+3 new',
    isPositive: true,
    icon: 'courses',
    color: 'teal',
  },
  {
    id: 'total-admins',
    label: 'Total Admins',
    value: '8',
    change: 'No change',
    isPositive: null,
    icon: 'admins',
    color: 'orange',
  },
];

const StatsCards = () => {
  const renderIcon = (iconName) => {
    const icons = {
      students: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      active: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      blocked: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        </svg>
      ),
      new: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
      ),
      courses: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
      admins: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    };
    return icons[iconName] || null;
  };

  return (
    <div className={styles.statsGrid}>
      {stats.map((stat) => (
        <div key={stat.id} className={`${styles.statCard} ${styles[stat.color]}`}>
          <div className={styles.statIcon}>{renderIcon(stat.icon)}</div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>{stat.label}</span>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={`${styles.statChange} ${stat.isPositive === true ? styles.positive : stat.isPositive === false ? styles.negative : ''}`}>
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;

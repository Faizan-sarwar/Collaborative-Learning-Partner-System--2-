import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './DashboardSidebar.module.css';

const navItems = [
  { id: 'dashboard', icon: 'grid', label: 'Dashboard', path: '/dashboard' },
  { id: 'study-time', icon: 'clock', label: 'Study Time', path: '/study-time' },
  { id: 'courses', icon: 'book', label: 'Courses', path: '/courses' },
  { id: 'social', icon: 'users', label: 'Social', path: '/social' },
  { id: 'analytics', icon: 'chart', label: 'Analytics', path: '/analytics' },
];

const sidebarWidgets = [
  { id: 'weekly-progress', title: 'Weekly Progress', subtitle: 'Ready to start!', icon: '📊', color: 'purple' },
  { id: 'study-streak', title: 'Study Streak', subtitle: 'Plant First Seed', icon: '🌱', color: 'green' },
  { id: 'study-partners', title: 'Study Partners', subtitle: 'Find Partners', icon: '👋', color: 'yellow' },
  { id: 'next-deadline', title: 'Next Deadline', subtitle: 'No deadlines yet!', icon: '📅', color: 'red' },
];

const DashboardSidebar = () => {
  const location = useLocation();
  const [activeWidget, setActiveWidget] = useState(null);

  const renderIcon = (iconName) => {
    const icons = {
      grid: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
      clock: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      book: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
      users: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      chart: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 20V10" />
          <path d="M12 20V4" />
          <path d="M6 20v-6" />
        </svg>
      ),
    };
    return icons[iconName] || null;
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="6" fill="url(#logoGrad)" />
              <path d="M7 12h10M12 7v10" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="24" y2="24">
                  <stop stopColor="#8B5CF6" />
                  <stop offset="1" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className={styles.logoText}>CLPS</span>
        </div>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>{renderIcon(item.icon)}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.widgets}>
        {sidebarWidgets.map((widget) => (
          <div
            key={widget.id}
            className={`${styles.widget} ${styles[widget.color]} ${activeWidget === widget.id ? styles.activeWidget : ''}`}
            onClick={() => setActiveWidget(widget.id)}
          >
            <span className={styles.widgetIcon}>{widget.icon}</span>
            <div className={styles.widgetInfo}>
              <strong>{widget.title}</strong>
              <span>{widget.subtitle}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <span className={styles.versionText}>v1.0.0</span>
      </div>
    </aside>
  );
};

export default DashboardSidebar;

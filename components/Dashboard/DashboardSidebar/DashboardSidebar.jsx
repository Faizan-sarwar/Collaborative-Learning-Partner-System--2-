import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../../../src/context/SettingsContext';
import { 
  LayoutDashboard, Clock, BookOpen, UserPlus, Users, UserCheck, 
  MessageSquare, Zap, Trophy, BarChart3, Settings, 
  TrendingUp, Flame, CalendarDays 
} from 'lucide-react';
import styles from './DashboardSidebar.module.css';

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { id: 'study-time', icon: Clock, label: 'Study Time', path: '/study-time' },
  { id: 'courses', icon: BookOpen, label: 'Courses', path: '/courses' },
  { id: 'study-matches', icon: UserPlus, label: 'Study Matches', path: '/study-matches' },
  { id: 'connections', icon: Users, label: 'Connections', path: '/connections' },
  { id: 'pending-connections', icon: UserCheck, label: 'Pending', path: '/pending-connections' },
  { id: 'messages', icon: MessageSquare, label: 'Messages', path: '/messages' },
  { id: 'xp', icon: Zap, label: 'XP & Rewards', path: '/xp' },
  { id: 'gamification', icon: Trophy, label: 'Gamification', path: '/gamification' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
];

const DashboardSidebar = () => {
  const location = useLocation();
  const [activeWidget, setActiveWidget] = useState(null);
  const { settings } = useSettings(); 
  
  const [badges, setBadges] = useState({});
  const [widgetData, setWidgetData] = useState({
    hours: 0,
    streak: 0,
    connections: 0
  });

  const calculateBadgesAndWidgets = () => {
    const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    const storedNotifs = JSON.parse(localStorage.getItem('notifications') || '[]');

    // --- BADGES LOGIC ---
    let newBadges = {};
    if (storedUser.receivedRequests && storedUser.receivedRequests.length > 0) {
      newBadges['pending-connections'] = true;
    }

    const hasUnreadMessages = storedNotifs.some(n => 
      (n.type === 'message' || n.title.toLowerCase().includes('message')) && 
      (n.unread === true || (n.unread === undefined && !n.read))
    );
    if (hasUnreadMessages) {
      newBadges['messages'] = true;
    }
    setBadges(newBadges);

    // --- WIDGET DATA LOGIC ---
    setWidgetData({
        hours: storedUser.studyHours || 0,
        streak: storedUser.streak || 0,
        connections: storedUser.connections ? storedUser.connections.length : 0
    });
  };

  useEffect(() => {
    calculateBadgesAndWidgets(); 
    window.addEventListener('userUpdated', calculateBadgesAndWidgets);
    window.addEventListener('notificationAdded', calculateBadgesAndWidgets);
    
    return () => {
      window.removeEventListener('userUpdated', calculateBadgesAndWidgets);
      window.removeEventListener('notificationAdded', calculateBadgesAndWidgets);
    };
  }, []);

  // Dynamically populated widgets based on user data
  const sidebarWidgets = [
    { 
        id: 'weekly-progress', 
        title: 'Study Progress', 
        subtitle: `${widgetData.hours.toFixed(1)}h logged`, 
        icon: <TrendingUp size={20} />, 
        color: 'purple' 
    },
    { 
        id: 'study-streak', 
        title: 'Study Streak', 
        subtitle: `${widgetData.streak} days active`, 
        icon: <Flame size={20} />, 
        color: 'green' 
    },
    { 
        id: 'study-partners', 
        title: 'Network', 
        subtitle: `${widgetData.connections} connections`, 
        icon: <Users size={20} />, 
        color: 'yellow' 
    },
    { 
        id: 'next-deadline', 
        title: 'Deadlines', 
        subtitle: 'Check calendar', 
        icon: <CalendarDays size={20} />, 
        color: 'red' 
    },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#grad1)" />
              <path d="M2 17L12 22L22 17" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="grad1" x1="2" y1="2" x2="22" y2="22">
                  <stop stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className={styles.logoText}>{settings?.platformName || 'Loading...'}</span>
        </div>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>
                <Icon size={20} />
                {badges[item.id] && <span className={styles.redDot}></span>}
              </span>
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.widgets}>
        {sidebarWidgets.map((widget) => (
          <div
            key={widget.id}
            className={`${styles.widget} ${styles[widget.color]} ${activeWidget === widget.id ? styles.activeWidget : ''}`}
            onClick={() => setActiveWidget(widget.id)}
          >
            <span className={styles.widgetIconWrapper}>{widget.icon}</span>
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
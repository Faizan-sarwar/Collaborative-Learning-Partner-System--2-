import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './DashboardHeader.module.css';
import { useNotification } from '../../../src/context/NotificationContext';

import maleLevel1 from '../../../src/assets/gamification/male-level-1.png';
import femaleLevel1 from '../../../src/assets/gamification/female-level-1.png';

const DashboardHeader = ({ title, isFullWidth }) => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [user, setUser] = useState(JSON.parse((localStorage.getItem('user') || sessionStorage.getItem('user'))) || {});
  const [notifications, setNotifications] = useState([]);

  const menuRef = useRef(null);
  const notifRef = useRef(null);

  const loadUser = () => {
    const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    setUser(storedUser);
  };

  // 🟢 FIX: The "Fork in the Road" - Admins and Students get different feeds
  const loadNotifications = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token || !user.role) return;

      // Route Admins to the admin feed, and Students to their personal feed
      const endpoint = (user.role === 'admin' || user.role === 'super-admin')
        ? 'http://localhost:5000/api/auth/admin/notifications'
        : 'http://localhost:5000/api/notifications';

      const res = await fetch(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.success && data.notifications) {
        setNotifications(data.notifications);
      } else {
        const localNotifs = JSON.parse(localStorage.getItem('notifications') || '[]');
        setNotifications(localNotifs);
      }
    } catch (err) {
      console.error("Failed to load notifications", err);
      const localNotifs = JSON.parse(localStorage.getItem('notifications') || '[]');
      setNotifications(localNotifs);
    }
  };

  // 🟢 REAL-TIME SYNC: This makes the Red Dots react instantly when someone else interacts with the user
  useEffect(() => {
    loadUser();
    loadNotifications();

    const handleUserUpdate = () => loadUser();
    const handleNotificationAdd = () => loadNotifications();
    window.addEventListener('userUpdated', handleUserUpdate);
    window.addEventListener('notificationAdded', handleNotificationAdd);

    // BACKGROUND WATCHER: Checks the database every 5 seconds
    const liveSync = setInterval(async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) return;

        // 1. Check for New Notifications (Messages, XP, etc)
        const endpoint = (user.role === 'admin' || user.role === 'super-admin')
          ? 'http://localhost:5000/api/auth/admin/notifications'
          : 'http://localhost:5000/api/notifications';

        const notifRes = await fetch(endpoint, { headers: { 'Authorization': `Bearer ${token}` } });
        const notifData = await notifRes.json();

        if (notifData.success) {
          // If there's new data, update local storage and shout out to the Sidebar to react!
          localStorage.setItem('notifications', JSON.stringify(notifData.notifications));
          setNotifications(notifData.notifications);
          window.dispatchEvent(new Event('notificationAdded'));
        }

        // 2. Check for New Connection Requests
        if (user.role === 'student') {
          const userRes = await fetch('http://localhost:5000/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } });
          const userData = await userRes.json();

          if (userData.success) {
            localStorage.setItem('user', JSON.stringify(userData.user));
            setUser(userData.user);
            window.dispatchEvent(new Event('userUpdated')); // Wakes up the Pending Connections dot!
          }
        }

      } catch (e) {
        // Silently ignore network errors so it doesn't disrupt the user
      }
    }, 5000); // 5000ms = checks every 5 seconds

    return () => {
      clearInterval(liveSync); // Cleanup when they log out
      window.removeEventListener('userUpdated', handleUserUpdate);
      window.removeEventListener('notificationAdded', handleNotificationAdd);
    };
  }, [user.role]);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowProfileMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = async () => {
    const updated = notifications.map(n => ({ ...n, unread: false, read: true }));
    setNotifications(updated);

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      // Only students need to mark personal notifications as read in the DB
      if (user.role === 'student') {
        await fetch('http://localhost:5000/api/notifications/read', {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (e) { console.error("Failed to mark read in DB"); }
  };

  const clearNotifications = async () => {
    setNotifications([]); // Instantly clear UI

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      // Only students clear personal notifications. Admins shouldn't wipe global system logs!
      if (user.role === 'student') {
        await fetch('http://localhost:5000/api/notifications/clear', {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (e) { console.error("Failed to delete notifications in DB"); }
  };

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
    } catch (err) { console.error("Logout failed", err); }
    finally {
      localStorage.removeItem('studyTimerState');
      sessionStorage.clear();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('notifications');
      localStorage.removeItem('streakData');
      navigate('/login');
    }
  };

  const getAvatarSrc = () => {
    if (user.settings?.showAvatar === false) {
      return user._id ? `http://localhost:5000/api/auth/student/${user._id}/picture` : `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`;
    }
    if (user.gender?.toLowerCase() === 'female') return femaleLevel1;
    return maleLevel1;
  };

  const unreadCount = notifications.filter(n => n.unread === true || (n.unread === undefined && !n.read)).length;

  return (
    <header
      className={styles.header}
      style={isFullWidth ? { left: 0, width: '100vw', maxWidth: '100vw', marginLeft: 0, borderRadius: 0 } : {}}
    >
      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          <img src={getAvatarSrc()} alt="User" onError={(e) => e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`} />
        </div>
        <div className={styles.greeting}>
          <span className={styles.hello}>Hi, {user.fullName ? user.fullName.split(' ')[0] : 'Student'}</span>
          <span className={styles.welcomeText}>Welcome back!</span>
        </div>
      </div>

      <div className={styles.searchBar}>
        <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
        <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={styles.searchInput} />
      </div>

      <div className={styles.actions}>
        <button className={styles.iconBtn} onClick={toggleTheme}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
        </button>

        <div className={styles.notificationSection} ref={notifRef}>
          <button className={styles.iconBtn} onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) markAllAsRead(); }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
            {unreadCount > 0 && <span className={styles.notifBadge}>{unreadCount}</span>}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div className={styles.notificationDropdown} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className={styles.notifHeader}>
                  <h3>Notifications</h3>
                  {user.role === 'student' && <button className={styles.markAllBtn} onClick={clearNotifications}>Clear All</button>}
                </div>
                <div className={styles.notifList}>
                  {notifications.length === 0 ? (
                    <div className={styles.emptyNotif}><p>No new notifications</p></div>
                  ) : (
                    notifications.map((notif, index) => (
                      <div key={notif._id || index} className={`${styles.notifItem} ${notif.unread || !notif.read ? styles.unread : ''}`}>
                        <div className={styles.notifIcon}>
                          {notif.type === 'achievement' || notif.type === 'success' ? '🎉' : '🔔'}
                        </div>
                        <div className={styles.notifContent}>
                          <span className={styles.notifTitle}>{notif.title}</span>
                          <p className={styles.notifMessage}>{notif.message}</p>
                          <span className={styles.notifTime}>
                            {notif.createdAt || notif.timestamp ? new Date(notif.createdAt || notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                          </span>
                        </div>
                        {(notif.unread || (notif.unread === undefined && !notif.read)) && <div className={styles.unreadDot} />}
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button className={styles.startTimer} onClick={() => navigate('/study-time')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
          Start timer
        </button>
        <Link to='/refer' className={styles.referBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
          Refer
        </Link>

        <div className={styles.profileSection} ref={menuRef}>
          <button className={styles.profileBtn} onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <img src={getAvatarSrc()} alt="Profile" onError={(e) => e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`} />
          </button>
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div className={styles.profileMenu} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className={styles.menuHeader}>
                  <img src={getAvatarSrc()} alt="Profile" />
                  <div>
                    <span className={styles.menuName}>{user.fullName}</span>
                    <span className={styles.menuEmail}>{user.email}</span>
                  </div>
                </div>
                <div className={styles.menuDivider} />
                <Link to={`/user-profile/${user._id}`} className={styles.menuItem}>Profile</Link>
                <Link to="/settings" className={styles.menuItem}>Settings</Link>
                <div className={styles.menuDivider} />
                <button className={styles.menuItemLogout} onClick={handleLogout}>Log out</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
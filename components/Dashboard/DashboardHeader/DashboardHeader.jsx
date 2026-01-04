import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './DashboardHeader.module.css';

// Import Avatar assets
import maleLevel1 from '../../../src/assets/gamification/male-level-1.png';
import femaleLevel1 from '../../../src/assets/gamification/female-level-1.png';

const DashboardHeader = () => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')) || {});
  
  // 🔹 REAL STATE for Notifications
  const [notifications, setNotifications] = useState([]); 
  
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  // 🔹 1. FETCH NOTIFICATIONS FROM DB
  const fetchNotifications = async () => {
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      if (!token) return;

      const res = await fetch('http://localhost:5000/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  // Initial Fetch + Polling every 30s
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Listen for User Updates (Profile/Gamification changes)
  useEffect(() => {
    const handleUserUpdate = () => {
      const storedUser = JSON.parse(sessionStorage.getItem('user'));
      if (storedUser) setUser(storedUser);
    };
    window.addEventListener('userUpdated', handleUserUpdate);
    return () => window.removeEventListener('userUpdated', handleUserUpdate);
  }, []);

  // Handle Click Outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowProfileMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 🔹 2. HANDLE NOTIFICATION CLICK (Fixed Redirection)
  const handleNotificationClick = async (notif) => {
    // A. Optimistic UI Update (Mark as read instantly)
    setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, unread: false } : n));

    // B. API Call to Mark as Read
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/notifications/${notif._id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) { console.error(err); }

    // C. 🟢 REDIRECT LOGIC
    if (notif.type === 'connection') {
      // Redirect to Pending Connections Page to Accept/Decline
      navigate('/pending-connections');
    } else if (notif.link) {
      // Use the link provided by the backend (if any)
      navigate(notif.link);
    }

    setShowNotifications(false);
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      await fetch('http://localhost:5000/api/notifications/read-all', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Helper: Current User Avatar
  const getAvatarSrc = () => {
    if (user.settings?.showAvatar) {
      if (user.gender?.toLowerCase() === 'female') return femaleLevel1;
      return maleLevel1;
    }
    if (user._id) return `http://localhost:5000/api/auth/student/${user._id}/picture`;
    return `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`;
  };

  // Helper: Sender Avatar (for notifications)
  const getSenderAvatar = (sender) => {
    if (!sender) return null;
    // If sender has a picture uploaded
    if (sender.picture) return `http://localhost:5000/api/auth/student/${sender._id}/picture`;
    // Fallback
    return `https://api.dicebear.com/7.x/initials/svg?seed=${sender.fullName}`;
  };

  // Helper: Time Format
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 60000); // minutes
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} min ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  // Helper: Icons
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'connection': return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>;
      case 'study': return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
      case 'achievement': return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;
      default: return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className={styles.header}>
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
        <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={styles.searchInput} />
      </div>

      <div className={styles.actions}>
        <button className={styles.iconBtn} onClick={toggleTheme}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg></button>

        {/* 🟢 NOTIFICATION SECTION (LOGICAL) */}
        <div className={styles.notificationSection} ref={notifRef}>
          <button className={styles.iconBtn} onClick={() => setShowNotifications(!showNotifications)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            {unreadCount > 0 && <span className={styles.notifBadge}>{unreadCount}</span>}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div className={styles.notificationDropdown} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className={styles.notifHeader}>
                  <h3>Notifications</h3>
                  {unreadCount > 0 && <button className={styles.markAllBtn} onClick={markAllAsRead}>Mark all read</button>}
                </div>
                <div className={styles.notifList}>
                  {notifications.length === 0 ? (
                    <div className={styles.emptyNotif}>
                        <p>No new notifications</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif._id} 
                        className={`${styles.notifItem} ${notif.unread ? styles.unread : ''}`}
                        onClick={() => handleNotificationClick(notif)} // 👈 FIXED REDIRECT HERE
                        style={{ cursor: 'pointer' }}
                      >
                        <div className={styles.notifIcon}>
                            {/* If sender has avatar, show it, else show icon */}
                            {notif.sender ? (
                                <img 
                                    src={getSenderAvatar(notif.sender)} 
                                    alt="sender" 
                                    className={styles.notifAvatarImg}
                                    style={{width:'32px', height:'32px', borderRadius:'50%', objectFit:'cover'}}
                                    onError={(e) => {e.target.style.display='none';}} 
                                />
                            ) : (
                                getNotificationIcon(notif.type)
                            )}
                        </div>
                        <div className={styles.notifContent}>
                          <span className={styles.notifTitle}>{notif.title}</span>
                          <p className={styles.notifMessage}>{notif.message}</p>
                          <span className={styles.notifTime}>{formatTime(notif.createdAt)}</span>
                        </div>
                        {notif.unread && <div className={styles.unreadDot} />}
                      </div>
                    ))
                  )}
                </div>
                <Link to="/notifications" className={styles.viewAllBtn} onClick={() => setShowNotifications(false)}>
                  View All Notifications
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button className={styles.startTimer}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>Start timer</button>
        <button className={styles.studyRooms}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>Study Rooms</button>
        <button className={styles.referBtn}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>Refer</button>

        <div className={styles.profileSection} ref={menuRef}>
          <button className={styles.profileBtn} onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <img src={getAvatarSrc()} alt="Profile" onError={(e) => e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`} />
          </button>
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div className={styles.profileMenu} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className={styles.menuHeader}>
                  <img src={getAvatarSrc()} alt="Profile" onError={(e) => e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`} />
                  <div><span className={styles.menuName}>{user.fullName}</span><span className={styles.menuEmail}>{user.email}</span></div>
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
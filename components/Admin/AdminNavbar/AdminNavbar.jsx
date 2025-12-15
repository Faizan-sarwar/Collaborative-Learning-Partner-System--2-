import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './AdminNavbar.module.css';
import ThemeToggle from '../../ThemeToggle/ThemeToggle';

// Simple notification sound (Beep)
const NOTIFICATION_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

const AdminNavbar = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 🔹 User & UI State
  const [user, setUser] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  // 🔹 Notification State
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Sound & Tracking Refs
  const audioRef = useRef(new Audio(NOTIFICATION_SOUND));
  const lastNotificationId = useRef(null); 

  // 🔹 Load User Info on Mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user') || localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 🔹 Get Page Title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path.includes('students')) return 'Student Management';
    if (path.includes('admins')) return 'Admin Management';
    if (path.includes('courses')) return 'Course Management';
    if (path.includes('notifications')) return 'Notifications';
    if (path.includes('logs')) return 'Activity Logs';
    if (path.includes('settings')) return 'Settings';
    if (path.includes('profile')) return 'Profile';
    return 'Admin Panel';
  };

  const handleNavigation = (path) => {
    navigate(path);
    setShowProfile(false);
  };

  // 🔹 Helper: Format Time
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return date.toLocaleDateString();
  };

  // 🔹 Fetch Notifications Logic
  const fetchNotifications = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/admin/notifications');
      const data = await res.json();

      if (data.success && Array.isArray(data.notifications) && data.notifications.length > 0) {
        const latestNotif = data.notifications[0];

        // CHECK IF NEW NOTIFICATION ARRIVED
        if (lastNotificationId.current && lastNotificationId.current !== latestNotif._id) {
          audioRef.current.play().catch(e => console.log("Audio play blocked"));
          setUnreadCount(prev => prev + 1); 
        }

        if (!lastNotificationId.current) {
            lastNotificationId.current = latestNotif._id;
        } else {
            lastNotificationId.current = latestNotif._id;
        }

        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  // 🔹 Polling (Every 5 seconds)
  useEffect(() => {
    fetchNotifications(); 
    const interval = setInterval(fetchNotifications, 5000); 
    return () => clearInterval(interval);
  }, []);

  const handleToggleNotifications = () => {
    if (!showNotifications) {
      setUnreadCount(0); // Clear badge on open
    }
    setShowNotifications(!showNotifications);
  };

  // 🔹 Profile Picture Helper
  const renderProfileImage = () => {
    // 1. Image found (and no error loading it)
    if (user && user._id && !imgError) {
      return (
        <div style={{
            width: '32px', 
            height: '32px', 
            minWidth: '32px', // Prevent shrinking
            borderRadius: '50%', 
            overflow: 'hidden',
            marginRight: '8px',
            border: '1px solid var(--border-color)'
        }}>
            <img 
              src={`http://localhost:5000/api/auth/student/${user._id}/picture`} 
              alt="Admin"
              onError={() => setImgError(true)}
              style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', // Ensures image fills circle without stretching
                  display: 'block'
              }}
            />
        </div>
      );
    }

    // 2. Fallback: Initials Circle
    const initials = user?.fullName 
      ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
      : 'AD';
      
    return (
        <div className={styles.profileAvatar} style={{
            width: '32px', 
            height: '32px', 
            minWidth: '32px',
            fontSize: '12px',
            marginRight: '8px'
        }}>
            {initials}
        </div>
    );
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
      </div>

      <div className={styles.right}>
        <div className={styles.searchBox}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Search..." className={styles.searchInput} />
        </div>

        <ThemeToggle />

        {/* 🔔 Notification Bell */}
        <div className={styles.notificationWrapper}>
          <button 
            className={styles.iconBtn}
            onClick={handleToggleNotifications}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && <span className={styles.notificationBadge}>{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <span>Notifications</span>
                <button className={styles.markAllRead} onClick={() => setUnreadCount(0)}>Mark read</button>
              </div>
              <div className={styles.dropdownContent}>
                {notifications.length === 0 ? (
                   <div className={styles.emptyState}>No notifications yet</div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif._id} className={styles.notificationItem}>
                      <p className={styles.notifText}>
                        <strong>{notif.title}</strong>
                        <br/>
                        <span className={styles.notifUser}>{notif.message}</span>
                      </p>
                      <span className={styles.notifTime}>{formatTimeAgo(notif.createdAt)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* 👤 Profile Dropdown */}
        <div className={styles.profileWrapper}>
          <button 
            className={styles.profileBtn}
            onClick={() => setShowProfile(!showProfile)}
            style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '0' }}
          >
            {/* ⚡ UPDATED: Renders Image or Initials */}
            {renderProfileImage()}
            
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {showProfile && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader} style={{padding: '10px 15px', borderBottom: '1px solid var(--border-color)'}}>
                  <strong style={{display:'block', color: 'var(--text-primary)'}}>{user?.fullName || 'Admin'}</strong>
                  <span style={{fontSize:'0.8rem', color: 'var(--text-secondary)'}}>{user?.email}</span>
              </div>
              <div className={styles.dropdownContent}>
                <button onClick={() => handleNavigation('/admin/profile')} className={styles.dropdownItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Profile
                </button>
                <button onClick={() => handleNavigation('/admin/settings')} className={styles.dropdownItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  Settings
                </button>
                <div className={styles.dropdownDivider}></div>
                <button onClick={() => {
                    sessionStorage.clear();
                    localStorage.clear();
                    window.location.href = '/login';
                }} className={styles.dropdownItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
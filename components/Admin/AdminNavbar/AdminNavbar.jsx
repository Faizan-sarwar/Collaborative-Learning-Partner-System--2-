import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, Search, Bell, ChevronDown, User as UserIcon, 
  Settings, LogOut, ShieldCheck, Lock 
} from 'lucide-react';
import styles from './AdminNavbar.module.css';
import ThemeToggle from '../../ThemeToggle/ThemeToggle';
import { useSettings } from '../../../src/context/SettingsContext'; 

const NOTIFICATION_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

const AdminNavbar = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useSettings();
  
  const [user, setUser] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const audioRef = useRef(typeof Audio !== "undefined" ? new Audio(NOTIFICATION_SOUND) : null);
  const lastNotificationId = useRef(null); 
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    if (storedUser && storedUser._id) {
      setUser(storedUser);
    }
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard Overview';
    if (path.includes('students')) return 'Student Management';
    if (path.includes('admins')) return 'Admin Management';
    if (path.includes('courses')) return 'Course Management';
    if (path.includes('notifications')) return 'System Notifications';
    if (path.includes('logs')) return 'Activity Logs';
    if (path.includes('settings')) return 'Platform Settings';
    if (path.includes('profile')) return 'Admin Profile';
    return 'Admin Control Panel';
  };

  const handleNavigation = (path) => {
    navigate(path);
    setShowProfile(false);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((new Date() - date) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`http://${window.location.hostname}:5000/api/auth/admin/notifications`);
      const data = await res.json();

      if (data.success && Array.isArray(data.notifications)) {
        setNotifications(data.notifications);

        if (data.notifications.length > 0) {
            const latestNotif = data.notifications[0];
            if (lastNotificationId.current && lastNotificationId.current !== latestNotif._id) {
                // Safe audio play handling to prevent browser autoplay blocks
                if (audioRef.current) {
                  audioRef.current.currentTime = 0;
                  audioRef.current.play().catch(() => console.log("Audio blocked by browser"));
                }
                setUnreadCount(prev => prev + 1);
            }
            lastNotificationId.current = latestNotif._id;
        }
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications(); 
    const interval = setInterval(fetchNotifications, 10000); // Polling every 10s for admin
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowProfile(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleNotifications = () => {
    if (!showNotifications) setUnreadCount(0); 
    setShowNotifications(!showNotifications);
  };

  const handleMarkRead = () => {
    setUnreadCount(0);
    setNotifications([]); 
  };

  const handleLogout = () => {
    if (settings?.maintenanceMode) return; // Silent block if in maintenance mode
    sessionStorage.clear();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const renderProfileImage = () => {
    if (user && user._id && !imgError) {
      return (
        <div className={styles.profileImageWrapper}>
            <img 
              src={`http://localhost:5000/api/auth/student/${user._id}/picture`} 
              alt="Admin" 
              onError={() => setImgError(true)}
              className={styles.profileImage}
            />
        </div>
      );
    }
    const initials = user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'AD';
    return <div className={styles.profileAvatar}>{initials}</div>;
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
      </div>

      <div className={styles.right}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input type="text" placeholder="Search records..." className={styles.searchInput} />
        </div>

        <ThemeToggle />

        {/* 🔔 NOTIFICATION BELL */}
        <div className={styles.notificationWrapper} ref={notifRef}>
          <button className={styles.iconBtn} onClick={handleToggleNotifications}>
            <Bell size={18} />
            {unreadCount > 0 && <span className={styles.notificationBadge}>{unreadCount > 9 ? '9+' : unreadCount}</span>}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                className={styles.dropdown}
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
              >
                <div className={styles.dropdownHeader}>
                  <span>System Alerts</span>
                  <button className={styles.markAllRead} onClick={handleMarkRead}>Clear all</button>
                </div>
                <div className={styles.dropdownContent}>
                  {notifications.length === 0 ? (
                     <div className={styles.emptyState}>All systems nominal. No new alerts.</div>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif._id} className={styles.notificationItem}>
                        <p className={styles.notifText}>
                          <strong>{notif.title}</strong><br/>
                          <span className={styles.notifUser}>{notif.message}</span>
                        </p>
                        <span className={styles.notifTime}>{formatTimeAgo(notif.createdAt)}</span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 👤 PROFILE DROPDOWN */}
        <div className={styles.profileWrapper} ref={menuRef}>
          <button className={styles.profileBtn} onClick={() => setShowProfile(!showProfile)}>
            {renderProfileImage()}
            <span className={styles.profileName}>{user?.fullName ? user.fullName.split(' ')[0] : 'Admin'}</span>
            <ChevronDown size={14} className={styles.chevron} />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div 
                className={styles.dropdown}
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
              >
                <div className={styles.dropdownProfileHeader}>
                  <div className={styles.dropdownProfileInfo}>
                    <strong>{user?.fullName || 'System Administrator'}</strong>
                    <span>{user?.email || 'admin@system.com'}</span>
                  </div>
                  <ShieldCheck size={20} className={styles.adminBadgeIcon} />
                </div>
                
                <div className={styles.dropdownContent}>
                  <button onClick={() => handleNavigation('/admin/profile')} className={styles.dropdownItem}>
                    <UserIcon size={16} /> My Profile
                  </button>
                  <button onClick={() => handleNavigation('/admin/settings')} className={styles.dropdownItem}>
                    <Settings size={16} /> Global Settings
                  </button>
                  
                  <div className={styles.dropdownDivider}></div>
                  
                  {/* 🟢 HARD LOCKDOWN: Logout Button Security */}
                  <button 
                    onClick={handleLogout} 
                    className={`${styles.dropdownItem} ${styles.logoutItem} ${settings?.maintenanceMode ? styles.disabledItem : ''}`}
                    disabled={settings?.maintenanceMode}
                    title={settings?.maintenanceMode ? "Disabled to prevent lockout during maintenance" : "Sign out of admin panel"}
                  >
                    {settings?.maintenanceMode ? <Lock size={16} /> : <LogOut size={16} />} 
                    {settings?.maintenanceMode ? 'Logout Locked' : 'Sign Out'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
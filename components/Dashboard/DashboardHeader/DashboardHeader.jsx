import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './DashboardHeader.module.css';

const DashboardHeader = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const userName = user?.fullName || 'Student';
  const userEmail = user?.email || 'student@email.com';
  const userPicture = user?.pictureUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=student';

  return (
    <header className={styles.header}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          <img src={userPicture} alt="User" />
        </div>
        <div className={styles.greeting}>
          <span className={styles.hello}>Hi, {userName}</span>
          <span className={styles.welcomeText}>Welcome!</span>
        </div>
      </div>

      <div className={styles.searchBar}>
        <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search for friends by email or username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.actions}>
        <button className={styles.iconBtn} onClick={toggleTheme} title="Toggle theme">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </button>

        {/* Other buttons like Notifications, Timer, Study Rooms... */}
        
        <div className={styles.profileSection} ref={menuRef}>
          <button 
            className={styles.profileBtn}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <img src={userPicture} alt="Profile" />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                className={styles.profileMenu}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className={styles.menuHeader}>
                  <img src={userPicture} alt="Profile" />
                  <div>
                    <span className={styles.menuName}>{userName}</span>
                    <span className={styles.menuEmail}>{userEmail}</span>
                  </div>
                </div>
                <div className={styles.menuDivider} />
                <Link to="/profile" className={styles.menuItem}>Profile</Link>
                <Link to="/settings" className={styles.menuItem}>Settings</Link>
                <div className={styles.menuDivider} />
                <button className={styles.menuItemLogout} onClick={() => {
                  localStorage.removeItem('user');
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}>Log out</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

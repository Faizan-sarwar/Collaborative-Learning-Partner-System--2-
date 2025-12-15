import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './DashboardHeader.module.css';

const DashboardHeader = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [imgError, setImgError] = useState(false);
  
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Load user data
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user') || localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Close menu on click outside
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

  // 🔹 ROBUST LOGOUT FUNCTION
  const handleLogout = async () => {
    // 1. Get token BEFORE clearing storage
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    
    if (token) {
      try {
        // 2. Send request to backend
        // We use 'await' to ensure the request fires before we redirect
        await fetch('http://localhost:5000/api/auth/logout', {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error("Logout backend failed", error);
      }
    }

    // 3. Clear Storage
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // 4. Force Redirect
    navigate('/login');
  };

  const userName = user?.fullName || 'Student';
  const userEmail = user?.email || 'student@email.com';
  
  // Profile Picture Component
  const ProfileAvatar = ({ size = "40px", fontSize = "1.2rem" }) => {
    if (user && user._id && !imgError) {
      return (
        <img 
          src={`http://localhost:5000/api/auth/student/${user._id}/picture`} 
          alt="Profile" 
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
        />
      );
    }
    return (
      <div style={{
        width: '100%', height: '100%', borderRadius: '50%', 
        backgroundColor: '#e0e7ff', color: '#4f46e5',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 'bold', fontSize: fontSize
      }}>
        {userName.split(' ').map(n => n[0]).join('')}
      </div>
    );
  };

  return (
    <header className={styles.header}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          <ProfileAvatar />
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
          placeholder="Search for friends..."
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

        <div className={styles.profileSection} ref={menuRef}>
          <button 
            className={styles.profileBtn}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div style={{width: '32px', height: '32px'}}>
               <ProfileAvatar size="32px" fontSize="0.9rem" />
            </div>
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
                  <div style={{width: '40px', height: '40px', marginRight: '10px'}}>
                    <ProfileAvatar />
                  </div>
                  <div>
                    <span className={styles.menuName}>{userName}</span>
                    <span className={styles.menuEmail}>{userEmail}</span>
                  </div>
                </div>
                <div className={styles.menuDivider} />
                <Link to="/profile" className={styles.menuItem}>Profile</Link>
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
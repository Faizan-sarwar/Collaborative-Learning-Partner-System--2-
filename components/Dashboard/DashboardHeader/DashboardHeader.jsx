import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Moon, Sun, Bell, Play, Gift, 
  User as UserIcon, Settings, LogOut, 
  MessageSquare, AlertCircle, Award 
} from 'lucide-react';
import styles from './DashboardHeader.module.css';

import maleLevel1 from '../../../src/assets/gamification/male-level-1.png';
import maleLevel2 from '../../../src/assets/gamification/male-level-2.png';
import maleLevel3 from '../../../src/assets/gamification/male-level-3.png';
import maleLevel4 from '../../../src/assets/gamification/male-level-4.png';
import maleLevel5 from '../../../src/assets/gamification/male-level-5.png';
import maleLevel6 from '../../../src/assets/gamification/male-level-6.png';
import maleLevel7 from '../../../src/assets/gamification/male-level-7.png';

import femaleLevel1 from '../../../src/assets/gamification/female-level-1.png';
import femaleLevel2 from '../../../src/assets/gamification/female-level-2.png';
import femaleLevel3 from '../../../src/assets/gamification/female-level-3.png';
import femaleLevel4 from '../../../src/assets/gamification/female-level-4.png';
import femaleLevel5 from '../../../src/assets/gamification/female-level-5.png';
import femaleLevel6 from '../../../src/assets/gamification/female-level-6.png';
import femaleLevel7 from '../../../src/assets/gamification/female-level-7.png';

const avatars = {
  male: { 1: maleLevel1, 2: maleLevel2, 3: maleLevel3, 4: maleLevel4, 5: maleLevel5, 6: maleLevel6, 7: maleLevel7 },
  female: { 1: femaleLevel1, 2: femaleLevel2, 3: femaleLevel3, 4: femaleLevel4, 5: femaleLevel5, 6: femaleLevel6, 7: femaleLevel7 }
};

const mergeNotifications = (localArray, remoteArray) => {
  const combined = [...localArray, ...remoteArray];
  const uniqueMap = new Map();
  
  combined.forEach(notif => {
    const key = notif._id || notif.id; 
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, notif);
    } else {
      const existing = uniqueMap.get(key);
      if (notif.read !== undefined) existing.read = notif.read;
      if (notif.unread !== undefined) existing.unread = notif.unread;
    }
  });

  return Array.from(uniqueMap.values()).sort((a, b) => {
    return new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt);
  });
};

const DashboardHeader = ({ title, isFullWidth }) => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(true);

  const [user, setUser] = useState(JSON.parse((localStorage.getItem('user') || sessionStorage.getItem('user'))) || {});
  const [notifications, setNotifications] = useState([]);

  const menuRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || localStorage.getItem('theme') || 'dark';
    setIsDark(currentTheme === 'dark');
  }, []);

  const loadUser = () => {
    const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    setUser(storedUser);
  };

  useEffect(() => {
    if (!user || !user._id) return;
    const welcomeKey = `has_received_welcome_${user._id}`;
    if (!localStorage.getItem(welcomeKey)) {
      const currentLocalNotifs = JSON.parse(localStorage.getItem('notifications') || '[]');
      const newInjections = [{
        id: `welcome-${Date.now()}`,
        title: 'Welcome to the Platform! 🎉',
        message: `Hi ${user.fullName.split(' ')[0]}, your learning journey begins now. Start by finding study matches!`,
        type: 'success',
        read: false,
        timestamp: new Date().toISOString()
      }];

      if (user.xp === 0 || user.xp === 10) {
        newInjections.push({
          id: `xp-${Date.now() + 1}`,
          title: 'Welcome Bonus! ⚡',
          message: 'You received 10 XP for joining. Level up by logging study time!',
          type: 'achievement',
          read: false,
          timestamp: new Date().toISOString()
        });
      }

      const merged = mergeNotifications(newInjections, currentLocalNotifs);
      localStorage.setItem('notifications', JSON.stringify(merged));
      setNotifications(merged);
      localStorage.setItem(welcomeKey, 'true');
      window.dispatchEvent(new Event('notificationAdded'));
    }
  }, [user]);

  const loadNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token || !user.role) return;

      const endpoint = (user.role === 'admin' || user.role === 'super-admin')
        ? 'http://localhost:5000/api/auth/admin/notifications'
        : 'http://localhost:5000/api/notifications';

      const res = await fetch(endpoint, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      let backendNotifs = data.success ? data.notifications : [];

      if (user.role === 'student') {
          const chatRes = await fetch('http://localhost:5000/api/chat/conversations', { headers: { 'Authorization': `Bearer ${token}` } });
          const chatData = await chatRes.json();
          if (chatData.success) {
              const totalUnread = chatData.conversations.reduce((sum, conv) => sum + (conv.unread || 0), 0);
              if (totalUnread > 0) {
                  backendNotifs.unshift({
                      id: 'global-unread-messages',
                      title: 'New Messages',
                      message: `You have ${totalUnread} unread chat message(s).`,
                      type: 'message',
                      read: false,
                      timestamp: new Date().toISOString()
                  });
              } else {
                 // Remove it if they read everything
                 const localNotifs = JSON.parse(localStorage.getItem('notifications') || '[]');
                 const filtered = localNotifs.filter(n => n.id !== 'global-unread-messages');
                 localStorage.setItem('notifications', JSON.stringify(filtered));
              }
          }
      }

      const localNotifs = JSON.parse(localStorage.getItem('notifications') || '[]').filter(n => n.id !== 'global-unread-messages' || backendNotifs.some(b => b.id === 'global-unread-messages'));
      const merged = mergeNotifications(localNotifs, backendNotifs);
      
      setNotifications(merged);
      localStorage.setItem('notifications', JSON.stringify(merged));

    } catch (err) {}
  }, [user.role]);

  useEffect(() => {
    loadUser();
    loadNotifications();

    const handleUserUpdate = () => loadUser();
    const handleNotificationAdd = () => loadNotifications(); 
    
    // 🟢 NEW: Listen for when a user reads a chat on the Messages page
    const handleChatRead = () => {
      const localNotifs = JSON.parse(localStorage.getItem('notifications') || '[]');
      const filtered = localNotifs.filter(n => n.id !== 'global-unread-messages');
      localStorage.setItem('notifications', JSON.stringify(filtered));
      setNotifications(filtered);
    };

    window.addEventListener('userUpdated', handleUserUpdate);
    window.addEventListener('notificationAdded', handleNotificationAdd);
    window.addEventListener('chatRead', handleChatRead);

    const liveSync = setInterval(() => {
      loadNotifications();
    }, 5000);

    return () => {
      clearInterval(liveSync);
      window.removeEventListener('userUpdated', handleUserUpdate);
      window.removeEventListener('notificationAdded', handleNotificationAdd);
      window.removeEventListener('chatRead', handleChatRead);
    };
  }, [user.role, loadNotifications]);

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
    localStorage.setItem('notifications', JSON.stringify(updated));
    window.dispatchEvent(new Event('notificationAdded'));

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (user.role === 'student') {
        await fetch('http://localhost:5000/api/notifications/read', {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (e) {}
  };

  const clearNotifications = async () => {
    setNotifications([]);
    localStorage.setItem('notifications', JSON.stringify([])); 
    window.dispatchEvent(new Event('notificationAdded'));
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (user.role === 'student') {
        await fetch('http://localhost:5000/api/notifications/clear', { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      }
    } catch (e) {}
  };

  // 🟢 SMART REDIRECT HANDLER
  const handleNotificationClick = async (notif) => {
    setShowNotifications(false); // Close dropdown
    
    // Mark as read locally
    const updated = notifications.map(n => n.id === notif.id || n._id === notif._id ? { ...n, unread: false, read: true } : n);
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));

    // Redirect based on type
    if (notif.type === 'message') {
      navigate('/messages');
    } else if (notif.title.includes('Connection') || notif.type === 'connection') {
      navigate('/pending-connections');
    } else if (notif.type === 'achievement') {
      navigate('/gamification');
    }
  };

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setIsDark(newTheme === 'dark');
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await fetch('http://localhost:5000/api/auth/logout', { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } });
    } catch (err) {}
    finally {
      localStorage.removeItem('studyTimerState');
      sessionStorage.clear();
      localStorage.clear();
      navigate('/login');
    }
  };

  const getAvatarSrc = () => {
    if (user.settings?.showAvatar === false) {
      return user._id ? `http://localhost:5000/api/auth/student/${user._id}/picture?t=${Date.now()}` : `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`;
    }
    const gender = user.gender?.toLowerCase() === 'female' ? 'female' : 'male';
    const level = user.level || 1;
    return avatars[gender]?.[level] || avatars['male'][1];
  };

  const unreadCount = notifications.filter(n => n.unread === true || (n.unread === undefined && !n.read)).length;

  const getNotifIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'achievement':
      case 'success': return <Award size={20} className={styles.iconSuccess} />;
      case 'message': return <MessageSquare size={20} className={styles.iconMessage} />;
      case 'reminder': return <AlertCircle size={20} className={styles.iconWarning} />;
      default: return <Bell size={20} className={styles.iconDefault} />;
    }
  };

  return (
    <header className={styles.header} style={isFullWidth ? { left: 0, width: '100vw', maxWidth: '100vw', marginLeft: 0, borderRadius: 0 } : {}}>
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
        <Search className={styles.searchIcon} size={18} />
        <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={styles.searchInput} />
      </div>

      <div className={styles.actions}>
        <button className={styles.iconBtn} onClick={toggleTheme} title="Toggle Theme">
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className={styles.notificationSection} ref={notifRef}>
          <button className={styles.iconBtn} onClick={() => { setShowNotifications(!showNotifications); }}>
            <Bell size={18} />
            {unreadCount > 0 && <span className={styles.notifBadge}>{unreadCount > 9 ? '9+' : unreadCount}</span>}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div className={styles.notificationDropdown} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className={styles.notifHeader}>
                  <h3>Notifications</h3>
                  <div style={{display: 'flex', gap: '10px'}}>
                      <button className={styles.markAllBtn} onClick={markAllAsRead}>Mark Read</button>
                      {user.role === 'student' && <button className={styles.markAllBtn} onClick={clearNotifications}>Clear</button>}
                  </div>
                </div>
                <div className={styles.notifList}>
                  {notifications.length === 0 ? (
                    <div className={styles.emptyNotif}><p>No new notifications</p></div>
                  ) : (
                    notifications.map((notif, index) => (
                      <div 
                        key={notif.id || notif._id || index} 
                        className={`${styles.notifItem} ${notif.unread || !notif.read ? styles.unread : ''}`}
                        onClick={() => handleNotificationClick(notif)}
                      >
                        <div className={styles.notifIcon}>
                          {getNotifIcon(notif.type)}
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
          <Play size={16} fill="currentColor" /> Start Timer
        </button>
        <button className={styles.referBtn} onClick={() => navigate('/refer')}>
          <Gift size={16} /> Refer
        </button>

        <div className={styles.profileSection} ref={menuRef}>
          <button className={styles.profileBtn} onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <img src={getAvatarSrc()} alt="Profile" onError={(e) => e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`} />
          </button>
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div className={styles.profileMenu} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className={styles.menuHeader}>
                  <img src={getAvatarSrc()} alt="Profile" />
                  <div className={styles.menuUserInfo}>
                    <span className={styles.menuName}>{user.fullName}</span>
                    <span className={styles.menuEmail}>{user.email}</span>
                  </div>
                </div>
                <div className={styles.menuDivider} />
                <Link to={`/user-profile/${user._id || user.id}`} className={styles.menuItem}><UserIcon size={16} /> Profile</Link>
                <Link to="/settings" className={styles.menuItem}><Settings size={16} /> Settings</Link>
                <div className={styles.menuDivider} />
                <button className={styles.menuItemLogout} onClick={handleLogout}><LogOut size={16} /> Log out</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
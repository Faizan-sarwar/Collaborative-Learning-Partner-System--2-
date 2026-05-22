import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Moon, Sun, Bell, Play, Gift,
  User as UserIcon, Settings, LogOut,
  MessageSquare, AlertCircle, Award, Menu, Check, Trash2
} from 'lucide-react';
import styles from './DashboardHeader.module.css';


// ─── Constants ────────────────────────────────────────────────────────────────
const API = `http://${window.location.hostname}:5000/api`;
const POLL_MS = 8000; // poll every 8s — not 5s, reduces server load

const avatars = {
  male: { 1: maleLevel1, 2: maleLevel2, 3: maleLevel3, 4: maleLevel4, 5: maleLevel5, 6: maleLevel6, 7: maleLevel7 },
  female: { 1: femaleLevel1, 2: femaleLevel2, 3: femaleLevel3, 4: femaleLevel4, 5: femaleLevel5, 6: femaleLevel6, 7: femaleLevel7 }
};

const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
  } catch { return {}; }
};

// ─── Notification helpers ─────────────────────────────────────────────────────

/**
 * Normalise a notification from ANY source (DB, local, chat-derived)
 * into one consistent shape so the rest of the code never has to guess.
 *
 * DB shape:   { _id, recipient, type, title, message, link, unread: true/false, createdAt }
 * Local shape: { id, type, title, message, read: true/false, timestamp }
 */
const normalise = (n) => ({
  // canonical id — always a string
  id: String(n._id || n.id || ''),
  // canonical read flag — unread:true means NOT read
  isUnread: n.unread === true || (n.unread === undefined && n.read === false),
  type: (n.type || 'system').toLowerCase(),
  title: n.title || '',
  message: n.message || '',
  link: n.link || null,
  createdAt: n.createdAt || n.timestamp || new Date().toISOString(),
  // keep originals for API calls that need _id
  _id: n._id || null,
  // mark origin so we know whether to call API or just update localStorage
  _local: !n._id,
});

/**
 * Merge two arrays of normalised notifications deduplicating by id.
 * Remote (DB) values win on read-state because they are the source of truth.
 */
const mergeNotifications = (local = [], remote = []) => {
  const map = new Map();

  // Local first (lower priority)
  local.forEach(n => map.set(n.id, n));

  // Remote overwrites — crucially, remote read-state wins
  remote.forEach(n => {
    map.set(n.id, { ...map.get(n.id), ...n });
  });

  return Array.from(map.values())
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// ─── Welcome notification — injected ONCE per user, stored in localStorage ───
const WELCOME_FLAG = (userId) => `welcome_injected_${userId}`;

const buildWelcomeNotifications = (user) => {
  const now = new Date().toISOString();
  const notes = [
    {
      id: `welcome-${user._id}`,
      isUnread: true,
      type: 'success',
      title: 'Welcome to the Platform! 🎉',
      message: `Hi ${user.fullName?.split(' ')[0] || 'there'}, your learning journey starts now. Find study matches to get started!`,
      link: '/matches',
      createdAt: now,
      _local: true,
    }
  ];

  // Only add XP bonus note if they genuinely have 0 XP (brand new) or the
  // signup flow awarded exactly 10 welcome XP — don't show this to returning users
  if ((user.xp ?? 0) <= 10) {
    notes.push({
      id: `welcome-xp-${user._id}`,
      isUnread: true,
      type: 'achievement',
      title: 'Welcome Bonus! ⚡',
      message: 'You received 10 XP for joining. Level up by logging study time and connecting with peers!',
      link: '/gamification',
      createdAt: new Date(Date.now() - 1).toISOString(), // 1ms earlier so welcome is on top
      _local: true,
    });
  }

  return notes;
};

const getLocalKey = (userId) => `local_notifs_${userId}`;

const readLocalNotifs = (userId) => {
  if (!userId) return [];
  try { return JSON.parse(localStorage.getItem(getLocalKey(userId)) || '[]'); }
  catch { return []; }
};

const writeLocalNotifs = (userId, arr) => {
  if (!userId) return;
  localStorage.setItem(getLocalKey(userId), JSON.stringify(arr.filter(n => n._local)));
};

// ─── Component ────────────────────────────────────────────────────────────────
const DashboardHeader = ({ title, isFullWidth, toggleSidebar }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(getStoredUser);
  const [imgCacheKey, setImgCacheKey] = useState(Date.now);
  const [isDark, setIsDark] = useState(() => {
    const t = document.documentElement.getAttribute('data-theme') || localStorage.getItem('theme') || 'dark';
    return t === 'dark';
  });

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const menuRef = useRef(null);
  const notifRef = useRef(null);

  // ── Load user from storage ───────────────────────────────────────────────
  const loadUser = useCallback(() => {
    const u = getStoredUser();
    setUser(u);
    setImgCacheKey(Date.now());
  }, []);

  // ── Welcome notification (runs once per user id) ─────────────────────────
  useEffect(() => {
    if (!user?._id) return;

    const flag = WELCOME_FLAG(user._id);
    if (localStorage.getItem(flag)) return; // already injected

    // Determine if this is truly a new user:
    // New users have no study hours, no connections, and very low XP
    const isNewUser = (
      (user.studyHours ?? 0) === 0 &&
      (user.connections?.length ?? 0) === 0 &&
      (user.xp ?? 0) <= 10
    );

    if (!isNewUser) {
      // Existing user: mark flag so we never inject welcome again
      localStorage.setItem(flag, 'existing');
      return;
    }

    // Inject welcome notes into local storage
    const welcomeNotes = buildWelcomeNotifications(user);
    const existingLocal = readLocalNotifs();
    // Avoid duplicating if component remounts before flag is set
    const alreadyHas = existingLocal.some(n => n.id === welcomeNotes[0].id);
    if (!alreadyHas) {
      writeLocalNotifs([...welcomeNotes, ...existingLocal]);
    }
    localStorage.setItem(flag, 'new');

  }, [user._id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Core notification fetch ───────────────────────────────────────────────
  const loadNotifications = useCallback(async () => {
    const token = getToken();
    if (!token || !user?.role) return;

    try {
      // ── 1. Fetch DB notifications based on role ──────────────────────────
      let dbNotifs = [];

      if (user.role === 'admin' || user.role === 'super-admin') {
        // Admin: only system/registration/admin notifications
        const res = await fetch(`${API}/auth/admin/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) dbNotifs = data.notifications;

      } else {
        // Student: personal notifications from the dedicated endpoint
        // GET /api/notifications returns { success, notifications: [...] }
        // where each notification has { _id, type, title, message, link, unread, createdAt }
        const res = await fetch(`${API}/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) dbNotifs = data.notifications;
        }
        // If the endpoint 404s (route doesn't exist yet in this project),
        // we gracefully fall through with empty dbNotifs — local notifs still show.
      }

      const normDB = dbNotifs.map(normalise);

      // ── 2. Inject unread chat count as a synthetic notification ──────────
      // Only for students — admin doesn't use chat
      let chatNotif = null;
      if (user.role === 'student') {
        try {
          const chatRes = await fetch(`${API}/chat/conversations`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (chatRes.ok) {
            const chatData = await chatRes.json();
            if (chatData.success) {
              const totalUnread = chatData.conversations.reduce(
                (sum, c) => sum + (c.unread || 0), 0
              );
              if (totalUnread > 0) {
                chatNotif = normalise({
                  id: 'synthetic-chat-unread',
                  type: 'message',
                  title: 'New Messages',
                  message: `You have ${totalUnread} unread message${totalUnread > 1 ? 's' : ''}.`,
                  link: '/messages',
                  unread: true,
                  createdAt: new Date().toISOString(),
                });
              }
            }
          }
        } catch { /* chat fetch failing should never crash notifications */ }
      }

      // ── 3. Read local-only notifications (welcome, etc.) ─────────────────
      const localNotifs = readLocalNotifs().map(normalise);

      // ── 4. Merge: local + DB + optional chat synthetic ───────────────────
      // Order: chat synthetic first (most urgent), then merge rest
      const merged = mergeNotifications(localNotifs, normDB);
      const final = chatNotif ? [chatNotif, ...merged.filter(n => n.id !== 'synthetic-chat-unread')] : merged;

      setNotifications(final);

      // Persist only local ones back — DB ones are always refetched
      writeLocalNotifs(final);

    } catch (err) {
      console.error('[DashboardHeader] loadNotifications:', err);
      // On error, still show whatever we have locally
      const localNotifs = readLocalNotifs().map(normalise);
      setNotifications(localNotifs);
    }
  }, [user.role]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Event listeners + polling ────────────────────────────────────────────
  useEffect(() => {
    loadUser();
    loadNotifications();

    const onUserUpdated = () => loadUser();
    const onNotificationAdd = () => loadNotifications();
    const onChatRead = () => {
      // Remove the synthetic chat notification immediately
      setNotifications(prev => prev.filter(n => n.id !== 'synthetic-chat-unread'));
    };

    window.addEventListener('userUpdated', onUserUpdated);
    window.addEventListener('notificationAdded', onNotificationAdd);
    window.addEventListener('chatRead', onChatRead);

    const poll = setInterval(loadNotifications, POLL_MS);

    return () => {
      window.removeEventListener('userUpdated', onUserUpdated);
      window.removeEventListener('notificationAdded', onNotificationAdd);
      window.removeEventListener('chatRead', onChatRead);
      clearInterval(poll);
    };
  }, [loadUser, loadNotifications]);

  // ── Click outside ────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowProfileMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Mark all as read ─────────────────────────────────────────────────────
  const markAllAsRead = async () => {
    // 1. Optimistic UI
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));

    // 2. Update local storage (local notifications)
    const updated = readLocalNotifs().map(n => ({ ...n, isUnread: false, read: true, unread: false }));
    writeLocalNotifs(updated);

    // 3. Tell backend to mark all DB notifications as read
    const token = getToken();
    if (!token || user.role !== 'student') return;
    try {
      await fetch(`${API}/notifications/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('[DashboardHeader] markAllAsRead:', err);
    }
  };

  // ── Clear all notifications ───────────────────────────────────────────────
  const clearNotifications = async () => {
    // 1. Optimistic UI — keep the chat synthetic if present (real-time data)
    setNotifications(prev => prev.filter(n => n.id === 'synthetic-chat-unread'));

    // 2. Wipe local storage notifications
    writeLocalNotifs([]);

    // 3. Tell backend to delete all DB notifications for this user
    const token = getToken();
    if (!token || user.role !== 'student') return;
    try {
      await fetch(`${API}/notifications/clear`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('[DashboardHeader] clearNotifications:', err);
    }
  };

  // ── Click a single notification ───────────────────────────────────────────
  const handleNotificationClick = async (notif) => {
    setShowNotifications(false);

    // 1. Mark as read in UI
    setNotifications(prev =>
      prev.map(n => n.id === notif.id ? { ...n, isUnread: false } : n)
    );

    // 2. Persist read state for local notifications
    if (notif._local) {
      const updated = readLocalNotifs().map(n =>
        n.id === notif.id ? { ...n, isUnread: false, read: true, unread: false } : n
      );
      writeLocalNotifs(updated);
    } else if (notif._id) {
      // 3. Tell backend to mark this specific DB notification as read
      // Most backends expose PUT /api/notifications/:id/read
      // We fire-and-forget — the next poll will confirm
      const token = getToken();
      if (token) {
        fetch(`${API}/notifications/${notif._id}/read`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => { });
      }
    }

    // 4. Navigate to relevant page
    const dest = notif.link ||
      (notif.type === 'message' ? '/messages' :
        notif.type === 'connection' ? '/pending-connections' :
          notif.type === 'achievement' ? '/gamification' : null);

    if (dest) navigate(dest);
  };

  // ── Theme toggle ──────────────────────────────────────────────────────────
  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setIsDark(!isDark);
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    const token = getToken();
    try {
      if (token) {
        await fetch(`${API}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
      }
    } catch { /* always proceed with logout */ }
    finally {
      // Clear everything — in correct order
      sessionStorage.clear();
      localStorage.removeItem('studyTimerState');
      // Do NOT wipe LOCAL_KEY here so welcome flag persists across sessions
      // (prevents re-injecting welcome on next login)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  // ── Avatar source ─────────────────────────────────────────────────────────
  const getAvatarSrc = () => {
    if (!user) return `https://api.dicebear.com/7.x/initials/svg?seed=ST`;
    if (user.settings?.showAvatar === false && user._id) {
      return `${API}/auth/student/${user._id}/picture?t=${imgCacheKey}`;
    }
    const gender = user.gender?.toLowerCase() === 'female' ? 'female' : 'male';
    const level = Math.min(Math.max(user.level || 1, 1), 7);
    return avatars[gender]?.[level] || avatars.male[1];
  };

  const avatarSrc = getAvatarSrc();
  const fallbackSrc = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.fullName || 'ST')}`;

  // ── Derived counts ────────────────────────────────────────────────────────
  const unreadCount = notifications.filter(n => n.isUnread).length;

  // ── Notification icon ─────────────────────────────────────────────────────
  const getNotifIcon = (type) => {
    switch (type) {
      case 'achievement':
      case 'success': return <Award size={18} className={styles.iconSuccess} />;
      case 'message': return <MessageSquare size={18} className={styles.iconMessage} />;
      case 'connection': return <UserIcon size={18} className={styles.iconDefault} />;
      case 'reminder': return <AlertCircle size={18} className={styles.iconWarning} />;
      default: return <Bell size={18} className={styles.iconDefault} />;
    }
  };

  const fmtTime = (iso) => {
    if (!iso) return 'Just now';
    const d = new Date(iso);
    const now = Date.now();
    const diff = Math.floor((now - d.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <header
      className={styles.header}
      style={isFullWidth ? { left: 0, width: '100vw', maxWidth: '100vw', marginLeft: 0, borderRadius: 0 } : {}}
    >
      {/* 🟢 A11Y FIX: Added aria-label */}
      <button className={styles.mobileMenuBtn} onClick={toggleSidebar} aria-label="Open mobile menu">
        <Menu size={24} aria-hidden="true" />
      </button>

      {/* User greeting */}
      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          <img
            src={avatarSrc}
            alt="User Profile"
            fetchPriority="high" /* 🟢 PERFORMANCE FIX: Force load the main LCP image */
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackSrc; }}
          />
        </div>
        <div className={styles.greeting}>
          <span className={styles.hello}>
            Hi, {user.fullName ? user.fullName.split(' ')[0] : 'Student'}
          </span>
          <span className={styles.welcomeText}>Welcome back!</span>
        </div>
      </div>

      {/* Search */}
      <div className={styles.searchBar}>
        <Search className={styles.searchIcon} size={18} aria-hidden="true" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
          aria-label="Search platform" /* 🟢 A11Y FIX: Added aria-label to input */
        />
      </div>

      {/* Actions */}
      <div className={styles.actions}>

        {/* Theme toggle */}
        <button className={styles.iconBtn} onClick={toggleTheme} title="Toggle theme" aria-label="Toggle dark mode">
          {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
        </button>

        {/* Notifications */}
        <div className={styles.notificationSection} ref={notifRef}>
          <button
            className={styles.iconBtn}
            onClick={() => setShowNotifications(v => !v)}
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
          >
            <Bell size={18} aria-hidden="true" />
            {unreadCount > 0 && (
              <span className={styles.notifBadge}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                className={styles.notificationDropdown}
                initial={{ opacity: 0, y: -10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.18 }}
              >
                {/* Header */}
                <div className={styles.notifHeader}>
                  <h3>
                    Notifications
                    {unreadCount > 0 && (
                      <span style={{
                        marginLeft: '8px', fontSize: '0.7rem', fontWeight: '700',
                        background: '#6366f1', color: 'white',
                        borderRadius: '999px', padding: '1px 7px'
                      }}>
                        {unreadCount}
                      </span>
                    )}
                  </h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {unreadCount > 0 && (
                      <button
                        className={styles.markAllBtn}
                        onClick={markAllAsRead}
                        title="Mark all as read"
                      >
                        <Check size={13} aria-hidden="true" /> All read
                      </button>
                    )}
                    {(user.role === 'student') && notifications.length > 0 && (
                      <button
                        className={styles.markAllBtn}
                        onClick={clearNotifications}
                        title="Clear all"
                        style={{ color: '#ef4444' }}
                      >
                        <Trash2 size={13} aria-hidden="true" /> Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* List */}
                <div className={styles.notifList}>
                  {notifications.length === 0 ? (
                    <div className={styles.emptyNotif}>
                      <Bell size={28} style={{ opacity: 0.2, margin: '0 auto 8px', display: 'block' }} />
                      <p>No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notif, index) => (
                      <div
                        key={notif.id || index}
                        className={`${styles.notifItem} ${notif.isUnread ? styles.unread : ''}`}
                        onClick={() => handleNotificationClick(notif)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleNotificationClick(notif)}
                      >
                        <div className={styles.notifIcon}>
                          {getNotifIcon(notif.type)}
                        </div>
                        <div className={styles.notifContent}>
                          <span className={styles.notifTitle}>{notif.title}</span>
                          <p className={styles.notifMessage}>{notif.message}</p>
                          <span className={styles.notifTime}>{fmtTime(notif.createdAt)}</span>
                        </div>
                        {notif.isUnread && <div className={styles.unreadDot} />}
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Start Timer */}
        <button className={styles.startTimer} onClick={() => navigate('/study-time')}>
          <Play size={16} fill="currentColor" aria-hidden="true" /> Start Timer
        </button>

        {/* Refer */}
        <button className={styles.referBtn} onClick={() => navigate('/refer')}>
          <Gift size={16} aria-hidden="true" /> Refer
        </button>

        {/* Profile menu */}
        <div className={styles.profileSection} ref={menuRef}>
          <button
            className={styles.profileBtn}
            onClick={() => setShowProfileMenu(v => !v)}
            aria-label="Open profile menu"
          >
            <img
              src={avatarSrc}
              alt="Profile Toggle"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackSrc; }}
            />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                className={styles.profileMenu}
                initial={{ opacity: 0, y: -10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.18 }}
              >
                <div className={styles.menuHeader}>
                  <img
                    src={avatarSrc}
                    alt="Profile Menu Avatar"
                    loading="lazy" /* 🟢 PERFORMANCE FIX: Lazy load the hidden dropdown image */
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackSrc; }}
                  />
                  <div className={styles.menuUserInfo}>
                    <span className={styles.menuName}>{user.fullName || 'Student'}</span>
                    <span className={styles.menuEmail}>{user.email || ''}</span>
                    {user.level && (
                      <span style={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: '700', marginTop: '2px' }}>
                        Level {user.level} · {user.xp ?? 0} XP
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.menuDivider} />

                <Link
                  to={`/user-profile/${user._id || user.id}`}
                  className={styles.menuItem}
                  onClick={() => setShowProfileMenu(false)}
                >
                  <UserIcon size={15} aria-hidden="true" /> Profile
                </Link>
                <Link
                  to="/settings"
                  className={styles.menuItem}
                  onClick={() => setShowProfileMenu(false)}
                >
                  <Settings size={15} aria-hidden="true" /> Settings
                </Link>

                <div className={styles.menuDivider} />

                <button className={styles.menuItemLogout} onClick={handleLogout}>
                  <LogOut size={15} aria-hidden="true" /> Log out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
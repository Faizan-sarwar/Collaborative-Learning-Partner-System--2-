import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../../../src/context/SettingsContext';
import {
  LayoutDashboard, Clock, BookOpen, UserPlus, Users, UserCheck,
  MessageSquare, Zap, Trophy, BarChart3, Settings,
  X
} from 'lucide-react';
import styles from './DashboardSidebar.module.css';

// ============================================================================
// 🟢 NAV CONFIG — `activityKeys` lists every event "channel" that should
//    light up this nav item. One nav can listen to multiple events.
// ============================================================================
const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', activityKeys: [] },
  { id: 'study-time', icon: Clock, label: 'Study Time', path: '/study-time', activityKeys: ['study-session'] },
  { id: 'courses', icon: BookOpen, label: 'Courses', path: '/courses', activityKeys: ['course-update'] },
  { id: 'study-matches', icon: UserPlus, label: 'Study Matches', path: '/study-matches', activityKeys: ['match-found'] },
  { id: 'connections', icon: Users, label: 'Connections', path: '/connections', activityKeys: ['connection-accepted'] },
  { id: 'pending-connections', icon: UserCheck, label: 'Pending', path: '/pending-connections', activityKeys: ['connection-request'] },
  { id: 'messages', icon: MessageSquare, label: 'Messages', path: '/messages', activityKeys: ['new-message'] },
  { id: 'xp', icon: Zap, label: 'XP & Rewards', path: '/xp', activityKeys: ['xp-earned', 'reward-unlocked'] },
  { id: 'gamification', icon: Trophy, label: 'Gamification', path: '/gamification', activityKeys: ['achievement-unlocked', 'level-up', 'badge-earned'] },
  { id: 'analytics', icon: BarChart3, label: 'Analytics', path: '/analytics', activityKeys: ['analytics-update'] },
  { id: 'settings', icon: Settings, label: 'Settings', path: '/settings', activityKeys: ['settings-updated'] },
];

// ============================================================================
// 🟢 ACTIVITY STORE — persisted to sessionStorage so a refresh doesn't wipe
//    pending notifications. Format:
//    { "messages": { count: 3, glow: true, lastEvent: 1716700000000 } }
// ============================================================================
const ACTIVITY_STORAGE_KEY = 'sidebar:activity';

const loadActivity = () => {
  try {
    const raw = sessionStorage.getItem(ACTIVITY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
};

const saveActivity = (state) => {
  try { sessionStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(state)); }
  catch { /* quota or private mode — silent */ }
};

// Reverse lookup: which navId reacts to which activityKey?
// Built once at module load so the hot path stays O(1).
const KEY_TO_NAV = {};
navItems.forEach(item => {
  item.activityKeys.forEach(key => { KEY_TO_NAV[key] = item.id; });
});

// ============================================================================
// 🟢 PUBLIC API — call from anywhere in the app to ping the sidebar.
//    Examples:
//      pingSidebar('new-message')
//      pingSidebar('achievement-unlocked', { title: 'First Steps' })
//      pingSidebar('settings-updated')
// ============================================================================
export const pingSidebar = (activityKey, meta = {}) => {
  window.dispatchEvent(new CustomEvent('sidebarActivity', {
    detail: { key: activityKey, ...meta }
  }));
};

// ============================================================================
// 🟢 COMPONENT
// ============================================================================
const DashboardSidebar = ({ isOpen, closeSidebar }) => {
  const location = useLocation();
  const { settings } = useSettings();

  // activity = { [navId]: { count, glow, lastEvent } }
  const [activity, setActivity] = useState(() => loadActivity());

  // Legacy badges (kept for backwards compat with existing localStorage flags)
  const [legacyBadges, setLegacyBadges] = useState({});

  // ─── Persist whenever activity changes ─────────────────────────────────────
  useEffect(() => { saveActivity(activity); }, [activity]);

  // ─── Helper: register a new ping for a section ─────────────────────────────
  const recordActivity = useCallback((navId) => {
    if (!navId) return;
    setActivity(prev => {
      const current = prev[navId] || { count: 0, glow: false };
      return {
        ...prev,
        [navId]: {
          count: (current.count || 0) + 1,
          glow: true,
          lastEvent: Date.now()
        }
      };
    });
  }, []);

  // ─── Helper: clear a section (when visited) ────────────────────────────────
  const clearActivity = useCallback((navId) => {
    setActivity(prev => {
      if (!prev[navId]) return prev;
      const next = { ...prev };
      delete next[navId];
      return next;
    });
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // 🟢 LISTEN TO sidebarActivity EVENTS (universal entry point)
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const handler = (e) => {
      const key = e.detail?.key;
      const navId = KEY_TO_NAV[key];
      if (!navId) return;
      // Don't ping the section the user is already on — they'd see it instantly
      const currentNav = navItems.find(n => location.pathname.startsWith(n.path));
      if (currentNav && currentNav.id === navId) return;
      recordActivity(navId);
    };
    window.addEventListener('sidebarActivity', handler);
    return () => window.removeEventListener('sidebarActivity', handler);
  }, [location.pathname, recordActivity]);

  // ═══════════════════════════════════════════════════════════════════════════
  // 🟢 ROUTE CHANGE → clear activity for whichever section we just visited
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const matched = navItems.find(n => location.pathname.startsWith(n.path));
    if (matched) clearActivity(matched.id);
  }, [location.pathname, clearActivity]);

  // ═══════════════════════════════════════════════════════════════════════════
  // 🟢 LEGACY BADGE LOGIC — kept so existing localStorage flags still work
  // ═══════════════════════════════════════════════════════════════════════════
  const calculateLegacyBadges = useCallback(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    const storedNotifs = JSON.parse(localStorage.getItem('notifications') || '[]');

    const newBadges = {};
    if (storedUser.receivedRequests && storedUser.receivedRequests.length > 0) {
      newBadges['pending-connections'] = true;
    }
    const hasUnreadMessages = storedNotifs.some(n =>
      (n.type === 'message' || (n.title || '').toLowerCase().includes('message')) &&
      (n.unread === true || (n.unread === undefined && !n.read))
    );
    if (hasUnreadMessages) {
      newBadges['messages'] = true;
    }
    setLegacyBadges(newBadges);
  }, []);

  useEffect(() => {
    calculateLegacyBadges();
    window.addEventListener('userUpdated', calculateLegacyBadges);
    window.addEventListener('notificationAdded', calculateLegacyBadges);
    return () => {
      window.removeEventListener('userUpdated', calculateLegacyBadges);
      window.removeEventListener('notificationAdded', calculateLegacyBadges);
    };
  }, [calculateLegacyBadges]);

  // ═══════════════════════════════════════════════════════════════════════════
  // 🟢 AUTO-WIRE: when ANY 'notificationAdded' event fires anywhere in the
  //    app, infer which section it relates to and ping the sidebar. This means
  //    if you already dispatch notificationAdded in other pages, you get
  //    sidebar glow for free — no extra integration needed.
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const onNotificationAdded = (e) => {
      const n = e.detail || {};
      const type = (n.type || '').toLowerCase();
      const title = (n.title || '').toLowerCase();

      if (type === 'message' || title.includes('message')) {
        pingSidebar('new-message');
      } else if (type === 'achievement' || title.includes('achievement') || title.includes('badge')) {
        pingSidebar('achievement-unlocked');
      } else if (type === 'level-up' || title.includes('level up') || title.includes('leveled')) {
        pingSidebar('level-up');
      } else if (type === 'xp' || title.includes('xp') || title.includes('reward')) {
        pingSidebar('xp-earned');
      } else if (type === 'connection-request' || title.includes('connection request') || title.includes('friend request')) {
        pingSidebar('connection-request');
      } else if (type === 'connection-accepted' || title.includes('accepted')) {
        pingSidebar('connection-accepted');
      } else if (type === 'settings' || title.includes('settings')) {
        pingSidebar('settings-updated');
      } else if (type === 'match' || title.includes('match')) {
        pingSidebar('match-found');
      } else if (type === 'course' || title.includes('course')) {
        pingSidebar('course-update');
      }
    };
    window.addEventListener('notificationAdded', onNotificationAdded);
    return () => window.removeEventListener('notificationAdded', onNotificationAdded);
  }, []);

  // ─── Combine real-time + legacy into the final badge state per nav item ────
  const getBadgeFor = (navId) => {
    const live = activity[navId];
    if (live && live.count > 0) {
      return { glow: true, count: live.count, live: true };
    }
    if (legacyBadges[navId]) {
      return { glow: true, count: 0, live: false }; // count 0 = show dot only, no number
    }
    return null;
  };

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <button className={styles.mobileCloseBtn} onClick={closeSidebar} aria-label="Close sidebar">
        <X size={24} aria-hidden="true" />
      </button>

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
          const badge = getBadgeFor(item.id);
          const isActive = location.pathname === item.path;
          const isGlowing = !!badge?.glow && !isActive;
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={closeSidebar}
              className={`${styles.navItem} ${isActive ? styles.active : ''} ${isGlowing ? styles.glowing : ''}`}
              aria-label={badge?.count > 0 ? `${item.label}, ${badge.count} new` : item.label}
            >
              <span className={styles.navIcon}>
                <Icon size={20} />
                {badge && (
                  badge.count > 0
                    ? <span className={styles.countBadge}>{badge.count > 99 ? '99+' : badge.count}</span>
                    : <span className={styles.redDot} aria-hidden="true" />
                )}
              </span>
              <span className={styles.navLabel}>{item.label}</span>
              {badge && badge.count > 0 && (
                <span className={styles.inlineCount} aria-hidden="true">
                  {badge.count > 99 ? '99+' : badge.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <span className={styles.versionText}>v1.0.0</span>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
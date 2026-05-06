/**
 * sessionTracker.js — Global Study Time Tracker
 *
 * This module is a SINGLETON. Import it anywhere in the app and it tracks
 * time continuously, even when the user navigates away from Analytics.
 *
 * How it works:
 *  - Starts a 1-second tick on first import
 *  - Detects idle (5 min no activity) and pauses counting
 *  - Every 5 minutes, flushes accumulated seconds to the backend via /track-time
 *  - On tab close, fires navigator.sendBeacon so no time is lost
 *  - Stores session start time in localStorage so a page refresh doesn't reset the counter
 *  - Exposes subscribe() so any component can react to state changes
 */

const IDLE_TIMEOUT_MS  = 5 * 60 * 1000;   // 5 minutes
const SYNC_INTERVAL_MS = 5 * 60 * 1000;   // flush to DB every 5 minutes
const SESSION_KEY      = 'st_session_start';
const API_BASE         = `http://${window.location.hostname}:5000/api`;

const getToken = () =>
  localStorage.getItem('token') || sessionStorage.getItem('token');

// ─── Internal state ──────────────────────────────────────────────────────────
let lastActiveTime  = Date.now();
let unsavedSeconds  = 0;       // accumulated, not yet sent to DB
let isIdle          = false;
let dbTotalHours    = 0;       // last confirmed value from server
let listeners       = [];      // subscriber callbacks

// Persist session start across refreshes
if (!localStorage.getItem(SESSION_KEY)) {
  localStorage.setItem(SESSION_KEY, Date.now().toString());
}
const getSessionSeconds = () =>
  Math.floor((Date.now() - parseInt(localStorage.getItem(SESSION_KEY) || Date.now())) / 1000);

// ─── Notify all subscribers ───────────────────────────────────────────────────
const notify = () => {
  const state = getState();
  listeners.forEach(fn => fn(state));
};

// ─── Public state snapshot ────────────────────────────────────────────────────
const getState = () => ({
  isIdle,
  dbTotalHours,
  unsavedSeconds,
  sessionSeconds: getSessionSeconds(),
  // Grand total = confirmed DB hours + unsaved local seconds
  totalHours: dbTotalHours + unsavedSeconds / 3600,
});

// ─── Sync to server ───────────────────────────────────────────────────────────
const syncToServer = async () => {
  if (unsavedSeconds < 60) return;              // don't bother for < 1 minute
  const token = getToken();
  if (!token) return;

  const minutesToSave    = unsavedSeconds / 60;
  unsavedSeconds         = 0;                   // reset immediately — prevent double-save

  try {
    const res  = await fetch(`${API_BASE}/auth/track-time`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ minutes: minutesToSave }),
    });
    const data = await res.json();
    if (data.success) {
      dbTotalHours = data.totalHours;
      notify();
    } else {
      // roll back so we retry next interval
      unsavedSeconds += minutesToSave * 60;
    }
  } catch {
    unsavedSeconds += minutesToSave * 60; // network failure — retry later
  }
};

// ─── Load initial hours from server ───────────────────────────────────────────
export const loadInitialHours = async () => {
  const token = getToken();
  if (!token) return;
  try {
    const res  = await fetch(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (data.success) {
      dbTotalHours = data.user.studyHours || 0;
      notify();
    }
  } catch { /* silent — not critical */ }
};

// ─── Activity listeners ───────────────────────────────────────────────────────
const onActivity = () => {
  lastActiveTime = Date.now();
  if (isIdle) {
    isIdle = false;
    notify();
  }
};

window.addEventListener('mousemove', onActivity, { passive: true });
window.addEventListener('keydown',   onActivity, { passive: true });
window.addEventListener('click',     onActivity, { passive: true });
window.addEventListener('scroll',    onActivity, { passive: true });
window.addEventListener('touchstart',onActivity, { passive: true });

// ─── Tab close beacon ─────────────────────────────────────────────────────────
window.addEventListener('beforeunload', () => {
  if (unsavedSeconds < 60) return;
  const token = getToken();
  if (!token) return;
  const blob = new Blob(
    [JSON.stringify({ minutes: unsavedSeconds / 60 })],
    { type: 'application/json' }
  );
  navigator.sendBeacon(`${API_BASE}/auth/track-time`, blob);
});

// ─── Core 1-second tick ───────────────────────────────────────────────────────
setInterval(() => {
  const now     = Date.now();
  const wasIdle = isIdle;

  if (now - lastActiveTime > IDLE_TIMEOUT_MS) {
    isIdle = true;
    if (!wasIdle) notify(); // only notify on state change
    return;
  }

  isIdle = false;
  unsavedSeconds += 1;

  // Notify every 5 seconds to keep UI fresh without hammering React
  if (unsavedSeconds % 5 === 0) notify();
}, 1000);

// ─── Periodic server sync ─────────────────────────────────────────────────────
setInterval(syncToServer, SYNC_INTERVAL_MS);

// ─── Public API ───────────────────────────────────────────────────────────────

/** Subscribe to state changes. Returns an unsubscribe function. */
export const subscribe = (fn) => {
  listeners.push(fn);
  fn(getState()); // immediately emit current state
  return () => { listeners = listeners.filter(l => l !== fn); };
};

/** Force an immediate sync (e.g. when user logs out) */
export const forceSync = syncToServer;

/** Reset session clock (e.g. on login) */
export const resetSession = () => {
  localStorage.setItem(SESSION_KEY, Date.now().toString());
  notify();
};

export default { subscribe, forceSync, resetSession, loadInitialHours, getState };
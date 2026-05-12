/**
 * sessionTracker.js — Global Study Time Tracker
 *
 * This module is a SINGLETON. Import it anywhere in the app and it tracks
 * time continuously, even when the user navigates away from Analytics.
 */

const IDLE_TIMEOUT_MS = 5 * 60 * 1000;   // 5 minutes
const SYNC_INTERVAL_MS = 5 * 60 * 1000;  // flush to DB every 5 minutes
const API_BASE = `http://${window.location.hostname}:5000/api`;

// ─── LocalStorage Keys ────────────────────────────────────────────────────────
const LS_SESSION_START = 'st_session_start';
const LS_UNSAVED_SECS = 'st_unsaved_secs';
const LS_SESSION_SECS = 'st_session_secs';
const LS_LAST_ACTIVE = 'st_last_active';

const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

// ─── Internal state ──────────────────────────────────────────────────────────
let lastActiveTime = parseInt(localStorage.getItem(LS_LAST_ACTIVE)) || Date.now();
let unsavedSeconds = parseInt(localStorage.getItem(LS_UNSAVED_SECS)) || 0;
let sessionSeconds = parseInt(localStorage.getItem(LS_SESSION_SECS)) || 0;
let isIdle = false;
let dbTotalHours = 0;
let listeners = [];

if (!localStorage.getItem(LS_SESSION_START)) {
  localStorage.setItem(LS_SESSION_START, Date.now().toString());
  localStorage.setItem(LS_UNSAVED_SECS, '0');
  localStorage.setItem(LS_SESSION_SECS, '0');
}

// ─── Notify all subscribers ───────────────────────────────────────────────────
const notify = () => {
  const state = getState();
  listeners.forEach(fn => fn(state));
};

const getState = () => ({
  isIdle,
  dbTotalHours,
  unsavedSeconds,
  sessionSeconds,
  totalHours: dbTotalHours + (unsavedSeconds / 3600),
});

// ─── Sync to server ───────────────────────────────────────────────────────────
const syncToServer = async () => {
  if (unsavedSeconds < 60) return;
  const token = getToken();
  if (!token) return;

  const minutesToSave = unsavedSeconds / 60;
  unsavedSeconds = 0;
  localStorage.setItem(LS_UNSAVED_SECS, '0');

  try {
    const res = await fetch(`${API_BASE}/auth/track-time`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ minutes: minutesToSave }),
    });
    const data = await res.json();
    if (data.success) {
      dbTotalHours = data.totalHours;
      notify();
    } else {
      unsavedSeconds += minutesToSave * 60;
      localStorage.setItem(LS_UNSAVED_SECS, unsavedSeconds.toString());
    }
  } catch {
    unsavedSeconds += minutesToSave * 60;
    localStorage.setItem(LS_UNSAVED_SECS, unsavedSeconds.toString());
  }
};

// ─── Load initial hours from server ───────────────────────────────────────────
export const loadInitialHours = async () => {
  const token = getToken();
  if (!token) return;
  try {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (data.success) {
      dbTotalHours = data.user.studyHours || 0;
      notify();
    }
  } catch { /* silent */ }
};

// ─── Activity listeners ───────────────────────────────────────────────────────
const onActivity = () => {
  lastActiveTime = Date.now();
  localStorage.setItem(LS_LAST_ACTIVE, lastActiveTime.toString());
  if (isIdle) {
    isIdle = false;
    notify();
  }
};

['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(ev =>
  window.addEventListener(ev, onActivity, { passive: true })
);

window.addEventListener('beforeunload', () => {
  if (unsavedSeconds < 60) return;
  const token = getToken();
  if (!token) return;
  const blob = new Blob(
    [JSON.stringify({ minutes: unsavedSeconds / 60 })],
    { type: 'application/json' }
  );
  navigator.sendBeacon(`${API_BASE}/auth/track-time`, blob);
  localStorage.setItem(LS_UNSAVED_SECS, '0');
});

// ─── Core 1-second tick ───────────────────────────────────────────────────────
setInterval(() => {
  const token = getToken();

  // 🟢 LOGOUT DETECTION: If no token exists, immediately wipe the session time
  if (!token) {
    if (sessionSeconds > 0) {
      sessionSeconds = 0;
      unsavedSeconds = 0;
      localStorage.setItem(LS_SESSION_SECS, '0');
      localStorage.setItem(LS_UNSAVED_SECS, '0');
      notify();
    }
    return; // Pause timer completely
  }

  const now = Date.now();
  const wasIdle = isIdle;

  if (now - lastActiveTime > IDLE_TIMEOUT_MS) {
    isIdle = true;
    if (!wasIdle) notify();
    return;
  }

  isIdle = false;
  unsavedSeconds += 1;
  sessionSeconds += 1;

  localStorage.setItem(LS_UNSAVED_SECS, unsavedSeconds.toString());
  localStorage.setItem(LS_SESSION_SECS, sessionSeconds.toString());

  notify();
}, 1000);

setInterval(syncToServer, SYNC_INTERVAL_MS);

export const subscribe = (fn) => {
  listeners.push(fn);
  fn(getState());
  return () => { listeners = listeners.filter(l => l !== fn); };
};

export const forceSync = syncToServer;

export const resetSession = () => {
  localStorage.setItem(LS_SESSION_START, Date.now().toString());
  localStorage.setItem(LS_SESSION_SECS, '0');
  sessionSeconds = 0;
  notify();
};

export default { subscribe, forceSync, resetSession, loadInitialHours, getState };
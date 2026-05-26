import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io as socketIO } from 'socket.io-client';
import {
  Search, MessageSquarePlus, MessageSquare, X, MoreVertical, Send,
  Trash2, Ban, ShieldAlert, Check, CheckCheck, AlertTriangle, RefreshCw,
  ArrowLeft, Image as ImageIcon, Mic, Reply, Edit2, MoreHorizontal,
  Square, Play, Pause, Paperclip
} from 'lucide-react';
import ChatBot from '../ChatBot/ChatBot';
import styles from './Messages.module.css';

// ============================================================================
// 🟢 CONSTANTS & CONFIG
// ============================================================================
const avatars = {
  male: {
    1: '/gamification/male-level-1.png',
    2: '/gamification/male-level-2.png',
    3: '/gamification/male-level-3.png',
    4: '/gamification/male-level-4.png',
    5: '/gamification/male-level-5.png',
    6: '/gamification/male-level-6.png',
    7: '/gamification/male-level-7.png'
  },
  female: {
    1: '/gamification/female-level-1.png',
    2: '/gamification/female-level-2.png',
    3: '/gamification/female-level-3.png',
    4: '/gamification/female-level-4.png',
    5: '/gamification/female-level-5.png',
    6: '/gamification/female-level-6.png',
    7: '/gamification/female-level-7.png'
  }
};

const MAX_MESSAGE_LENGTH = 4000;
const POLL_INTERVAL_MS = 8000; // Slower polling — socket is primary now
const EDIT_WINDOW_MS = 15 * 60 * 1000;
const TYPING_DEBOUNCE_MS = 1500;
const ONLINE_WINDOW_MS = 15 * 60 * 1000;

const API_HOST = `http://${window.location.hostname}:5000`;
const API = `${API_HOST}/api`;
const SOCKET_URL = API_HOST;

// 🟢 SOCKET SINGLETON — survives React StrictMode's double-mount in dev.
// Without this, every dev render creates two sockets, the first gets killed,
// and the backend briefly thinks you're offline during the gap.
// In production (no StrictMode double-invoke) this is a harmless wrapper.
const __socketCache = { instance: null, refs: 0 };

// ============================================================================
// 🟢 HELPERS — preserved from original
// ============================================================================
const getAvatarSrc = (userObj) => {
  const userId = userObj?.id || userObj?._id;
  const hasPic = userObj?.hasPicture || !!userObj?.picture;
  if (userObj?.settings?.showAvatar === false && hasPic) {
    return `${API}/auth/student/${userId}/picture`;
  }
  const gender = userObj?.gender?.toLowerCase() === 'female' ? 'female' : 'male';
  const level = Math.min(Math.max(parseInt(userObj?.level) || 1, 1), 7);
  return avatars[gender]?.[level] || avatars.male[1];
};

const getInitials = (name = '') =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'ST';

const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

// Decode JWT to extract own userId for socket registration (no extra API call)
const getMyUserId = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id || payload._id || null;
  } catch { return null; }
};

// Resolve full media URL — relative paths get prefixed with API host
const resolveMediaUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_HOST}${url}`;
};

const parseDate = (val) => {
  if (val == null || val === '') return null;
  if (typeof val === 'number') {
    return new Date(val < 4_102_444_800 ? val * 1000 : val);
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (/^[0-9]+$/.test(trimmed)) {
      const n = parseInt(trimmed, 10);
      return new Date(n < 4_102_444_800 ? n * 1000 : n);
    }
    const d = new Date(trimmed);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
};

const resolveOnline = (userOrConv) => {
  if (!userOrConv) return false;
  const isOnlineFlag = userOrConv.isOnline === true || userOrConv.online === true;
  if (!isOnlineFlag) return false;
  const loginTime = userOrConv.lastLogin ?? userOrConv.lastActive ?? userOrConv.lastSeen;
  if (!loginTime) return false;
  const d = parseDate(loginTime);
  if (!d) return false;
  return (Date.now() - d.getTime()) <= ONLINE_WINDOW_MS;
};

const formatLastSeen = (val) => {
  if (!val) return 'Offline';
  const d = parseDate(val);
  if (!d) return 'Offline';
  const diff = Date.now() - d.getTime();
  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d ago`;
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
};

const formatDateSeparator = (val) => {
  const d = parseDate(val);
  if (!d) return null;
  const diffDays = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return d.toLocaleDateString('en', { weekday: 'long' });
  return d.toLocaleDateString('en', { month: 'long', day: 'numeric', year: diffDays > 365 ? 'numeric' : undefined });
};

const isSameDay = (a, b) => {
  const da = parseDate(a), db = parseDate(b);
  if (!da || !db) return true;
  return da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate();
};

const sanitize = (str) => String(str ?? '').replace(/</g, '\u003c').replace(/>/g, '\u003e');

// 🟢 SAFE UUID — works on insecure-context phones (http://192.168.x.x)
// where window.crypto.randomUUID is undefined.
const safeUUID = () => {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch { /* fall through */ }
  // RFC4122 v4 fallback — good enough for client-side temp IDs
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// 🟢 FETCH WITH TIMEOUT — bare fetch() hangs forever on unreachable LAN hosts
// or slow mobile networks, locking the UI. AbortController forces a hard fail.
const fetchWithTimeout = async (url, options = {}, timeoutMs = 20000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

// Format duration (seconds → mm:ss) for voice notes
const formatDuration = (sec) => {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

// Client-side mirror of backend's 15-min check
const isWithinEditWindow = (createdAt) => {
  if (!createdAt) return false;
  const t = new Date(createdAt).getTime();
  if (isNaN(t)) return false;
  return (Date.now() - t) <= EDIT_WINDOW_MS;
};

function useDebounce(value, delay = 220) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ============================================================================
// 🟢 AVATAR
// ============================================================================
const Avatar = ({ src, name, size = 42, online = false }) => {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: '50%', overflow: 'hidden',
        background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.35, color: 'white', fontWeight: '700', flexShrink: 0
      }}>
        {src && !imgFailed
          ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setImgFailed(true)} />
          : getInitials(name)}
      </div>
      {online && (
        <span style={{
          position: 'absolute', bottom: 1, right: 1,
          width: size * 0.28, height: size * 0.28,
          borderRadius: '50%', background: '#10b981',
          border: `2px solid var(--bg-primary, #0f172a)`,
          boxShadow: '0 0 8px rgba(16,185,129,0.6)'
        }} />
      )}
    </div>
  );
};

// ============================================================================
// 🟢 TYPING INDICATOR
// ============================================================================
const TypingIndicator = () => (
  <div className={styles.typingIndicator}>
    <span className={styles.typingDot} />
    <span className={styles.typingDot} />
    <span className={styles.typingDot} />
  </div>
);

// ============================================================================
// 🟢 DATE SEPARATOR
// ============================================================================
const DateSeparator = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0 8px' }}>
    <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
    <span style={{
      fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '600',
      background: 'var(--bg-secondary)', padding: '3px 10px', borderRadius: '99px',
      border: '1px solid var(--border-color)', whiteSpace: 'nowrap'
    }}>
      {label}
    </span>
    <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
  </div>
);

// ============================================================================
// 🟢 CONFIRM MODAL — preserved from original
// ============================================================================
const CONFIRM_CONFIG = {
  clear: { title: 'Clear Chat', body: 'All messages will be permanently deleted for you.', label: 'Clear', danger: true, Icon: Trash2 },
  delete: { title: 'Delete Chat', body: 'This conversation will be removed from your list.', label: 'Delete', danger: true, Icon: Trash2 },
  block: { title: 'Block User', body: 'They won\'t be able to message you. You can unblock them later.', label: 'Block', danger: true, Icon: Ban },
  unblock: { title: 'Unblock User', body: 'They will be able to message you again.', label: 'Unblock', danger: false, Icon: ShieldAlert },
  unsend: { title: 'Unsend Message?', body: 'This message will be removed for everyone in this chat.', label: 'Unsend', danger: true, Icon: Trash2 },
};

const ConfirmModal = ({ type, onConfirm, onCancel }) => {
  const cfg = CONFIRM_CONFIG[type];
  if (!cfg) return null;
  const { Icon } = cfg;
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 3000, backdropFilter: 'blur(6px)'
      }}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-secondary)', borderRadius: '20px', padding: '32px 28px',
          width: '340px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)', border: '1px solid var(--border-color)'
        }}
      >
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: cfg.danger ? 'rgba(239,68,68,0.12)' : 'rgba(99,102,241,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon size={24} color={cfg.danger ? '#ef4444' : '#6366f1'} />
        </div>
        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '700' }}>{cfg.title}</h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem', textAlign: 'center', lineHeight: 1.5 }}>{cfg.body}</p>
        <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '4px' }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '12px', borderRadius: '12px',
            border: '1px solid var(--border-color)', background: 'transparent',
            color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem'
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: '12px', borderRadius: '12px',
            border: 'none', background: cfg.danger ? '#ef4444' : '#6366f1',
            color: 'white', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem'
          }}>{cfg.label}</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// 🟢 TOAST
// ============================================================================
const Toast = ({ message, type }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
    style={{
      position: 'fixed', bottom: '28px', left: '50%', transform: 'translateX(-50%)',
      background: type === 'success' ? '#10b981' : '#ef4444',
      color: 'white', padding: '11px 22px', borderRadius: '12px',
      fontWeight: '600', fontSize: '0.88rem', zIndex: 4000,
      display: 'flex', alignItems: 'center', gap: '8px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.35)', whiteSpace: 'nowrap'
    }}
  >
    {type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
    {message}
  </motion.div>
);

// ============================================================================
// 🟢 VOICE NOTE PLAYER (native HTML5 audio with custom UI)
// ============================================================================
const VoiceNotePlayer = ({ src, isOwn }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loadError, setLoadError] = useState(null);

  // 🟢 Re-initialize whenever src changes (live-arriving voice notes)
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setLoadError(null);
    a.load(); // force <audio> to re-fetch the new source
  }, [src]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setCurrentTime(a.currentTime);
    const onMeta = () => setDuration(a.duration || 0);
    const onEnd = () => { setPlaying(false); setCurrentTime(0); };
    const onError = () => {
      console.error('[VoiceNotePlayer] Audio load error:', src, a.error);
      setLoadError(a.error?.message || 'Cannot play this voice note');
    };
    const onCanPlay = () => setLoadError(null);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onMeta);
    a.addEventListener('durationchange', onMeta);
    a.addEventListener('ended', onEnd);
    a.addEventListener('error', onError);
    a.addEventListener('canplay', onCanPlay);
    if (a.readyState >= 1 && a.duration && !isNaN(a.duration)) setDuration(a.duration);
    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onMeta);
      a.removeEventListener('durationchange', onMeta);
      a.removeEventListener('ended', onEnd);
      a.removeEventListener('error', onError);
      a.removeEventListener('canplay', onCanPlay);
    };
  }, [src]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
      return;
    }
    try {
      // Await play() so we catch autoplay-policy rejections and codec errors
      await a.play();
      setPlaying(true);
    } catch (err) {
      console.error('[VoiceNotePlayer] play() rejected:', err);
      setLoadError(err.message || 'Playback failed.');
      setPlaying(false);
    }
  };

  const pct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '6px 10px', borderRadius: 24,
      background: isOwn ? 'rgba(255,255,255,0.18)' : 'rgba(99,102,241,0.1)',
      minWidth: 180
    }}>
      <button onClick={toggle} title={loadError || 'Play voice note'} style={{
        width: 32, height: 32, borderRadius: '50%', border: 'none',
        background: loadError ? '#ef4444' : (isOwn ? 'rgba(255,255,255,0.9)' : '#6366f1'),
        color: loadError ? 'white' : (isOwn ? '#6366f1' : 'white'),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0
      }}>
        {loadError ? <AlertTriangle size={14} /> : playing ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: 1 }} />}
      </button>
      <div style={{ flex: 1, height: 4, background: isOwn ? 'rgba(255,255,255,0.3)' : 'rgba(99,102,241,0.25)', borderRadius: 2, position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${pct}%`, background: isOwn ? 'white' : '#6366f1', borderRadius: 2
        }} />
      </div>
      <span style={{ fontSize: '0.7rem', opacity: 0.85, fontVariantNumeric: 'tabular-nums', minWidth: 38, textAlign: 'right' }}>
        {formatDuration(playing || currentTime ? currentTime : duration)}
      </span>
      {/* preload="auto" so it's buffered when arriving via socket */}
      <audio ref={audioRef} src={src} preload="auto" />
    </div>
  );
};

// ============================================================================
// 🟢 MESSAGE BUBBLE — with reply, edit, unsend, media
// ============================================================================
const MessageBubble = ({
  message, onRetry, isFirst, isLast,
  onReply, onEdit, onUnsend, onDeleteForMe,
  scrollToMessage, replyParticipantName
}) => {
  const isOwn = message.isOwn;
  const [showActions, setShowActions] = useState(false);
  const longPressTimer = useRef(null);

  const createdAt = message.createdAt || message.timestamp;
  const msgTime = createdAt ? new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  // Client-side gating mirrors the backend 15-min window. Backend re-validates.
  const canEditUnsend = isOwn && !message.deletedForEveryone && message.status !== 'sending' && message.status !== 'error' && isWithinEditWindow(createdAt);

  // Long-press for mobile (touchstart 500ms)
  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => setShowActions(true), 500);
  };
  const handleTouchEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  // ─── DELETED FOR EVERYONE STATE ─────────────────────────────────────────
  if (message.deletedForEveryone) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}
        style={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start', marginBottom: isLast ? '12px' : '2px' }}
      >
        <div className={styles.deletedBubble}>
          <Ban size={13} />
          <span>{isOwn ? 'You unsent a message' : 'Message unsent'}</span>
          <span style={{ fontSize: '0.65rem', opacity: 0.6, marginLeft: 4 }}>{msgTime}</span>
        </div>
      </motion.div>
    );
  }

  const mediaUrl = resolveMediaUrl(message.fileUrl);

  return (
    <motion.div
      className={`${styles.messageWrapper} ${isOwn ? styles.ownMessage : ''}`}
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.18 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      style={{ marginBottom: isLast ? '12px' : '2px', position: 'relative' }}
    >
      {/* 🟢 FLOATING ACTION MENU */}
      <AnimatePresence>
        {showActions && message.status !== 'sending' && message.status !== 'error' && !message.deletedForEveryone && (
          <motion.div
            className={styles.messageActions}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            style={{ opacity: 1, pointerEvents: 'auto' }}
          >
            <button className={styles.actionBtn} title="Reply" onClick={() => { onReply?.(message); setShowActions(false); }}>
              <Reply size={14} />
            </button>
            {canEditUnsend && !message.fileUrl && (
              <button className={styles.actionBtn} title="Edit" onClick={() => { onEdit?.(message); setShowActions(false); }}>
                <Edit2 size={14} />
              </button>
            )}
            {canEditUnsend && (
              <button className={styles.actionBtn} title="Unsend" onClick={() => { onUnsend?.(message); setShowActions(false); }}>
                <Trash2 size={14} />
              </button>
            )}
            <button className={styles.actionBtn} title="Delete for me" onClick={() => { onDeleteForMe?.(message); setShowActions(false); }}>
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={styles.messageBubble}
        style={{
          maxWidth: '72%',
          background: isOwn ? 'linear-gradient(135deg,#6366f1,#7c3aed)' : 'var(--bg-secondary)',
          color: isOwn ? 'white' : 'var(--text-primary)',
          borderRadius: isOwn
            ? (isFirst ? '18px 18px 4px 18px' : isLast ? '18px 4px 18px 18px' : '18px 4px 4px 18px')
            : (isFirst ? '18px 18px 18px 4px' : isLast ? '4px 18px 18px 18px' : '4px 18px 18px 4px'),
          border: isOwn ? 'none' : '1px solid var(--border-color)',
          boxShadow: message.status === 'error'
            ? '0 0 0 2px #ef4444'
            : isOwn ? '0 2px 12px rgba(99,102,241,0.35)' : 'none'
        }}
      >
        {/* 🟢 REPLY QUOTE BUBBLE */}
        {message.replyTo && (
          <div className={styles.replyBubble} onClick={() => scrollToMessage?.(message.replyTo.id)}>
            <span className={styles.replySender}>
              {message.replyTo.senderId === message.senderId ? (isOwn ? 'You' : replyParticipantName || 'They') : (isOwn ? replyParticipantName || 'They' : 'You')}
            </span>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {message.replyTo.deletedForEveryone
                ? <em style={{ opacity: 0.6 }}>Original message unsent</em>
                : message.replyTo.fileType === 'image' ? '📷 Photo'
                  : message.replyTo.fileType === 'audio' ? '🎤 Voice note'
                    : message.replyTo.fileType === 'video' ? '🎬 Video'
                      : message.replyTo.fileType === 'document' ? '📎 File'
                        : sanitize(message.replyTo.text || '').slice(0, 120)}
            </span>
          </div>
        )}

        {/* 🟢 MEDIA RENDERING */}
        {message.fileType === 'image' && mediaUrl && (
          <img
            src={mediaUrl}
            alt={message.fileName || 'image'}
            className={styles.messageMedia}
            style={{ maxHeight: 320, display: 'block' }}
            onClick={() => window.open(mediaUrl, '_blank')}
          />
        )}
        {message.fileType === 'audio' && mediaUrl && (
          <VoiceNotePlayer src={mediaUrl} isOwn={isOwn} />
        )}
        {message.fileType === 'video' && mediaUrl && (
          <video src={mediaUrl} controls className={styles.messageMedia} style={{ maxHeight: 320, maxWidth: '100%' }} />
        )}
        {message.fileType === 'document' && mediaUrl && (
          <a href={mediaUrl} target="_blank" rel="noreferrer" style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
            background: isOwn ? 'rgba(255,255,255,0.15)' : 'rgba(99,102,241,0.1)',
            borderRadius: 10, color: 'inherit', textDecoration: 'none', marginBottom: message.text ? 6 : 0
          }}>
            <Paperclip size={16} />
            <span style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>
              {message.fileName || 'File'}
            </span>
          </a>
        )}

        {/* 🟢 TEXT (optional — voice notes / images may have none) */}
        {message.text && (
          <p className={styles.messageText} style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
            {sanitize(message.text)}
          </p>
        )}

        {/* 🟢 META: time + edited + status */}
        <div className={styles.messageMeta} style={{ marginTop: 4 }}>
          {message.isEdited && (
            <span className={styles.editedLabel} style={{ color: isOwn ? 'rgba(255,255,255,0.75)' : 'var(--text-secondary)' }}>
              (edited)
            </span>
          )}
          <span style={{ fontSize: '0.65rem', opacity: 0.7, color: isOwn ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)' }}>
            {msgTime}
          </span>
          {isOwn && (
            <span style={{ display: 'flex', alignItems: 'center' }}>
              {message.status === 'error' ? (
                <button onClick={() => onRetry?.(message)} title="Retry"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                  <RefreshCw size={11} color="#fca5a5" />
                </button>
              ) : message.status === 'sending' ? (
                <Check size={13} style={{ color: 'rgba(255,255,255,0.5)' }} />
              ) : message.isRead ? (
                <CheckCheck size={13} style={{ color: '#38bdf8' }} />
              ) : (
                <CheckCheck size={13} style={{ color: 'rgba(255,255,255,0.6)' }} />
              )}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// 🟢 MAIN COMPONENT
// ============================================================================
const Messages = () => {
  // ─── STATE ────────────────────────────────────────────────────────────────
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState({});
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionsLoading, setConnectionsLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newChatSearch, setNewChatSearch] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(null);
  const [toast, setToast] = useState(null);

  // 🟢 NEW: Reply, Edit, Typing, Recording, Unsend
  const [replyingTo, setReplyingTo] = useState(null);     // { id, text, senderName, ... }
  const [editingMessage, setEditingMessage] = useState(null); // { id, originalText }
  const [pendingUnsend, setPendingUnsend] = useState(null); // message object awaiting confirm
  const [peerTyping, setPeerTyping] = useState(false);    // is the OTHER side typing
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [socketConnected, setSocketConnected] = useState(false);

  // ─── REFS ─────────────────────────────────────────────────────────────────
  const newChatModalRef = useRef(null);
  const chatMenuRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const activeConvIdRef = useRef(null);
  const socketRef = useRef(null);
  const myIdRef = useRef(getMyUserId());
  const typingEmitTimerRef = useRef(null);
  const peerTypingTimerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const reconnectTimerRef = useRef(null);

  const debouncedSearch = useDebounce(searchQuery);
  const debouncedNewChatSearch = useDebounce(newChatSearch);

  const showToast = useCallback((message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Mirror conversations into a ref so socket callbacks have current data
  // (declared before the socket effect so it exists when callbacks fire)
  const conversationsRef = useRef([]);
  useEffect(() => { conversationsRef.current = conversations; }, [conversations]);

  // ═══════════════════════════════════════════════════════════════════════════
  // 🟢 SOCKET.IO — AGGRESSIVE RECONNECTION FOR MOBILE
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const myId = myIdRef.current;
    if (!myId) {
      console.warn('[Messages] No userId in token — socket NOT connecting');
      return;
    }

    // 🟢 SINGLETON — reuse the existing connection if StrictMode double-mounts
    // us in dev. Without this, every dev render creates two sockets; the first
    // is killed by cleanup, and the backend briefly thinks you're offline.
    __socketCache.refs += 1;
    let socket = __socketCache.instance;
    if (!socket) {
      console.log('[Messages] 🚀 Creating new socket for user', myId, 'to', SOCKET_URL);
      socket = socketIO(SOCKET_URL, {
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 8000,
        randomizationFactor: 0.5,
        timeout: 20000,
        transports: ['websocket', 'polling'],
        withCredentials: true,
        autoConnect: true,
      });
      __socketCache.instance = socket;
    } else {
      console.log('[Messages] ♻️ Reusing socket', socket.id);
      // Re-register immediately so backend knows we're still here
      if (socket.connected) socket.emit('registerUser', myId);
    }
    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketConnected(true);
      socket.emit('registerUser', myId);
      console.log('[socket] ✅ Connected:', socket.id, '| Registered userId:', myId);
    });
    socket.on('disconnect', (reason) => {
      setSocketConnected(false);
      console.log('[socket] ❌ Disconnected:', reason);
      if (reason === 'io server disconnect' || reason === 'transport close') {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = setTimeout(() => socket.connect(), 800);
      }
    });
    socket.on('connect_error', (err) => {
      console.warn('[socket] connect_error:', err.message);
    });

    // ─── INCOMING MESSAGE ────────────────────────────────────────────────────
    socket.on('receiveMessage', ({ conversationId, message }) => {
      if (!message) return;
      setMessages(prev => {
        const list = prev[conversationId] || [];
        // De-dupe if backend echo arrives after we already optimistically inserted
        if (list.some(m => m.id === message.id)) return prev;
        return { ...prev, [conversationId]: [...list, message] };
      });
      // Bump conversation preview + unread badge
      setConversations(prev => prev.map(c =>
        c.id === conversationId
          ? {
            ...c,
            lastMessage: message.text || (message.fileType === 'image' ? '📷 Photo'
              : message.fileType === 'audio' ? '🎤 Voice note'
                : message.fileType === 'video' ? '🎬 Video'
                  : message.fileType === 'document' ? '📎 File' : ''),
            lastMessageAt: message.createdAt,
            unread: activeConvIdRef.current === conversationId ? 0 : (c.unread || 0) + 1
          }
          : c
      ));
      // If chat is open, auto-mark-read
      if (activeConvIdRef.current === conversationId) {
        const conv = conversationsRef.current?.find(c => c.id === conversationId);
        if (conv) {
          socket.emit('markRead', { conversationId, targetUserId: conv.otherUserId });
          // Also fire the HTTP cascade so it persists
          const token = getToken();
          if (token) fetch(`${API}/chat/conversations/${conversationId}/read`, {
            method: 'PUT', headers: { Authorization: `Bearer ${token}` }
          }).catch(() => { });
        }
      }
    });

    // ─── ECHO TO OWN OTHER DEVICES ───────────────────────────────────────────
    socket.on('messageSentEcho', ({ conversationId, message }) => {
      if (!message) return;
      setMessages(prev => {
        const list = prev[conversationId] || [];
        // If we already have a matching tempId, replace; else append
        const tempIdx = message.clientTempId ? list.findIndex(m => m.id === message.clientTempId) : -1;
        if (tempIdx >= 0) {
          const updated = [...list];
          updated[tempIdx] = message;
          return { ...prev, [conversationId]: updated };
        }
        if (list.some(m => m.id === message.id)) return prev;
        return { ...prev, [conversationId]: [...list, message] };
      });
    });

    // ─── EDIT / UNSEND BROADCASTS ────────────────────────────────────────────
    socket.on('messageEdited', ({ conversationId, message }) => {
      setMessages(prev => ({
        ...prev,
        [conversationId]: (prev[conversationId] || []).map(m => m.id === message.id ? message : m)
      }));
    });
    socket.on('messageUnsent', ({ conversationId, messageId, message }) => {
      setMessages(prev => ({
        ...prev,
        [conversationId]: (prev[conversationId] || []).map(m => m.id === messageId ? (message || { ...m, deletedForEveryone: true, text: '', fileUrl: null }) : m)
      }));
    });

    // ─── TYPING ──────────────────────────────────────────────────────────────
    socket.on('userTyping', ({ conversationId, userId }) => {
      if (activeConvIdRef.current === conversationId && userId !== myId) {
        setPeerTyping(true);
        clearTimeout(peerTypingTimerRef.current);
        // Auto-clear if no further pings (typing indicator should never get stuck)
        peerTypingTimerRef.current = setTimeout(() => setPeerTyping(false), 3500);
      }
    });
    socket.on('userStoppedTyping', ({ conversationId, userId }) => {
      if (activeConvIdRef.current === conversationId && userId !== myId) {
        setPeerTyping(false);
      }
    });

    // ─── READ RECEIPTS ───────────────────────────────────────────────────────
    socket.on('messagesRead', ({ conversationId, readerId, readAt }) => {
      if (readerId === myId) return;
      setMessages(prev => ({
        ...prev,
        [conversationId]: (prev[conversationId] || []).map(m =>
          m.isOwn && !m.isRead ? { ...m, isRead: true, readAt } : m
        )
      }));
    });

    // ─── BLOCKED LIVE ────────────────────────────────────────────────────────
    socket.on('youWereBlocked', ({ byUserId }) => {
      setConversations(prev => prev.map(c => c.otherUserId === byUserId ? { ...c, amIBlocked: true } : c));
      setSelectedConversation(prev => prev && prev.otherUserId === byUserId ? { ...prev, amIBlocked: true } : prev);
    });
    socket.on('youWereUnblocked', ({ byUserId }) => {
      setConversations(prev => prev.map(c => c.otherUserId === byUserId ? { ...c, amIBlocked: false } : c));
      setSelectedConversation(prev => prev && prev.otherUserId === byUserId ? { ...prev, amIBlocked: false } : prev);
    });

    // ─── Mobile resume: re-register on tab focus, and heartbeat ──────────────
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        if (!socket.connected) socket.connect();
        else socket.emit('registerUser', myId);
      }
    };
    const heartbeatInterval = setInterval(() => {
      if (socket.connected) socket.emit('heartbeat');
    }, 25000);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('online', () => socket.connect());

    return () => {
      clearInterval(heartbeatInterval);
      clearTimeout(reconnectTimerRef.current);
      document.removeEventListener('visibilitychange', onVisibility);

      // 🟢 SINGLETON CLEANUP — only fully disconnect when the last consumer
      // unmounts. StrictMode's first cleanup just decrements the ref count;
      // the second mount finds the socket still alive and reuses it.
      __socketCache.refs -= 1;
      if (__socketCache.refs <= 0) {
        // Defer the real disconnect to survive StrictMode's
        // mount → cleanup → mount sequence (all happens within ~50ms).
        setTimeout(() => {
          if (__socketCache.refs <= 0 && __socketCache.instance) {
            console.log('[Messages] 👋 Last consumer left — fully disconnecting socket');
            __socketCache.instance.disconnect();
            __socketCache.instance = null;
          }
        }, 200);
      }
      // Remove only the listeners we attached so other consumers (none yet,
      // but future-proofing) aren't affected.
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('receiveMessage');
      socket.off('messageSentEcho');
      socket.off('messageEdited');
      socket.off('messageUnsent');
      socket.off('userTyping');
      socket.off('userStoppedTyping');
      socket.off('messagesRead');
      socket.off('youWereBlocked');
      socket.off('youWereUnblocked');
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // 🟢 DATA FETCHING
  // ═══════════════════════════════════════════════════════════════════════════
  const fetchConversations = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      let res = await fetch(`${API}/chat/conversations`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok && res.status === 404) {
        res = await fetch(`${API}/auth/connections`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.success) {
          const validated = data.connections.map(c => ({
            ...c,
            avatar: getAvatarSrc({ id: c._id, gender: c.gender, level: c.level, settings: c.settings, hasPicture: !!c.picture }),
            online: resolveOnline(c),
            lastLogin: c.lastLogin ?? null,
            lastSeen: c.lastLogin ?? null,
          }));
          setConversations(validated);
        }
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success) {
        const validated = data.conversations.map(c => ({
          ...c,
          avatar: getAvatarSrc({ id: c.otherUserId, gender: c.gender, level: c.level, settings: c.settings, hasPicture: c.hasPicture }),
          online: resolveOnline(c),
          lastLogin: c.lastLogin ?? c.otherUserLastLogin ?? null,
          lastSeen: c.lastSeen ?? c.otherUserLastSeen ?? c.lastMessageAt ?? null,
        }));
        setConversations(validated);
      }
    } catch (err) {
      console.error('[Messages] fetchConversations:', err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
    // Slower polling as a fallback (socket carries the bulk of updates now)
    const id = setInterval(fetchConversations, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchConversations]);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (!selectedConversation?.id) return;
    const convId = selectedConversation.id;
    activeConvIdRef.current = convId;

    const fetchMessages = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const res = await fetch(`${API}/chat/messages/${convId}`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) { if (res.status === 404) return; throw new Error(`HTTP ${res.status}`); }
        const data = await res.json();
        if (data.success && activeConvIdRef.current === convId) {
          setMessages(prev => ({ ...prev, [convId]: data.messages }));
        }
      } catch (err) {
        console.error('[Messages] fetchMessages:', err);
      }
    };
    fetchMessages();
    return () => { if (activeConvIdRef.current === convId) activeConvIdRef.current = null; };
  }, [selectedConversation?.id]);

  // Active conversation pointer
  const activeConversation = useMemo(
    () => conversations.find(c => c.id === selectedConversation?.id) || selectedConversation,
    [conversations, selectedConversation]
  );

  // Auto-mark-read when opening a conversation with unread
  useEffect(() => {
    if (!activeConversation?.id || !activeConversation?.unread) return;
    setConversations(prev => prev.map(c => c.id === activeConversation.id ? { ...c, unread: 0 } : c));
    setSelectedConversation(prev => prev ? { ...prev, unread: 0 } : prev);
    window.dispatchEvent(new Event('chatRead'));
    const token = getToken();
    if (!token) return;
    fetch(`${API}/chat/conversations/${activeConversation.id}/read`, {
      method: 'PUT', headers: { Authorization: `Bearer ${token}` }
    }).catch(err => console.error('[Messages] markRead:', err));
    // Also via socket for instant peer-side update
    if (socketRef.current?.connected) {
      socketRef.current.emit('markRead', { conversationId: activeConversation.id, targetUserId: activeConversation.otherUserId });
    }
  }, [activeConversation?.id, activeConversation?.unread]);

  // Scroll to latest
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedConversation, peerTyping]);

  // Focus input on conversation open
  useEffect(() => {
    if (activeConversation) setTimeout(() => inputRef.current?.focus(), 100);
  }, [activeConversation?.id]);

  // ═══════════════════════════════════════════════════════════════════════════
  // 🟢 SEND MESSAGE (text, reply, media — always via FormData for consistency)
  // ═══════════════════════════════════════════════════════════════════════════
  const sendMessageInternal = useCallback(async ({ text = '', file = null, replyToId = null }) => {
    if (!selectedConversation || isSending) return;
    if (!text.trim() && !file) return;
    if (text.length > MAX_MESSAGE_LENGTH) {
      showToast(`Message too long. Max ${MAX_MESSAGE_LENGTH.toLocaleString()} characters.`);
      return;
    }

    setIsSending(true);

    // 🟢 Declare outside try so the catch block can still reference it for status='error'
    let tempId = null;
    const currentConvId = selectedConversation.id || 'temp';

    try {
      tempId = `temp-${safeUUID()}`;

      // Optimistic insert
      const tempMessage = {
        id: tempId,
        text: text.trim(),
        senderId: 'me',
        isOwn: true,
        status: 'sending',
        isRead: false,
        _retryPayload: { text, replyToId, file }, // file may be a Blob/File
        createdAt: new Date().toISOString(),
        replyTo: replyingTo ? {
          id: replyingTo.id,
          text: replyingTo.text,
          senderId: replyingTo.senderId,
          fileType: replyingTo.fileType || null,
          deletedForEveryone: false
        } : null,
        fileUrl: file ? URL.createObjectURL(file) : null,
        fileType: file ? (file.type.startsWith('image/') ? 'image' : file.type.startsWith('audio/') ? 'audio' : file.type.startsWith('video/') ? 'video' : 'document') : null,
        fileName: file?.name || null,
        fileSize: file?.size || null,
      };

      setMessages(prev => ({ ...prev, [currentConvId]: [...(prev[currentConvId] || []), tempMessage] }));

      const token = getToken();
      if (!token) throw new Error('Not authenticated');

      // 🟢 USE FormData ALWAYS — robust on mobile, handles both text & media uniformly
      const fd = new FormData();
      if (selectedConversation.id) fd.append('conversationId', selectedConversation.id);
      if (selectedConversation.otherUserId) fd.append('targetUserId', selectedConversation.otherUserId);
      if (text.trim()) fd.append('text', text.trim());
      if (replyToId) fd.append('replyTo', replyToId);
      fd.append('clientTempId', tempId);
      if (file) fd.append('file', file, file.name || 'upload');

      // 🟢 fetchWithTimeout — prevents the send button from spinning forever
      // when the phone can't reach the server (LAN drop, slow network, etc.)
      const res = await fetchWithTimeout(`${API}/chat/messages`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }, // DO NOT set Content-Type — browser sets boundary
        body: fd
      }, 30000); // 30s — generous for image/voice uploads on slow mobile

      if (res.status === 404) {
        showToast('Chat system not yet available.');
        return; // finally{} will clear isSending
      }

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Send failed');

      // Resolve conversationId if it was newly created
      if (!selectedConversation.id && data.conversationId) {
        setSelectedConversation(prev => ({ ...prev, id: data.conversationId }));
        setMessages(prev => {
          const { temp, ...rest } = prev;
          return { ...rest, [data.conversationId]: temp || [] };
        });
        fetchConversations();
      }

      const finalConvId = data.conversationId || currentConvId;
      // Swap temp with server message
      setMessages(prev => ({
        ...prev,
        [finalConvId]: (prev[finalConvId] || []).map(m => m.id === tempId ? { ...data.message, status: 'delivered' } : m)
      }));

      setConversations(prev => prev.map(c =>
        c.id === finalConvId
          ? { ...c, lastMessage: data.message.text || (data.message.fileType === 'image' ? '📷 Photo' : data.message.fileType === 'audio' ? '🎤 Voice note' : ''), lastSender: 'me', lastMessageRead: false }
          : c
      ));
    } catch (err) {
      console.error('[Messages] sendMessage:', err);
      // Differentiate timeout from other failures so user knows what to do
      const isTimeout = err.name === 'AbortError';
      showToast(isTimeout ? 'Network timeout. Check your connection and retry.' : (err.message || 'Failed to send. Tap ↺ to retry.'));
      // Only mark error if we got far enough to insert the temp message
      if (tempId) {
        setMessages(prev => ({
          ...prev,
          [currentConvId]: (prev[currentConvId] || []).map(m => m.id === tempId ? { ...m, status: 'error' } : m)
        }));
      }
    } finally {
      // 🟢 ALWAYS clears — no matter what threw above, the button stops spinning
      setIsSending(false);
    }
  }, [selectedConversation, isSending, replyingTo, showToast, fetchConversations]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();

    // 🟢 EDIT MODE submission
    if (editingMessage) {
      await submitEdit();
      return;
    }

    const text = newMessage.trim();
    if (!text) return;

    const replyToId = replyingTo?.id || null;
    setNewMessage('');
    setReplyingTo(null);
    // Stop typing immediately
    emitStopTyping();

    await sendMessageInternal({ text, replyToId });
  };

  const handleRetry = useCallback((failedMsg) => {
    if (!failedMsg._retryPayload || !selectedConversation) return;
    const key = selectedConversation.id || 'temp';
    setMessages(prev => ({ ...prev, [key]: (prev[key] || []).filter(m => m.id !== failedMsg.id) }));
    sendMessageInternal(failedMsg._retryPayload);
  }, [selectedConversation, sendMessageInternal]);

  // ═══════════════════════════════════════════════════════════════════════════
  // 🟢 TYPING — debounced socket emits (no HTTP spam)
  // ═══════════════════════════════════════════════════════════════════════════
  const emitTyping = useCallback(() => {
    if (!socketRef.current?.connected || !activeConversation?.id || !activeConversation?.otherUserId) return;
    socketRef.current.emit('typing', {
      conversationId: activeConversation.id,
      targetUserId: activeConversation.otherUserId
    });
    clearTimeout(typingEmitTimerRef.current);
    typingEmitTimerRef.current = setTimeout(emitStopTyping, TYPING_DEBOUNCE_MS);
  }, [activeConversation]);

  const emitStopTyping = useCallback(() => {
    if (!socketRef.current?.connected || !activeConversation?.id || !activeConversation?.otherUserId) return;
    socketRef.current.emit('stopTyping', {
      conversationId: activeConversation.id,
      targetUserId: activeConversation.otherUserId
    });
    clearTimeout(typingEmitTimerRef.current);
  }, [activeConversation]);

  const handleInputChange = (e) => {
    if (e.target.value.length <= MAX_MESSAGE_LENGTH) {
      setNewMessage(e.target.value);
      if (e.target.value.trim()) emitTyping();
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // 🟢 REPLY / EDIT / UNSEND / DELETE-FOR-ME
  // ═══════════════════════════════════════════════════════════════════════════
  const handleReply = useCallback((msg) => {
    setReplyingTo({
      id: msg.id,
      text: msg.text,
      senderId: msg.senderId,
      senderName: msg.isOwn ? 'You' : (activeConversation?.name || 'They'),
      fileType: msg.fileType
    });
    setEditingMessage(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [activeConversation]);

  const handleStartEdit = useCallback((msg) => {
    if (!msg.isOwn || msg.fileUrl) return;
    if (!isWithinEditWindow(msg.createdAt)) {
      showToast('Edit window has expired.');
      return;
    }
    setEditingMessage({ id: msg.id, originalText: msg.text });
    setNewMessage(msg.text || '');
    setReplyingTo(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [showToast]);

  const submitEdit = async () => {
    if (!editingMessage) return;
    const trimmed = newMessage.trim();
    if (!trimmed) { showToast('Message cannot be empty.'); return; }
    if (trimmed === editingMessage.originalText) {
      setEditingMessage(null);
      setNewMessage('');
      return;
    }
    const convId = selectedConversation?.id;
    if (!convId) return;
    // Optimistic UI
    setMessages(prev => ({
      ...prev,
      [convId]: (prev[convId] || []).map(m => m.id === editingMessage.id ? { ...m, text: trimmed, isEdited: true } : m)
    }));
    const idToEdit = editingMessage.id;
    setEditingMessage(null);
    setNewMessage('');

    try {
      const token = getToken();
      const res = await fetch(`${API}/chat/messages/${idToEdit}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Edit failed');
      // Replace with authoritative server copy
      setMessages(prev => ({
        ...prev,
        [convId]: (prev[convId] || []).map(m => m.id === idToEdit ? data.message : m)
      }));
    } catch (err) {
      showToast(err.message || 'Failed to edit message.');
      // Reload to revert
      const token = getToken();
      if (token) {
        fetch(`${API}/chat/messages/${convId}`, { headers: { Authorization: `Bearer ${token}` } })
          .then(r => r.json()).then(d => { if (d.success) setMessages(prev => ({ ...prev, [convId]: d.messages })); })
          .catch(() => { });
      }
    }
  };

  const cancelEditOrReply = () => {
    if (editingMessage) {
      setEditingMessage(null);
      setNewMessage('');
    }
    setReplyingTo(null);
  };

  const handleUnsend = useCallback((msg) => {
    if (!msg.isOwn) return;
    if (!isWithinEditWindow(msg.createdAt)) {
      showToast('Unsend window has expired.');
      return;
    }
    setPendingUnsend(msg);
    setShowConfirmModal('unsend');
  }, [showToast]);

  const confirmUnsend = async () => {
    if (!pendingUnsend) return;
    const msg = pendingUnsend;
    const convId = selectedConversation?.id;
    setShowConfirmModal(null);
    setPendingUnsend(null);
    // Optimistic
    setMessages(prev => ({
      ...prev,
      [convId]: (prev[convId] || []).map(m => m.id === msg.id ? { ...m, deletedForEveryone: true, text: '', fileUrl: null, fileType: null } : m)
    }));
    try {
      const token = getToken();
      const res = await fetch(`${API}/chat/messages/${msg.id}/unsend`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Unsend failed');
      showToast('Message unsent.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to unsend.');
    }
  };

  const handleDeleteForMe = useCallback(async (msg) => {
    const convId = selectedConversation?.id;
    if (!convId) return;
    setMessages(prev => ({ ...prev, [convId]: (prev[convId] || []).filter(m => m.id !== msg.id) }));
    try {
      const token = getToken();
      await fetch(`${API}/chat/messages/${msg.id}/me`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      showToast('Failed to delete.');
    }
  }, [selectedConversation, showToast]);

  const scrollToMessage = useCallback((messageId) => {
    const el = document.querySelector(`[data-msg-id="${messageId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.style.transition = 'background 0.4s';
      el.style.background = 'rgba(99,102,241,0.15)';
      setTimeout(() => { el.style.background = ''; }, 1400);
    }
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // 🟢 MEDIA UPLOAD — IMAGE + VOICE NOTE
  // ═══════════════════════════════════════════════════════════════════════════
  const handleImagePick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      showToast('File too large. Max 25MB.');
      e.target.value = '';
      return;
    }
    // Reset so picking the same file twice still fires onChange
    e.target.value = '';
    sendMessageInternal({ text: '', file, replyToId: replyingTo?.id || null });
    setReplyingTo(null);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm'
          : MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4'
            : '';
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recordedChunksRef.current = [];
      recorder.ondataavailable = (ev) => { if (ev.data && ev.data.size > 0) recordedChunksRef.current.push(ev.data); };
      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        // Wrap blob as File so backend gets a proper filename
        const ext = (recorder.mimeType || '').includes('mp4') ? 'm4a' : 'webm';
        const file = new File([blob], `voice-${Date.now()}.${ext}`, { type: blob.type });
        stream.getTracks().forEach(t => t.stop());
        if (file.size > 200) sendMessageInternal({ text: '', file, replyToId: replyingTo?.id || null });
        setReplyingTo(null);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingDuration(0);
      recordingTimerRef.current = setInterval(() => setRecordingDuration(d => d + 1), 1000);
    } catch (err) {
      showToast('Microphone access denied.');
    }
  };

  const stopRecording = (discard = false) => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      if (discard) {
        // Replace onstop with no-op to discard
        mediaRecorderRef.current.onstop = () => {
          recordedChunksRef.current = [];
          mediaRecorderRef.current.stream?.getTracks().forEach(t => t.stop());
        };
      }
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    clearInterval(recordingTimerRef.current);
    setRecordingDuration(0);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // 🟢 NEW CHAT FLOW
  // ═══════════════════════════════════════════════════════════════════════════
  const handleOpenNewChat = async () => {
    setShowNewChatModal(true);
    setConnectionsLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API}/auth/connections`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success) {
        setConnections(data.connections.map(u => ({ ...u, isOnline: resolveOnline({ isOnline: u.isOnline, lastLogin: u.lastLogin }) })));
      }
    } catch (err) {
      showToast('Could not load connections.');
    } finally {
      setConnectionsLoading(false);
    }
  };

  const handleStartNewChat = (user) => {
    const existing = conversations.find(c => c.otherUserId === user._id);
    if (existing) {
      setSelectedConversation(existing);
    } else {
      setSelectedConversation({
        id: null,
        otherUserId: user._id,
        name: user.fullName,
        avatar: getAvatarSrc({ id: user._id, gender: user.gender, level: user.level, settings: user.settings, hasPicture: !!user.picture }),
        lastMessage: '',
        lastSeen: user.lastLogin || null,
        unread: 0,
        online: resolveOnline({ isOnline: user.isOnline, lastLogin: user.lastLogin }),
        lastLogin: user.lastLogin
      });
    }
    setShowNewChatModal(false);
    setNewChatSearch('');
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // 🟢 CLEAR / DELETE / BLOCK — preserved
  // ═══════════════════════════════════════════════════════════════════════════
  const handleClearChat = async () => {
    if (!selectedConversation?.id) return;
    const convId = selectedConversation.id;
    const backupMessages = messages[convId] || [];
    const backupConvs = [...conversations];
    setMessages(prev => ({ ...prev, [convId]: [] }));
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, lastMessage: '', lastSender: null } : c));
    setShowConfirmModal(null);
    setShowChatMenu(false);
    try {
      const token = getToken();
      const res = await fetch(`${API}/chat/messages/${convId}/clear`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showToast('Chat cleared.', 'success');
    } catch (err) {
      setMessages(prev => ({ ...prev, [convId]: backupMessages }));
      setConversations(backupConvs);
      showToast('Failed to clear chat.');
    }
  };

  const handleDeleteChat = async () => {
    if (!selectedConversation?.id) return;
    const convId = selectedConversation.id;
    const backupConvs = [...conversations];
    const backupSelected = selectedConversation;
    setConversations(prev => prev.filter(c => c.id !== convId));
    setSelectedConversation(null);
    setShowConfirmModal(null);
    setShowChatMenu(false);
    try {
      const token = getToken();
      const res = await fetch(`${API}/chat/conversations/${convId}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showToast('Conversation deleted.', 'success');
    } catch (err) {
      setConversations(backupConvs);
      setSelectedConversation(backupSelected);
      showToast('Failed to delete chat.');
    }
  };

  const handleBlockUser = async () => {
    if (!selectedConversation) return;
    const targetId = selectedConversation.otherUserId;
    setConversations(prev => prev.map(c => c.id === selectedConversation.id ? { ...c, didIBlock: true } : c));
    setSelectedConversation(prev => ({ ...prev, didIBlock: true }));
    setShowConfirmModal(null);
    setShowChatMenu(false);
    try {
      const token = getToken();
      const res = await fetch(`${API}/chat/block/${targetId}`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showToast('User blocked successfully.', 'success');
    } catch (err) {
      setConversations(prev => prev.map(c => c.id === selectedConversation.id ? { ...c, didIBlock: false } : c));
      setSelectedConversation(prev => ({ ...prev, didIBlock: false }));
      showToast('Failed to block user.');
    }
  };

  const handleUnblockUser = async () => {
    if (!selectedConversation) return;
    const targetId = selectedConversation.otherUserId;
    setConversations(prev => prev.map(c => c.id === selectedConversation.id ? { ...c, didIBlock: false } : c));
    setSelectedConversation(prev => ({ ...prev, didIBlock: false }));
    setShowConfirmModal(null);
    setShowChatMenu(false);
    try {
      const token = getToken();
      const res = await fetch(`${API}/chat/unblock/${targetId}`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showToast('User unblocked successfully.', 'success');
    } catch (err) {
      setConversations(prev => prev.map(c => c.id === selectedConversation.id ? { ...c, didIBlock: true } : c));
      setSelectedConversation(prev => ({ ...prev, didIBlock: true }));
      showToast('Failed to unblock user.');
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // 🟢 OUTSIDE CLICKS / ESC
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const onMouse = (e) => {
      if (newChatModalRef.current && !newChatModalRef.current.contains(e.target)) setShowNewChatModal(false);
      if (chatMenuRef.current && !chatMenuRef.current.contains(e.target)) setShowChatMenu(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setShowNewChatModal(false);
        setShowConfirmModal(null);
        setShowChatMenu(false);
        cancelEditOrReply();
      }
    };
    document.addEventListener('mousedown', onMouse);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onMouse);
      document.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // 🟢 DERIVED STATE
  // ═══════════════════════════════════════════════════════════════════════════
  const filteredConversations = useMemo(() => conversations.filter(c =>
    c.name?.toLowerCase().includes(debouncedSearch.toLowerCase())
  ), [conversations, debouncedSearch]);

  const filteredAvailableUsers = useMemo(() => connections.filter(u =>
    u.fullName?.toLowerCase().includes(debouncedNewChatSearch.toLowerCase())
  ), [connections, debouncedNewChatSearch]);

  const currentMessages = useMemo(() => {
    if (!selectedConversation) return [];
    return messages[selectedConversation.id || 'temp'] || [];
  }, [messages, selectedConversation]);

  const renderedMessages = useMemo(() => {
    const result = [];
    let lastDate = null;
    currentMessages.forEach((msg, i) => {
      const msgDate = msg.createdAt || msg.timestamp;
      if (msgDate && (!lastDate || !isSameDay(lastDate, msgDate))) {
        const label = formatDateSeparator(msgDate);
        if (label) result.push({ type: 'date', label, key: `date-${i}` });
        lastDate = msgDate;
      }
      const prev = currentMessages[i - 1];
      const next = currentMessages[i + 1];
      const isFirst = !prev || prev.senderId !== msg.senderId;
      const isLast = !next || next.senderId !== msg.senderId;
      result.push({ type: 'message', msg, isFirst, isLast });
    });
    return result;
  }, [currentMessages]);

  const charsLeft = MAX_MESSAGE_LENGTH - newMessage.length;
  const charsWarning = charsLeft < 200;

  const statusText = useMemo(() => {
    if (!activeConversation) return '';
    if (peerTyping) return 'typing…';
    if (activeConversation.online) return 'Online';
    const raw = activeConversation.lastSeen || activeConversation.lastLogin;
    if (!raw) return 'Offline';
    const d = parseDate(raw);
    if (!d) return 'Offline';
    const ago = formatLastSeen(raw);
    return ago && ago !== 'Offline' ? `Last seen ${ago}` : 'Offline';
  }, [activeConversation, peerTyping]);

  // Backend "admin blocked"/deleted detection — the conversation list flags amIBlocked
  const isBlockedByAdmin = activeConversation?.adminBlocked || activeConversation?.userDeleted;
  const inputDisabled = !!(activeConversation?.didIBlock || activeConversation?.amIBlocked || isBlockedByAdmin);
  const blockedPlaceholder = isBlockedByAdmin
    ? 'This user is no longer available.'
    : activeConversation?.didIBlock
      ? 'You blocked this contact. Unblock to send a message.'
      : activeConversation?.amIBlocked
        ? 'You cannot reply to this conversation.'
        : '';


  // ═══════════════════════════════════════════════════════════════════════════
  // 🟢 RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <>
      <style>{`
        @keyframes typingBounce {
          0%,60%,100% { transform: translateY(0); opacity:0.4; }
          30%          { transform: translateY(-6px); opacity:1; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
      `}</style>

      <motion.div
        className={styles.container}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}
      >
        {/* Tiny connection-status pill — useful during dev, can hide if you want */}
        {!socketConnected && (
          <div style={{
            position: 'fixed', top: 8, right: 8, zIndex: 5000,
            background: 'rgba(239,68,68,0.95)', color: 'white',
            fontSize: '0.7rem', fontWeight: 600, padding: '4px 10px',
            borderRadius: 99, display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 4px 12px rgba(239,68,68,0.4)'
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'white', animation: 'pulse 1.4s infinite' }} />
            Reconnecting…
          </div>
        )}

        <div className={styles.messagesWrapper}>
          {/* ═══ SIDEBAR ═══ */}
          <div className={styles.conversationsSidebar}>
            <div className={styles.sidebarHeader}>
              <h2 className={styles.sidebarTitle}>Messages</h2>
              <button className={styles.addChatBtn} onClick={handleOpenNewChat} title="New message">
                <MessageSquarePlus size={18} />
              </button>
            </div>

            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} size={15} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                maxLength={100}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', padding: '0 4px' }}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className={styles.conversationsList}>
              {loading ? (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <div style={{ width: 20, height: 20, border: '2px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 8px' }} />
                  Loading...
                </div>
              ) : filteredConversations.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <MessageSquare size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                  <p style={{ margin: 0, fontSize: '0.85rem' }}>{searchQuery ? 'No results found.' : 'No conversations yet.'}</p>
                  {!searchQuery && (
                    <button onClick={handleOpenNewChat} style={{ marginTop: 12, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, color: '#6366f1', padding: '6px 14px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>
                      Start a conversation
                    </button>
                  )}
                </div>
              ) : (
                filteredConversations.map(conv => {
                  const isActive = activeConversation?.id === conv.id;
                  return (
                    <div key={conv.id} className={`${styles.conversationItem} ${isActive ? styles.selected : ''}`} onClick={() => setSelectedConversation(conv)}>
                      <Avatar src={conv.avatar} name={conv.name} size={46} online={conv.online} />
                      <div className={styles.conversationInfo}>
                        <div className={styles.conversationHeader}>
                          <span className={styles.conversationName}>{conv.name}</span>
                          <span className={styles.conversationTime} style={{ fontSize: '0.7rem' }}>
                            {conv.online ? (
                              <span style={{ color: '#22c55e', fontWeight: '600', fontSize: '0.68rem' }}>Online</span>
                            ) : (formatLastSeen(conv.lastMessageAt || conv.updatedAt || conv.lastSeen) || '')}
                          </span>
                        </div>
                        <div className={styles.conversationPreview}>
                          <span className={styles.lastMessage} style={{ color: conv.unread > 0 ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: conv.unread > 0 ? '500' : '400' }}>
                            {conv.lastSender === 'me' && (
                              <span style={{ marginRight: 2 }}>
                                {conv.lastMessageRead
                                  ? <CheckCheck size={13} style={{ color: '#6366f1', verticalAlign: 'middle' }} />
                                  : <Check size={13} style={{ color: '#94a3b8', verticalAlign: 'middle' }} />}
                              </span>
                            )}
                            {sanitize(conv.lastMessage) || (<span style={{ fontStyle: 'italic', opacity: 0.5 }}>No messages yet</span>)}
                          </span>
                          {conv.unread > 0 && (
                            <span className={styles.unreadBadge} style={{ background: '#6366f1', color: 'white', fontSize: '0.68rem', fontWeight: '700', padding: '2px 7px', borderRadius: '99px', flexShrink: 0 }}>
                              {conv.unread > 99 ? '99+' : conv.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ═══ CHAT AREA ═══ */}
          <div className={styles.chatArea} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {activeConversation ? (
              <>
                {/* HEADER */}
                <div className={styles.chatHeader}>
                  <div className={styles.chatUserInfo}>
                    <button onClick={() => setSelectedConversation(null)} className={styles.mobileBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'none', padding: '4px' }}>
                      <ArrowLeft size={20} />
                    </button>
                    <Avatar src={activeConversation.avatar} name={activeConversation.name} size={40} online={activeConversation.online} />
                    <div className={styles.chatUserDetails} style={{ marginLeft: 10 }}>
                      <h3 className={styles.chatUserName}>{activeConversation.name}</h3>
                      <span className={styles.chatUserStatus} style={{ fontSize: '0.75rem', color: peerTyping ? '#6366f1' : (activeConversation.online ? '#22c55e' : 'var(--text-secondary)'), fontWeight: peerTyping ? 600 : 400 }}>
                        {statusText}
                      </span>
                    </div>
                  </div>

                  <div className={styles.chatHeaderActions}>
                    <div className={styles.chatMenuWrapper} ref={chatMenuRef}>
                      <button className={styles.chatMenuBtn} onClick={() => setShowChatMenu(v => !v)}>
                        <MoreVertical size={20} />
                      </button>
                      <AnimatePresence>
                        {showChatMenu && (
                          <motion.div className={styles.chatMenuDropdown} initial={{ opacity: 0, scale: 0.9, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -8 }} transition={{ duration: 0.15 }}>
                            <button className={styles.chatMenuItem} onClick={() => { setShowConfirmModal('clear'); setShowChatMenu(false); }}>
                              <Trash2 size={14} /> Clear Chat
                            </button>
                            <button className={styles.chatMenuItem} onClick={() => { setShowConfirmModal('delete'); setShowChatMenu(false); }}>
                              <X size={14} /> Delete Chat
                            </button>
                            <div style={{ height: 1, background: 'var(--border-color)', margin: '4px 0' }} />
                            {activeConversation.didIBlock ? (
                              <button className={styles.chatMenuItem} onClick={() => { setShowConfirmModal('unblock'); setShowChatMenu(false); }}>
                                <ShieldAlert size={14} style={{ color: '#10b981' }} />
                                <span style={{ color: '#10b981' }}>Unblock User</span>
                              </button>
                            ) : (
                              <button className={`${styles.chatMenuItem} ${styles.dangerItem}`} onClick={() => { setShowConfirmModal('block'); setShowChatMenu(false); }}>
                                <Ban size={14} /> Block User
                              </button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <button className={styles.closeChat} onClick={() => setSelectedConversation(null)}>
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* MESSAGES */}
                <div ref={messagesContainerRef} className={styles.messagesContainer} style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
                  {currentMessages.length === 0 && (
                    <div className={styles.noMessages} style={{ textAlign: 'center', padding: '40px 20px' }}>
                      <Avatar src={activeConversation.avatar} name={activeConversation.name} size={64} online={activeConversation.online} />
                      <h4 style={{ margin: '12px 0 4px', color: 'var(--text-primary)' }}>{activeConversation.name}</h4>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Send a message to start the conversation 👋</p>
                    </div>
                  )}

                  {renderedMessages.map((item) =>
                    item.type === 'date' ? (
                      <DateSeparator key={item.key} label={item.label} />
                    ) : (
                      <div key={item.msg.id} data-msg-id={item.msg.id}>
                        <MessageBubble
                          message={item.msg}
                          onRetry={handleRetry}
                          isFirst={item.isFirst}
                          isLast={item.isLast}
                          onReply={handleReply}
                          onEdit={handleStartEdit}
                          onUnsend={handleUnsend}
                          onDeleteForMe={handleDeleteForMe}
                          scrollToMessage={scrollToMessage}
                          replyParticipantName={activeConversation.name}
                        />
                      </div>
                    )
                  )}

                  {peerTyping && <div style={{ paddingLeft: 4 }}><TypingIndicator /></div>}
                  <div ref={messagesEndRef} />
                </div>

                {/* INPUT AREA */}
                <div style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-primary)', flexShrink: 0 }}>
                  {/* 🟢 REPLY / EDIT PREVIEW BAR */}
                  {(replyingTo || editingMessage) && (
                    <div className={styles.replyPreview}>
                      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
                        <span style={{ fontWeight: 700, color: '#6366f1', fontSize: '0.75rem' }}>
                          {editingMessage ? 'Editing message' : `Replying to ${replyingTo.senderName}`}
                        </span>
                        <span className={styles.replyPreviewText}>
                          {editingMessage
                            ? sanitize(editingMessage.originalText).slice(0, 100)
                            : (replyingTo.fileType === 'image' ? '📷 Photo'
                              : replyingTo.fileType === 'audio' ? '🎤 Voice note'
                                : sanitize(replyingTo.text || '').slice(0, 100))}
                        </span>
                      </div>
                      <button onClick={cancelEditOrReply} className={styles.cancelReplyBtn}>
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  {/* 🟢 BLOCKED / DELETED USER STATES (admin moderation aware) */}
                  {inputDisabled ? (
                    <div className={styles.blockedNotice}>
                      {isBlockedByAdmin ? <ShieldAlert size={16} /> : <Ban size={16} />}
                      {blockedPlaceholder}
                    </div>
                  ) : (
                    <div style={{ padding: '12px 16px' }}>
                      {charsWarning && (
                        <div style={{ fontSize: '0.68rem', color: charsLeft < 50 ? '#ef4444' : 'var(--text-secondary)', textAlign: 'right', marginBottom: '4px' }}>
                          {charsLeft} characters left
                        </div>
                      )}

                      {/* RECORDING UI */}
                      {isRecording ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 16, padding: '10px 14px' }}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.2s infinite' }} />
                          <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontVariantNumeric: 'tabular-nums' }}>
                            Recording… {formatDuration(recordingDuration)}
                          </span>
                          <div style={{ flex: 1 }} />
                          <button onClick={() => stopRecording(true)} title="Cancel" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 6 }}>
                            <X size={18} />
                          </button>
                          <button onClick={() => stopRecording(false)} title="Send" style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'linear-gradient(135deg,#6366f1,#7c3aed)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Send size={15} />
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleSendMessage} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '6px 6px 6px 8px' }}>
                          {/* 🟢 MEDIA ACTIONS */}
                          <input ref={fileInputRef} type="file" accept="image/*,video/*,application/pdf" onChange={handleFileChange} style={{ display: 'none' }} />
                          {!editingMessage && (
                            <>
                              <button type="button" className={styles.mediaBtn} onClick={handleImagePick} title="Attach file" disabled={isSending}>
                                <ImageIcon size={18} />
                              </button>
                              <button type="button" className={styles.mediaBtn} onClick={startRecording} title="Record voice note" disabled={isSending}>
                                <Mic size={18} />
                              </button>
                            </>
                          )}

                          <input
                            ref={inputRef} type="text"
                            placeholder={editingMessage ? 'Edit your message...' : 'Type a message...'}
                            value={newMessage}
                            onChange={handleInputChange}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) handleSendMessage(e); }}
                            disabled={isSending}
                            maxLength={MAX_MESSAGE_LENGTH}
                            autoComplete="off"
                            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.92rem', padding: '6px 8px', minWidth: 0 }}
                          />
                          <button type="submit" disabled={!newMessage.trim() || isSending} title={editingMessage ? 'Save' : 'Send (Enter)'}
                            style={{ width: 40, height: 40, borderRadius: '12px', border: 'none', background: newMessage.trim() ? 'linear-gradient(135deg,#6366f1,#7c3aed)' : 'rgba(99,102,241,0.15)', color: newMessage.trim() ? 'white' : '#6366f1', cursor: newMessage.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s', boxShadow: newMessage.trim() ? '0 2px 8px rgba(99,102,241,0.4)' : 'none' }}>
                            {isSending ? <div style={{ width: 15, height: 15, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> : editingMessage ? <Check size={16} /> : <Send size={16} />}
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className={styles.noConversation} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={32} style={{ color: '#6366f1', opacity: 0.7 }} />
                </div>
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontWeight: '700' }}>Your messages</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem', textAlign: 'center' }}>Select a conversation or start a new one</p>
                <button onClick={handleOpenNewChat} style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', border: 'none', borderRadius: 12, color: 'white', padding: '10px 22px', cursor: 'pointer', fontWeight: '700', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}>
                  <MessageSquarePlus size={16} /> New Message
                </button>
              </div>
            )}
          </div>
        </div>

        {/* NEW CHAT MODAL */}
        <AnimatePresence>
          {showNewChatModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNewChatModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(6px)' }}>
              <motion.div ref={newChatModalRef} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }} onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-secondary)', borderRadius: '20px', padding: '24px', width: '400px', maxHeight: '560px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 24px 80px rgba(0,0,0,0.5)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '700' }}>New Message</h3>
                  <button onClick={() => setShowNewChatModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', padding: 4, borderRadius: 8 }}><X size={20} /></button>
                </div>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
                  <input type="text" placeholder="Search your connections..." value={newChatSearch} onChange={e => setNewChatSearch(e.target.value)} autoFocus style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.88rem', boxSizing: 'border-box', outline: 'none' }} />
                </div>
                <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {connectionsLoading ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <div style={{ width: 20, height: 20, border: '2px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 8px' }} />
                      Loading connections...
                    </div>
                  ) : filteredAvailableUsers.length === 0 ? (
                    <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem' }}>{newChatSearch ? 'No connections match your search.' : 'No connections yet.'}</p>
                    </div>
                  ) : (
                    filteredAvailableUsers.map(user => (
                      <button key={user._id} onClick={() => handleStartNewChat(user)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '12px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.08)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <Avatar src={getAvatarSrc(user)} name={user.fullName} size={42} online={user.isOnline} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.92rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.fullName}</p>
                          <p style={{ margin: 0, color: user.isOnline ? '#22c55e' : 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: user.isOnline ? '600' : '400' }}>{user.isOnline ? 'Online' : (user.department || '')}</p>
                        </div>
                        {conversations.some(c => c.otherUserId === user._id) && (
                          <span style={{ fontSize: '0.68rem', color: '#6366f1', background: 'rgba(99,102,241,0.1)', borderRadius: 99, padding: '2px 8px', fontWeight: '600', flexShrink: 0 }}>Existing</span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showConfirmModal && (
            <ConfirmModal
              type={showConfirmModal}
              onCancel={() => { setShowConfirmModal(null); setPendingUnsend(null); }}
              onConfirm={
                showConfirmModal === 'clear' ? handleClearChat :
                  showConfirmModal === 'delete' ? handleDeleteChat :
                    showConfirmModal === 'block' ? handleBlockUser :
                      showConfirmModal === 'unsend' ? confirmUnsend :
                        handleUnblockUser
              }
            />
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AnimatePresence>

      <ChatBot />
    </>
  );
};

export default Messages;
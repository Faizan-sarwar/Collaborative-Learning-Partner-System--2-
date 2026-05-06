import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MessageSquarePlus, MessageSquare, X, MoreVertical, Send,
  Trash2, Ban, ShieldAlert, Check, CheckCheck, AlertTriangle, RefreshCw,
  Phone, Video, ArrowLeft, Smile
} from 'lucide-react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import ChatBot from '../ChatBot/ChatBot';
import styles from './Messages.module.css';

import maleLevel1   from '../../src/assets/gamification/male-level-1.png';
import maleLevel2   from '../../src/assets/gamification/male-level-2.png';
import maleLevel3   from '../../src/assets/gamification/male-level-3.png';
import maleLevel4   from '../../src/assets/gamification/male-level-4.png';
import maleLevel5   from '../../src/assets/gamification/male-level-5.png';
import maleLevel6   from '../../src/assets/gamification/male-level-6.png';
import maleLevel7   from '../../src/assets/gamification/male-level-7.png';
import femaleLevel1 from '../../src/assets/gamification/female-level-1.png';
import femaleLevel2 from '../../src/assets/gamification/female-level-2.png';
import femaleLevel3 from '../../src/assets/gamification/female-level-3.png';
import femaleLevel4 from '../../src/assets/gamification/female-level-4.png';
import femaleLevel5 from '../../src/assets/gamification/female-level-5.png';
import femaleLevel6 from '../../src/assets/gamification/female-level-6.png';
import femaleLevel7 from '../../src/assets/gamification/female-level-7.png';

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_MESSAGE_LENGTH  = 4000;
const POLL_INTERVAL_MS    = 3000;
const API = `http://${window.location.hostname}:5000/api`;

// 🟢 ONLINE WINDOW: Matches exactly what backend validates (auth.js login)
const ONLINE_WINDOW_MS = 15 * 60 * 1000; // 15 min

const avatars = {
  male:   { 1: maleLevel1,   2: maleLevel2,   3: maleLevel3,   4: maleLevel4,   5: maleLevel5,   6: maleLevel6,   7: maleLevel7   },
  female: { 1: femaleLevel1, 2: femaleLevel2, 3: femaleLevel3, 4: femaleLevel4, 5: femaleLevel5, 6: femaleLevel6, 7: femaleLevel7 }
};

const getAvatarSrc = (userObj) => {
  if (userObj?.settings?.showAvatar === false) {
    const id = userObj._id || userObj.id;
    return id ? `${API}/auth/student/${id}/picture` : null;
  }
  const gender = userObj?.gender?.toLowerCase() === 'female' ? 'female' : 'male';
  const level  = Math.min(Math.max(parseInt(userObj?.level) || 1, 1), 7);
  return avatars[gender]?.[level] || avatars.male[1];
};

const getInitials = (name = '') =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'ST';

const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

// ─── DATE PARSING ──────────────────────────────────────────────────────────────
// Handles: ms (number), ISO string, stringified ms/seconds
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

// 🟢 RESOLVE ONLINE STATUS: Check isOnline flag AND lastLogin window
const resolveOnline = (userOrConv) => {
  if (!userOrConv) return false;
  
  // Must have isOnline=true OR online=true
  const isOnlineFlag = userOrConv.isOnline === true || userOrConv.online === true;
  if (!isOnlineFlag) return false;
  
  // Must have lastLogin/lastActive/lastSeen within 15 min
  const loginTime = userOrConv.lastLogin ?? userOrConv.lastActive ?? userOrConv.lastSeen;
  if (!loginTime) return false;
  
  const d = parseDate(loginTime);
  if (!d) return false;
  
  const isRecent = (Date.now() - d.getTime()) <= ONLINE_WINDOW_MS;
  return isRecent;
};

// 🟢 FORMAT LAST SEEN: Never returns "Invalid Date"
const formatLastSeen = (val) => {
  if (!val) return 'Offline';
  
  const d = parseDate(val);
  if (!d) return 'Offline';
  
  const diff = Date.now() - d.getTime();
  if (diff < 60_000)     return 'just now';
  if (diff < 3_600_000)  return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d ago`;
  
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
};

const formatTime = (val) => {
  if (!val) return '';
  const d = parseDate(val);
  if (!d) return '';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDateSeparator = (val) => {
  const d = parseDate(val);
  if (!d) return null;
  const diffDays = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7)  return d.toLocaleDateString('en', { weekday: 'long' });
  return d.toLocaleDateString('en', { month: 'long', day: 'numeric', year: diffDays > 365 ? 'numeric' : undefined });
};

const isSameDay = (a, b) => {
  const da = parseDate(a), db = parseDate(b);
  if (!da || !db) return true;
  return da.getFullYear() === db.getFullYear() &&
         da.getMonth()    === db.getMonth()    &&
         da.getDate()     === db.getDate();
};

const sanitize = (str) => String(str ?? '').replace(/</g, '\u003c').replace(/>/g, '\u003e');

// ─── DEBOUNCE ──────────────────────────────────────────────────────────────────
function useDebounce(value, delay = 220) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ─── AVATAR COMPONENT ───────────────────────────────────────────────────────────
const Avatar = ({ src, name, size = 42, online = false }) => (
  <div style={{ position: 'relative', flexShrink: 0 }}>
    <div style={{
      width: size, height: size, borderRadius: '50%', overflow: 'hidden',
      background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, color: 'white', fontWeight: '700', flexShrink: 0
    }}>
      {src
        ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.style.display = 'none'; }} />
        : getInitials(name)}
    </div>
    {/* 🟢 GREEN DOT: Only when truly online */}
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

// ─── TYPING INDICATOR ───────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '10px 14px',
    background: 'var(--bg-secondary)', borderRadius: '18px 18px 18px 4px',
    width: 'fit-content', marginBottom: '8px' }}>
    {[0, 1, 2].map(i => (
      <span key={i} style={{
        width: 7, height: 7, borderRadius: '50%', background: '#94a3b8',
        animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`
      }} />
    ))}
  </div>
);

// ─── DATE SEPARATOR ─────────────────────────────────────────────────────────────
const DateSeparator = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0 8px' }}>
    <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '600',
      background: 'var(--bg-secondary)', padding: '3px 10px', borderRadius: '99px',
      border: '1px solid var(--border-color)', whiteSpace: 'nowrap' }}>
      {label}
    </span>
    <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
  </div>
);

// ─── CONFIRM MODAL ──────────────────────────────────────────────────────────────
const CONFIRM_CONFIG = {
  clear:  { title: 'Clear Chat',  body: 'All messages will be permanently deleted for you.',    label: 'Clear',  danger: false, Icon: Trash2 },
  delete: { title: 'Delete Chat', body: 'This conversation will be removed from your list.',    label: 'Delete', danger: true,  Icon: Trash2 },
  block:  { title: 'Block User',  body: 'They won\'t be able to message you. You can unblock from settings.', label: 'Block', danger: true, Icon: Ban },
};

const ConfirmModal = ({ type, onConfirm, onCancel }) => {
  const cfg = CONFIRM_CONFIG[type];
  if (!cfg) return null;
  const { Icon } = cfg;
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onCancel}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 3000, backdropFilter: 'blur(6px)' }}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        onClick={e => e.stopPropagation()}
        style={{ background: 'var(--bg-secondary)', borderRadius: '20px', padding: '32px 28px',
          width: '340px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)', border: '1px solid var(--border-color)' }}
      >
        <div style={{ width: 52, height: 52, borderRadius: '50%',
          background: cfg.danger ? 'rgba(239,68,68,0.12)' : 'rgba(99,102,241,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={24} color={cfg.danger ? '#ef4444' : '#6366f1'} />
        </div>
        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '700' }}>{cfg.title}</h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem', textAlign: 'center', lineHeight: 1.5 }}>{cfg.body}</p>
        <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '4px' }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '12px', borderRadius: '12px',
            border: '1px solid var(--border-color)', background: 'transparent',
            color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '12px', borderRadius: '12px',
            border: 'none', background: cfg.danger ? '#ef4444' : '#6366f1',
            color: 'white', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem' }}>
            {cfg.label}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── TOAST ──────────────────────────────────────────────────────────────────────
const Toast = ({ message, type }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
    style={{ position: 'fixed', bottom: '28px', left: '50%', transform: 'translateX(-50%)',
      background: type === 'success' ? '#10b981' : '#ef4444',
      color: 'white', padding: '11px 22px', borderRadius: '12px',
      fontWeight: '600', fontSize: '0.88rem', zIndex: 4000,
      display: 'flex', alignItems: 'center', gap: '8px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.35)', whiteSpace: 'nowrap' }}
  >
    {type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
    {message}
  </motion.div>
);

// ─── MESSAGE BUBBLE ─────────────────────────────────────────────────────────────
const MessageBubble = ({ message, onRetry, isFirst, isLast }) => {
  const isOwn = message.isOwn;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.18 }}
      style={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start',
        marginBottom: isLast ? '12px' : '2px' }}
    >
      <div style={{
        maxWidth: '72%', minWidth: '80px',
        background: isOwn
          ? 'linear-gradient(135deg,#6366f1,#7c3aed)'
          : 'var(--bg-secondary)',
        color: isOwn ? 'white' : 'var(--text-primary)',
        borderRadius: isOwn
          ? (isFirst ? '18px 18px 4px 18px' : isLast ? '18px 4px 18px 18px' : '18px 4px 4px 18px')
          : (isFirst ? '18px 18px 18px 4px' : isLast ? '4px 18px 18px 18px' : '4px 18px 18px 4px'),
        padding: '10px 14px 8px',
        border: isOwn ? 'none' : '1px solid var(--border-color)',
        boxShadow: message.status === 'error'
          ? '0 0 0 2px #ef4444'
          : isOwn ? '0 2px 12px rgba(99,102,241,0.35)' : 'none',
        position: 'relative'
      }}>
        <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
          {sanitize(message.text)}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          gap: '4px', marginTop: '4px' }}>
          <span style={{ fontSize: '0.65rem', opacity: 0.7, color: isOwn ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)' }}>
            {formatTime(message.timestamp || message.createdAt)}
          </span>
          {isOwn && (
            <span style={{ display: 'flex', alignItems: 'center' }}>
              {message.status === 'error' ? (
                <button onClick={() => onRetry(message)} title="Retry"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <RefreshCw size={11} color="#fca5a5" />
                </button>
              ) : message.status === 'sending' ? (
                <Check size={13} style={{ opacity: 0.5, color: 'rgba(255,255,255,0.8)' }} />
              ) : (message.read || message.status === 'read') ? (
                <CheckCheck size={13} style={{ color: '#93c5fd' }} />
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

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────────
const Messages = () => {
  const [conversations,        setConversations]        = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages,             setMessages]             = useState({});
  const [connections,          setConnections]          = useState([]);
  const [loading,              setLoading]              = useState(true);
  const [connectionsLoading,   setConnectionsLoading]   = useState(false);
  const [newMessage,           setNewMessage]           = useState('');
  const [searchQuery,          setSearchQuery]          = useState('');
  const [newChatSearch,        setNewChatSearch]        = useState('');
  const [isSending,            setIsSending]            = useState(false);
  const [showNewChatModal,     setShowNewChatModal]     = useState(false);
  const [showChatMenu,         setShowChatMenu]         = useState(false);
  const [showConfirmModal,     setShowConfirmModal]     = useState(null);
  const [toast,                setToast]                = useState(null);
  const [isTyping,             setIsTyping]             = useState(false);

  const newChatModalRef = useRef(null);
  const chatMenuRef     = useRef(null);
  const messagesEndRef  = useRef(null);
  const inputRef        = useRef(null);
  const activeConvIdRef = useRef(null);

  const debouncedSearch        = useDebounce(searchQuery);
  const debouncedNewChatSearch = useDebounce(newChatSearch);

  // ── Toast helper ──────────────────────────────────────────────────────────
  const showToast = useCallback((message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Fetch conversations from chat API ─────────────────────────────────────
  // 🟢 FALLBACK: If chat API unavailable, fetch from /auth/connections
  const fetchConversations = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      // Try chat API first
      let res = await fetch(`${API}/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // 🟢 FALLBACK to connections if chat API doesn't exist
      if (!res.ok && res.status === 404) {
        console.log('[Messages] Chat API not found, falling back to connections...');
        res = await fetch(`${API}/auth/connections`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        
        if (data.success) {
          // Convert connections to conversation format
          const conversations = data.connections.map(u => ({
            id: u._id,
            otherUserId: u._id,
            name: u.fullName,
            avatar: getAvatarSrc(u),
            lastMessage: '',
            lastMessageAt: u.lastLogin,
            lastSeen: u.lastLogin,
            lastLogin: u.lastLogin,
            isOnline: u.isOnline,
            unread: 0,
            // 🟢 Validate online status
            online: resolveOnline({
              isOnline: u.isOnline,
              lastLogin: u.lastLogin
            })
          }));
          setConversations(conversations);
        }
        setLoading(false);
        return;
      }
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      
      if (data.success) {
        // 🟢 Validate online status for each conversation
        const validated = data.conversations.map(c => ({
          ...c,
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
    const id = setInterval(fetchConversations, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchConversations]);

  // ── Fetch messages ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedConversation?.id) return;
    const convId = selectedConversation.id;
    activeConvIdRef.current = convId;

    const fetchMessages = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const res = await fetch(`${API}/chat/messages/${convId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          if (res.status === 404) {
            // Chat API doesn't exist yet, just skip
            console.log('[Messages] Chat API not ready');
            return;
          }
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        if (data.success && activeConvIdRef.current === convId) {
          setMessages(prev => ({ ...prev, [convId]: data.messages }));
        }
      } catch (err) {
        console.error('[Messages] fetchMessages:', err);
      }
    };

    fetchMessages();
    const id = setInterval(fetchMessages, POLL_INTERVAL_MS);
    return () => {
      clearInterval(id);
      if (activeConvIdRef.current === convId) activeConvIdRef.current = null;
    };
  }, [selectedConversation?.id]);

  // ── Active conversation (always fresh) ────────────────────────────────────
  const activeConversation = useMemo(
    () => conversations.find(c => c.id === selectedConversation?.id) || selectedConversation,
    [conversations, selectedConversation]
  );

  // ── Mark as read ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!activeConversation?.id || !activeConversation?.unread) return;
    setConversations(prev => prev.map(c =>
      c.id === activeConversation.id ? { ...c, unread: 0 } : c
    ));
    setSelectedConversation(prev => prev ? { ...prev, unread: 0 } : prev);
    window.dispatchEvent(new Event('chatRead'));
    
    const token = getToken();
    if (!token) return;
    fetch(`${API}/chat/conversations/${activeConversation.id}/read`, {
      method: 'PUT', headers: { Authorization: `Bearer ${token}` }
    }).catch(err => console.error('[Messages] markRead:', err));
  }, [activeConversation?.id, activeConversation?.unread]);

  // ── Scroll to bottom ──────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedConversation]);

  // ── Focus input ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeConversation) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [activeConversation?.id]);

  // ── Send message ──────────────────────────────────────────────────────────
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const messageText = newMessage.trim();
    if (!messageText || !selectedConversation || isSending) return;
    if (messageText.length > MAX_MESSAGE_LENGTH) {
      showToast(`Message too long. Max ${MAX_MESSAGE_LENGTH.toLocaleString()} characters.`);
      return;
    }

    setNewMessage('');
    setIsSending(true);

    const tempId = `temp-${crypto.randomUUID()}`;
    const currentConvId = selectedConversation.id || 'temp';
    const tempMessage = {
      id: tempId,
      text: messageText,
      senderId: 'me',
      isOwn: true,
      status: 'sending',
      read: false,
      _retryText: messageText,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    setMessages(prev => ({
      ...prev,
      [currentConvId]: [...(prev[currentConvId] || []), tempMessage]
    }));

    try {
      const token = getToken();
      if (!token) throw new Error('Not authenticated');

      const res = await fetch(`${API}/chat/messages`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          targetUserId: selectedConversation.otherUserId,
          text: messageText
        })
      });
      
      if (res.status === 404) {
        showToast('Chat system not yet available.');
        setIsSending(false);
        return;
      }
      
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Send failed');

      // New conversation created
      if (!selectedConversation.id && data.conversationId) {
        setSelectedConversation(prev => ({ ...prev, id: data.conversationId }));
        setMessages(prev => {
          const { temp, ...rest } = prev;
          return { ...rest, [data.conversationId]: temp || [] };
        });
        fetchConversations();
      }

      setMessages(prev => ({
        ...prev,
        [currentConvId]: (prev[currentConvId] || []).map(m =>
          m.id === tempId ? { ...m, status: 'delivered' } : m
        )
      }));

      setConversations(prev => prev.map(c =>
        c.id === currentConvId
          ? { ...c, lastMessage: messageText, lastSender: 'me', lastMessageRead: false }
          : c
      ));
    } catch (err) {
      console.error('[Messages] sendMessage:', err);
      showToast('Failed to send. Tap ↺ to retry.');
      setMessages(prev => ({
        ...prev,
        [currentConvId]: (prev[currentConvId] || []).map(m =>
          m.id === tempId ? { ...m, status: 'error' } : m
        )
      }));
    } finally {
      setIsSending(false);
    }
  };

  // ── Retry failed message ──────────────────────────────────────────────────
  const handleRetry = useCallback((failedMsg) => {
    if (!failedMsg._retryText || !selectedConversation) return;
    const key = selectedConversation.id || 'temp';
    setMessages(prev => ({
      ...prev,
      [key]: (prev[key] || []).filter(m => m.id !== failedMsg.id)
    }));
    setNewMessage(failedMsg._retryText);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [selectedConversation]);

  // ── Input change ─────────────────────────────���────────────────────────────
  const handleInputChange = (e) => {
    if (e.target.value.length <= MAX_MESSAGE_LENGTH) setNewMessage(e.target.value);
  };

  // ── Open new chat modal ───────────────────────────────────────────────────
  const handleOpenNewChat = async () => {
    setShowNewChatModal(true);
    setConnectionsLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API}/auth/connections`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success) {
        // 🟢 Validate online status for connections
        setConnections(data.connections.map(u => ({
          ...u,
          isOnline: resolveOnline({
            isOnline: u.isOnline,
            lastLogin: u.lastLogin
          })
        })));
      }
    } catch (err) {
      console.error('[Messages] fetchConnections:', err);
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
        avatar: getAvatarSrc(user),
        lastMessage: '',
        lastSeen: user.lastLogin || null,
        unread: 0,
        online: resolveOnline({
          isOnline: user.isOnline,
          lastLogin: user.lastLogin
        }),
        lastLogin: user.lastLogin
      });
    }
    setShowNewChatModal(false);
    setNewChatSearch('');
  };

  // ── Clear chat ────────────────────────────────────────────────────────────
  const handleClearChat = async () => {
    if (!selectedConversation?.id) return;
    const convId = selectedConversation.id;
    const backup = messages[convId] || [];
    setMessages(prev => ({ ...prev, [convId]: [] }));
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
      console.error('[Messages] clearChat:', err);
      setMessages(prev => ({ ...prev, [convId]: backup }));
      showToast('Failed to clear chat.');
    }
  };

  // ── Delete chat ───────────────────────────────────────────────────────────
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
      console.error('[Messages] deleteChat:', err);
      setConversations(backupConvs);
      setSelectedConversation(backupSelected);
      showToast('Failed to delete chat.');
    }
  };

  // ── Block user ────────────────────────────────────────────────────────────
  const handleBlockUser = async () => {
    if (!selectedConversation) return;
    const targetId = selectedConversation.otherUserId;
    const backupConvs = [...conversations];
    const backupSelected = selectedConversation;
    setConversations(prev => prev.filter(c => c.id !== selectedConversation.id));
    setSelectedConversation(null);
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
      console.error('[Messages] blockUser:', err);
      setConversations(backupConvs);
      setSelectedConversation(backupSelected);
      showToast('Failed to block user.');
    }
  };

  // ── Click outside & Escape ────────────────────────────────────────────────
  useEffect(() => {
    const onMouse = (e) => {
      if (newChatModalRef.current && !newChatModalRef.current.contains(e.target))
        setShowNewChatModal(false);
      if (chatMenuRef.current && !chatMenuRef.current.contains(e.target))
        setShowChatMenu(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setShowNewChatModal(false);
        setShowConfirmModal(null);
        setShowChatMenu(false);
      }
    };
    document.addEventListener('mousedown', onMouse);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onMouse);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // ── Derived state ─────────────────────────────────────────────────────────
  const filteredConversations = useMemo(
    () => conversations.filter(c =>
      c.name?.toLowerCase().includes(debouncedSearch.toLowerCase())
    ),
    [conversations, debouncedSearch]
  );

  const filteredAvailableUsers = useMemo(
    () => connections.filter(u =>
      u.fullName?.toLowerCase().includes(debouncedNewChatSearch.toLowerCase())
    ),
    [connections, debouncedNewChatSearch]
  );

  const currentMessages = useMemo(() => {
    if (!selectedConversation) return [];
    return messages[selectedConversation.id || 'temp'] || [];
  }, [messages, selectedConversation]);

  // 🟢 Group messages with date separators
  const renderedMessages = useMemo(() => {
    const result = [];
    let lastDate = null;
    currentMessages.forEach((msg, i) => {
      const msgDate = msg.createdAt || msg.timestamp;
      if (msgDate && (!lastDate || !isSameDay(lastDate, msgDate))) {
        const label = formatDateSeparator(msgDate);
        if (label) {
          result.push({ type: 'date', label, key: `date-${i}` });
        }
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

  // 🟢 STATUS TEXT: Never returns "Invalid Date"
  const statusText = useMemo(() => {
    if (!activeConversation) return '';
    if (activeConversation.online) return 'Online';
    const raw = activeConversation.lastSeen || activeConversation.lastLogin;
    if (!raw) return 'Offline';
    const d = parseDate(raw);
    if (!d) return 'Offline';
    const ago = formatLastSeen(raw);
    return ago && ago !== 'Offline' ? `Last seen ${ago}` : 'Offline';
  }, [activeConversation]);

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout title="Messages">
      <style>{`
        @keyframes typingBounce {
          0%,60%,100% { transform: translateY(0); opacity:0.4; }
          30%          { transform: translateY(-6px); opacity:1; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <motion.div
        className={styles.container}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <div className={styles.messagesWrapper}>
          {/* ══════════════════════════════════════════════════════════
              SIDEBAR
          ══════════════════════════════════════════════════════════ */}
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
                <button onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-secondary)', display: 'flex', padding: '0 4px' }}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className={styles.conversationsList}>
              {loading ? (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <div style={{ width: 20, height: 20, border: '2px solid #6366f1',
                    borderTopColor: 'transparent', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite', margin: '0 auto 8px' }} />
                  Loading...
                </div>
              ) : filteredConversations.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <MessageSquare size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                  <p style={{ margin: 0, fontSize: '0.85rem' }}>
                    {searchQuery ? 'No results found.' : 'No conversations yet.'}
                  </p>
                  {!searchQuery && (
                    <button onClick={handleOpenNewChat}
                      style={{ marginTop: 12, background: 'rgba(99,102,241,0.12)',
                        border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8,
                        color: '#6366f1', padding: '6px 14px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>
                      Start a conversation
                    </button>
                  )}
                </div>
              ) : (
                filteredConversations.map(conv => {
                  const isActive = activeConversation?.id === conv.id;
                  return (
                    <div
                      key={conv.id}
                      className={`${styles.conversationItem} ${isActive ? styles.selected : ''}`}
                      onClick={() => setSelectedConversation(conv)}
                    >
                      <Avatar
                        src={conv.avatar}
                        name={conv.name}
                        size={46}
                        online={conv.online}
                      />
                      <div className={styles.conversationInfo}>
                        <div className={styles.conversationHeader}>
                          <span className={styles.conversationName}>{conv.name}</span>
                          <span className={styles.conversationTime} style={{ fontSize: '0.7rem' }}>
                            {conv.online ? (
                              <span style={{ color: '#22c55e', fontWeight: '600', fontSize: '0.68rem' }}>Online</span>
                            ) : (
                              formatLastSeen(conv.lastMessageAt || conv.updatedAt || conv.lastSeen) || ''
                            )}
                          </span>
                        </div>
                        <div className={styles.conversationPreview}>
                          <span className={styles.lastMessage} style={{
                            color: conv.unread > 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: conv.unread > 0 ? '500' : '400'
                          }}>
                            {conv.lastSender === 'me' && (
                              <span style={{ marginRight: 2 }}>
                                {conv.lastMessageRead
                                  ? <CheckCheck size={13} style={{ color: '#6366f1', verticalAlign: 'middle' }} />
                                  : <Check size={13} style={{ color: '#94a3b8', verticalAlign: 'middle' }} />}
                              </span>
                            )}
                            {sanitize(conv.lastMessage) || (
                              <span style={{ fontStyle: 'italic', opacity: 0.5 }}>No messages yet</span>
                            )}
                          </span>
                          {conv.unread > 0 && (
                            <span className={styles.unreadBadge} style={{
                              background: '#6366f1', color: 'white',
                              fontSize: '0.68rem', fontWeight: '700',
                              padding: '2px 7px', borderRadius: '99px', flexShrink: 0
                            }}>
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

          {/* ══════════════════════════════════════════════════════════
              CHAT AREA
          ══════════════════��═══════════════════════════════════════ */}
          <div className={styles.chatArea} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className={styles.chatHeader}>
                  <div className={styles.chatUserInfo}>
                    <button
                      onClick={() => setSelectedConversation(null)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--text-secondary)', display: 'none', padding: '4px' }}
                      className={styles.mobileBack}
                    >
                      <ArrowLeft size={20} />
                    </button>

                    <Avatar
                      src={activeConversation.avatar}
                      name={activeConversation.name}
                      size={40}
                      online={activeConversation.online}
                    />
                    <div className={styles.chatUserDetails} style={{ marginLeft: 10 }}>
                      <h3 className={styles.chatUserName}>{activeConversation.name}</h3>
                      <span className={styles.chatUserStatus} style={{
                        fontSize: '0.75rem',
                        color: activeConversation.online ? '#22c55e' : 'var(--text-secondary)'
                      }}>
                        {statusText}
                      </span>
                    </div>
                  </div>

                  <div className={styles.chatHeaderActions}>
                    <div className={styles.chatMenuWrapper} ref={chatMenuRef}>
                      <button className={styles.chatMenuBtn}
                        onClick={() => setShowChatMenu(v => !v)}>
                        <MoreVertical size={20} />
                      </button>
                      <AnimatePresence>
                        {showChatMenu && (
                          <motion.div
                            className={styles.chatMenuDropdown}
                            initial={{ opacity: 0, scale: 0.9, y: -8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -8 }}
                            transition={{ duration: 0.15 }}
                          >
                            <button className={styles.chatMenuItem}
                              onClick={() => { setShowConfirmModal('clear'); setShowChatMenu(false); }}>
                              <Trash2 size={14} /> Clear Chat
                            </button>
                            <button className={styles.chatMenuItem}
                              onClick={() => { setShowConfirmModal('delete'); setShowChatMenu(false); }}>
                              <X size={14} /> Delete Chat
                            </button>
                            <div style={{ height: 1, background: 'var(--border-color)', margin: '4px 0' }} />
                            <button
                              className={`${styles.chatMenuItem} ${styles.dangerItem}`}
                              onClick={() => { setShowConfirmModal('block'); setShowChatMenu(false); }}>
                              <Ban size={14} /> Block User
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <button className={styles.closeChat}
                      onClick={() => setSelectedConversation(null)}>
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Messages Container */}
                <div className={styles.messagesContainer} style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
                  {currentMessages.length === 0 && (
                    <div className={styles.noMessages} style={{ textAlign: 'center', padding: '40px 20px' }}>
                      <Avatar
                        src={activeConversation.avatar}
                        name={activeConversation.name}
                        size={64}
                        online={activeConversation.online}
                      />
                      <h4 style={{ margin: '12px 0 4px', color: 'var(--text-primary)' }}>
                        {activeConversation.name}
                      </h4>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        Send a message to start the conversation 👋
                      </p>
                    </div>
                  )}

                  {renderedMessages.map((item, idx) =>
                    item.type === 'date' ? (
                      <DateSeparator key={item.key} label={item.label} />
                    ) : (
                      <MessageBubble
                        key={item.msg.id}
                        message={item.msg}
                        onRetry={handleRetry}
                        isFirst={item.isFirst}
                        isLast={item.isLast}
                      />
                    )
                  )}

                  {isTyping && (
                    <div style={{ paddingLeft: 4 }}>
                      <TypingIndicator />
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div style={{
                  padding: '12px 16px',
                  borderTop: '1px solid var(--border-color)',
                  background: 'var(--bg-primary)',
                  flexShrink: 0
                }}>
                  {charsWarning && (
                    <div style={{ fontSize: '0.68rem', color: charsLeft < 50 ? '#ef4444' : 'var(--text-secondary)',
                      textAlign: 'right', marginBottom: '4px' }}>
                      {charsLeft} characters left
                    </div>
                  )}
                  <form
                    onSubmit={handleSendMessage}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '16px', padding: '6px 6px 6px 16px' }}
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={handleInputChange}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) handleSendMessage(e);
                      }}
                      disabled={isSending}
                      maxLength={MAX_MESSAGE_LENGTH}
                      autoComplete="off"
                      style={{
                        flex: 1, background: 'transparent', border: 'none', outline: 'none',
                        color: 'var(--text-primary)', fontSize: '0.92rem',
                        padding: '6px 0', minWidth: 0
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || isSending}
                      title="Send (Enter)"
                      style={{
                        width: 40, height: 40, borderRadius: '12px', border: 'none',
                        background: newMessage.trim()
                          ? 'linear-gradient(135deg,#6366f1,#7c3aed)'
                          : 'rgba(99,102,241,0.15)',
                        color: newMessage.trim() ? 'white' : '#6366f1',
                        cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, transition: 'background 0.2s',
                        boxShadow: newMessage.trim() ? '0 2px 8px rgba(99,102,241,0.4)' : 'none'
                      }}
                    >
                      {isSending
                        ? <div style={{ width: 15, height: 15, border: '2px solid white',
                            borderTopColor: 'transparent', borderRadius: '50%',
                            animation: 'spin 0.7s linear infinite' }} />
                        : <Send size={16} />}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className={styles.noConversation} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%',
                  background: 'rgba(99,102,241,0.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={32} style={{ color: '#6366f1', opacity: 0.7 }} />
                </div>
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontWeight: '700' }}>
                  Your messages
                </h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem', textAlign: 'center' }}>
                  Select a conversation or start a new one
                </p>
                <button onClick={handleOpenNewChat} style={{
                  background: 'linear-gradient(135deg,#6366f1,#7c3aed)',
                  border: 'none', borderRadius: 12, color: 'white',
                  padding: '10px 22px', cursor: 'pointer', fontWeight: '700',
                  fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 4px 16px rgba(99,102,241,0.35)'
                }}>
                  <MessageSquarePlus size={16} /> New Message
                </button>
              </div>
            )}
          </div>
        </div>

        {/* NEW CHAT MODAL */}
        <AnimatePresence>
          {showNewChatModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewChatModal(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 2000, backdropFilter: 'blur(6px)' }}
            >
              <motion.div
                ref={newChatModalRef}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                onClick={e => e.stopPropagation()}
                style={{ background: 'var(--bg-secondary)', borderRadius: '20px', padding: '24px',
                  width: '400px', maxHeight: '560px', display: 'flex', flexDirection: 'column', gap: '16px',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.5)', border: '1px solid var(--border-color)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '700' }}>
                    New Message
                  </h3>
                  <button onClick={() => setShowNewChatModal(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-secondary)', display: 'flex', padding: 4,
                      borderRadius: 8 }}>
                    <X size={20} />
                  </button>
                </div>

                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: 12,
                    top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    placeholder="Search your connections..."
                    value={newChatSearch}
                    onChange={e => setNewChatSearch(e.target.value)}
                    autoFocus
                    style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '10px',
                      border: '1px solid var(--border-color)', background: 'var(--bg-primary)',
                      color: 'var(--text-primary)', fontSize: '0.88rem', boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>

                <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {connectionsLoading ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <div style={{ width: 20, height: 20, border: '2px solid #6366f1',
                        borderTopColor: 'transparent', borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite', margin: '0 auto 8px' }} />
                      Loading connections...
                    </div>
                  ) : filteredAvailableUsers.length === 0 ? (
                    <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem' }}>
                        {newChatSearch ? 'No connections match your search.' : 'No connections yet.'}
                      </p>
                    </div>
                  ) : (
                    filteredAvailableUsers.map(user => (
                      <button
                        key={user._id}
                        onClick={() => handleStartNewChat(user)}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px',
                          padding: '10px 12px', borderRadius: '12px', border: 'none',
                          background: 'transparent', cursor: 'pointer', textAlign: 'left', width: '100%',
                          transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <Avatar src={getAvatarSrc(user)} name={user.fullName} size={42} online={user.isOnline} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, color: 'var(--text-primary)', fontWeight: '600',
                            fontSize: '0.92rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user.fullName}
                          </p>
                          <p style={{ margin: 0, color: user.isOnline ? '#22c55e' : 'var(--text-secondary)',
                            fontSize: '0.75rem', fontWeight: user.isOnline ? '600' : '400' }}>
                            {user.isOnline ? 'Online' : (user.department || '')}
                          </p>
                        </div>
                        {conversations.some(c => c.otherUserId === user._id) && (
                          <span style={{ fontSize: '0.68rem', color: '#6366f1',
                            background: 'rgba(99,102,241,0.1)', borderRadius: 99, padding: '2px 8px',
                            fontWeight: '600', flexShrink: 0 }}>
                            Existing
                          </span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONFIRM MODALS */}
        <AnimatePresence>
          {showConfirmModal && (
            <ConfirmModal
              type={showConfirmModal}
              onCancel={() => setShowConfirmModal(null)}
              onConfirm={
                showConfirmModal === 'clear' ? handleClearChat :
                showConfirmModal === 'delete' ? handleDeleteChat :
                handleBlockUser
              }
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* TOAST */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AnimatePresence>

      <ChatBot />
    </DashboardLayout>
  );
};

export default Messages;
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MessageSquarePlus,MessageSquare,X, MoreVertical, Send, 
  Trash2, Ban, ShieldAlert, Check, CheckCheck 
} from 'lucide-react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import ChatBot from '../ChatBot/ChatBot';
import styles from './Messages.module.css';

import maleLevel1 from '../../src/assets/gamification/male-level-1.png';
import maleLevel2 from '../../src/assets/gamification/male-level-2.png';
import maleLevel3 from '../../src/assets/gamification/male-level-3.png';
import maleLevel4 from '../../src/assets/gamification/male-level-4.png';
import maleLevel5 from '../../src/assets/gamification/male-level-5.png';
import maleLevel6 from '../../src/assets/gamification/male-level-6.png';
import maleLevel7 from '../../src/assets/gamification/male-level-7.png';

import femaleLevel1 from '../../src/assets/gamification/female-level-1.png';
import femaleLevel2 from '../../src/assets/gamification/female-level-2.png';
import femaleLevel3 from '../../src/assets/gamification/female-level-3.png';
import femaleLevel4 from '../../src/assets/gamification/female-level-4.png';
import femaleLevel5 from '../../src/assets/gamification/female-level-5.png';
import femaleLevel6 from '../../src/assets/gamification/female-level-6.png';
import femaleLevel7 from '../../src/assets/gamification/female-level-7.png';

const avatars = {
  male: { 1: maleLevel1, 2: maleLevel2, 3: maleLevel3, 4: maleLevel4, 5: maleLevel5, 6: maleLevel6, 7: maleLevel7 },
  female: { 1: femaleLevel1, 2: femaleLevel2, 3: femaleLevel3, 4: femaleLevel4, 5: femaleLevel5, 6: femaleLevel6, 7: femaleLevel7 }
};

const getAvatarSrc = (userObj) => {
  if (userObj.settings?.showAvatar === false) {
    return userObj.picture ? `http://localhost:5000/api/auth/student/${userObj._id || userObj.id}/picture` : null;
  }
  const gender = userObj.gender?.toLowerCase() === 'female' ? 'female' : 'male';
  const level = userObj.level || 1;
  return avatars[gender]?.[level] || avatars['male'][1];
};

const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'ST';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState({}); 
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newChatSearch, setNewChatSearch] = useState('');
  const [isSending, setIsSending] = useState(false);

  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(null);

  const newChatModalRef = useRef(null);
  const chatMenuRef = useRef(null);
  const messagesEndRef = useRef(null);

  const fetchConversations = useCallback(async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if(!token) return;
      const res = await fetch(`http://${window.location.hostname}:5000/api/chat/conversations`, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setConversations(data.conversations);
    } catch (err) {} 
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 3000); // Poll slightly faster for read receipts
    return () => clearInterval(interval);
  }, [fetchConversations]);

  // 🟢 WHATSAPP LOGIC: Mark conversation as READ when selected
  useEffect(() => {
    if (selectedConversation && selectedConversation.id && selectedConversation.unread > 0) {
      
      // 1. Optimistically zero the badge locally
      setConversations(prev => prev.map(c => c.id === selectedConversation.id ? { ...c, unread: 0 } : c));
      setSelectedConversation(prev => ({ ...prev, unread: 0 }));

      // 2. Dispatch event to clear the DashboardHeader bell icon instantly
      window.dispatchEvent(new Event('chatRead'));

      // 3. Tell backend we read it
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      fetch(`http://localhost:5000/api/chat/conversations/${selectedConversation.id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(err => console.error("Could not mark as read in DB", err));
    }
  }, [selectedConversation]);

  // Fetch Messages for active chat
  useEffect(() => {
    if (!selectedConversation?.id) return;
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/chat/messages/${selectedConversation.id}`, { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();
        if (data.success) {
          setMessages(prev => ({ ...prev, [selectedConversation.id]: data.messages }));
        }
      } catch (err) {}
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedConversation]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => scrollToBottom(), [messages, selectedConversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || isSending) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    const tempId = `temp-${crypto.randomUUID()}`;
    const tempMessage = {
      id: tempId,
      text: messageText,
      senderId: 'me',
      isOwn: true,
      status: 'sent', // Optimistically show single tick
      read: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const currentConvId = selectedConversation.id || 'temp';
    setMessages(prev => ({ ...prev, [currentConvId]: [...(prev[currentConvId] || []), tempMessage] }));

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`http://${window.location.hostname}:5000/api/chat/messages`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: selectedConversation.id, targetUserId: selectedConversation.otherUserId, text: messageText })
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to send");

      if (!selectedConversation.id) {
        setSelectedConversation(prev => ({ ...prev, id: data.conversationId }));
        fetchConversations();
      }

      setMessages(prev => ({ ...prev, [currentConvId]: prev[currentConvId].map(m => m.id === tempId ? { ...m, status: 'delivered' } : m) }));
    } catch (err) { 
        setMessages(prev => ({ ...prev, [currentConvId]: prev[currentConvId].map(m => m.id === tempId ? { ...m, status: 'error' } : m) }));
    } finally {
        setIsSending(false);
    }
  };

  const handleOpenNewChat = async () => {
    setShowNewChatModal(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://${window.location.hostname}:5000/api/auth/connections`, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setConnections(data.connections);
    } catch (err) {}
  };

  const handleStartNewChat = (user) => {
    const existingConv = conversations.find(c => c.otherUserId === user._id);
    if (existingConv) {
      setSelectedConversation(existingConv);
    } else {
      setSelectedConversation({
        id: null,
        otherUserId: user._id,
        name: user.fullName,
        avatar: getAvatarSrc(user),
        lastMessage: 'Start a conversation...',
        lastSeen: 'Online',
        unread: 0,
        online: true
      });
    }
    setShowNewChatModal(false);
    setNewChatSearch('');
  };

  const handleClearChat = async () => {
    if (!selectedConversation?.id) return;
    const convId = selectedConversation.id;
    setMessages(prev => ({ ...prev, [convId]: [] }));
    setShowConfirmModal(null);
    setShowChatMenu(false);
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/chat/messages/${convId}/clear`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    } catch (err) {}
  };

  const handleDeleteChat = async () => {
    if (!selectedConversation?.id) return;
    const convId = selectedConversation.id;
    setConversations(prev => prev.filter(c => c.id !== convId));
    setSelectedConversation(null);
    setShowConfirmModal(null);
    setShowChatMenu(false);
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/chat/conversations/${convId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    } catch (err) {}
  };

  const handleBlockUser = async () => {
    if (!selectedConversation) return;
    const targetId = selectedConversation.otherUserId;
    setConversations(prev => prev.filter(c => c.id !== selectedConversation.id));
    setSelectedConversation(null);
    setShowConfirmModal(null);
    setShowChatMenu(false);
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/chat/block/${targetId}`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
    } catch (err) {}
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (newChatModalRef.current && !newChatModalRef.current.contains(event.target)) setShowNewChatModal(false);
      if (chatMenuRef.current && !chatMenuRef.current.contains(event.target)) setShowChatMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredConversations = conversations.filter(conv => conv.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredAvailableUsers = connections.filter(user => user.fullName.toLowerCase().includes(newChatSearch.toLowerCase()));
  const activeConversation = conversations.find(c => c.id === selectedConversation?.id) || selectedConversation;
  
  const currentMessages = selectedConversation
    ? (selectedConversation.id ? (messages[selectedConversation.id] || []) : (messages['temp'] || []))
    : [];

  return (
    <DashboardLayout title="Messages">
      <motion.div className={styles.container} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div className={styles.messagesWrapper}>

          {/* SIDEBAR */}
          <div className={styles.conversationsSidebar}>
            <div className={styles.sidebarHeader}>
              <h2 className={styles.sidebarTitle}>Messages</h2>
              <button className={styles.addChatBtn} onClick={handleOpenNewChat} title="Start new chat">
                <MessageSquarePlus size={18} />
              </button>
            </div>

            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} size={16} />
              <input type="text" placeholder="Search chats..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={styles.searchInput} />
            </div>

            <div className={styles.conversationsList}>
              {loading ? (
                <div className={styles.loadingText}>Loading messages...</div>
              ) : filteredConversations.length === 0 ? (
                <div className={styles.loadingText}>No messages yet.</div>
              ) : (
                filteredConversations.map(conv => (
                  <div key={conv.id} className={`${styles.conversationItem} ${activeConversation?.id === conv.id ? styles.selected : ''}`} onClick={() => setSelectedConversation(conv)}>
                    <div className={styles.conversationAvatar}>
                      {conv.avatar ? (
                        <img src={conv.avatar} alt={conv.name} className={styles.avatarImage} onError={(e) => { e.target.style.display = 'none' }} />
                      ) : (
                        <div className={styles.avatarFallback}>{getInitials(conv.name)}</div>
                      )}
                      {conv.online === true && <span className={styles.onlineIndicator}></span>}
                    </div>
                    <div className={styles.conversationInfo}>
                      <div className={styles.conversationHeader}>
                        <span className={styles.conversationName}>{conv.name}</span>
                        <span className={styles.conversationTime}>{conv.online === true ? 'Online' : (conv.lastSeen || '')}</span>
                      </div>
                      <div className={styles.conversationPreview}>
                        <span className={styles.lastMessage}>
                            {/* Quick Read Receipt indicator on sidebar preview if it's your message */}
                            {conv.lastSender === 'me' && (
                                <span className={styles.previewTick}>
                                  {conv.lastMessageRead ? <CheckCheck size={14} className={styles.blueTick} /> : <Check size={14} />}
                                </span>
                            )}
                            {conv.lastMessage}
                        </span>
                        {conv.unread > 0 && <span className={styles.unreadBadge}>{conv.unread}</span>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* CHAT AREA */}
          <div className={styles.chatArea}>
            {activeConversation ? (
              <>
                <div className={styles.chatHeader}>
                  <div className={styles.chatUserInfo}>
                    <div className={styles.chatAvatarWrapper}>
                      {activeConversation.avatar ? (
                        <img src={activeConversation.avatar} alt={activeConversation.name} className={styles.chatAvatarImg} />
                      ) : (
                        <div className={styles.avatarFallback}>{getInitials(activeConversation.name)}</div>
                      )}
                    </div>
                    <div className={styles.chatUserDetails}>
                      <h3 className={styles.chatUserName}>{activeConversation.name}</h3>
                      <span className={styles.chatUserStatus}>
                        {activeConversation.online === true ? <><span className={styles.statusDot}></span> Online</> : 'Offline'}
                      </span>
                    </div>
                  </div>

                  <div className={styles.chatHeaderActions}>
                    <div className={styles.chatMenuWrapper} ref={chatMenuRef}>
                      <button className={styles.chatMenuBtn} onClick={() => setShowChatMenu(!showChatMenu)}>
                        <MoreVertical size={20} />
                      </button>
                      <AnimatePresence>
                        {showChatMenu && (
                          <motion.div className={styles.chatMenuDropdown} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <button className={styles.chatMenuItem} onClick={() => setShowConfirmModal('clear')}><Trash2 size={16} /> Clear Chat</button>
                            <button className={styles.chatMenuItem} onClick={() => setShowConfirmModal('delete')}><X size={16} /> Delete Chat</button>
                            <button className={`${styles.chatMenuItem} ${styles.dangerItem}`} onClick={() => setShowConfirmModal('block')}><Ban size={16} /> Block User</button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <button className={styles.closeChat} onClick={() => setSelectedConversation(null)}><X size={20} /></button>
                  </div>
                </div>

                <div className={styles.messagesContainer}>
                  {currentMessages.length === 0 && (
                    <div className={styles.noMessages}>
                        <p>Say hello to <strong>{activeConversation.name}</strong>! 👋</p>
                    </div>
                  )}
                  {currentMessages.map(message => (
                    <div key={message.id} className={`${styles.messageWrapper} ${message.isOwn ? styles.ownMessage : ''}`}>
                      <div className={`${styles.messageBubble} ${message.status === 'error' ? styles.errorBubble : ''}`}>
                        <p className={styles.messageText}>{message.text}</p>
                        <div className={styles.messageMeta}>
                            <span className={styles.messageTime}>{message.timestamp}</span>
                            {/* 🟢 WHATSAPP STYLE READ RECEIPTS */}
                            {message.isOwn && (
                                <span className={styles.messageStatusIcon}>
                                    {message.status === 'error' ? <ShieldAlert size={14} color="#ef4444" /> :
                                     (message.read || message.status === 'read') ? <CheckCheck size={14} className={styles.blueTick} /> : 
                                     message.status === 'delivered' ? <CheckCheck size={14} className={styles.grayTick} /> :
                                     <Check size={14} className={styles.grayTick} />}
                                </span>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form className={styles.messageInputContainer} onSubmit={handleSendMessage}>
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    className={styles.messageInput} 
                    disabled={isSending}
                  />
                  <button type="submit" className={styles.sendBtn} disabled={!newMessage.trim() || isSending}>
                    <Send size={18} />
                  </button>
                </form>
              </>
            ) : (
              <div className={styles.noConversation}>
                <div className={styles.noConversationIcon}><MessageSquare size={48} /></div>
                <h3>Select a conversation</h3>
                <p>Choose from the sidebar or <span onClick={handleOpenNewChat} className={styles.linkText}>Start New Chat</span></p>
              </div>
            )}
          </div>
        </div>

        {/* MODALS */}
        {/* ... (Keep your existing Modal rendering code here, unchanged) ... */}
        
      </motion.div>
      <ChatBot />
    </DashboardLayout>
  );
};

export default Messages;
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './Messages.module.css';

// Emoji categories (Keep existing)
const emojiCategories = {
  smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷'],
  gestures: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🙏', '💪', '🦾', '🦿'],
  hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'],
  objects: ['📚', '📖', '📝', '✏️', '📌', '📎', '🔗', '💻', '🖥️', '⌨️', '🖱️', '🎓', '🏆', '🥇', '🥈', '🥉', '🎯', '🔔', '📢', '💡', '🔍', '⏰', '📅', '✅', '❌', '⭐', '🌟', '💯', '🔥', '✨'],
  nature: ['🌸', '🌺', '🌻', '🌹', '🌷', '🌱', '🌲', '🌳', '🍀', '🌈', '☀️', '🌙', '⭐', '🌍', '🌊', '🔥', '❄️', '🌪️']
};

const Messages = () => {
  // 🔹 STATE VARIABLES
  const [conversations, setConversations] = useState([]); // List of active chats
  const [selectedConversation, setSelectedConversation] = useState(null); // Currently open chat
  const [messages, setMessages] = useState([]); // Messages in current chat
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiCategory, setActiveEmojiCategory] = useState('smileys');
  const [loading, setLoading] = useState(true);
  
  // 🔹 NEW CHAT MODAL STATE
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [connections, setConnections] = useState([]); // List of friends to chat with

  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const messagesEndRef = useRef(null);

  // 🔹 1. FETCH CONVERSATIONS (Sidebar List)
  const fetchConversations = async () => {
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/chat/conversations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (err) {
      console.error("Failed to load chats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  // 🔹 2. FETCH CONNECTIONS (For New Chat Modal)
  const handleOpenNewChat = async () => {
    setShowNewChatModal(true);
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/connections', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if(data.success) {
        setConnections(data.connections);
      }
    } catch(err) {
      console.error("Failed to load connections", err);
    }
  };

  // 🔹 3. START CHAT WITH A FRIEND
  const startChat = (user) => {
    // Check if chat already exists
    const existing = conversations.find(c => c.otherUserId === user._id);
    
    if (existing) {
        setSelectedConversation(existing);
    } else {
        // Create a temporary conversation object for the UI
        // The actual ID will be created by backend when first message is sent
        const tempConv = {
            id: null, 
            otherUserId: user._id,
            name: user.fullName,
            avatar: null, 
            lastMessage: 'Start a conversation',
            online: false, 
            unread: 0
        };
        setSelectedConversation(tempConv);
    }
    setShowNewChatModal(false);
  };

  // 🔹 4. FETCH MESSAGES FOR SELECTED CHAT
  useEffect(() => {
    if (!selectedConversation || !selectedConversation.id) {
        setMessages([]); 
        return;
    }

    const fetchMessages = async () => {
      try {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/chat/messages/${selectedConversation.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setMessages(data.messages);
          scrollToBottom();
        }
      } catch (err) { console.error(err); }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Poll messages every 3s
    return () => clearInterval(interval);
  }, [selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 🔹 5. SEND MESSAGE
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    // Optimistic Update
    const tempMessage = {
        id: `temp-${Date.now()}`,
        text: newMessage,
        senderId: 'me',
        isOwn: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    scrollToBottom();

    try {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/chat/messages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                conversationId: selectedConversation.id, 
                targetUserId: selectedConversation.otherUserId, 
                text: tempMessage.text
            })
        });

        const data = await res.json();
        if (data.success) {
            // Update temp message with real one
            setMessages(prev => prev.map(msg => msg.id === tempMessage.id ? data.message : msg));
            
            // If it was a new chat, update the ID so future messages work
            if (!selectedConversation.id) {
                setSelectedConversation(prev => ({ ...prev, id: data.conversationId }));
                fetchConversations(); // Refresh sidebar to show new chat
            }
        }
    } catch (err) { console.error("Send failed", err); }
  };

  // Helper Functions
  const handleEmojiClick = (emoji) => setNewMessage(prev => prev + emoji);
  
  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'CH';

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close emoji picker on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target) &&
          emojiButtonRef.current && !emojiButtonRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } } };

  return (
    <DashboardLayout title="Messages">
      <motion.div className={styles.container} variants={containerVariants} initial="hidden" animate="visible">
        <div className={styles.messagesWrapper}>
          
          {/* SIDEBAR */}
          <div className={styles.conversationsSidebar}>
            <div className={styles.sidebarHeader}>
              <h2 className={styles.sidebarTitle}>Messages</h2>
            </div>

            <div className={styles.tabsContainer}>
              <button className={`${styles.tab} ${styles.active}`}>Direct</button>
            </div>

            <div className={styles.searchContainer}>
              <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={styles.searchInput} />
              
              {/* 🟢 NEW CHAT BUTTON */}
              <button className={styles.composeBtn} onClick={handleOpenNewChat} title="Start New Chat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </button>
            </div>

            <div className={styles.conversationsList}>
              {filteredConversations.map(conv => (
                <div key={conv.id} className={`${styles.conversationItem} ${selectedConversation?.id === conv.id ? styles.selected : ''}`} onClick={() => setSelectedConversation(conv)}>
                  <div className={styles.conversationAvatar}>
                    <div className={styles.avatar}>{getInitials(conv.name)}</div>
                    {conv.online && <span className={styles.onlineIndicator}></span>}
                  </div>
                  <div className={styles.conversationInfo}>
                    <div className={styles.conversationHeader}>
                      <span className={styles.conversationName}>{conv.name}</span>
                      <span className={styles.conversationTime}>{conv.lastSeen}</span>
                    </div>
                    <div className={styles.conversationPreview}>
                      <span className={styles.lastMessage}>{conv.lastMessage}</span>
                      {conv.unread > 0 && <span className={styles.unreadBadge}>{conv.unread}</span>}
                    </div>
                  </div>
                </div>
              ))}
              {filteredConversations.length === 0 && !loading && (
                  <div style={{padding:'20px', textAlign:'center', color:'#888'}}>
                      <p>No messages yet.</p>
                      <button onClick={handleOpenNewChat} style={{color:'#6366f1', background:'none', border:'none', cursor:'pointer', textDecoration:'underline'}}>Start a chat</button>
                  </div>
              )}
            </div>
          </div>

          {/* CHAT AREA */}
          <div className={styles.chatArea}>
            {selectedConversation ? (
              <>
                <div className={styles.chatHeader}>
                  <div className={styles.chatUserInfo}>
                    <div className={styles.chatAvatar}>{getInitials(selectedConversation.name)}</div>
                    <div className={styles.chatUserDetails}>
                      <h3 className={styles.chatUserName}>{selectedConversation.name}</h3>
                      <span className={styles.chatUserStatus}>{selectedConversation.online ? <><span className={styles.statusDot}></span> Online</> : 'Offline'}</span>
                    </div>
                  </div>
                  <button className={styles.closeChat} onClick={() => setSelectedConversation(null)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>

                <div className={styles.messagesContainer}>
                  {messages.length === 0 && (
                      <div style={{textAlign:'center', marginTop:'50px', color:'#888'}}>
                          <p>Say hello to <strong>{selectedConversation.name}</strong>! 👋</p>
                      </div>
                  )}
                  {messages.map(message => (
                    <div key={message.id} className={`${styles.messageWrapper} ${message.isOwn ? styles.ownMessage : ''}`}>
                      <div className={styles.messageBubble}>
                        <p className={styles.messageText}>{message.text}</p>
                        <span className={styles.messageTime}>
                          {message.timestamp}
                          {message.isOwn && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20,6 9,17 4,12"></polyline></svg>}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form className={styles.messageInputContainer} onSubmit={handleSendMessage}>
                  <div className={styles.emojiWrapper}>
                    <button type="button" className={styles.emojiBtn} ref={emojiButtonRef} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                    </button>
                    <AnimatePresence>
                      {showEmojiPicker && (
                        <motion.div ref={emojiPickerRef} className={styles.emojiPicker} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.15 }}>
                          <div className={styles.emojiCategories}>
                            {Object.keys(emojiCategories).map(category => (
                              <button key={category} type="button" className={`${styles.emojiCategoryBtn} ${activeEmojiCategory === category ? styles.activeCategory : ''}`} onClick={() => setActiveEmojiCategory(category)}>
                                {category === 'smileys' && '😀'} {category === 'gestures' && '👋'} {category === 'hearts' && '❤️'} {category === 'objects' && '📚'} {category === 'nature' && '🌸'}
                              </button>
                            ))}
                          </div>
                          <div className={styles.emojiGrid}>
                            {emojiCategories[activeEmojiCategory].map((emoji, index) => (
                              <button key={index} type="button" className={styles.emojiItem} onClick={() => handleEmojiClick(emoji)}>{emoji}</button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <input type="text" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className={styles.messageInput} />
                  <button type="submit" className={styles.sendBtn} disabled={!newMessage.trim()}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22,2 15,22 11,13 2,9 22,2"></polygon></svg>
                  </button>
                </form>
              </>
            ) : (
              <div className={styles.noConversation}>
                <div className={styles.noConversationIcon}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <h3>Select a conversation</h3>
                <p>Choose from sidebar or <span onClick={handleOpenNewChat} style={{color:'#6366f1', cursor:'pointer', fontWeight:'bold'}}>Start New Chat</span></p>
              </div>
            )}
          </div>
        </div>

        {/* 🟢 NEW CHAT MODAL */}
        <AnimatePresence>
            {showNewChatModal && (
                <div className={styles.modalOverlay}>
                    <motion.div className={styles.modalContent} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                        <div className={styles.modalHeader}>
                            <h3>Start New Chat</h3>
                            <button onClick={() => setShowNewChatModal(false)}>✕</button>
                        </div>
                        <div className={styles.userList}>
                            {connections.length === 0 ? (
                                <div style={{padding:'20px', textAlign:'center', color:'#666'}}>
                                    <p>No connections found.</p>
                                    <p style={{fontSize:'0.85em'}}>Go to 'Pending Connections' to accept requests.</p>
                                </div>
                            ) : (
                                connections.map(user => (
                                    <div key={user._id} className={styles.userListItem} onClick={() => startChat(user)}>
                                        <div className={styles.listAvatar}>
                                            <img 
                                                src={`http://localhost:5000/api/auth/student/${user._id}/picture`} 
                                                alt="" 
                                                style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}} 
                                                onError={(e)=>{e.target.src=`https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`}}
                                            />
                                        </div>
                                        <div className={styles.listInfo}>
                                            <span className={styles.listName}>{user.fullName}</span>
                                            <span className={styles.listDept}>{user.department}</span>
                                        </div>
                                        <button className={styles.startBtn}>Chat</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

      </motion.div>
    </DashboardLayout>
  );
};

export default Messages;
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './Messages.module.css';

// Emoji categories
const emojiCategories = {
  smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷'],
  gestures: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🙏', '💪', '🦾', '🦿'],
  hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'],
  objects: ['📚', '📖', '📝', '✏️', '📌', '📎', '🔗', '💻', '🖥️', '⌨️', '🖱️', '🎓', '🏆', '🥇', '🥈', '🥉', '🎯', '🔔', '📢', '💡', '🔍', '⏰', '📅', '✅', '❌', '⭐', '🌟', '💯', '🔥', '✨'],
  nature: ['🌸', '🌺', '🌻', '🌹', '🌷', '🌱', '🌲', '🌳', '🍀', '🌈', '☀️', '🌙', '⭐', '🌍', '🌊', '🔥', '❄️', '🌪️']
};

const Messages = () => {
  // 🔹 STATE
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiCategory, setActiveEmojiCategory] = useState('smileys');
  const [loading, setLoading] = useState(true);

  // 🔹 NEW CHAT MODAL STATE
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [connections, setConnections] = useState([]); 
  const [newChatSearch, setNewChatSearch] = useState('');

  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const newChatModalRef = useRef(null);
  const messagesEndRef = useRef(null);

  // 🔹 1. FETCH CONVERSATIONS
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
    const interval = setInterval(fetchConversations, 5000); // Polling for updates
    return () => clearInterval(interval);
  }, []);

  // 🔹 2. FETCH CONNECTIONS
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

  // 🔹 3. START CHAT LOGIC
  const handleStartNewChat = (user) => {
    const existingConv = conversations.find(c => c.otherUserId === user._id);
    
    if (existingConv) {
      setSelectedConversation(existingConv);
    } else {
      const newConv = {
        id: null,
        otherUserId: user._id,
        name: user.fullName,
        avatar: user.picture ? `http://localhost:5000/api/auth/student/${user._id}/picture` : null,
        lastMessage: 'Start a conversation...',
        lastSeen: 'Just now', // Initial state
        unread: 0,
        online: false // Default to false until backend updates
      };
      setSelectedConversation(newConv);
    }
    setShowNewChatModal(false);
    setNewChatSearch('');
  };

  // 🔹 4. FETCH MESSAGES
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
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedConversation]);

  // 🔹 5. SEND MESSAGE
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

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
        setMessages(prev => prev.map(msg => msg.id === tempMessage.id ? data.message : msg));
        if (!selectedConversation.id) {
            setSelectedConversation(prev => ({ ...prev, id: data.conversationId }));
            fetchConversations();
        }
      }
    } catch (err) { console.error("Send failed", err); }
  };

  // Utils
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEmojiClick = (emoji) => {
    setNewMessage(prev => prev + emoji);
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'CH';
  };

  // Filters
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAvailableUsers = connections.filter(user =>
    user.fullName.toLowerCase().includes(newChatSearch.toLowerCase())
  );

  // Click Outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target) &&
          emojiButtonRef.current && !emojiButtonRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
      if (newChatModalRef.current && !newChatModalRef.current.contains(event.target) &&
          !event.target.closest(`.${styles.addChatBtn}`)) { 
        setShowNewChatModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  return (
    <DashboardLayout title="Messages">
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className={styles.messagesWrapper}>
          
          {/* Sidebar */}
          <div className={styles.conversationsSidebar}>
            <div className={styles.sidebarHeader}>
              <h2 className={styles.sidebarTitle}>Messages</h2>
            </div>

            <div className={styles.tabsContainer}>
              <button className={`${styles.tab} ${styles.active}`}>Direct</button>
            </div>

            {/* SEARCH & COMPOSE BUTTON */}
            <div className={styles.searchContainer}>
              <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <button 
                className={styles.composeBtn} 
                onClick={handleOpenNewChat}
                title="Start new chat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
            </div>

            {/* Conversation List */}
            <div className={styles.conversationsList}>
              {loading ? (
                  <div style={{padding:'20px', textAlign:'center', color:'#888'}}>Loading...</div>
              ) : filteredConversations.length === 0 ? (
                  <div style={{padding:'20px', textAlign:'center', color:'#666'}}>
                      <p>No messages yet.</p>
                      <span onClick={handleOpenNewChat} style={{color:'#6366f1', cursor:'pointer', textDecoration:'underline'}}>Start a chat</span>
                  </div>
              ) : (
                  filteredConversations.map(conv => (
                    <div
                      key={conv.id}
                      className={`${styles.conversationItem} ${selectedConversation?.id === conv.id ? styles.selected : ''}`}
                      onClick={() => setSelectedConversation(conv)}
                    >
                      <div className={styles.conversationAvatar}>
                        {conv.avatar ? (
                            <img 
                                src={conv.avatar} 
                                alt={conv.name} 
                                className={styles.avatarImage} 
                                style={{width:'40px', height:'40px', borderRadius:'50%', objectFit:'cover'}}
                                onError={(e)=>{e.target.style.display='none'}} 
                            />
                        ) : (
                            <div className={styles.avatar}>{getInitials(conv.name)}</div>
                        )}
                        {/* 🟢 FIXED ONLINE INDICATOR */}
                        {/* Only show green dot if property is strictly true */}
                        {conv.online === true && <span className={styles.onlineIndicator}></span>}
                      </div>
                      <div className={styles.conversationInfo}>
                        <div className={styles.conversationHeader}>
                          <span className={styles.conversationName}>{conv.name}</span>
                          <span className={styles.conversationTime}>{conv.online === true ? 'Online' : (conv.lastSeen || '')}</span>
                        </div>
                        <div className={styles.conversationPreview}>
                          <span className={styles.lastMessage}>{conv.lastMessage}</span>
                          {conv.unread > 0 && (
                            <span className={styles.unreadBadge}>{conv.unread}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={styles.chatArea}>
            {selectedConversation ? (
              <>
                <div className={styles.chatHeader}>
                  <div className={styles.chatUserInfo}>
                    <div className={styles.chatAvatar}>
                      {selectedConversation.avatar ? (
                          <img src={selectedConversation.avatar} alt={selectedConversation.name} style={{width:'40px', height:'40px', borderRadius:'50%', objectFit:'cover'}} onError={(e)=>{e.target.style.display='none'}}/>
                      ) : (
                          getInitials(selectedConversation.name)
                      )}
                    </div>
                    <div className={styles.chatUserDetails}>
                      <h3 className={styles.chatUserName}>{selectedConversation.name}</h3>
                      <span className={styles.chatUserStatus}>
                        {/* 🟢 FIXED STATUS LOGIC */}
                        {selectedConversation.online === true ? (
                          <><span className={styles.statusDot}></span> Online</>
                        ) : (
                          selectedConversation.lastSeen ? `Last seen ${selectedConversation.lastSeen}` : 'Offline'
                        )}
                      </span>
                    </div>
                  </div>
                  <button className={styles.closeChat} onClick={() => setSelectedConversation(null)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
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
                          {message.isOwn && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20,6 9,17 4,12"></polyline>
                            </svg>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form className={styles.messageInputContainer} onSubmit={handleSendMessage}>
                  <div className={styles.emojiWrapper}>
                    <button type="button" className={styles.emojiBtn} ref={emojiButtonRef} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                        <line x1="9" y1="9" x2="9.01" y2="9"></line>
                        <line x1="15" y1="9" x2="15.01" y2="9"></line>
                      </svg>
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
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                    </svg>
                  </button>
                </form>
              </>
            ) : (
              <div className={styles.noConversation}>
                <div className={styles.noConversationIcon}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <h3>Select a conversation</h3>
                <p>Choose from sidebar or <span onClick={handleOpenNewChat} style={{color:'#6366f1', cursor:'pointer', fontWeight:'bold'}}>Start New Chat</span></p>
              </div>
            )}
          </div>
        </div>

        {/* New Chat Modal */}
        <AnimatePresence>
          {showNewChatModal && (
            <motion.div 
              className={styles.modalOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                ref={newChatModalRef}
                className={styles.newChatModal}
                style={!styles.newChatModal ? {background:'var(--bg-card)', width:'400px', padding:'20px', borderRadius:'12px'} : {}}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <div className={styles.newChatHeader} style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
                  <h3>Start New Chat</h3>
                  <button className={styles.closeModalBtn} onClick={() => setShowNewChatModal(false)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
                
                <input
                  type="text"
                  placeholder="Search users..."
                  value={newChatSearch}
                  onChange={(e) => setNewChatSearch(e.target.value)}
                  className={styles.newChatSearchInput} 
                  style={{width:'100%', padding:'10px', marginBottom:'15px', borderRadius:'8px', border:'1px solid var(--border-color)', background:'var(--bg-secondary)', color:'var(--text-primary)'}}
                />

                <div className={styles.usersList} style={{maxHeight:'300px', overflowY:'auto'}}>
                  {filteredAvailableUsers.length > 0 ? (
                    filteredAvailableUsers.map(user => (
                      <div
                        key={user._id}
                        className={styles.userItem}
                        style={{display:'flex', alignItems:'center', padding:'10px', cursor:'pointer', borderRadius:'8px'}}
                        onClick={() => handleStartNewChat(user)}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div className={styles.userAvatar} style={{marginRight:'10px'}}>
                           {user.picture ? (
                               <img src={`http://localhost:5000/api/auth/student/${user._id}/picture`} alt="" style={{width:'32px', height:'32px', borderRadius:'50%'}} onError={(e)=>{e.target.style.display='none'}}/>
                           ) : (
                               getInitials(user.fullName)
                           )}
                        </div>
                        <span className={styles.userName}>{user.fullName}</span>
                      </div>
                    ))
                  ) : (
                    <div className={styles.noUsersFound} style={{textAlign:'center', color:'#888'}}>
                      <p>No connections found.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </DashboardLayout>
  );
};

export default Messages;
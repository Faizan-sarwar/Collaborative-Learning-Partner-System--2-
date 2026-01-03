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
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiCategory, setActiveEmojiCategory] = useState('smileys');
  const [loading, setLoading] = useState(true);
  
  // 🔹 New Chat State
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);

  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const messagesEndRef = useRef(null);

  // 🔹 1. Fetch Conversations
  useEffect(() => {
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
    
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 2. Fetch Users for New Chat Modal
  const handleOpenNewChat = async () => {
    setShowNewChatModal(true);
    try {
        const storedUser = sessionStorage.getItem('user') || localStorage.getItem('user');
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser._id || parsedUser.id;

        // Reuse the matches endpoint to get a list of students
        const res = await fetch(`http://localhost:5000/api/auth/matches/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if(data.success) {
            setAvailableUsers(data.matches);
        }
    } catch(err) {
        console.error("Failed to load users", err);
    }
  };

  // 🔹 3. Start New Chat
  const startChat = (user) => {
    // Check if conversation already exists
    const existing = conversations.find(c => c.otherUserId === user.id);
    if (existing) {
        setSelectedConversation(existing);
    } else {
        // Create a temporary conversation object
        const tempConv = {
            id: null, // No ID yet (will be created on first message)
            otherUserId: user.id,
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

  // 🔹 4. Fetch Messages
  useEffect(() => {
    if (!selectedConversation || !selectedConversation.id) {
        setMessages([]); // Clear messages for new/temp chat
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
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
                conversationId: selectedConversation.id, // Can be null for new chat
                targetUserId: selectedConversation.otherUserId, // Required for new chat
                text: tempMessage.text
            })
        });

        const data = await res.json();
        if (data.success) {
            setMessages(prev => prev.map(msg => msg.id === tempMessage.id ? data.message : msg));
            
            // If this was a new conversation, update the ID so future messages work
            if (!selectedConversation.id) {
                setSelectedConversation(prev => ({ ...prev, id: data.conversationId }));
                // Also refresh list to show the new conversation in sidebar
                const refreshRes = await fetch('http://localhost:5000/api/chat/conversations', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const refreshData = await refreshRes.json();
                if (refreshData.success) setConversations(refreshData.conversations);
            }
        }
    } catch (err) {
        console.error("Send failed", err);
    }
  };

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'CH';

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout title="Messages">
      <div className={styles.container}>
        <div className={styles.messagesWrapper}>
          
          {/* Sidebar */}
          <div className={styles.conversationsSidebar}>
            <div className={styles.sidebarHeader}>
              <h2 className={styles.sidebarTitle}>Messages</h2>
              {/* 🟢 NEW CHAT BUTTON */}
              <button className={styles.newChatBtn} onClick={handleOpenNewChat} title="Start New Chat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
            
            <div className={styles.searchContainer}>
              <input 
                type="text" 
                placeholder="Search chats..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className={styles.searchInput} 
              />
            </div>

            <div className={styles.conversationsList}>
              {loading ? <div style={{padding: '20px', textAlign:'center', color:'#888'}}>Loading...</div> : 
               filteredConversations.length === 0 ? (
                   <div style={{padding:'20px', textAlign:'center', color:'#666'}}>
                       <p>No messages yet.</p>
                       <button onClick={handleOpenNewChat} className={styles.linkBtn}>Start a chat</button>
                   </div>
               ) :
               filteredConversations.map(conv => (
                <div 
                  key={conv.id} 
                  className={`${styles.conversationItem} ${selectedConversation?.id === conv.id ? styles.selected : ''}`}
                  onClick={() => setSelectedConversation(conv)}
                >
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
            </div>
          </div>

          {/* Chat Area */}
          <div className={styles.chatArea}>
            {selectedConversation ? (
              <>
                <div className={styles.chatHeader}>
                  <div className={styles.chatUserInfo}>
                    <div className={styles.chatAvatar}>{getInitials(selectedConversation.name)}</div>
                    <div className={styles.chatUserDetails}>
                      <h3 className={styles.chatUserName}>{selectedConversation.name}</h3>
                      <span className={styles.chatUserStatus}>
                        {selectedConversation.online ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.messagesContainer}>
                  {messages.length === 0 && (
                      <div style={{textAlign:'center', marginTop:'50px', color:'#888'}}>
                          <p>No messages here yet.</p>
                          <p>Say hello to <strong>{selectedConversation.name}</strong>! 👋</p>
                      </div>
                  )}
                  {messages.map(message => (
                    <div key={message.id} className={`${styles.messageWrapper} ${message.isOwn ? styles.ownMessage : ''}`}>
                      <div className={styles.messageBubble}>
                        <p className={styles.messageText}>{message.text}</p>
                        <span className={styles.messageTime}>{message.timestamp}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form className={styles.messageInputContainer} onSubmit={handleSendMessage}>
                  <div className={styles.emojiWrapper}>
                    <button type="button" className={styles.emojiBtn} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</button>
                    <AnimatePresence>
                      {showEmojiPicker && (
                        <motion.div ref={emojiPickerRef} className={styles.emojiPicker} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <div className={styles.emojiGrid}>
                            {emojiCategories[activeEmojiCategory].map((emoji, idx) => (
                                <button key={idx} type="button" className={styles.emojiItem} onClick={() => { handleSendMessage({preventDefault:()=>{}}); setNewMessage(prev => prev + emoji); }}>{emoji}</button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <input type="text" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className={styles.messageInput} />
                  <button type="submit" className={styles.sendBtn} disabled={!newMessage.trim()}>➤</button>
                </form>
              </>
            ) : (
              <div className={styles.noConversation}>
                <h3>Select a conversation</h3>
                <p>or click the + button to start a new chat</p>
              </div>
            )}
          </div>
        </div>

        {/* 🔹 NEW CHAT MODAL */}
        <AnimatePresence>
            {showNewChatModal && (
                <div className={styles.modalOverlay}>
                    <motion.div 
                        className={styles.modalContent}
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                    >
                        <div className={styles.modalHeader}>
                            <h3>Start New Chat</h3>
                            <button onClick={() => setShowNewChatModal(false)}>✕</button>
                        </div>
                        <div className={styles.userList}>
                            {availableUsers.length === 0 ? <p>No users found.</p> : 
                             availableUsers.map(user => (
                                <div key={user.id} className={styles.userListItem} onClick={() => startChat(user)}>
                                    <div className={styles.listAvatar}>{getInitials(user.fullName)}</div>
                                    <div className={styles.listInfo}>
                                        <span className={styles.listName}>{user.fullName}</span>
                                        <span className={styles.listDept}>{user.department}</span>
                                    </div>
                                    <button className={styles.startBtn}>Chat</button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

      </div>
    </DashboardLayout>
  );
};

export default Messages;
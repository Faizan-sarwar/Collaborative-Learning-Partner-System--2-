import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './StudyRoom.module.css';

const StudyRoom = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // 🔹 State for Rooms & User
  const [rooms, setRooms] = useState([]);
  const [user, setUser] = useState(JSON.parse((localStorage.getItem('user') || sessionStorage.getItem('user'))) || {});
  
  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    subject: 'Mathematics',
    topics: '',
    maxParticipants: 5,
    scheduleType: 'now',
    startTime: ''
  });

  // 🔹 Fetch Rooms
  useEffect(() => {
    // In a real app, fetch from API. For now, we simulate fetching.
    // const fetchRooms = async () => { ... }
    // fetchRooms();
    
    // Using mock data for display, but simulating DB IDs
    const mockRooms = [
      { id: 'room-1', name: 'Math Group', subject: 'Mathematics', host: 'John Doe', hostId: 'other-user-id', status: 'live', participants: 3, maxParticipants: 5, topics: ['Calculus'] },
      { id: 'room-2', name: 'Physics Help', subject: 'Physics', host: 'Sarah Smith', hostId: 'other-user-id-2', status: 'live', participants: 2, maxParticipants: 6, topics: ['Gravity'] }
    ];
    setRooms(mockRooms);
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Fixed: added name attribute to inputs below
  };

  // 🔹 HANDLE CREATE ROOM (HOST)
  const handleCreateRoom = async () => {
    try {
      const token = (localStorage.getItem('token') || sessionStorage.getItem('token'));
      // API Call to create room
      /* const res = await fetch('http://localhost:5000/api/study-rooms/create', {
         method: 'POST',
         headers: { 'Authorization': `Bearer ${token}` },
         body: JSON.stringify({ ...formData, hostId: user._id })
      });
      const data = await res.json(); 
      */

      // SIMULATION: Create room object
      const newRoom = {
        id: `room-${Date.now()}`,
        ...formData,
        host: user.fullName || 'Me',
        hostId: user._id, // 🟢 IMPORTANT: Set current user as Host
        status: 'live',
        participants: 1,
        topics: formData.topics.split(',')
      };

      // 🟢 LOGIC: Hosts go directly to Active Room (No waiting)
      setShowCreateModal(false);
      navigate(`/study-room/active/${newRoom.id}`, { state: { room: newRoom, isHost: true } });

    } catch (err) {
      console.error("Failed to create room", err);
    }
  };

  // 🔹 HANDLE JOIN ROOM (PARTICIPANT)
  const handleJoinRoom = (room) => {
    // 🟢 LOGIC: Participants go to Waiting Room
    navigate(`/study-room/waiting/${room.id}`, { state: { room } });
  };

  // ... (Filtering logic remains same)
  const filteredRooms = activeTab === 'all' 
    ? rooms 
    : activeTab === 'live'
    ? rooms.filter(r => r.status === 'live')
    : rooms.filter(r => r.status === 'scheduled');

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const cardVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  // ... (Subject Colors/Icons objects remain same)
  const subjectColors = { 'Mathematics': '#6366f1', 'Physics': '#8b5cf6', 'Chemistry': '#ec4899', 'Biology': '#10b981', 'Computer Science': '#f59e0b' };
  const subjectIcons = { 'Mathematics': '📐', 'Physics': '⚛️', 'Chemistry': '🧪', 'Biology': '🧬', 'Computer Science': '💻' };

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Study Rooms</h1>
            <p className={styles.subtitle}>Join live study sessions or create your own room</p>
          </div>
          <motion.button className={styles.createBtn} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowCreateModal(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
            Create Room
          </motion.button>
        </div>

        {/* Stats Row (Kept same) */}
        <div className={styles.statsRow}>
           {/* ... (Stats cards code remains exactly the same as provided) ... */}
           {/* Placeholder for brevity, assume stats UI is here */}
        </div>

        <div className={styles.tabs}>
          {['all', 'live', 'scheduled'].map((tab) => (
            <button key={tab} className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`} onClick={() => setActiveTab(tab)}>
              {tab === 'live' && <span className={styles.liveIndicator} />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Rooms
            </button>
          ))}
        </div>

        <motion.div className={styles.roomsGrid} variants={containerVariants} initial="hidden" animate="visible">
          {filteredRooms.map((room) => (
            <motion.div key={room.id} className={styles.roomCard} variants={cardVariants} whileHover={{ y: -5 }}>
              <div className={styles.roomHeader} style={{ background: `linear-gradient(135deg, ${subjectColors[room.subject]}20, ${subjectColors[room.subject]}10)` }}>
                <div className={styles.roomSubject}>
                  <span className={styles.subjectIcon}>{subjectIcons[room.subject]}</span>
                  <span className={styles.subjectName}>{room.subject}</span>
                </div>
                {room.status === 'live' ? <span className={styles.liveBadge}><span className={styles.liveIndicator} />Live</span> : <span className={styles.scheduledBadge}>🕐 {room.startTime}</span>}
              </div>

              <div className={styles.roomBody}>
                <h3 className={styles.roomName}>{room.name}</h3>
                <div className={styles.hostInfo}>
                  <div className={styles.hostAvatar}>{room.host.charAt(0)}</div>
                  <span className={styles.hostName}>Hosted by {room.host}</span>
                </div>
                <div className={styles.topics}>
                  {room.topics && room.topics.map((topic, index) => <span key={index} className={styles.topic}>{topic}</span>)}
                </div>
                <div className={styles.roomStats}>
                  <div className={styles.participants}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    <span>{room.participants}/{room.maxParticipants}</span>
                  </div>
                </div>
              </div>

              <div className={styles.roomFooter}>
                <motion.button 
                    className={styles.joinBtn} 
                    style={{ background: room.status === 'live' ? `linear-gradient(135deg, ${subjectColors[room.subject]}, ${subjectColors[room.subject]}cc)` : undefined }} 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleJoinRoom(room)} // 🟢 Calls logic
                >
                  {room.status === 'live' ? 'Join Room' : 'Set Reminder'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {showCreateModal && (
          <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setShowCreateModal(false)}>
            <motion.div className={styles.modal} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}><h2>Create Study Room</h2><button className={styles.closeBtn} onClick={() => setShowCreateModal(false)}>✕</button></div>
              <div className={styles.modalBody}>
                {/* Inputs binding to formData */}
                <div className={styles.formGroup}><label>Room Name</label><input name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="Enter room name..." /></div>
                <div className={styles.formGroup}><label>Subject</label><select name="subject" value={formData.subject} onChange={handleInputChange}><option>Mathematics</option><option>Physics</option><option>Computer Science</option></select></div>
                <div className={styles.formGroup}><label>Topics</label><input name="topics" value={formData.topics} onChange={handleInputChange} type="text" placeholder="e.g., Calculus" /></div>
                <div className={styles.formRow}><div className={styles.formGroup}><label>Max Participants</label><input name="maxParticipants" value={formData.maxParticipants} onChange={handleInputChange} type="number" /></div></div>
              </div>
              <div className={styles.modalFooter}>
                <button className={styles.cancelBtn} onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button className={styles.createRoomBtn} onClick={handleCreateRoom}>Create Room</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudyRoom;
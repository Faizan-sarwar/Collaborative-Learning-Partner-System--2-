import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import styles from './StudyRoomActive.module.css';

const mockParticipants = [
  { id: 1, name: 'John Doe', role: 'host', isMuted: false, isVideoOn: true },
  { id: 2, name: 'Sarah Smith', role: 'participant', isMuted: true, isVideoOn: true },
  { id: 3, name: 'Mike Johnson', role: 'participant', isMuted: false, isVideoOn: false },
  { id: 4, name: 'Emily Chen', role: 'participant', isMuted: true, isVideoOn: true },
  { id: 5, name: 'You', role: 'participant', isMuted: false, isVideoOn: true },
];

const mockNotes = [
  { id: 1, user: 'John Doe', text: 'Remember to cover Chapter 5 topics', time: '2:30 PM' },
  { id: 2, user: 'Sarah Smith', text: 'Great explanation on derivatives!', time: '2:35 PM' },
  { id: 3, user: 'Emily Chen', text: 'Can we do more practice problems?', time: '2:40 PM' },
];

const StudyRoomActive = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const location = useLocation();
  const roomData = location.state?.room;
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeTab, setActiveTab] = useState('participants');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState(mockNotes);
  const [sessionTime, setSessionTime] = useState('45:23');
  
  const handleLeaveRoom = () => {
    navigate('/study-room');
  };
  
  const handleSendNote = () => {
    if (newNote.trim()) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setNotes([...notes, { id: Date.now(), user: 'You', text: newNote, time: timeStr }]);
      setNewNote('');
    }
  };

  return (
    <div className={styles.container}>
      {/* Main Video Area */}
      <div className={styles.mainArea}>
        <div className={styles.header}>
          <div className={styles.roomInfo}>
            <span className={styles.liveBadge}>
              <span className={styles.liveIndicator}></span>
              LIVE
            </span>
            <h1 className={styles.roomName}>{roomData?.name || 'Study Session'}</h1>
            <span className={styles.sessionTime}>⏱️ {sessionTime}</span>
          </div>
          
          <motion.button
            className={styles.leaveBtn}
            onClick={() => setShowLeaveModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Leave Room
          </motion.button>
        </div>
        
        <div className={styles.videoGrid}>
          {mockParticipants.slice(0, 4).map((participant, index) => (
            <motion.div
              key={participant.id}
              className={`${styles.videoTile} ${participant.role === 'host' ? styles.hostTile : ''}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {participant.isVideoOn ? (
                <div className={styles.videoPlaceholder}>
                  <div className={styles.avatarLarge}>
                    {participant.name.charAt(0)}
                  </div>
                </div>
              ) : (
                <div className={styles.videoOff}>
                  <div className={styles.avatarLarge}>
                    {participant.name.charAt(0)}
                  </div>
                  <span>Camera Off</span>
                </div>
              )}
              
              <div className={styles.participantOverlay}>
                <span className={styles.participantName}>
                  {participant.role === 'host' && <span className={styles.hostBadge}>👑</span>}
                  {participant.name}
                </span>
                <div className={styles.participantStatus}>
                  {participant.isMuted && <span className={styles.mutedIcon}>🔇</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Control Bar */}
        <div className={styles.controlBar}>
          <motion.button
            className={`${styles.controlBtn} ${isMuted ? styles.controlBtnOff : ''}`}
            onClick={() => setIsMuted(!isMuted)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMuted ? '🔇' : '🎤'}
          </motion.button>
          
          <motion.button
            className={`${styles.controlBtn} ${!isVideoOn ? styles.controlBtnOff : ''}`}
            onClick={() => setIsVideoOn(!isVideoOn)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isVideoOn ? '📹' : '📷'}
          </motion.button>
          
          <motion.button
            className={`${styles.controlBtn} ${isScreenSharing ? styles.controlBtnActive : ''}`}
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            🖥️
          </motion.button>
          
          <motion.button
            className={styles.controlBtn}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            ✋
          </motion.button>
          
          <motion.button
            className={styles.controlBtn}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            📋
          </motion.button>
        </div>
      </div>
      
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarTabs}>
          <button
            className={`${styles.sidebarTab} ${activeTab === 'participants' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('participants')}
          >
            👥 Participants ({mockParticipants.length})
          </button>
          <button
            className={`${styles.sidebarTab} ${activeTab === 'notes' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            📝 Notes
          </button>
        </div>
        
        <div className={styles.sidebarContent}>
          {activeTab === 'participants' && (
            <div className={styles.participantsList}>
              {mockParticipants.map((participant) => (
                <div key={participant.id} className={styles.participantItem}>
                  <div className={styles.participantAvatar}>
                    {participant.name.charAt(0)}
                    {participant.role === 'host' && (
                      <span className={styles.hostIndicator}>👑</span>
                    )}
                  </div>
                  <div className={styles.participantInfo}>
                    <span className={styles.participantNameSmall}>
                      {participant.name}
                      {participant.name === 'You' && ' (You)'}
                    </span>
                    <span className={styles.participantRole}>
                      {participant.role === 'host' ? 'Host' : 'Participant'}
                    </span>
                  </div>
                  <div className={styles.participantIcons}>
                    {participant.isMuted && <span>🔇</span>}
                    {!participant.isVideoOn && <span>📷</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'notes' && (
            <div className={styles.notesSection}>
              <div className={styles.notesList}>
                {notes.map((note) => (
                  <div key={note.id} className={styles.noteItem}>
                    <div className={styles.noteHeader}>
                      <span className={styles.noteUser}>{note.user}</span>
                      <span className={styles.noteTime}>{note.time}</span>
                    </div>
                    <p className={styles.noteText}>{note.text}</p>
                  </div>
                ))}
              </div>
              
              <div className={styles.noteInput}>
                <input
                  type="text"
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendNote()}
                />
                <motion.button
                  onClick={handleSendNote}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ➤
                </motion.button>
              </div>
            </div>
          )}
        </div>
        
        {/* Resources Section */}
        <div className={styles.resourcesSection}>
          <h3>📚 Session Resources</h3>
          <div className={styles.resourcesList}>
            <div className={styles.resourceItem}>
              <span>📄</span>
              <span>Study Guide.pdf</span>
            </div>
            <div className={styles.resourceItem}>
              <span>🔗</span>
              <span>Practice Problems</span>
            </div>
            <div className={styles.resourceItem}>
              <span>📊</span>
              <span>Shared Whiteboard</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Leave Modal */}
      {showLeaveModal && (
        <motion.div
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowLeaveModal(false)}
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalIcon}>👋</div>
            <h2>Leave Study Room?</h2>
            <p>You're about to leave the study session. Are you sure?</p>
            
            <div className={styles.modalButtons}>
              <button className={styles.cancelModalBtn} onClick={() => setShowLeaveModal(false)}>
                Stay
              </button>
              <button className={styles.leaveModalBtn} onClick={handleLeaveRoom}>
                Leave Room
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default StudyRoomActive;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './StudyRoom.module.css';

const mockRooms = [
  {
    id: 1,
    name: 'Mathematics Study Group',
    subject: 'Mathematics',
    participants: 5,
    maxParticipants: 8,
    host: 'John Doe',
    status: 'live',
    duration: '2h 15m',
    topics: ['Calculus', 'Linear Algebra'],
  },
  {
    id: 2,
    name: 'Physics Problem Solving',
    subject: 'Physics',
    participants: 3,
    maxParticipants: 6,
    host: 'Sarah Smith',
    status: 'live',
    duration: '45m',
    topics: ['Mechanics', 'Thermodynamics'],
  },
  {
    id: 3,
    name: 'Organic Chemistry Review',
    subject: 'Chemistry',
    participants: 4,
    maxParticipants: 5,
    host: 'Mike Johnson',
    status: 'scheduled',
    startTime: '3:00 PM',
    topics: ['Reactions', 'Nomenclature'],
  },
  {
    id: 4,
    name: 'Biology Exam Prep',
    subject: 'Biology',
    participants: 6,
    maxParticipants: 10,
    host: 'Emily Chen',
    status: 'live',
    duration: '1h 30m',
    topics: ['Cell Biology', 'Genetics'],
  },
  {
    id: 5,
    name: 'CS Algorithm Practice',
    subject: 'Computer Science',
    participants: 2,
    maxParticipants: 4,
    host: 'Alex Turner',
    status: 'scheduled',
    startTime: '5:00 PM',
    topics: ['Sorting', 'Dynamic Programming'],
  },
];

const subjectColors = {
  'Mathematics': '#6366f1',
  'Physics': '#8b5cf6',
  'Chemistry': '#ec4899',
  'Biology': '#10b981',
  'Computer Science': '#f59e0b',
};

const subjectIcons = {
  'Mathematics': '📐',
  'Physics': '⚛️',
  'Chemistry': '🧪',
  'Biology': '🧬',
  'Computer Science': '💻',
};

const StudyRoom = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredRooms = activeTab === 'all' 
    ? mockRooms 
    : activeTab === 'live'
    ? mockRooms.filter(r => r.status === 'live')
    : mockRooms.filter(r => r.status === 'scheduled');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Study Rooms</h1>
            <p className={styles.subtitle}>
              Join live study sessions or create your own room
            </p>
          </div>

          <motion.button
            className={styles.createBtn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Create Room
          </motion.button>
        </div>

        <div className={styles.statsRow}>
          <motion.div
            className={styles.statCard}
            whileHover={{ y: -5 }}
          >
            <div className={styles.statIcon} style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
              <span>🎯</span>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{mockRooms.filter(r => r.status === 'live').length}</span>
              <span className={styles.statLabel}>Live Rooms</span>
            </div>
          </motion.div>

          <motion.div
            className={styles.statCard}
            whileHover={{ y: -5 }}
          >
            <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <span>👥</span>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>
                {mockRooms.reduce((acc, r) => acc + r.participants, 0)}
              </span>
              <span className={styles.statLabel}>Active Students</span>
            </div>
          </motion.div>

          <motion.div
            className={styles.statCard}
            whileHover={{ y: -5 }}
          >
            <div className={styles.statIcon} style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
              <span>📅</span>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{mockRooms.filter(r => r.status === 'scheduled').length}</span>
              <span className={styles.statLabel}>Scheduled</span>
            </div>
          </motion.div>

          <motion.div
            className={styles.statCard}
            whileHover={{ y: -5 }}
          >
            <div className={styles.statIcon} style={{ background: 'rgba(236, 72, 153, 0.1)' }}>
              <span>🏆</span>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>12</span>
              <span className={styles.statLabel}>Sessions Joined</span>
            </div>
          </motion.div>
        </div>

        <div className={styles.tabs}>
          {['all', 'live', 'scheduled'].map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'live' && <span className={styles.liveIndicator} />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Rooms
            </button>
          ))}
        </div>

        <motion.div
          className={styles.roomsGrid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredRooms.map((room) => (
            <motion.div
              key={room.id}
              className={styles.roomCard}
              variants={cardVariants}
              whileHover={{ y: -5 }}
            >
              <div
                className={styles.roomHeader}
                style={{ background: `linear-gradient(135deg, ${subjectColors[room.subject]}20, ${subjectColors[room.subject]}10)` }}
              >
                <div className={styles.roomSubject}>
                  <span className={styles.subjectIcon}>{subjectIcons[room.subject]}</span>
                  <span className={styles.subjectName}>{room.subject}</span>
                </div>
                {room.status === 'live' ? (
                  <span className={styles.liveBadge}>
                    <span className={styles.liveIndicator} />
                    Live
                  </span>
                ) : (
                  <span className={styles.scheduledBadge}>
                    🕐 {room.startTime}
                  </span>
                )}
              </div>

              <div className={styles.roomBody}>
                <h3 className={styles.roomName}>{room.name}</h3>
                
                <div className={styles.hostInfo}>
                  <div className={styles.hostAvatar}>
                    {room.host.charAt(0)}
                  </div>
                  <span className={styles.hostName}>Hosted by {room.host}</span>
                </div>

                <div className={styles.topics}>
                  {room.topics.map((topic, index) => (
                    <span key={index} className={styles.topic}>
                      {topic}
                    </span>
                  ))}
                </div>

                <div className={styles.roomStats}>
                  <div className={styles.participants}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span>{room.participants}/{room.maxParticipants}</span>
                  </div>
                  {room.duration && (
                    <div className={styles.duration}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>{room.duration}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.roomFooter}>
                <motion.button
                  className={styles.joinBtn}
                  style={{ 
                    background: room.status === 'live' 
                      ? `linear-gradient(135deg, ${subjectColors[room.subject]}, ${subjectColors[room.subject]}cc)`
                      : undefined
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {room.status === 'live' ? 'Join Room' : 'Set Reminder'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {showCreateModal && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h2>Create Study Room</h2>
                <button className={styles.closeBtn} onClick={() => setShowCreateModal(false)}>
                  ✕
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>Room Name</label>
                  <input type="text" placeholder="Enter room name..." />
                </div>

                <div className={styles.formGroup}>
                  <label>Subject</label>
                  <select>
                    <option>Select subject</option>
                    <option>Mathematics</option>
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Biology</option>
                    <option>Computer Science</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Topics (comma separated)</label>
                  <input type="text" placeholder="e.g., Calculus, Algebra" />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Max Participants</label>
                    <input type="number" placeholder="8" min="2" max="20" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Schedule</label>
                    <select>
                      <option>Start Now</option>
                      <option>Schedule for Later</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button className={styles.cancelBtn} onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button className={styles.createRoomBtn}>
                  Create Room
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudyRoom;

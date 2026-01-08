import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './StudyRoomWaiting.module.css';

const StudyRoomWaiting = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const location = useLocation();
  const roomData = location.state?.room;
  const user = JSON.parse(sessionStorage.getItem('user'));
  
  const [waitingTime, setWaitingTime] = useState(0);
  const [status, setStatus] = useState('pending'); // pending, approved, rejected
  
  // 🔹 1. Send Join Request on Mount
  useEffect(() => {
    const sendJoinRequest = async () => {
        try {
            // await fetch(`http://localhost:5000/api/study-rooms/${roomId}/join`, { method: 'POST', ... });
            console.log(`Request sent to host of room ${roomId} by ${user.fullName}`);
        } catch (e) { console.error(e); }
    };
    sendJoinRequest();
  }, [roomId]);

  // 🔹 2. Poll for Status Change
  useEffect(() => {
    const timer = setInterval(() => {
      setWaitingTime(prev => prev + 1);
    }, 1000);
    
    const demoTimer = setTimeout(() => setStatus('approved'), 8000); 

    return () => {
        clearInterval(timer);
        clearTimeout(demoTimer);
    };
  }, []);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleJoinRoom = () => {
    // 🟢 Join as Participant
    navigate(`/study-room/active/${roomId}`, { state: { room: roomData, isHost: false } });
  };
  
  const handleCancel = () => {
    navigate('/study-room');
  };

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <motion.div 
          className={styles.waitingCard}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {status === 'pending' && (
            <>
              <div className={styles.loaderContainer}>
                <div className={styles.loader}>
                  <div className={styles.loaderRing}></div>
                  <div className={styles.loaderRing}></div>
                  <div className={styles.loaderRing}></div>
                  <div className={styles.loaderIcon}>🎓</div>
                </div>
              </div>
              
              <h1 className={styles.title}>Waiting for Approval</h1>
              <p className={styles.subtitle}>
                The host is reviewing your request to join
              </p>
              
              <div className={styles.roomInfo}>
                <div className={styles.roomName}>
                  <span className={styles.roomIcon}>📚</span>
                  {roomData?.name || 'Study Room'}
                </div>
                <div className={styles.hostInfo}>
                  Hosted by <strong>{roomData?.host || 'Unknown'}</strong>
                </div>
              </div>
              
              <div className={styles.waitingTimer}>
                <span className={styles.timerLabel}>Waiting time</span>
                <span className={styles.timerValue}>{formatTime(waitingTime)}</span>
              </div>
              
              <motion.button className={styles.cancelBtn} onClick={handleCancel} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                Cancel Request
              </motion.button>
            </>
          )}
          
          {status === 'approved' && (
            <>
              <motion.div className={styles.approvedIcon} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.6 }}>✅</motion.div>
              <h1 className={styles.title}>Request Approved!</h1>
              <p className={styles.subtitle}>You've been approved to join the study session</p>
              
              <motion.button className={styles.joinBtn} onClick={handleJoinRoom} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <span>🚀</span> Join Study Room
              </motion.button>
            </>
          )}
          
          {status === 'rejected' && (
            <>
              <motion.div className={styles.rejectedIcon} initial={{ scale: 0 }} animate={{ scale: 1 }}>❌</motion.div>
              <h1 className={styles.title}>Request Declined</h1>
              <p className={styles.subtitle}>Unfortunately, your request was not approved</p>
              <motion.button className={styles.backBtn} onClick={handleCancel} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                Browse Other Rooms
              </motion.button>
            </>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default StudyRoomWaiting;
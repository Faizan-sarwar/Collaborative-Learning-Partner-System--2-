import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { UserCheck, UserX, UserSearch, Inbox, Send, Check, X, User as UserIcon } from 'lucide-react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './PendingConnections.module.css';

// 🟢 IMPORT ALL AVATARS
const avatars = {
  male: { 
    1: '/gamification/male-level-1.png', 
    2: '/gamification/male-level-2.png', 
    3: '/gamification/male-level-3.png',
    /* ... */
  },
  female: { 
    1: '/gamification/female-level-1.png', 
    2: '/gamification/female-level-2.png', 
    /* ... */
  }
};
// 🟢 SMART AVATAR COMPONENT
const UserAvatar = ({ user, getInitials }) => {
  const [imgError, setImgError] = useState(false);
  const uId = user._id || user.id;
  const showAvatar = user.settings?.showAvatar !== false;

  if (showAvatar) {
    const gender = user.gender?.toLowerCase() === 'female' ? 'female' : 'male';
    const level = user.level || 1;
    const avatarSrc = avatars[gender]?.[level] || avatars['male'][1];
    
    return (
      <div className={styles.avatarWrapper}>
        <img src={avatarSrc} alt={user.fullName} className={styles.avatarImg} />
      </div>
    );
  }

  if (!imgError && uId) {
    return (
      <div className={styles.avatarWrapper}>
        <img
          src={`http://localhost:5000/api/auth/student/${uId}/picture`}
          alt={user.fullName}
          onError={() => setImgError(true)}
          className={styles.avatarImg}
        />
      </div>
    );
  }
  
  return <div className={styles.avatarFallback}>{getInitials(user.fullName)}</div>;
};

const PendingConnections = () => {
  const navigate = useNavigate();
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🟢 SECURITY: Prevents double-clicking buttons
  const [processingId, setProcessingId] = useState(null);

  // FETCH REQUESTS
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
        const currentUser = JSON.parse(storage.getItem('user') || '{}');
        const existingConnections = currentUser.connections || [];
        
        const isNotConnected = (req) => !existingConnections.some(c => (c._id || c) === req._id);

        const [resIn, resOut] = await Promise.all([
            fetch(`http://${window.location.hostname}:5000/api/auth/requests/received`, { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch(`http://${window.location.hostname}:5000/api/auth/requests/sent`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        const dataIn = await resIn.json();
        const dataOut = await resOut.json();

        if (dataIn.success) {
            const cleanIncoming = dataIn.requests.filter(isNotConnected);
            setIncomingRequests(cleanIncoming);

            if (currentUser.receivedRequests) {
                currentUser.receivedRequests = cleanIncoming.map(req => req._id);
                storage.setItem('user', JSON.stringify(currentUser));
                window.dispatchEvent(new Event('userUpdated')); 
            }
        }
        
        if (dataOut.success) {
            setOutgoingRequests(dataOut.requests.filter(isNotConnected));
        }

      } catch (err) {
        console.error("Failed to load requests", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'ST';

  // 🟢 ACCEPT REQUEST (Enterprise logic)
  const acceptRequest = async (reqUser) => {
    if (processingId) return;
    setProcessingId(reqUser._id);

    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/auth/requests/${reqUser._id}/accept`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success) {
            setIncomingRequests(prev => prev.filter(req => req._id !== reqUser._id));
            
            // Sync local storage
            const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
            const currentUser = JSON.parse(storage.getItem('user') || '{}');
            
            if (!currentUser.connections.includes(reqUser._id)) {
                currentUser.connections.push(reqUser._id);
            }
            currentUser.receivedRequests = (currentUser.receivedRequests || []).filter(reqId => reqId !== reqUser._id);
            storage.setItem('user', JSON.stringify(currentUser));
            window.dispatchEvent(new Event('userUpdated'));

            // 🟢 Send System Notification
            const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
            notifs.unshift({
                id: Date.now(), 
                title: "New Connection! 🎉", 
                message: `You are now connected with ${reqUser.fullName}. Say hi!`, 
                type: 'success', 
                read: false, 
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('notifications', JSON.stringify(notifs));
            window.dispatchEvent(new Event('notificationAdded'));
        }
    } catch (err) {
        console.error("Accept failed", err);
    } finally {
        setProcessingId(null);
    }
  };

  // 🟢 DECLINE REQUEST
  const declineRequest = async (id) => {
    if (processingId) return;
    setProcessingId(id);

    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/auth/requests/${id}/decline`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
            setIncomingRequests(prev => prev.filter(req => req._id !== id));
            const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
            const currentUser = JSON.parse(storage.getItem('user') || '{}');
            if (currentUser.receivedRequests) {
                currentUser.receivedRequests = currentUser.receivedRequests.filter(reqId => reqId !== id);
                storage.setItem('user', JSON.stringify(currentUser));
                window.dispatchEvent(new Event('userUpdated'));
            }
        }
    } catch (err) { 
        console.error(err); 
    } finally {
        setProcessingId(null);
    }
  };

  // 🟢 CANCEL OUTGOING
  const cancelRequest = async (id) => {
    if (processingId) return;
    setProcessingId(id);

    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/auth/requests/${id}/decline`, { 
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            setOutgoingRequests(prev => prev.filter(req => req._id !== id));
        }
    } catch (err) { 
        console.error(err); 
    } finally {
        setProcessingId(null);
    }
  };

  if (loading) return <DashboardLayout title="Pending Connections"><div className={styles.loadingState}>Loading network...</div></DashboardLayout>;

  return (
    <DashboardLayout title="Pending Connections">
      <div className={styles.container}>
        
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Pending Connections</h1>
            <p className={styles.subtitle}>Manage your network and review study requests.</p>
          </div>
          <div className={styles.headerActions}>
            <Link to="/study-matches" className={styles.findMatchesBtn}>
                <UserSearch size={18} /> Find Matches
            </Link>
          </div>
        </div>

        {/* Requests Grid */}
        <div className={styles.requestsGrid}>
          
          {/* 🟢 INCOMING REQUESTS */}
          <div className={styles.requestsSection}>
            <div className={styles.sectionHeader}>
                <div className={styles.sectionIconWrapper} style={{color: '#a855f7', background: 'rgba(168, 85, 247, 0.15)'}}>
                    <Inbox size={20} />
                </div>
                <div>
                    <h2 className={styles.sectionTitle}>Incoming Requests</h2>
                    <p className={styles.sectionSubtitle}>People who want to connect with you</p>
                </div>
            </div>

            {incomingRequests.length > 0 ? (
              <div className={styles.requestsList}>
                <AnimatePresence>
                    {incomingRequests.map(req => (
                    <motion.div 
                        key={req._id} 
                        className={styles.requestCard} 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <div className={styles.requestInfo}>
                        <UserAvatar user={req} getInitials={getInitials} />
                        <div className={styles.userDetails}>
                            <h3 className={styles.userName}>{req.fullName}</h3>
                            <p className={styles.userInstitution}>{req.department || 'Student'}</p>
                        </div>
                        </div>
                        <div className={styles.requestActions}>
                        <button className={styles.profileBtn} onClick={() => navigate(`/user-profile/${req._id}`)} title="View Profile">
                            <UserIcon size={16} />
                        </button>
                        <button 
                            className={styles.acceptBtn} 
                            onClick={() => acceptRequest(req)}
                            disabled={processingId === req._id}
                        >
                            {processingId === req._id ? <div className={styles.spinner}></div> : <Check size={16} />} 
                            <span className={styles.btnText}>Accept</span>
                        </button>
                        <button 
                            className={styles.declineBtn} 
                            onClick={() => declineRequest(req._id)}
                            disabled={processingId === req._id}
                            title="Decline"
                        >
                            <X size={16} />
                        </button>
                        </div>
                    </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className={styles.emptyState}>
                  <Inbox size={48} className={styles.emptyIcon} />
                  <h3>Inbox Zero</h3>
                  <p>You have no pending incoming requests.</p>
              </div>
            )}
          </div>

          {/* 🟢 OUTGOING REQUESTS */}
          <div className={styles.requestsSection}>
            <div className={styles.sectionHeader}>
                <div className={styles.sectionIconWrapper} style={{color: '#3b82f6', background: 'rgba(59, 130, 246, 0.15)'}}>
                    <Send size={20} />
                </div>
                <div>
                    <h2 className={styles.sectionTitle}>Outgoing Requests</h2>
                    <p className={styles.sectionSubtitle}>Invitations you have sent</p>
                </div>
            </div>

            {outgoingRequests.length > 0 ? (
              <div className={styles.requestsList}>
                <AnimatePresence>
                    {outgoingRequests.map(req => (
                    <motion.div 
                        key={req._id} 
                        className={styles.requestCard} 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <div className={styles.requestInfo}>
                        <UserAvatar user={req} getInitials={getInitials} />
                        <div className={styles.userDetails}>
                            <h3 className={styles.userName}>{req.fullName}</h3>
                            <p className={styles.userInstitution}>{req.department || 'Student'}</p>
                        </div>
                        </div>
                        <div className={styles.requestActions}>
                        <button className={styles.profileBtn} onClick={() => navigate(`/user-profile/${req._id}`)} title="View Profile">
                            <UserIcon size={16} />
                        </button>
                        <button 
                            className={styles.cancelBtn} 
                            onClick={() => cancelRequest(req._id)}
                            disabled={processingId === req._id}
                        >
                            {processingId === req._id ? <div className={styles.spinnerDark}></div> : <UserX size={16} />}
                            <span className={styles.btnText}>Cancel</span>
                        </button>
                        </div>
                    </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className={styles.emptyState}>
                  <Send size={48} className={styles.emptyIcon} />
                  <h3>No Outgoing Requests</h3>
                  <p>Start networking to find your ideal study buddy.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PendingConnections;
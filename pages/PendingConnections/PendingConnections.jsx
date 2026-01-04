import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './PendingConnections.module.css';

const PendingConnections = () => {
  const navigate = useNavigate();
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 FETCH REQUESTS
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        
        // Fetch Incoming
        const resIn = await fetch('http://localhost:5000/api/auth/requests/received', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const dataIn = await resIn.json();
        
        // Fetch Outgoing
        const resOut = await fetch('http://localhost:5000/api/auth/requests/sent', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const dataOut = await resOut.json();

        if (dataIn.success) setIncomingRequests(dataIn.requests);
        if (dataOut.success) setOutgoingRequests(dataOut.requests);

      } catch (err) {
        console.error("Failed to load requests", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'NA';

  // 🔹 ACCEPT REQUEST
  const acceptRequest = async (id) => {
    try {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/auth/requests/${id}/accept`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success) {
            setIncomingRequests(prev => prev.filter(req => req._id !== id));
            // Show alert and redirect logic
            if(window.confirm("Connected successfully! Go to messages?")) {
                navigate('/messages');
            }
        }
    } catch (err) {
        console.error("Accept failed", err);
    }
  };

  // 🔹 DECLINE REQUEST
  const declineRequest = async (id) => {
    if(!window.confirm("Decline this connection request?")) return;
    try {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/auth/requests/${id}/decline`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            setIncomingRequests(prev => prev.filter(req => req._id !== id));
        }
    } catch (err) { console.error(err); }
  };

  // 🔹 CANCEL OUTGOING
  const cancelRequest = async (id) => {
    if(!window.confirm("Cancel this request?")) return;
    try {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/auth/requests/${id}/decline`, { // Reusing decline logic as it removes from arrays
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            setOutgoingRequests(prev => prev.filter(req => req._id !== id));
        }
    } catch (err) { console.error(err); }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  if (loading) return <DashboardLayout title="Pending Connections"><div style={{padding:'20px'}}>Loading requests...</div></DashboardLayout>;

  return (
    <DashboardLayout title="Pending Connections">
      <motion.div className={styles.container} variants={containerVariants} initial="hidden" animate="visible">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Pending Connections</h1>
            <p className={styles.subtitle}>Manage your incoming and outgoing connection requests</p>
          </div>
          <div className={styles.headerActions}>
            <Link to="/study-matches" className={styles.findMatchesBtn}>Find Matches</Link>
          </div>
        </div>

        {/* Requests Grid */}
        <div className={styles.requestsGrid}>
          {/* Incoming */}
          <div className={styles.requestsSection}>
            <h2 className={styles.sectionTitle}>Incoming Requests</h2>
            {incomingRequests.length > 0 ? (
              <div className={styles.requestsList}>
                {incomingRequests.map(req => (
                  <motion.div key={req._id} className={styles.requestCard} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className={styles.requestInfo}>
                      <div className={styles.avatar}>
                        <img 
                            src={`http://localhost:5000/api/auth/student/${req._id}/picture`} 
                            onError={(e) => e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${req.fullName}`}
                            alt={req.fullName} 
                            style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}}
                        />
                      </div>
                      <div className={styles.userDetails}>
                        <h3 className={styles.userName}>{req.fullName}</h3>
                        <p className={styles.userInstitution}>{req.department}</p>
                      </div>
                    </div>
                    <div className={styles.requestActions}>
                      <button className={styles.profileBtn} onClick={() => navigate(`/user-profile/${req._id}`)}>View</button>
                      <button className={styles.acceptBtn} onClick={() => acceptRequest(req._id)}>Accept</button>
                      <button className={styles.declineBtn} onClick={() => declineRequest(req._id)}>Decline</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}><p>No incoming requests</p></div>
            )}
          </div>

          {/* Outgoing */}
          <div className={styles.requestsSection}>
            <h2 className={styles.sectionTitle}>Outgoing Requests</h2>
            {outgoingRequests.length > 0 ? (
              <div className={styles.requestsList}>
                {outgoingRequests.map(req => (
                  <motion.div key={req._id} className={styles.requestCard} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className={styles.requestInfo}>
                      <div className={styles.avatar}>{getInitials(req.fullName)}</div>
                      <div className={styles.userDetails}>
                        <h3 className={styles.userName}>{req.fullName}</h3>
                        <p className={styles.userInstitution}>{req.department}</p>
                      </div>
                    </div>
                    <div className={styles.requestActions}>
                      <button className={styles.cancelBtn} onClick={() => cancelRequest(req._id)}>Cancel</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}><p>No outgoing requests</p></div>
            )}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default PendingConnections;
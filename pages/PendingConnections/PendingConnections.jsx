import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './PendingConnections.module.css';

// Mock data
const mockIncomingRequests = [
  {
    id: '1',
    name: 'Vikram Singh',
    institution: 'University Student',
    sentDate: '01/02/2026',
  },
];

const mockOutgoingRequests = [
  {
    id: '1',
    name: 'Garima Yadav',
    institution: 'University Student',
    sentDate: '12/10/2025',
  },
  {
    id: '2',
    name: 'Rahul Mehra',
    institution: 'Engineering College',
    sentDate: '12/08/2025',
  },
];

const PendingConnections = () => {
  const navigate = useNavigate();
  const [incomingRequests, setIncomingRequests] = useState(mockIncomingRequests);
  const [outgoingRequests, setOutgoingRequests] = useState(mockOutgoingRequests);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const acceptRequest = (id) => {
    setIncomingRequests(prev => prev.filter(req => req.id !== id));
  };

  const declineRequest = (id) => {
    setIncomingRequests(prev => prev.filter(req => req.id !== id));
  };

  const cancelRequest = (id) => {
    setOutgoingRequests(prev => prev.filter(req => req.id !== id));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  return (
    <DashboardLayout title="Pending Connections">
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Pending Connections</h1>
            <p className={styles.subtitle}>Manage your incoming and outgoing connection requests</p>
          </div>
          <div className={styles.headerActions}>
            <Link to="/study-matches" className={styles.findMatchesBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              Find Matches
            </Link>
            <Link to="/connections" className={styles.connectionsBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Connections
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.incomingIcon}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="7,10 12,15 17,10" />
                <line x1="12" y1="15" x2="12" y2="3" />
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              </svg>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Incoming</span>
              <span className={styles.statValue}>{incomingRequests.length}</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.outgoingIcon}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Outgoing</span>
              <span className={styles.statValue}>{outgoingRequests.length}</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.limitsInfo}>
              <span className={styles.limitsTitle}>Acceptance Limits</span>
              <div className={styles.limitRow}>
                <span>Hourly:</span>
                <span className={styles.limitValue}>10/10</span>
              </div>
              <div className={styles.limitRow}>
                <span>Daily:</span>
                <span className={styles.limitValue}>30/30</span>
              </div>
            </div>
          </div>
        </div>

        {/* Requests Grid */}
        <div className={styles.requestsGrid}>
          {/* Incoming Requests */}
          <div className={styles.requestsSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Incoming Requests</h2>
              <p className={styles.sectionSubtitle}>Students who want to connect with you</p>
            </div>

            {incomingRequests.length > 0 ? (
              <div className={styles.requestsList}>
                {incomingRequests.map(req => (
                  <motion.div
                    key={req.id}
                    className={styles.requestCard}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className={styles.requestInfo}>
                      <div className={styles.avatar}>
                        {getInitials(req.name)}
                      </div>
                      <div className={styles.userDetails}>
                        <h3 className={styles.userName}>{req.name}</h3>
                        <p className={styles.userInstitution}>{req.institution}</p>
                        <p className={styles.requestDate}>Received {req.sentDate}</p>
                      </div>
                    </div>
                    <div className={styles.requestActions}>
                      <button
                        className={styles.profileBtn}
                        onClick={() => navigate(`/user-profile/${req.id}`)}
                        title="View profile"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </button>
                      <button
                        className={styles.acceptBtn}
                        onClick={() => acceptRequest(req.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20,6 9,17 4,12" />
                        </svg>
                        Accept
                      </button>
                      <button
                        className={styles.declineBtn}
                        onClick={() => declineRequest(req.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        Decline
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                  </svg>
                </div>
                <h3>No pending requests</h3>
                <p>When students send you connection requests, they'll appear here</p>
                <Link to="/study-matches" className={styles.findPartnersBtn}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                  Find Study Partners
                </Link>
              </div>
            )}
          </div>

          {/* Outgoing Requests */}
          <div className={styles.requestsSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Outgoing Requests</h2>
              <p className={styles.sectionSubtitle}>Students you've sent connection requests to</p>
            </div>

            {outgoingRequests.length > 0 ? (
              <div className={styles.requestsList}>
                {outgoingRequests.map(req => (
                  <motion.div
                    key={req.id}
                    className={styles.requestCard}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className={styles.requestInfo}>
                      <div className={styles.avatar}>
                        {getInitials(req.name)}
                      </div>
                      <div className={styles.userDetails}>
                        <h3 className={styles.userName}>{req.name}</h3>
                        <p className={styles.userInstitution}>{req.institution}</p>
                        <p className={styles.requestDate}>Sent {req.sentDate}</p>
                      </div>
                    </div>
                    <div className={styles.requestActions}>
                      <button
                        className={styles.profileBtn}
                        onClick={() => navigate(`/user-profile/${req.id}`)}
                        title="View profile"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </button>
                      <button
                        className={styles.cancelBtn}
                        onClick={() => cancelRequest(req.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3>No outgoing requests</h3>
                <p>Find study partners and send them connection requests</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default PendingConnections;

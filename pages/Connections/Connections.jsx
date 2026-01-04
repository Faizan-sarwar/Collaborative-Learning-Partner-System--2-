import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './Connections.module.css';

const Connections = () => {
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // 🔹 FETCH REAL CONNECTIONS
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/auth/connections', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success) {
          // Add an 'isFavorite' property locally for UI interaction if backend doesn't have it
          const formatted = data.connections.map(c => ({ ...c, isFavorite: false }));
          setConnections(formatted);
        }
      } catch (err) {
        console.error("Failed to load connections", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'NA';
  };

  // 🔹 REMOVE CONNECTION
  const removeConnection = async (id) => {
    if (!window.confirm("Are you sure you want to remove this connection?")) return;

    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/auth/connections/${id}/remove`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setConnections(prev => prev.filter(conn => conn._id !== id));
      }
    } catch (err) {
      console.error("Failed to remove connection", err);
    }
  };

  const toggleFavorite = (id) => {
    setConnections(prev =>
      prev.map(conn =>
        conn._id === id ? { ...conn, isFavorite: !conn.isFavorite } : conn
      )
    );
  };

  // Filter Logic
  const filteredConnections = connections.filter(conn =>
    conn.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (conn.department && conn.department.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalConnections = connections.length;
  const totalFavorites = connections.filter(c => c.isFavorite).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  if (loading) return <DashboardLayout title="Your Connections"><div style={{padding:'20px'}}>Loading connections...</div></DashboardLayout>;

  return (
    <DashboardLayout title="Your Connections">
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Your Connections</h1>
            <p className={styles.subtitle}>Message, plan study sessions, and manage your network</p>
          </div>
          <div className={styles.headerActions}>
            <Link to="/pending-connections" className={styles.pendingBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
              Pending
            </Link>
            <Link to="/study-matches" className={styles.findMatchesBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              Find Matches
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.connectionsIcon}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Total Connections</span>
              <span className={styles.statValue}>{totalConnections}</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.favoritesIcon}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Favorites</span>
              <span className={styles.statValue}>{totalFavorites}</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className={styles.searchContainer}>
          <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search connections by name or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Connections List */}
        <div className={styles.connectionsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>All Connections</h2>
            <p className={styles.sectionSubtitle}>Your study partners and collaborators</p>
          </div>

          {filteredConnections.length > 0 ? (
            <div className={styles.connectionsGrid}>
              {filteredConnections.map(conn => (
                <motion.div
                  key={conn._id}
                  className={styles.connectionCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.avatar}>
                        <img 
                            src={`http://localhost:5000/api/auth/student/${conn._id}/picture`} 
                            onError={(e) => e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${conn.fullName}`}
                            alt={conn.fullName} 
                            style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}}
                        />
                    </div>
                    <div className={styles.userInfo}>
                      <h3 className={styles.userName}>{conn.fullName}</h3>
                      <p className={styles.userDetails}>{conn.department}</p>
                    </div>
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      className={styles.profileBtn}
                      onClick={() => navigate(`/user-profile/${conn._id}`)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Profile
                    </button>
                    <button
                      className={styles.messageBtn}
                      onClick={() => navigate('/messages')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      Message
                    </button>
                  </div>
                  <div className={styles.cardFooter}>
                    <button
                      className={`${styles.favoriteBtn} ${conn.isFavorite ? styles.favorited : ''}`}
                      onClick={() => toggleFavorite(conn._id)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={conn.isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      Favorite
                    </button>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeConnection(conn._id)}
                      title="Remove connection"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <line x1="18" y1="11" x2="23" y2="11" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3>No connections found</h3>
              <p>Start by finding study partners who match your interests</p>
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
      </motion.div>
    </DashboardLayout>
  );
};

export default Connections;
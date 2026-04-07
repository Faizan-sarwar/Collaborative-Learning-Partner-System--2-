import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './StudyMatches.module.css';

// 🟢 AVATAR COMPONENT: Secure Profile Picture with Initial Fallback
const UserAvatar = ({ user, getInitials }) => {
  const [imgError, setImgError] = useState(false);
  const uId = user._id || user.id;

  if (!imgError && uId) {
    return (
      <div className={styles.avatar} style={{ padding: 0, overflow: 'hidden', border: '2px solid var(--border-color)' }}>
        <img
          src={`http://localhost:5000/api/auth/student/${uId}/picture`}
          alt={user.fullName}
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    );
  }
  return <div className={styles.avatar}>{getInitials(user.fullName)}</div>;
};

const StudyMatches = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('match'); // Default to Smart Match
  const [currentUser, setCurrentUser] = useState(null);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        if (!storedUser || !token) {
          navigate('/login');
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);

        const userId = parsedUser._id || parsedUser.id;
        const response = await fetch(`http://localhost:5000/api/auth/matches/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (data.success) {
          setUsers(data.matches);
        }
      } catch (error) {
        console.error("Error loading matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // CONNECT LOGIC
  const handleConnect = async (targetUser) => {
    const targetId = targetUser._id || targetUser.id;
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      setUsers(prevUsers => prevUsers.map(user => {
        const uId = user._id || user.id;
        return uId === targetId ? { ...user, connectionStatus: 'pending' } : user;
      }));

      const res = await fetch(`http://localhost:5000/api/auth/connect/${targetId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      if (!data.success) {
        setUsers(prevUsers => prevUsers.map(user => {
          const uId = user._id || user.id;
          return uId === targetId ? { ...user, connectionStatus: 'none' } : user;
        }));
      }
    } catch (err) {
      console.error("Connection error:", err);
    }
  };

  const handleCancelRequest = (targetUser) => {
    const targetId = targetUser._id || targetUser.id;
    setUsers(prevUsers => prevUsers.map(user => {
      const uId = user._id || user.id;
      return uId === targetId ? { ...user, connectionStatus: 'none' } : user;
    }));
  };

  const handleViewProfile = (targetUser) => {
    const targetId = targetUser._id || targetUser.id;
    if (targetId) navigate(`/user-profile/${targetId}`);
  };

  // 🟢 RELIABILITY HELPERS
  const getReliabilityColor = (score) => {
    if (score >= 90) return '#059669'; // Elite Scholar
    if (score >= 75) return '#3b82f6'; // Trusted Partner
    if (score >= 60) return '#f59e0b'; // Average
    return '#ef4444'; // Needs Improvement
  };

  const getReliabilityLabel = (score) => {
    if (score >= 90) return 'Elite Scholar';
    if (score >= 75) return 'Trusted Partner';
    if (score >= 60) return 'Average';
    return 'Needs Improvement';
  };

  const calculateLevel = (hours) => {
    const h = Number(hours) || 0;
    if (h >= 20) return 3;
    if (h >= 10) return 2;
    return 1;
  };

  // FILTERS & SORTING
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (user.fullName || '').toLowerCase().includes(query) ||
      (user.department || '').toLowerCase().includes(query);

    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'same-semester') return matchesSearch && String(user.semester) === String(currentUser?.semester);
    if (activeFilter === 'mentoring') return matchesSearch && (user.studyStyle === 'One-on-One Mentoring');
    return matchesSearch;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === 'match') return (b.matchScore || 0) - (a.matchScore || 0);
    if (sortBy === 'name') return a.fullName.localeCompare(b.fullName);
    if (sortBy === 'reliability') return (b.reliability || 0) - (a.reliability || 0);
    return 0;
  });

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'ST';
  const getPlanBadge = (plan) => plan === 'pro' ? { label: 'PRO', className: styles.proBadge } : { label: 'FREE', className: styles.freeBadge };

  const getConnectionButton = (user) => {
    switch (user.connectionStatus) {
      case 'connected':
        return <button className={styles.connectedBtn} disabled>Connected</button>;
      case 'pending':
        return <button className={styles.pendingBtn} onClick={() => handleCancelRequest(user)}>Cancel</button>;
      case 'received':
        return <button className={styles.pendingBtn} onClick={() => navigate('/pending-connections')}>Respond</button>;
      default:
        return (
          <button className={styles.connectBtn} onClick={() => handleConnect(user)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
            Connect
          </button>
        );
    }
  };

  return (
    <DashboardLayout title="Study Matches">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Smart Recommendations</h1>
            <p className={styles.subtitle}>
              Best partners for: {currentUser?.subjectsOfDifficulty?.length > 0 ? currentUser.subjectsOfDifficulty.join(', ') : 'Collaboration'}
            </p>
          </div>
          <Link to='/Connections' className={styles.myConnectionsBtn}>My Connections</Link>
        </div>

        <div className={styles.searchSection}>
          <div className={styles.searchBar}>
            <input type="text" placeholder="Search students..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={styles.searchInput} />
            <div className={styles.searchActions}>
              <select className={styles.sortSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="match">Sort by Match Score</option>
                <option value="name">Sort by Name</option>
                <option value="reliability">Sort by Reliability</option>
              </select>
            </div>
          </div>
          <div className={styles.filters}>
            {['all', 'same-semester', 'mentoring'].map(f => (
              <button key={f} className={`${styles.filterBtn} ${activeFilter === f ? styles.active : ''}`} onClick={() => setActiveFilter(f)}>
                {f.replace('-', ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {loading ? <div className={styles.loading}>Loading recommendations...</div> : (
          <div className={styles.usersGrid}>
            {sortedUsers.map((user, index) => {
              const isBestMatch = index === 0 && sortBy === 'match';
              
              return (
                <motion.div
                  key={user.id}
                  className={`${styles.userCard} ${isBestMatch ? styles.bestMatchCard : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {/* 🏆 RANKING RIBBON */}
                  <div className={`${styles.rankRibbon} ${isBestMatch ? styles.goldRibbon : ''}`}>
                    {index === 0 ? '🏆 Best Match' : `#${index + 1} Ranked`}
                  </div>

                  <div className={styles.cardHeader}>
                    <div className={styles.avatarSection}>
                      <UserAvatar user={user} getInitials={getInitials} />
                      <span className={getPlanBadge(user.plan).className}>{getPlanBadge(user.plan).label}</span>
                      {isBestMatch && <span className={styles.matchAccuracy}>99% Match</span>}
                    </div>
                    <div className={styles.userInfo}>
                      <h3 className={styles.userName}>{user.fullName}</h3>
                      <span className={styles.userRoll}>{user.rollNumber}</span>
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.reliabilitySection}>
                      <div className={styles.reliabilityHeader}>
                        <span className={styles.reliabilityLabel}>
                          Reliability 
                          <span className={styles.tierLabel} style={{ color: getReliabilityColor(user.reliability) }}>
                             ({getReliabilityLabel(user.reliability)})
                          </span>
                        </span>
                        <span className={styles.reliabilityValue} style={{ color: getReliabilityColor(user.reliability) }}>
                          {user.reliability}%
                        </span>
                      </div>
                      <div className={styles.reliabilityBar}>
                        <div className={styles.reliabilityFill} style={{ width: `${user.reliability}%`, background: getReliabilityColor(user.reliability) }}></div>
                      </div>
                    </div>

                    <div className={styles.matchReason}>
                      <p className={styles.expertInLabel}>Expert Strength:</p>
                      <div className={styles.tags}>
                        {user.academicStrengths?.slice(0, 2).map((s, i) => (
                           <span key={i} className={styles.expertTag}>{s}</span>
                        ))}
                      </div>
                    </div>

                    <div className={styles.statsRow}>
                      <div className={styles.stat}>
                        <span className={styles.statValue}>{calculateLevel(user.studyHours)}</span>
                        <span className={styles.statLabel}>Level</span>
                      </div>
                      <div className={styles.stat}>
                        <span className={styles.statValue}>{user.studyHours || 0}h</span>
                        <span className={styles.statLabel}>EXP</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <button className={styles.viewProfileBtn} onClick={() => handleViewProfile(user)}>Profile</button>
                    {getConnectionButton(user)}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudyMatches;
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './StudyMatches.module.css';

const StudyMatches = () => {
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [currentUser, setCurrentUser] = useState(null);

  // 🔹 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = sessionStorage.getItem('user') || localStorage.getItem('user');
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');

        if (!storedUser || !token) {
          navigate('/login');
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);

        // Fetch using parsed ID
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

  // 🔹 CONNECT LOGIC (Fixed ID usage)
  const handleConnect = async (targetUser) => {
    const targetId = targetUser._id || targetUser.id;
    console.log("Connecting to:", targetId);

    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      
      // Optimistic Update
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
        // Revert on failure
        setUsers(prevUsers => prevUsers.map(user => {
            const uId = user._id || user.id;
            return uId === targetId ? { ...user, connectionStatus: 'none' } : user;
        }));
      }
    } catch (err) {
      console.error("Connection error:", err);
    }
  };

  // 🔹 CANCEL LOGIC
  const handleCancelRequest = (targetUser) => {
    const targetId = targetUser._id || targetUser.id;
    setUsers(prevUsers => prevUsers.map(user => {
      const uId = user._id || user.id;
      return uId === targetId ? { ...user, connectionStatus: 'none' } : user;
    }));
  };

  // 🔹 PROFILE NAVIGATION
  const handleViewProfile = (targetUser) => {
    const targetId = targetUser._id || targetUser.id;
    if (targetId) {
      navigate(`/user-profile/${targetId}`);
    } else {
      console.error("Invalid User ID, cannot navigate");
    }
  };

  // 🔹 FILTERS
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      (user.fullName || '').toLowerCase().includes(query) ||
      (user.email || '').toLowerCase().includes(query) ||
      (user.department || '').toLowerCase().includes(query);
    
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'same-semester') return matchesSearch && String(user.semester) === String(currentUser?.semester);
    if (activeFilter === 'group-study') return matchesSearch && (user.studyStyle === 'Group Collaboration');
    if (activeFilter === 'mentoring') return matchesSearch && (user.studyStyle === 'One-on-One Mentoring');
    
    return matchesSearch;
  });

  // 🔹 SORTING
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === 'name') return a.fullName.localeCompare(b.fullName);
    if (sortBy === 'level') return b.level - a.level;
    if (sortBy === 'hours') return b.studyHours - a.studyHours;
    return 0;
  });

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'ST';
  const getPlanBadge = (plan) => plan === 'pro' ? { label: 'PRO', className: styles.proBadge } : { label: 'FREE', className: styles.freeBadge };

  // 🔹 BUTTON RENDERER
  const getConnectionButton = (user) => {
    switch(user.connectionStatus) {
      case 'connected':
        return (
          <button className={styles.connectedBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20,6 9,17 4,12"></polyline></svg>
            Connected
          </button>
        );
      case 'pending':
        return (
          <button className={styles.pendingBtn} onClick={() => handleCancelRequest(user)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            Cancel
          </button>
        );
      default:
        return (
          <button className={styles.connectBtn} onClick={() => handleConnect(user)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
            Connect
          </button>
        );
    }
  };

  const filters = [
    { id: 'all', label: 'All Students' },
    { id: 'same-semester', label: 'Same Semester' },
    { id: 'group-study', label: 'Group Study' },
    { id: 'mentoring', label: 'Mentoring' }
  ];

  return (
    <DashboardLayout title="Study Matches">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Study Matches</h1>
            <p className={styles.subtitle}>Find your perfect study partner</p>
          </div>
          <Link to='/Connections' className={styles.myConnectionsBtn}>My Connections</Link>
        </div>

        <div className={styles.searchSection}>
          <div className={styles.searchBar}>
            <input type="text" placeholder="Search students..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={styles.searchInput} />
            <div className={styles.searchActions}>
              <select className={styles.sortSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="name">Sort by Name</option>
                <option value="level">Sort by Level</option>
                <option value="hours">Sort by Hours</option>
              </select>
            </div>
          </div>
          <div className={styles.filters}>
            {filters.map(filter => (
              <button key={filter.id} className={`${styles.filterBtn} ${activeFilter === filter.id ? styles.active : ''}`} onClick={() => setActiveFilter(filter.id)}>
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.resultsInfo}>
          <span className={styles.resultsCount}>{loading ? 'Loading...' : `${sortedUsers.length} students found`}</span>
        </div>

        {loading ? <div>Loading...</div> : (
            <div className={styles.usersGrid}>
            {sortedUsers.map(user => (
                <motion.div 
                    key={user._id || user.id} 
                    className={styles.userCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                <div className={styles.cardHeader}>
                    <div className={styles.avatarSection}>
                        <div className={styles.avatar}>{getInitials(user.fullName)}</div>
                        <span className={getPlanBadge(user.plan).className}>{getPlanBadge(user.plan).label}</span>
                    </div>
                    <div className={styles.userInfo}>
                        <h3 className={styles.userName}>{user.fullName}</h3>
                        <span className={styles.userRoll}>{user.rollNumber}</span>
                    </div>
                </div>

                <div className={styles.cardBody}>
                    {/* ✅ RELIABILITY BAR */}
                    <div className={styles.reliabilitySection}>
                      <div className={styles.reliabilityHeader}>
                        <span className={styles.reliabilityLabel}>Reliability</span>
                        <span className={styles.reliabilityValue}>{user.reliability || 85}%</span>
                      </div>
                      <div className={styles.reliabilityBar}>
                        <div className={styles.reliabilityFill} style={{ 
                            width: `${user.reliability || 85}%`,
                            background: (user.reliability || 85) >= 90 ? '#10b981' : (user.reliability || 85) >= 70 ? '#f59e0b' : '#ef4444'
                        }}></div>
                      </div>
                    </div>

                    <div className={styles.infoRow}><span>📚 {user.department}</span></div>
                    <div className={styles.infoRow}><span>🎓 Semester {user.semester}</span></div>
                    <div className={styles.infoRow}><span>💡 {user.studyStyle}</span></div>

                    <div className={styles.statsRow}>
                        <div className={styles.stat}><span className={styles.statValue}>{user.level}</span><span className={styles.statLabel}>Level</span></div>
                        <div className={styles.stat}><span className={styles.statValue}>{user.xp}</span><span className={styles.statLabel}>XP</span></div>
                        <div className={styles.stat}><span className={styles.statValue}>{user.studyHours}h</span><span className={styles.statLabel}>Hours</span></div>
                    </div>

                    <div className={styles.strengthsSection}>
                        <span className={styles.strengthsLabel}>Strengths:</span>
                        <div className={styles.tags}>
                            {user.academicStrengths?.slice(0, 2).map((s, i) => <span key={i} className={styles.strengthTag}>{s}</span>)}
                            {(user.academicStrengths?.length || 0) > 2 && <span className={styles.moreTag}>+{user.academicStrengths.length - 2}</span>}
                        </div>
                    </div>
                </div>

                <div className={styles.cardFooter}>
                    <button className={styles.viewProfileBtn} onClick={() => handleViewProfile(user)}>Profile</button>
                    {getConnectionButton(user)}
                </div>
                </motion.div>
            ))}
            </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudyMatches;  
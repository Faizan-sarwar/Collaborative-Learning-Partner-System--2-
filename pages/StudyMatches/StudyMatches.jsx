import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Check, Clock, UserPlus, Shield, X, Info } from 'lucide-react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './StudyMatches.module.css';

// 🟢 FIX: Completed the avatar dictionary so it doesn't crash on high-level users
const avatars = {
  male: {
    1: '/gamification/male-level-1.png',
    2: '/gamification/male-level-2.png',
    3: '/gamification/male-level-3.png',
    4: '/gamification/male-level-4.png',
    5: '/gamification/male-level-5.png',
    6: '/gamification/male-level-6.png',
    7: '/gamification/male-level-7.png'
  },
  female: {
    1: '/gamification/female-level-1.png',
    2: '/gamification/female-level-2.png',
    3: '/gamification/female-level-3.png',
    4: '/gamification/female-level-4.png',
    5: '/gamification/female-level-5.png',
    6: '/gamification/female-level-6.png',
    7: '/gamification/female-level-7.png'
  }
};

const UserAvatar = ({ user, getInitials }) => {
  const [imgError, setImgError] = useState(false);
  const uId = user._id || user.id;
  const showAvatar = user.settings?.showAvatar !== false;

  if (showAvatar) {
    const gender = user.gender?.toLowerCase() === 'female' ? 'female' : 'male';
    const level = Math.min(Math.max(parseInt(user.level) || 1, 1), 7);
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
        <img src={`http://${window.location.hostname}:5000/api/auth/student/${uId}/picture`} alt={user.fullName} onError={() => setImgError(true)} className={styles.avatarImg} />
      </div>
    );
  }
  return <div className={styles.avatarFallback}>{getInitials(user.fullName)}</div>;
};

const StudyMatches = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('match');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        if (!token) return navigate('/login');

        const userId = storedUser._id || storedUser.id;
        if (!userId) {
          localStorage.clear();
          return navigate('/login');
        }

        setCurrentUser(storedUser);

        const response = await fetch(`http://${window.location.hostname}:5000/api/auth/matches/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
          signal: abortController.signal
        });

        const data = await response.json();

        if (data.success) {
          setUsers(data.matches);
        } else {
          console.error("Backend Error:", data.message);
        }
      } catch (error) {
        if (error.name === 'AbortError') return; // Ignore expected abort errors
        console.error("Error loading matches:", error);
      } finally {
        // ⚡ FIX: Only turn off the "Analyzing network..." spinner if this SPECIFIC request actually finished!
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => abortController.abort();
  }, [navigate]);

  const handleConnect = async (targetUser) => {
    const targetId = targetUser._id || targetUser.id;
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      setUsers(prev => prev.map(u => (u._id || u.id) === targetId ? { ...u, connectionStatus: 'pending' } : u));
      const res = await fetch(`http://${window.location.hostname}:5000/api/auth/connect/${targetId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (!data.success) setUsers(prev => prev.map(u => (u._id || u.id) === targetId ? { ...u, connectionStatus: 'none' } : u));
    } catch (err) { }
  };

  const handleCancelRequest = (targetUser) => {
    const targetId = targetUser._id || targetUser.id;
    setUsers(prev => prev.map(u => (u._id || u.id) === targetId ? { ...u, connectionStatus: 'none' } : u));
  };

  const getReliabilityData = (score) => {
    if (score >= 90) return { color: '#10b981', label: 'Elite Scholar' };
    if (score >= 75) return { color: '#3b82f6', label: 'Trusted Partner' };
    if (score >= 60) return { color: '#f59e0b', label: 'Average' };
    return { color: '#ef4444', label: 'Needs Improvement' };
  };

  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (user.fullName || '').toLowerCase().includes(query) || (user.department || '').toLowerCase().includes(query);
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'same-semester') return matchesSearch && String(user.semester) === String(currentUser?.semester);
    if (activeFilter === 'group-study') return matchesSearch && (user.studyStyle === 'Group Collaboration');
    return matchesSearch;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === 'match') return (b.matchScore || 0) - (a.matchScore || 0);
    if (sortBy === 'name') return a.fullName.localeCompare(b.fullName);
    if (sortBy === 'level') return (b.level || 1) - (a.level || 1);
    if (sortBy === 'hours') return (b.studyHours || 0) - (a.studyHours || 0);
    return 0;
  });

  const getInitials = (n) => n ? n.split(' ').map(x => x[0]).join('').toUpperCase().substring(0, 2) : 'ST';
  const getPlanBadge = (plan) => plan === 'pro' ? { label: 'PRO', className: styles.proBadge } : { label: 'FREE', className: styles.freeBadge };

  const getConnectionButton = (user) => {
    switch (user.connectionStatus) {
      case 'connected': return <button className={styles.connectedBtn} disabled><Check size={16} /> Connected</button>;
      case 'pending': return <button className={styles.pendingBtn} onClick={() => handleCancelRequest(user)}><X size={16} /> Cancel</button>;
      case 'received': return <button className={styles.receivedBtn} disabled><Clock size={16} /> Received</button>;
      default: return <button className={styles.connectBtn} onClick={() => handleConnect(user)}><UserPlus size={16} /> Connect</button>;
    }
  };

  const hasExpertMatches = sortedUsers.some(u => u.isExpertMatch);

  return (
    <DashboardLayout title="Study Matches">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Smart Recommendations</h1>
            <p className={styles.subtitle}>
              Finding experts for: <strong style={{ color: 'var(--text-primary)' }}>{currentUser?.subjectsOfDifficulty?.join(', ') || 'your weak subjects'}</strong>
            </p>
          </div>
          <Link to='/Connections' className={styles.myConnectionsBtn}>My Connections</Link>
        </div>

        <div className={styles.searchSection}>
          <div className={styles.searchBarWrapper}>
            <Search className={styles.searchIcon} size={18} />
            <input type="text" placeholder="Search students..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={styles.searchInput} />
            <div className={styles.searchActions}>
              <SlidersHorizontal size={16} className={styles.filterIcon} />
              <select className={styles.sortSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="match">Sort by Best Match</option>
                <option value="level">Sort by Highest Level</option>
                <option value="hours">Sort by Most Hours</option>
                <option value="name">Sort Alphabetically</option>
              </select>
            </div>
          </div>
        </div>

        {!loading && !hasExpertMatches && sortBy === 'match' && (
          <motion.div className={styles.noExactMatchBanner} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Info size={18} />
            <span>No exact matches found for your struggling subjects right now. Here are some highly reliable community members instead!</span>
          </motion.div>
        )}

        <div className={styles.resultsInfo}>
          <span className={styles.resultsCount}>{loading ? 'Analyzing network...' : `${sortedUsers.length} potential partners found`}</span>
        </div>

        {loading ? <div className={styles.loadingState}><p>Finding partners...</p></div> : (
          <div className={styles.usersGrid}>
            <AnimatePresence>
              {sortedUsers.map((user, index) => {
                const rank = index + 1;
                const isTopThree = sortBy === 'match' && rank <= 3 && user.isExpertMatch;
                const isFirst = rank === 1 && isTopThree;

                let ribbonClass = '';
                let ribbonText = '';
                if (isTopThree) {
                  if (rank === 1) { ribbonClass = styles.goldRibbon; ribbonText = '🏆 Best Match'; }
                  else if (rank === 2) { ribbonClass = styles.silverRibbon; ribbonText = '🥈 2nd Match'; }
                  else if (rank === 3) { ribbonClass = styles.bronzeRibbon; ribbonText = '🥉 3rd Match'; }
                }

                const reliability = getReliabilityData(user.reliability || 0);

                return (
                  <motion.div key={user.id || user._id} className={`${styles.userCard} ${isFirst ? styles.bestMatchCard : ''}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
                    {isTopThree && <div className={`${styles.rankRibbon} ${ribbonClass}`}>{ribbonText}</div>}

                    <div className={styles.cardHeader}>
                      <UserAvatar user={user} getInitials={getInitials} />
                      <div className={styles.userInfo}>
                        <h3 className={styles.userName}>
                          {user.fullName}
                          <span className={getPlanBadge(user.plan).className}>{getPlanBadge(user.plan).label}</span>
                        </h3>
                        <span className={styles.userRoll}>{user.rollNumber}</span>
                        {user.isExpertMatch && <span className={styles.matchAccuracy}>{user.matchAccuracy}% Match</span>}
                      </div>
                    </div>

                    <div className={styles.cardBody}>
                      <div className={styles.reliabilitySection}>
                        <div className={styles.reliabilityHeader}>
                          <span className={styles.reliabilityLabel}><Shield size={14} style={{ marginRight: '4px' }} /> Reliability</span>
                          <span className={styles.reliabilityValue} style={{ color: reliability.color }}>{user.reliability || 0}%</span>
                        </div>
                        <div className={styles.reliabilityBar}>
                          <div className={styles.reliabilityFill} style={{ width: `${user.reliability || 0}%`, background: reliability.color }}></div>
                        </div>
                      </div>

                      <div className={user.isExpertMatch ? styles.matchReason : styles.standardStrengths}>
                        <p className={user.isExpertMatch ? styles.expertInLabel : styles.standardLabel}>
                          {user.isExpertMatch ? 'Matches Your Needs:' : 'General Strengths:'}
                        </p>
                        <div className={styles.tags}>
                          {user.academicStrengths?.slice(0, 3).map((s, i) => {
                            const isExactMatch = user.matchedSubjects?.includes(s);
                            return <span key={i} className={isExactMatch ? styles.expertTag : styles.strengthTag}>{s}</span>
                          })}
                        </div>
                      </div>

                      <div className={styles.statsRow}>
                        <div className={styles.stat}>
                          <span className={styles.statValue}>{user.level || 1}</span>
                          <span className={styles.statLabel}>Level</span>
                        </div>
                        <div className={styles.stat}>
                          <span className={styles.statValue}>{user.xp || 0}</span>
                          <span className={styles.statLabel}>XP</span>
                        </div>
                        <div className={styles.stat}>
                          <span className={styles.statValue}>{Number(user.studyHours || 0).toFixed(1)}h</span>
                          <span className={styles.statLabel}>Hours</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.cardFooter}>
                      <button className={styles.viewProfileBtn} onClick={() => navigate(`/user-profile/${user.id || user._id}`)}>Profile</button>
                      {getConnectionButton(user)}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudyMatches;
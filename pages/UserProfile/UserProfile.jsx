import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './UserProfile.module.css';

const UserProfile = () => {
  // 🔹 FIX: Ensure parameter matches route definition in App.jsx
  const { userId } = useParams(); 
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [imgError, setImgError] = useState(false);

  // 🔹 1. FETCH PROFILE DATA
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        // Use the ID from the URL
        const res = await fetch(`http://localhost:5000/api/auth/public-profile/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();

        if (data.success) {
          setUser(data.user);
        } else {
          setError(data.message);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchProfile();
  }, [userId, navigate]);

  // 🔹 2. HANDLE CONNECT
  const handleConnect = async () => {
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      
      // Optimistic Update (Immediate UI Feedback)
      setUser(prev => ({ ...prev, connectionStatus: 'pending' }));

      const res = await fetch(`http://localhost:5000/api/auth/connect/${user._id || user.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.message);
        // Revert if failed
        setUser(prev => ({ ...prev, connectionStatus: 'none' }));
      }
    } catch (err) {
      console.error(err);
      alert("Connection failed");
      setUser(prev => ({ ...prev, connectionStatus: 'none' }));
    }
  };

  // 🔹 3. HANDLE CANCEL
  const handleCancelRequest = () => {
    // For now, just UI update. You can add a cancel endpoint later.
    setUser(prev => ({ ...prev, connectionStatus: 'none' }));
  };

  // Helpers
  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'NA';
  const maskEmail = (email) => {
    if (!email) return 'Hidden';
    const [username, domain] = email.split('@');
    return username.substring(0, 2) + '***@' + domain;
  };

  const renderAvatar = () => {
    if (user && (user._id || user.id) && !imgError) {
      return (
        <img 
          src={`http://localhost:5000/api/auth/student/${user._id || user.id}/picture`}
          alt={user.fullName}
          className={styles.avatarImg}
          onError={() => setImgError(true)}
        />
      );
    }
    return <div className={styles.avatar}>{getInitials(user.fullName)}</div>;
  };

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'academic', label: 'Academic' },
    { id: 'skills', label: 'Skills' },
    { id: 'schedule', label: 'Schedule' }
  ];

  const getConnectionButton = () => {
    switch(user?.connectionStatus) {
      case 'connected':
        return (
          <button className={styles.connectedBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20,6 9,17 4,12"></polyline></svg>
            Connected
          </button>
        );
      case 'pending':
        return (
          <button className={styles.cancelBtn} onClick={handleCancelRequest}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            Cancel Request
          </button>
        );
      default:
        return (
          <button className={styles.connectBtn} onClick={handleConnect}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
            Send Request
          </button>
        );
    }
  };

  if (loading) return <DashboardLayout><div className={styles.container}>Loading profile...</div></DashboardLayout>;
  if (error || !user) return <DashboardLayout><div className={styles.container}><h3>{error || "User not found"}</h3></div></DashboardLayout>;

  return (
    <DashboardLayout title="User Profile">
      <div className={styles.container}>
        <div className={styles.backHeader}>
          <button className={styles.backBtn} onClick={() => navigate('/study-matches')}>
            ← Back
          </button>
          <h1 className={styles.pageTitle}>{user.fullName}'s Profile</h1>
        </div>

        <div className={styles.profileLayout}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            <div className={styles.profileCard}>
              <div className={styles.profileHeader}>
                {renderAvatar()}
                <h2 className={styles.userName}>{user.fullName}</h2>
                <p className={styles.userHandle}>@{user.rollNumber || 'student'}</p>
                {getConnectionButton()}
              </div>

              <div className={styles.tabsList}>
                {tabs.map(tab => (
                  <button key={tab.id} className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`} onClick={() => setActiveTab(tab.id)}>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className={styles.quickContact}>
                <h4>Contact</h4>
                <div className={styles.contactItem}>
                  <span>📧 {maskEmail(user.email)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            <div className={styles.contentCard}>
              {activeTab === 'about' && (
                <div className={styles.infoGrid}>
                    <div className={styles.infoSection}>
                        <h4>Personal Details</h4>
                        <div className={styles.infoList}>
                            <div className={styles.infoItem}>
                                <div><span className={styles.infoLabel}>Full Name</span><span className={styles.infoValue}>{user.fullName}</span></div>
                            </div>
                            <div className={styles.infoItem}>
                                <div><span className={styles.infoLabel}>Roll Number</span><span className={styles.infoValue}>{user.rollNumber}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
              )}
              
              {activeTab === 'academic' && (
                  <div className={styles.academicGrid}>
                      <div className={styles.academicCard}>
                          <span className={styles.academicLabel}>Department</span>
                          <span className={styles.academicValue}>{user.department}</span>
                      </div>
                      <div className={styles.academicCard}>
                          <span className={styles.academicLabel}>Semester</span>
                          <span className={styles.academicValue}>Semester {user.semester}</span>
                      </div>
                      <div className={styles.statsGrid} style={{ gridColumn: '1 / -1', marginTop: '20px' }}>
                          <div className={styles.statBox}><span className={styles.statNumber}>{user.level || 1}</span><span className={styles.statTitle}>Level</span></div>
                          <div className={styles.statBox}><span className={styles.statNumber}>{user.xp || 0}</span><span className={styles.statTitle}>XP</span></div>
                          <div className={styles.statBox}><span className={styles.statNumber}>{user.studyHours || 0}h</span><span className={styles.statTitle}>Hours</span></div>
                      </div>
                  </div>
              )}

              {activeTab === 'skills' && (
                  <div>
                      <div className={styles.skillCategory}>
                          <h4>Strong In</h4>
                          <div className={styles.skillTags}>
                              {user.academicStrengths?.map((s, i) => <span key={i} className={styles.strengthSkill}>{s}</span>) || <span>None listed</span>}
                          </div>
                      </div>
                      <div className={styles.skillCategory}>
                          <h4>Needs Help With</h4>
                          <div className={styles.skillTags}>
                              {user.subjectsOfDifficulty?.map((s, i) => <span key={i} className={styles.difficultySkill}>{s}</span>) || <span>None listed</span>}
                          </div>
                      </div>
                  </div>
              )}

              {activeTab === 'schedule' && (
                  <div className={styles.scheduleCard}>
                      <h4>Available Times</h4>
                      <p>{user.availability || 'No schedule set'}</p>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
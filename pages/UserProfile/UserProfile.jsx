import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, Star, Clock, BookOpen, Calendar, Award, MessageSquare, UserPlus, Check, X, Zap } from 'lucide-react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './UserProfile.module.css';

// 🟢 PROFESSIONAL TRUST TIER HELPER
const getTrustTier = (score) => {
    const s = score || 0;
    if (s >= 90) return { label: 'Elite Scholar', color: '#10b981', icon: <Shield size={16} /> };
    if (s >= 75) return { label: 'Trusted Partner', color: '#3b82f6', icon: <Check size={16} /> };
    if (s >= 60) return { label: 'Average', color: '#f59e0b', icon: <Star size={16} /> };
    return { label: 'Needs Improvement', color: '#ef4444', icon: <X size={16} /> };
};

const UserProfile = () => {
  const { userId } = useParams(); 
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
        let currentUser = JSON.parse(storage.getItem('user'));

        if (!token || !currentUser) { navigate('/login'); return; }

        // 1. SILENT REFRESH
        try {
          const meRes = await fetch(`http://${window.location.hostname}:5000/api/auth/me`, {
             headers: { 'Authorization': `Bearer ${token}` }
          });
          const meData = await meRes.json();
          if (meData.success) {
             currentUser = meData.user;
             storage.setItem('user', JSON.stringify(currentUser)); 
          }
        } catch (e) { console.error("Could not refresh current user data"); }

        const res = await fetch(`http://localhost:5000/api/auth/public-profile/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();

        if (data.success) {
          let status = 'none';
          const targetId = String(data.user._id || data.user.id);
          const isConnected = currentUser.connections.some(c => String(c._id || c) === targetId);
          const isSent = currentUser.sentRequests.some(r => String(r._id || r) === targetId);
          const isReceived = currentUser.receivedRequests.some(r => String(r._id || r) === targetId);

          if (isConnected) status = 'connected';
          else if (isSent) status = 'pending';
          else if (isReceived) status = 'received';

          setUser({ ...data.user, connectionStatus: status });
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

  const handleConnect = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
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
        setUser(prev => ({ ...prev, connectionStatus: 'none' }));
      } else {
        const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
        const currentUser = JSON.parse(storage.getItem('user'));
        const targetIdStr = String(user._id || user.id);
        
        if (!currentUser.sentRequests.includes(targetIdStr)) {
            currentUser.sentRequests.push(targetIdStr);
            storage.setItem('user', JSON.stringify(currentUser));
        }
      }
    } catch (err) {
      alert("Connection failed");
      setUser(prev => ({ ...prev, connectionStatus: 'none' }));
    }
  };

  const handleCancelRequest = () => {
    setUser(prev => ({ ...prev, connectionStatus: 'none' }));
  };

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'NA';
  
  const renderAvatar = () => {
    if (user && (user._id || user.id) && !imgError) {
      return (
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '4px solid #1e293b', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={`http://localhost:5000/api/auth/student/${user._id || user.id}/picture`}
              alt={user.fullName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setImgError(true)}
            />
        </div>
      );
    }
    return (
      <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', border: '4px solid #1e293b' }}>
        {getInitials(user.fullName)}
      </div>
    );
  };

  const getConnectionButton = () => {
    switch(user?.connectionStatus) {
      case 'connected':
        return (
            <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'default' }}>
                    <Check size={16} /> Connected
                </button>
                <button onClick={() => navigate('/messages')} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <MessageSquare size={16} /> Message
                </button>
            </div>
        );
      case 'pending':
        return <button onClick={handleCancelRequest} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', cursor: 'pointer' }}>Cancel Request</button>;
      case 'received':
        return <button onClick={() => navigate('/pending-connections')} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#f59e0b', color: 'white', cursor: 'pointer' }}>Respond to Request</button>;
      default:
        return (
            <button onClick={handleConnect} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <UserPlus size={16} /> Connect
            </button>
        );
    }
  };

  if (loading) return <DashboardLayout><div className={styles.container}>Loading profile...</div></DashboardLayout>;
  if (error || !user) return <DashboardLayout><div className={styles.container}><h3>{error || "User not found"}</h3></div></DashboardLayout>;

  const trustTier = getTrustTier(user.reliability);

  return (
    <DashboardLayout title={`${user.fullName}'s Profile`}>
      <div className={styles.container} style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        
        {/* 🟢 ENTERPRISE HERO BANNER */}
        <div style={{ width: '100%', height: '160px', borderRadius: '16px 16px 0 0', background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)', position: 'relative', marginBottom: '60px' }}>
            <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                ← Back
            </button>
            <div style={{ position: 'absolute', bottom: '-50px', left: '30px', display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
                {renderAvatar()}
                <div style={{ paddingBottom: '10px' }}>
                    <h1 style={{ margin: 0, fontSize: '2rem', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{user.fullName}</h1>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                        <span style={{ backgroundColor: '#1e293b', color: '#cbd5e1', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', border: '1px solid #334155' }}>@{user.rollNumber}</span>
                        {user.plan === 'pro' && <span style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', border: '1px solid #8b5cf6', fontWeight: 'bold' }}>PRO</span>}
                    </div>
                </div>
            </div>
            <div style={{ position: 'absolute', bottom: '-40px', right: '30px' }}>
                {getConnectionButton()}
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '24px' }}>
            
            {/* 🟢 LEFT COLUMN: TRUST & BIO */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Reliability Card */}
                <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc' }}>
                        <Shield size={18} color={trustTier.color} /> Trust Score
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                            <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#334155" strokeWidth="4" />
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={trustTier.color} strokeWidth="4" strokeDasharray={`${user.reliability || 0}, 100`} />
                            </svg>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem', color: '#f8fafc' }}>
                                {user.reliability || 0}%
                            </div>
                        </div>
                        <div>
                            <div style={{ color: trustTier.color, fontWeight: '600', fontSize: '1rem' }}>{trustTier.label}</div>
                            <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '2px' }}>Based on quiz & activity</div>
                        </div>
                    </div>
                </div>

                {/* About Card */}
                <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: '#f8fafc' }}>About</h3>
                    <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>
                        {user.bio || "This student hasn't written a bio yet, but they are ready to collaborate!"}
                    </p>
                </div>
            </div>

            {/* 🟢 RIGHT COLUMN: TABS & DATA */}
            <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
                
                {/* Custom Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid #334155', backgroundColor: '#0f172a' }}>
                    {[
                        { id: 'overview', icon: <Star size={16} />, label: 'Overview' },
                        { id: 'academic', icon: <BookOpen size={16} />, label: 'Academics' },
                        { id: 'schedule', icon: <Calendar size={16} />, label: 'Schedule' }
                    ].map(tab => (
                        <button 
                            key={tab.id} 
                            onClick={() => setActiveTab(tab.id)}
                            style={{ flex: 1, padding: '15px', background: activeTab === tab.id ? '#1e293b' : 'transparent', border: 'none', borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent', color: activeTab === tab.id ? '#3b82f6' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content Area */}
                <div style={{ padding: '24px' }}>
                    <AnimatePresence mode="wait">
                        
                        {/* OVERVIEW TAB */}
                        {activeTab === 'overview' && (
                            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                
                                {/* Quick Stats Grid */}
                                <h3 style={{ color: '#f8fafc', fontSize: '1.1rem', margin: '0 0 15px 0' }}>Platform Stats</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
                                    <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                                        <Award size={24} color="#3b82f6" style={{ margin: '0 auto 8px auto' }} />
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f8fafc' }}>Level {user.level || 1}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{user.xp || 0} XP</div>
                                    </div>
                                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                                        <Clock size={24} color="#10b981" style={{ margin: '0 auto 8px auto' }} />
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f8fafc' }}>{user.studyHours || 0}h</div>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Study Time</div>
                                    </div>
                                    <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                                        <Zap size={24} color="#f59e0b" style={{ margin: '0 auto 8px auto' }} />
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f8fafc' }}>{user.streak || 0}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Day Streak</div>
                                    </div>
                                </div>

                                {/* Skills Section */}
                                <h3 style={{ color: '#f8fafc', fontSize: '1.1rem', margin: '0 0 15px 0' }}>Academic Profile</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '10px' }}>
                                        <h4 style={{ color: '#10b981', margin: '0 0 10px 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}><Check size={14}/> Strong In</h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {user.academicStrengths?.length > 0 
                                                ? user.academicStrengths.map(s => <span key={s} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem' }}>{s}</span>)
                                                : <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Not specified</span>
                                            }
                                        </div>
                                    </div>
                                    <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '10px' }}>
                                        <h4 style={{ color: '#ef4444', margin: '0 0 10px 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}><X size={14}/> Seeking Help With</h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {user.subjectsOfDifficulty?.length > 0 
                                                ? user.subjectsOfDifficulty.map(s => <span key={s} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem' }}>{s}</span>)
                                                : <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Not specified</span>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ACADEMIC TAB */}
                        {activeTab === 'academic' && (
                            <motion.div key="academic" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: '#0f172a', borderRadius: '8px' }}>
                                        <span style={{ color: '#94a3b8' }}>Department</span>
                                        <span style={{ color: '#f8fafc', fontWeight: '500' }}>{user.department || 'Not specified'}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: '#0f172a', borderRadius: '8px' }}>
                                        <span style={{ color: '#94a3b8' }}>Current Semester</span>
                                        <span style={{ color: '#f8fafc', fontWeight: '500' }}>Semester {user.semester || 'N/A'}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: '#0f172a', borderRadius: '8px' }}>
                                        <span style={{ color: '#94a3b8' }}>Preferred Study Style</span>
                                        <span style={{ color: '#f8fafc', fontWeight: '500' }}>{user.studyStyle || 'Individual Study'}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* SCHEDULE TAB */}
                        {activeTab === 'schedule' && (
                            <motion.div key="schedule" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '10px' }}>
                                    <h3 style={{ color: '#f8fafc', fontSize: '1.1rem', margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Calendar size={18} color="#3b82f6" /> Typical Availability
                                    </h3>
                                    <p style={{ color: '#cbd5e1', lineHeight: '1.6', margin: 0, padding: '15px', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderLeft: '3px solid #3b82f6', borderRadius: '0 8px 8px 0' }}>
                                        {user.availability || "This user hasn't listed their specific availability yet. Send them a message to figure out a time to study!"}
                                    </p>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
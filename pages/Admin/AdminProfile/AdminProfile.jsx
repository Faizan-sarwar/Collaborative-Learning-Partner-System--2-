import React, { useState, useEffect, useRef } from 'react';
import styles from './AdminProfile.module.css';

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null); // Reference for hidden file input

  // 🔹 Profile State
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    joinDate: '',
    bio: '',
    pictureUrl: null // Store the URL from backend
  });

  // 🔹 Image Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // 🔹 Activity & Stats State
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState([
    { value: '0', label: 'Actions Today', icon: 'activity' },
    { value: '0', label: 'Total Actions', icon: 'chart' },
    { value: '0', label: 'Days Active', icon: 'calendar' },
  ]);

  // 🔹 Fetch Data on Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = (localStorage.getItem('token') || sessionStorage.getItem('token')) || localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // 1. Fetch Profile
        const userRes = await fetch('http://localhost:5000/api/auth/me', { headers });
        const userData = await userRes.json();

        if (userData.success) {
          const u = userData.user;
          setProfile({
            fullName: u.fullName,
            email: u.email,
            phone: u.phone || 'Not set',
            role: u.role === 'admin' ? 'Super Administrator' : 'Administrator',
            department: u.department || 'Administration',
            joinDate: new Date(u.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            bio: u.bio || 'No bio available yet.',
            // If backend provides a pictureUrl endpoint or base64
            pictureUrl: u.pictureUrl ? `http://localhost:5000/api/auth${u.pictureUrl}` : null 
          });
        }

        // 2. Fetch Activities
        const activityRes = await fetch('http://localhost:5000/api/activity-logs/latest');
        const activityData = await activityRes.json();
        
        const mappedActivities = activityData.map(log => ({
          icon: getIconForAction(log.action),
          text: log.action,
          time: new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          color: getColorForAction(log.action)
        }));
        setActivities(mappedActivities);

        const daysActive = Math.floor((new Date() - new Date(userData.user.createdAt)) / (1000 * 60 * 60 * 24));
        setStats([
            { value: activityData.length.toString(), label: 'Recent Actions', icon: 'activity' },
            { value: '∞', label: 'Access Level', icon: 'chart' },
            { value: daysActive.toString(), label: 'Days Active', icon: 'calendar' },
        ]);

      } catch (err) {
        console.error('Failed to load profile data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔹 Helper Functions
  const getIconForAction = (action) => {
    const lower = action.toLowerCase();
    if (lower.includes('regist')) return 'user-plus';
    if (lower.includes('course')) return 'book';
    if (lower.includes('login')) return 'user';
    return 'activity';
  };

  const getColorForAction = (action) => {
    const lower = action.toLowerCase();
    if (lower.includes('regist')) return 'blue';
    if (lower.includes('course')) return 'teal';
    if (lower.includes('fail')) return 'red';
    return 'purple';
  };

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  // 🔹 Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
      // Create preview URL
      setPreviewImage(URL.createObjectURL(file));
      setIsEditing(true); // Auto-enable edit mode
    }
  };

  // 🔹 Handle Trigger Input
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // 🔹 Handle Save (Using FormData for File Upload)
  const handleSave = async () => {
    try {
      const token = (localStorage.getItem('token') || sessionStorage.getItem('token')) || localStorage.getItem('token');
      
      // Use FormData to send file + text
      const formData = new FormData();
      formData.append('fullName', profile.fullName);
      formData.append('email', profile.email);
      formData.append('phone', profile.phone);
      formData.append('department', profile.department);
      formData.append('bio', profile.bio);
      
      if (selectedFile) {
        formData.append('profilePicture', selectedFile);
      }

      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // Do NOT set Content-Type header when sending FormData; browser does it automatically
        },
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        alert('Profile updated successfully!');
        setIsEditing(false);
        
        // Update local storage
        const currentUser = JSON.parse((localStorage.getItem('user') || sessionStorage.getItem('user')));
        sessionStorage.setItem('user', JSON.stringify({ ...currentUser, ...data.user }));
        
        // Clear temp file
        setSelectedFile(null);
      } else {
        alert('Update failed: ' + data.message);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Server error while saving.');
    }
  };

  const renderIcon = (iconName) => {
    // ... (Keep existing icons object same as before) ...
    const icons = {
      'user': <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
      'shield': <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
      'activity': <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
      'lock': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
      'key': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>,
      'monitor': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
      'user-plus': <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>,
      'settings': <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
      'check': <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
      'book': <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>,
      'upload': <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>,
      'edit': <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
      'chart': <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
      'calendar': <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
    };
    return icons[iconName] || null;
  };

  if (loading) return <div className={styles.container}>Loading profile...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Admin Profile</h2>
        <p>Manage your personal information and preferences</p>
      </div>

      <div className={styles.profileGrid}>
        {/* Profile Card */}
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarWrapper}>
              {/* 🔹 Avatar Logic: Preview -> Database Photo -> Initials */}
              {previewImage ? (
                <img src={previewImage} alt="Profile" className={styles.avatarImage} style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}} />
              ) : profile.pictureUrl ? (
                <img src={profile.pictureUrl} alt="Profile" className={styles.avatarImage} style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}} />
              ) : (
                <div className={styles.avatar}>
                  {profile.fullName.split(' ').map(n => n[0]).join('')}
                </div>
              )}
              
              <button className={styles.avatarEditBtn} onClick={triggerFileInput}>
                {renderIcon('upload')}
              </button>
              {/* 🔹 Hidden File Input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
                accept="image/*"
              />
            </div>
            <div className={styles.profileInfo}>
              <h3>{profile.fullName}</h3>
              <span className={styles.roleBadge}>{profile.role}</span>
            </div>
          </div>

          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statCard}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ... (Rest of UI: Personal Info Card, Security, Activity) keeps existing structure */}
        <div className={styles.infoCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleGroup}>
              <div className={styles.cardIcon}>{renderIcon('user')}</div>
              <h3>Personal Information</h3>
            </div>
            {!isEditing ? (
              <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
                {renderIcon('edit')} Edit
              </button>
            ) : (
              <div className={styles.editActions}>
                <button className={styles.cancelBtn} onClick={() => setIsEditing(false)}>Cancel</button>
                <button className={styles.saveBtn} onClick={handleSave}>Save Changes</button>
              </div>
            )}
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Full Name</label>
              {isEditing ? <input type="text" value={profile.fullName} onChange={(e) => handleChange('fullName', e.target.value)} className={styles.input} /> : <span>{profile.fullName}</span>}
            </div>
            <div className={styles.infoItem}>
              <label>Email Address</label>
              {isEditing ? <input type="email" value={profile.email} onChange={(e) => handleChange('email', e.target.value)} className={styles.input} /> : <span>{profile.email}</span>}
            </div>
            <div className={styles.infoItem}>
              <label>Phone Number</label>
              {isEditing ? <input type="tel" value={profile.phone} onChange={(e) => handleChange('phone', e.target.value)} className={styles.input} /> : <span>{profile.phone}</span>}
            </div>
            <div className={styles.infoItem}>
              <label>Role</label>
              <span className={styles.roleText}>{profile.role}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Department</label>
              {isEditing ? <input type="text" value={profile.department} onChange={(e) => handleChange('department', e.target.value)} className={styles.input} /> : <span>{profile.department}</span>}
            </div>
            <div className={styles.infoItem}>
              <label>Join Date</label>
              <span>{profile.joinDate}</span>
            </div>
            <div className={`${styles.infoItem} ${styles.fullWidth}`}>
              <label>Bio</label>
              {isEditing ? <textarea value={profile.bio} onChange={(e) => handleChange('bio', e.target.value)} className={styles.textarea} rows={3} /> : <span>{profile.bio}</span>}
            </div>
          </div>
        </div>

        {/* Security and Activity Cards (Unchanged) */}
        <div className={styles.securityCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleGroup}>
              <div className={styles.cardIcon}>{renderIcon('shield')}</div>
              <h3>Security Settings</h3>
            </div>
          </div>
          <div className={styles.securityList}>
            <div className={styles.securityItem}>
              <div className={styles.securityIcon}>{renderIcon('lock')}</div>
              <div className={styles.securityInfo}>
                <h4>Password</h4><p>Managed securely</p>
              </div>
              <button className={styles.actionBtn}>Change</button>
            </div>
          </div>
        </div>

        <div className={styles.activityCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleGroup}>
              <div className={styles.cardIcon}>{renderIcon('activity')}</div>
              <h3>Recent Activity</h3>
            </div>
          </div>
          <div className={styles.activityList}>
            {activities.length === 0 ? (
                <p style={{padding: '20px', color: '#666'}}>No recent activity found.</p>
            ) : (
                activities.map((activity, index) => (
                <div key={index} className={styles.activityItem}>
                    <div className={`${styles.activityIcon} ${styles[activity.color]}`}>
                    {renderIcon(activity.icon)}
                    </div>
                    <div className={styles.activityInfo}>
                    <span>{activity.text}</span>
                    <small>{activity.time}</small>
                    </div>
                </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
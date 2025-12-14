import React, { useState } from 'react';
import styles from './AdminProfile.module.css';

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: 'Super Admin',
    email: 'admin@studypal.com',
    phone: '+1 234 567 8900',
    role: 'Super Administrator',
    department: 'Administration',
    joinDate: 'January 15, 2024',
    bio: 'Platform administrator with full access to manage students, courses, and system settings.',
  });

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Admin Profile</h2>
        <p>Manage your personal information and preferences</p>
      </div>

      <div className={styles.profileGrid}>
        <div className={styles.profileCard}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>SA</div>
            <div className={styles.avatarInfo}>
              <h3>{profile.fullName}</h3>
              <span className={styles.role}>{profile.role}</span>
              <button className={styles.changeAvatarBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Change Photo
              </button>
            </div>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>156</span>
              <span className={styles.statLabel}>Actions Today</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>1,234</span>
              <span className={styles.statLabel}>Total Actions</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>45</span>
              <span className={styles.statLabel}>Days Active</span>
            </div>
          </div>
        </div>

        <div className={styles.detailsCard}>
          <div className={styles.cardHeader}>
            <h3>Personal Information</h3>
            {!isEditing ? (
              <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </button>
            ) : (
              <div className={styles.editActions}>
                <button className={styles.cancelBtn} onClick={() => setIsEditing(false)}>Cancel</button>
                <button className={styles.saveBtn} onClick={handleSave}>Save</button>
              </div>
            )}
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Full Name</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={profile.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className={styles.input}
                />
              ) : (
                <span>{profile.fullName}</span>
              )}
            </div>

            <div className={styles.infoItem}>
              <label>Email Address</label>
              {isEditing ? (
                <input 
                  type="email" 
                  value={profile.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={styles.input}
                />
              ) : (
                <span>{profile.email}</span>
              )}
            </div>

            <div className={styles.infoItem}>
              <label>Phone Number</label>
              {isEditing ? (
                <input 
                  type="tel" 
                  value={profile.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={styles.input}
                />
              ) : (
                <span>{profile.phone}</span>
              )}
            </div>

            <div className={styles.infoItem}>
              <label>Role</label>
              <span>{profile.role}</span>
            </div>

            <div className={styles.infoItem}>
              <label>Department</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={profile.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className={styles.input}
                />
              ) : (
                <span>{profile.department}</span>
              )}
            </div>

            <div className={styles.infoItem}>
              <label>Join Date</label>
              <span>{profile.joinDate}</span>
            </div>

            <div className={`${styles.infoItem} ${styles.fullWidth}`}>
              <label>Bio</label>
              {isEditing ? (
                <textarea 
                  value={profile.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  className={styles.textarea}
                  rows={3}
                />
              ) : (
                <span>{profile.bio}</span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.securityCard}>
          <div className={styles.cardHeader}>
            <h3>Security</h3>
          </div>

          <div className={styles.securityList}>
            <div className={styles.securityItem}>
              <div className={styles.securityInfo}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <div>
                  <h4>Password</h4>
                  <p>Last changed 30 days ago</p>
                </div>
              </div>
              <button className={styles.actionBtn}>Change</button>
            </div>

            <div className={styles.securityItem}>
              <div className={styles.securityInfo}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <div>
                  <h4>Two-Factor Authentication</h4>
                  <p>Add an extra layer of security</p>
                </div>
              </div>
              <button className={styles.actionBtn}>Enable</button>
            </div>

            <div className={styles.securityItem}>
              <div className={styles.securityInfo}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <div>
                  <h4>Active Sessions</h4>
                  <p>2 devices currently logged in</p>
                </div>
              </div>
              <button className={styles.actionBtn}>View All</button>
            </div>
          </div>
        </div>

        <div className={styles.activityCard}>
          <div className={styles.cardHeader}>
            <h3>Recent Activity</h3>
          </div>

          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
              </div>
              <div className={styles.activityInfo}>
                <span>Added new student "John Doe"</span>
                <small>2 hours ago</small>
              </div>
            </div>

            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
              <div className={styles.activityInfo}>
                <span>Updated platform settings</span>
                <small>5 hours ago</small>
              </div>
            </div>

            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className={styles.activityInfo}>
                <span>Approved 5 new registrations</span>
                <small>1 day ago</small>
              </div>
            </div>

            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <div className={styles.activityInfo}>
                <span>Published new course "Advanced Physics"</span>
                <small>2 days ago</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

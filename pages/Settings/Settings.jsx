import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import styles from './Settings.module.css';
import PageTransition from '../../components/PageTransition/PageTransition';
import DashboardSidebar from '../../components/Dashboard/DashboardSidebar/DashboardSidebar';
import DashboardHeader from '../../components/Dashboard/DashboardHeader/DashboardHeader';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);
  
  // 🔹 State structure matches User Model
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bio: '',
    department: 'CS',
    semester: '1',
    studyStyle: 'Individual Study',
    // Default settings structure
    settings: {
      notifications: {
        email: true,
        push: true,
        studyReminders: true,
        messages: true,
      },
      privacy: {
        showProfile: true,
        showActivity: true,
      },
      theme: 'dark',
      language: 'en',
    }
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // 🔹 1. Fetch User Data on Mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.success) {
          // Merge fetched data with default structure to prevent null errors
          setFormData(prev => ({
            ...prev,
            ...data.user,
            settings: {
              ...prev.settings,
              ...data.user.settings
            }
          }));
          
          // Set Avatar Preview
          if (data.user._id) {
            setPreviewImage(`http://localhost:5000/api/auth/student/${data.user._id}/picture`);
          }
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // 🔹 2. Handle Input Changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 🔹 3. Handle Nested Settings Changes
  const handleSettingChange = (category, key, value) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [category]: {
          ...prev.settings[category],
          [key]: value
        }
      }
    }));
  };

  const handleThemeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      settings: { ...prev.settings, theme: value }
    }));
  };

  // 🔹 4. Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file)); // Show local preview
    }
  };

  // 🔹 5. Save Changes
  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const dataToSend = new FormData();

      // Append text fields
      dataToSend.append('fullName', formData.fullName);
      dataToSend.append('phone', formData.phone || '');
      dataToSend.append('bio', formData.bio || '');
      dataToSend.append('department', formData.department);
      dataToSend.append('semester', formData.semester);
      dataToSend.append('studyStyle', formData.studyStyle);
      
      // Append Nested Settings as JSON string
      dataToSend.append('settings', JSON.stringify(formData.settings));

      // Append Image if selected
      if (selectedFile) {
        dataToSend.append('profilePicture', selectedFile);
      }

      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }, // Don't set Content-Type for FormData
        body: dataToSend
      });

      const result = await res.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Settings updated successfully!' });
        // Update Session Storage
        const currentUser = JSON.parse(sessionStorage.getItem('user'));
        sessionStorage.setItem('user', JSON.stringify({ ...currentUser, ...result.user }));
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to update.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Server error occurred.' });
    } finally {
      setSaving(false);
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'account', label: 'Account', icon: '🔐' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🛡️' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  if (loading) return <div className={styles.loading}>Loading Settings...</div>;

  return (
    <PageTransition>
      <div className={styles.settings}>
        <DashboardSidebar />
        
        <div className={styles.mainArea}>
          <DashboardHeader username={formData.fullName} />
          
          <motion.main 
            className={styles.content}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className={styles.pageHeader}>
              <h1>Settings</h1>
              <p>Manage your account settings and preferences</p>
            </div>

            {/* Success/Error Message Toast */}
            {message.text && (
              <div className={`${styles.toast} ${message.type === 'success' ? styles.success : styles.error}`}>
                {message.text}
              </div>
            )}

            <div className={styles.settingsContainer}>
              <div className={styles.tabsSidebar}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className={styles.tabIcon}>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className={styles.tabContent}>
                {activeTab === 'profile' && (
                  <motion.div className={styles.section} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2>Profile Information</h2>
                    <p className={styles.sectionDesc}>Update your personal details and photo</p>

                    <div className={styles.profilePhoto}>
                      <img 
                        src={previewImage || `https://api.dicebear.com/7.x/initials/svg?seed=${formData.fullName}`} 
                        alt="Profile" 
                        onError={(e) => e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${formData.fullName}`}
                      />
                      <div className={styles.photoActions}>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleImageChange} 
                          style={{display: 'none'}} 
                          accept="image/*"
                        />
                        <button className={styles.uploadBtn} onClick={() => fileInputRef.current.click()}>
                          Upload Photo
                        </button>
                      </div>
                    </div>

                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label>Full Name</label>
                        <input 
                          type="text" 
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <input type="email" value={formData.email} disabled className={styles.disabledInput} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Phone Number</label>
                        <input 
                          type="tel" 
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Department</label>
                        <select 
                          value={formData.department}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                        >
                          <option value="IT">Information Technology</option>
                          <option value="CS">Computer Science</option>
                          <option value="ECE">Electronics</option>
                          <option value="ME">Mechanical</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Semester</label>
                        <select 
                          value={formData.semester}
                          onChange={(e) => handleInputChange('semester', e.target.value)}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                            <option key={sem} value={sem}>Semester {sem}</option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Study Style</label>
                        <select 
                          value={formData.studyStyle}
                          onChange={(e) => handleInputChange('studyStyle', e.target.value)}
                        >
                          <option value="Individual Study">Individual Study</option>
                          <option value="Group Collaboration">Group Collaboration</option>
                          <option value="One-on-One Mentoring">One-on-One Mentoring</option>
                        </select>
                      </div>
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label>Bio</label>
                      <textarea 
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={4}
                      />
                    </div>

                    <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </motion.div>
                )}

                {activeTab === 'notifications' && (
                  <motion.div className={styles.section} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2>Notification Preferences</h2>
                    <p className={styles.sectionDesc}>Choose how you want to be notified</p>

                    <div className={styles.toggleList}>
                      {Object.keys(formData.settings.notifications).map((key) => (
                        <div className={styles.toggleItem} key={key}>
                          <div className={styles.toggleInfo}>
                            <h4>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
                          </div>
                          <label className={styles.toggle}>
                            <input 
                              type="checkbox" 
                              checked={formData.settings.notifications[key]}
                              onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                            />
                            <span className={styles.slider}></span>
                          </label>
                        </div>
                      ))}
                    </div>
                    <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                      {saving ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </motion.div>
                )}

                {activeTab === 'privacy' && (
                  <motion.div className={styles.section} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2>Privacy Settings</h2>
                    <div className={styles.toggleList}>
                      <div className={styles.toggleItem}>
                        <div className={styles.toggleInfo}>
                          <h4>Show Profile</h4>
                          <p>Allow others to view your profile</p>
                        </div>
                        <label className={styles.toggle}>
                          <input 
                            type="checkbox" 
                            checked={formData.settings.privacy.showProfile}
                            onChange={(e) => handleSettingChange('privacy', 'showProfile', e.target.checked)}
                          />
                          <span className={styles.slider}></span>
                        </label>
                      </div>
                      <div className={styles.toggleItem}>
                        <div className={styles.toggleInfo}>
                          <h4>Show Activity</h4>
                          <p>Show when you are online</p>
                        </div>
                        <label className={styles.toggle}>
                          <input 
                            type="checkbox" 
                            checked={formData.settings.privacy.showActivity}
                            onChange={(e) => handleSettingChange('privacy', 'showActivity', e.target.checked)}
                          />
                          <span className={styles.slider}></span>
                        </label>
                      </div>
                    </div>
                    <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                      {saving ? 'Saving...' : 'Save Privacy Settings'}
                    </button>
                  </motion.div>
                )}

                {activeTab === 'preferences' && (
                  <motion.div className={styles.section} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2>App Preferences</h2>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label>Theme</label>
                        <select 
                          value={formData.settings.theme}
                          onChange={(e) => handleThemeChange(e.target.value)}
                        >
                          <option value="dark">Dark Mode</option>
                          <option value="light">Light Mode</option>
                        </select>
                      </div>
                    </div>
                    <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                      {saving ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </motion.div>
                )}
                
                {activeTab === 'account' && (
                    <motion.div className={styles.section} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h2>Account Security</h2>
                        <div className={styles.securityCard}>
                            <div className={styles.securityInfo}>
                                <h3>Password</h3>
                                <p>For security, please contact support to change your password or use the "Forgot Password" link on the login page.</p>
                            </div>
                        </div>
                    </motion.div>
                )}

              </div>
            </div>
          </motion.main>
        </div>
      </div>
    </PageTransition>
  );
};

export default Settings;
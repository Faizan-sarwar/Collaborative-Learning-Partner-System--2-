import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Shield, Sliders, Lock, Camera, CheckCircle2, AlertCircle, Save } from 'lucide-react';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 🟢 1. ADDED showAvatar TO INITIAL STATE
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bio: '',
    department: 'CS',
    semester: '1',
    studyStyle: 'Individual Study',
    settings: {
      notifications: { email: true, push: true, studyReminders: true, messages: true },
      privacy: { showProfile: true, showActivity: true },
      theme: 'dark',
      language: 'en',
      showAvatar: true // Explicitly track the Avatar preference
    }
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = (localStorage.getItem('token') || sessionStorage.getItem('token')) || localStorage.getItem('token');
        const res = await fetch(`http://${window.location.hostname}:5000/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.success) {
          setFormData(prev => ({
            ...prev,
            ...data.user,
            settings: {
              ...prev.settings,
              ...data.user.settings
            }
          }));

          // 🟢 2. BULLETPROOF SYNC: Instantly update localStorage & Header so they never drift from the DB truth!
          const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
          storage.setItem('user', JSON.stringify(data.user));
          window.dispatchEvent(new Event('userUpdated'));

          if (data.user._id) {
            setPreviewImage(`http://${window.location.hostname}:5000/api/auth/student/${data.user._id}/picture?t=${Date.now()}`);
          }

          if (data.user.settings?.theme) {
            document.documentElement.setAttribute('data-theme', data.user.settings.theme);
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSettingChange = (category, key, value) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...(category ? { [category]: { ...prev.settings[category], [key]: value } } : { [key]: value })
      }
    }));
  };

  const handleThemeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      settings: { ...prev.settings, theme: value }
    }));
    document.documentElement.setAttribute('data-theme', value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 🟢 1. BUMPED TO 50MB SAFETY CHECK
      if (file.size > 50 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Photo is too large! Please choose an image under 50MB.' });
        setTimeout(() => setMessage({ type: '', text: '' }), 4000);
        return;
      }

      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      handleSettingChange(null, 'showAvatar', false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = (localStorage.getItem('token') || sessionStorage.getItem('token')) || localStorage.getItem('token');
      const dataToSend = new FormData();

      dataToSend.append('fullName', formData.fullName);
      dataToSend.append('phone', formData.phone || '');
      dataToSend.append('bio', formData.bio || '');
      dataToSend.append('department', formData.department);
      dataToSend.append('semester', formData.semester);
      dataToSend.append('studyStyle', formData.studyStyle);
      dataToSend.append('settings', JSON.stringify(formData.settings));

      if (selectedFile) {
        dataToSend.append('profilePicture', selectedFile);
      }

      const res = await fetch(`http://${window.location.hostname}:5000/api/auth/profile`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: dataToSend
      });

      const result = await res.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Settings updated successfully!' });

        const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
        const currentUser = JSON.parse(storage.getItem('user'));
        storage.setItem('user', JSON.stringify({ ...currentUser, ...result.user }));

        window.dispatchEvent(new Event('userUpdated'));
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to update.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Server error occurred.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Public Profile', icon: <User size={18} /> },
    { id: 'preferences', label: 'Preferences', icon: <Sliders size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'privacy', label: 'Privacy & Visibility', icon: <Shield size={18} /> },
    { id: 'account', label: 'Account Security', icon: <Lock size={18} /> },
  ];

  const fadeVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  if (loading) return <div className={styles.loading}>Loading Settings...</div>;

  return (
    <PageTransition>
      <div className={styles.settings}>
        <DashboardSidebar
          isOpen={isSidebarOpen}
          closeSidebar={() => setIsSidebarOpen(false)}
        />

        {isSidebarOpen && (
          <div className={styles.overlay} onClick={() => setIsSidebarOpen(false)}></div>
        )}

        <div className={styles.mainArea}>
          <DashboardHeader
            username={formData.fullName}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          <AnimatePresence>
            {message.text && (
              <motion.div
                initial={{ opacity: 0, y: -20, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: -20, x: '-50%' }}
                style={{
                  position: 'fixed', top: '80px', left: '50%', zIndex: 1000,
                  backgroundColor: message.type === 'success' ? '#10b981' : '#ef4444',
                  color: 'white', padding: '12px 24px', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontWeight: '500'
                }}
              >
                {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          <main className={styles.content}>
            <div className={styles.pageHeader}>
              <h1>Settings</h1>
              <p>Manage your account settings, profile, and app preferences.</p>
            </div>

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

                {/* PROFILE TAB */}
                {activeTab === 'profile' && (
                  <motion.div variants={fadeVariants} initial="hidden" animate="visible">
                    <div className={styles.sectionHeader}>
                      <h2>Public Profile</h2>
                      <p className={styles.sectionDesc}>This is how others will see you on the platform.</p>
                    </div>

                    <div className={styles.profilePhoto}>
                      <div className={styles.avatarWrapper} onClick={() => fileInputRef.current.click()}>
                        <img
                          src={previewImage || `https://api.dicebear.com/7.x/initials/svg?seed=${formData.fullName}`}
                          alt="Profile"
                          onError={(e) => e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${formData.fullName}`}
                        />
                        <div className={styles.avatarOverlay}>
                          <Camera size={24} />
                        </div>
                      </div>
                      <div className={styles.photoActions}>
                        <input
                          type="file" ref={fileInputRef}
                          onChange={handleImageChange}
                          style={{ display: 'none' }} accept="image/*"
                        />
                        <button type="button" className={styles.uploadBtn} onClick={() => fileInputRef.current.click()}>
                          Change Avatar
                        </button>
                        <p>JPG, GIF or PNG. Max size 5MB.</p>
                      </div>
                    </div>

                    {/* 🟢 4. ADDED UI: Let users manually toggle the setting right from the Profile page! */}
                    <div className={styles.formGroup} style={{ marginBottom: '24px' }}>
                      <label>Profile Picture Display</label>
                      <div className={styles.toggleItem} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', marginTop: '4px' }}>
                        <div className={styles.toggleInfo}>
                          <h4>Show Cartoon Avatar</h4>
                          <p>Turn off to display your uploaded photo to other users.</p>
                        </div>
                        <label className={styles.toggle}>
                          <input
                            type="checkbox"
                            checked={formData.settings.showAvatar !== false}
                            onChange={(e) => handleSettingChange(null, 'showAvatar', e.target.checked)}
                          />
                          <span className={styles.slider}></span>
                        </label>
                      </div>
                    </div>

                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label>Full Name</label>
                        <input
                          type="text" value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <input type="email" value={formData.email} disabled />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Department</label>
                        <select value={formData.department} onChange={(e) => handleInputChange('department', e.target.value)}>
                          <option value="Information Technology">Information Technology</option>
                          <option value="Computer Science">Computer Science</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Mechanical">Mechanical</option>
                          <option value="Civil">Civil</option>
                          <option value="Electrical">Electrical</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Semester</label>
                        <select value={formData.semester} onChange={(e) => handleInputChange('semester', e.target.value)}>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                            <option key={sem} value={sem}>Semester {sem}</option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Preferred Study Style</label>
                        <select value={formData.studyStyle} onChange={(e) => handleInputChange('studyStyle', e.target.value)}>
                          <option value="Individual Study">Individual Study</option>
                          <option value="Group Collaboration">Group Collaboration</option>
                          <option value="One-on-One Mentoring">One-on-One Mentoring</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Phone Number (Optional)</label>
                        <input
                          type="tel" value={formData.phone} placeholder="+1 (555) 000-0000"
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      </div>
                      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label>Bio</label>
                        <textarea
                          value={formData.bio} placeholder="Write a short introduction about yourself..."
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className={styles.saveAction}>
                      <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : <><Save size={16} /> Save Profile</>}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* PREFERENCES TAB */}
                {activeTab === 'preferences' && (
                  <motion.div variants={fadeVariants} initial="hidden" animate="visible">
                    <div className={styles.sectionHeader}>
                      <h2>App Preferences</h2>
                      <p className={styles.sectionDesc}>Customize your app experience.</p>
                    </div>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label>App Theme</label>
                        <select value={formData.settings.theme} onChange={(e) => handleThemeChange(e.target.value)}>
                          <option value="dark">Dark Mode</option>
                          <option value="light">Light Mode</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Language</label>
                        <select value={formData.settings.language} onChange={(e) => handleSettingChange('settings', 'language', e.target.value)}>
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                        </select>
                      </div>
                    </div>
                    <div className={styles.saveAction}>
                      <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : <><Save size={16} /> Save Preferences</>}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* NOTIFICATIONS TAB */}
                {activeTab === 'notifications' && (
                  <motion.div variants={fadeVariants} initial="hidden" animate="visible">
                    <div className={styles.sectionHeader}>
                      <h2>Notifications</h2>
                      <p className={styles.sectionDesc}>Control when and how you are notified.</p>
                    </div>
                    <div className={styles.toggleList}>
                      {[
                        { key: 'email', label: 'Email Notifications', desc: 'Receive daily summaries and updates.' },
                        { key: 'push', label: 'Push Notifications', desc: 'Real-time alerts in your browser.' },
                        { key: 'studyReminders', label: 'Study Reminders', desc: 'Get reminded for scheduled sessions.' },
                        { key: 'messages', label: 'Direct Messages', desc: 'Notify me when someone sends a message.' }
                      ].map((item) => (
                        <div className={styles.toggleItem} key={item.key}>
                          <div className={styles.toggleInfo}>
                            <h4>{item.label}</h4>
                            <p>{item.desc}</p>
                          </div>
                          <label className={styles.toggle}>
                            <input
                              type="checkbox"
                              checked={formData.settings.notifications[item.key]}
                              onChange={(e) => handleSettingChange('notifications', item.key, e.target.checked)}
                            />
                            <span className={styles.slider}></span>
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className={styles.saveAction}>
                      <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : <><Save size={16} /> Save Notifications</>}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* PRIVACY TAB */}
                {activeTab === 'privacy' && (
                  <motion.div variants={fadeVariants} initial="hidden" animate="visible">
                    <div className={styles.sectionHeader}>
                      <h2>Privacy & Visibility</h2>
                      <p className={styles.sectionDesc}>Control who can see your profile and activity.</p>
                    </div>
                    <div className={styles.toggleList}>
                      <div className={styles.toggleItem}>
                        <div className={styles.toggleInfo}>
                          <h4>Show Profile</h4>
                          <p>Allow others to discover you in Study Matches.</p>
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
                          <h4>Show Online Status</h4>
                          <p>Let connections see when you are currently active.</p>
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
                    <div className={styles.saveAction}>
                      <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : <><Save size={16} /> Save Privacy</>}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ACCOUNT TAB */}
                {activeTab === 'account' && (
                  <motion.div variants={fadeVariants} initial="hidden" animate="visible">
                    <div className={styles.sectionHeader}>
                      <h2>Account Security</h2>
                      <p className={styles.sectionDesc}>Manage your security settings and account deletion.</p>
                    </div>

                    <div className={styles.formGroup} style={{ marginBottom: '30px' }}>
                      <label>Password</label>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '10px', marginTop: 0 }}>
                        Need to change your password? Click below to receive a secure reset link.
                      </p>
                      <div>
                        <button type="button" className={styles.uploadBtn} onClick={() => alert("A password reset link would be sent to your email.")}>
                          Send Reset Link
                        </button>
                      </div>
                    </div>

                    <div className={styles.dangerZone}>
                      <div className={styles.dangerHeader}>
                        <h3>Danger Zone</h3>
                      </div>
                      <div className={styles.dangerContent}>
                        <div className={styles.dangerInfo}>
                          <h4>Delete Account</h4>
                          <p>Once you delete your account, there is no going back. Please be certain.</p>
                        </div>
                        <button className={styles.deleteBtn} onClick={() => {
                          if (window.confirm("Are you absolutely sure? This will delete all your data.")) {
                            alert("Contact support to process deletion.");
                          }
                        }}>
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

              </div>
            </div>
          </main>
        </div>
      </div>
    </PageTransition>
  );
};

export default Settings;
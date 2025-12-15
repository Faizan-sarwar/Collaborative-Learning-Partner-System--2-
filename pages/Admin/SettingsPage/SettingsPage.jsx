import React, { useState, useEffect } from 'react';
import styles from './SettingsPage.module.css';

const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  
  // 🔹 State for all settings
  const [formData, setFormData] = useState({
    platformName: 'StudyPal',
    logoUrl: '',
    supportEmail: '',
    allowRegistrations: true,
    maintenanceMode: false,
    sessionTimeout: 60,
    emailNotifications: true,
    welcomeEmail: true,
    adminAlerts: true,
    autoBackup: 'weekly',
    dataRetention: 30
  });

  // 🔹 Fetch Settings on Load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/admin/settings');
        const data = await res.json();
        if (data.success && data.settings) {
          setFormData(prev => ({ ...prev, ...data.settings }));
        }
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // 🔹 Handle Change Helper
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 🔹 Save Settings
  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (data.success) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (err) {
      console.error(err);
      alert('Server error occurred');
    }
  };

  if (loading) return <div className={styles.container}>Loading settings...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Settings</h2>
        <p>Configure your platform settings</p>
      </div>

      <div className={styles.settingsGrid}>
        
        {/* === GENERAL SETTINGS === */}
        <div className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
            <h3>General Settings</h3>
          </div>

          <div className={styles.settingsList}>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label>Platform Name</label>
                <span>The name displayed across your platform</span>
              </div>
              <input 
                type="text" 
                value={formData.platformName}
                onChange={(e) => handleChange('platformName', e.target.value)}
                className={styles.textInput}
              />
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label>Logo URL</label>
                <span>URL to your platform logo</span>
              </div>
              <input 
                type="text" 
                value={formData.logoUrl}
                onChange={(e) => handleChange('logoUrl', e.target.value)}
                placeholder="https://example.com/logo.png"
                className={styles.textInput}
              />
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label>Support Email</label>
                <span>Email for user support inquiries</span>
              </div>
              <input 
                type="email" 
                value={formData.supportEmail}
                onChange={(e) => handleChange('supportEmail', e.target.value)}
                placeholder="support@studypal.com"
                className={styles.textInput}
              />
            </div>
          </div>
        </div>

        {/* === SECURITY SETTINGS === */}
        <div className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3>Security Settings</h3>
          </div>

          <div className={styles.settingsList}>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label>Allow New Registrations</label>
                <span>Enable or disable user registrations</span>
              </div>
              <label className={styles.toggle}>
                <input 
                  type="checkbox" 
                  checked={formData.allowRegistrations}
                  onChange={(e) => handleChange('allowRegistrations', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label>Maintenance Mode</label>
                <span>Put the platform in maintenance mode</span>
              </div>
              <label className={styles.toggle}>
                <input 
                  type="checkbox" 
                  checked={formData.maintenanceMode}
                  onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label>Session Timeout (minutes)</label>
                <span>Auto logout after inactivity</span>
              </div>
              <select 
                className={styles.selectInput}
                value={formData.sessionTimeout}
                onChange={(e) => handleChange('sessionTimeout', Number(e.target.value))}
              >
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="480">8 hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* === NOTIFICATION SETTINGS === */}
        <div className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <h3>Notification Settings</h3>
          </div>

          <div className={styles.settingsList}>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label>Email Notifications</label>
                <span>Send email notifications to users</span>
              </div>
              <label className={styles.toggle}>
                <input 
                    type="checkbox" 
                    checked={formData.emailNotifications}
                    onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label>Welcome Email</label>
                <span>Send welcome email to new users</span>
              </div>
              <label className={styles.toggle}>
                <input 
                    type="checkbox" 
                    checked={formData.welcomeEmail}
                    onChange={(e) => handleChange('welcomeEmail', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label>Admin Activity Alerts</label>
                <span>Get alerts for admin actions</span>
              </div>
              <label className={styles.toggle}>
                <input 
                    type="checkbox" 
                    checked={formData.adminAlerts}
                    onChange={(e) => handleChange('adminAlerts', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
        </div>

        {/* === DATA MANAGEMENT === */}
        <div className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
              </svg>
            </div>
            <h3>Data Management</h3>
          </div>

          <div className={styles.settingsList}>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label>Auto Backup</label>
                <span>Automatically backup database</span>
              </div>
              <select 
                className={styles.selectInput}
                value={formData.autoBackup}
                onChange={(e) => handleChange('autoBackup', e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label>Data Retention (days)</label>
                <span>Keep deleted user data for</span>
              </div>
              <select 
                className={styles.selectInput}
                value={formData.dataRetention}
                onChange={(e) => handleChange('dataRetention', Number(e.target.value))}
              >
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
              </select>
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.actionBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export All Data
              </button>
              <button className={`${styles.actionBtn} ${styles.danger}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Clear Cache
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.saveSection}>
        <button className={styles.saveBtn} onClick={handleSave}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          Save All Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
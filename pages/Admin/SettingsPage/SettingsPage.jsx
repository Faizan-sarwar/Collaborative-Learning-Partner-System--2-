import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings2, ShieldCheck, Database, Save, 
  Download, Trash2, Loader2, AlertCircle, CheckCircle2, X 
} from 'lucide-react';
import styles from './SettingsPage.module.css';

import { useSettings } from '../../../src/context/SettingsContext';

const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: '' }
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { refreshSettings } = useSettings();
  
  const [formData, setFormData] = useState({
    platformName: 'Collaborative Learning Partner System',
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

  const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

  // 🟢 SECURE FETCH SETTINGS
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error("Authentication token missing.");

        const res = await fetch(`http://${window.location.hostname}:5000/api/auth/admin/settings`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.success && data.settings) {
          setFormData(prev => ({ ...prev, ...data.settings }));
        } else {
          throw new Error(data.message || "Failed to load settings");
        }
      } catch (err) {
        console.error('Failed to load settings', err);
        showStatus('error', 'Unable to load platform settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const showStatus = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  // 🟢 SECURE SAVE
  const handleSave = async () => {
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`http://${window.location.hostname}:5000/api/auth/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (data.success) {
        showStatus('success', 'Settings saved successfully!');
        await refreshSettings(); 
      } else {
        throw new Error(data.message || "Failed to save settings");
      }
    } catch (err) {
      console.error(err);
      showStatus('error', err.message || 'Server error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🟢 DATA EXPORT
  const handleExportData = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://${window.location.hostname}:5000/api/auth/admin/export-data`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      
      if (!res.ok) throw new Error('Export failed');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `platform_backup_${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      showStatus('success', 'Data exported successfully.');
    } catch (err) {
      showStatus('error', 'Failed to export data. Ensure backend route is configured.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🟢 SECURE CLEAR CACHE
  const handleClearCache = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`http://${window.location.hostname}:5000/api/auth/admin/clear-cache`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await res.json();
      
      if (res.ok) {
          showStatus('success', data.message || 'Server cache cleared successfully.');
      } else {
          throw new Error(data.message || 'Failed to clear cache');
      }
    } catch (err) {
      showStatus('error', err.message || 'Failed to clear cache.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
        <div className={styles.centerState}>
            <Loader2 size={32} className={styles.spinner} />
            <p>Loading platform configuration...</p>
        </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2>Platform Settings</h2>
          <p className={styles.subtitle}>Manage global configurations and security parameters.</p>
        </div>
        {/* 🟢 STATUS BANNER */}
        <AnimatePresence>
            {statusMessage && (
                <motion.div 
                    className={`${styles.statusBanner} ${styles[statusMessage.type]}`}
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                >
                    {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {statusMessage.text}
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      <div className={styles.settingsGrid}>
        
        {/* === GENERAL SETTINGS === */}
        <div className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <div className={`${styles.cardIcon} ${styles.blueIcon}`}><Settings2 size={20} /></div>
            <h3>General Settings</h3>
          </div>

          <div className={styles.settingsList}>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label>Platform Name</label>
                <span>The name displayed across your platform</span>
              </div>
              <input type="text" value={formData.platformName} onChange={(e) => handleChange('platformName', e.target.value)} className={styles.textInput} />
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label>Logo URL</label>
                <span>URL to your platform logo</span>
              </div>
              <input type="text" value={formData.logoUrl} onChange={(e) => handleChange('logoUrl', e.target.value)} placeholder="https://example.com/logo.png" className={styles.textInput} />
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label>Support Email</label>
                <span>Email for user support inquiries</span>
              </div>
              <input type="email" value={formData.supportEmail} onChange={(e) => handleChange('supportEmail', e.target.value)} placeholder="support@domain.com" className={styles.textInput} />
            </div>
          </div>
        </div>

        {/* === SECURITY SETTINGS === */}
        <div className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <div className={`${styles.cardIcon} ${styles.redIcon}`}><ShieldCheck size={20} /></div>
            <h3>Security Settings</h3>
          </div>

          <div className={styles.settingsList}>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label>Allow New Registrations</label>
                <span>Enable or disable student signups</span>
              </div>
              <label className={styles.toggle}>
                <input type="checkbox" checked={formData.allowRegistrations} onChange={(e) => handleChange('allowRegistrations', e.target.checked)} />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label className={formData.maintenanceMode ? styles.warningText : ''}>Maintenance Mode</label>
                <span>Lock out non-admin users</span>
              </div>
              <label className={styles.toggle}>
                <input type="checkbox" checked={formData.maintenanceMode} onChange={(e) => handleChange('maintenanceMode', e.target.checked)} />
                <span className={`${styles.slider} ${formData.maintenanceMode ? styles.sliderDanger : ''}`}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label>Session Timeout</label>
                <span>Auto logout after inactivity</span>
              </div>
              <select className={styles.selectInput} value={formData.sessionTimeout} onChange={(e) => handleChange('sessionTimeout', Number(e.target.value))}>
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
            <div className={`${styles.cardIcon} ${styles.greenIcon}`}><CheckCircle2 size={20} /></div>
            <h3>Notification Settings</h3>
          </div>

          <div className={styles.settingsList}>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label>Email Notifications</label>
                <span>Send email alerts to users</span>
              </div>
              <label className={styles.toggle}>
                <input type="checkbox" checked={formData.emailNotifications} onChange={(e) => handleChange('emailNotifications', e.target.checked)} />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label>Welcome Email</label>
                <span>Send welcome email to new users</span>
              </div>
              <label className={styles.toggle}>
                <input type="checkbox" checked={formData.welcomeEmail} onChange={(e) => handleChange('welcomeEmail', e.target.checked)} />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label>Admin Activity Alerts</label>
                <span>Get alerts for admin actions</span>
              </div>
              <label className={styles.toggle}>
                <input type="checkbox" checked={formData.adminAlerts} onChange={(e) => handleChange('adminAlerts', e.target.checked)} />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
        </div>

        {/* === DATA MANAGEMENT === */}
        <div className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <div className={`${styles.cardIcon} ${styles.purpleIcon}`}><Database size={20} /></div>
            <h3>Data Management</h3>
          </div>

          <div className={styles.settingsList}>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label>Auto Backup</label>
                <span>Automatically backup database</span>
              </div>
              <select className={styles.selectInput} value={formData.autoBackup} onChange={(e) => handleChange('autoBackup', e.target.value)}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label>Data Retention</label>
                <span>Keep deleted user data for</span>
              </div>
              <select className={styles.selectInput} value={formData.dataRetention} onChange={(e) => handleChange('dataRetention', Number(e.target.value))}>
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
              </select>
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.actionBtn} onClick={handleExportData} disabled={isSubmitting}>
                <Download size={16} /> Export All Data
              </button>
              <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => setShowConfirmModal(true)} disabled={isSubmitting}>
                <Trash2 size={16} /> Clear Cache
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.saveSection}>
        <button className={styles.saveBtn} onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? <Loader2 size={18} className={styles.spinnerIcon} /> : <Save size={18} />}
          Save All Changes
        </button>
      </div>

      {/* 🟢 CONFIRMATION MODAL */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={styles.confirmModal} initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className={styles.confirmIcon}><AlertCircle size={40} color="#ef4444" /></div>
              <h3>Clear Server Cache?</h3>
              <p>This will permanently delete all temporary files and active password reset tokens. Proceed with caution.</p>
              <div className={styles.confirmActions}>
                <button className={styles.cancelBtn} onClick={() => setShowConfirmModal(false)}>Cancel</button>
                <button className={styles.confirmDangerBtn} onClick={handleClearCache} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 size={16} className={styles.spinnerIcon} /> : 'Clear Cache'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SettingsPage;
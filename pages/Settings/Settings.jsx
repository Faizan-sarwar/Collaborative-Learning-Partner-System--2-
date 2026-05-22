import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Shield, Sliders, Lock, Camera, CheckCircle2, AlertCircle, Save, ZoomIn, ZoomOut } from 'lucide-react';
import styles from './Settings.module.css';

// ─── WhatsApp-style Photo Adjuster Component ─────────────────────────────────
const CONTAINER_W = 360;
const CONTAINER_H = 360;
const CROP_SIZE = 280;
const CIRCLE_R = CROP_SIZE / 2;
const CIRCLE_CX = CONTAINER_W / 2;
const CIRCLE_CY = CONTAINER_H / 2;

const PhotoAdjuster = ({ imageSrc, originalFile, onConfirm, onCancel }) => {
  const [imgNatural, setImgNatural] = useState({ w: 0, h: 0 });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const dragOrigin = useRef({ mx: 0, my: 0, ix: 0, iy: 0 });

  // Clamp image so it always fully covers the circle
  const clamp = useCallback((x, y, s) => {
    const iw = imgNatural.w * s;
    const ih = imgNatural.h * s;
    const clampedX = Math.min(CIRCLE_CX - CIRCLE_R, Math.max(CIRCLE_CX + CIRCLE_R - iw, x));
    const clampedY = Math.min(CIRCLE_CY - CIRCLE_R, Math.max(CIRCLE_CY + CIRCLE_R - ih, y));
    return { x: clampedX, y: clampedY };
  }, [imgNatural]);

  const onImgLoad = useCallback((e) => {
    const nw = e.target.naturalWidth;
    const nh = e.target.naturalHeight;
    const minFit = Math.max(CROP_SIZE / nw, CROP_SIZE / nh);
    setImgNatural({ w: nw, h: nh });
    setScale(minFit);
    setPos({
      x: (CONTAINER_W - nw * minFit) / 2,
      y: (CONTAINER_H - nh * minFit) / 2
    });
  }, []);

  // Mouse
  const onMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    dragOrigin.current = { mx: e.clientX, my: e.clientY, ix: pos.x, iy: pos.y };
  };
  const onMouseMove = useCallback((e) => {
    if (!dragging) return;
    const nx = dragOrigin.current.ix + (e.clientX - dragOrigin.current.mx);
    const ny = dragOrigin.current.iy + (e.clientY - dragOrigin.current.my);
    setPos(clamp(nx, ny, scale));
  }, [dragging, scale, clamp]);
  const onMouseUp = () => setDragging(false);

  // Touch
  const onTouchStart = (e) => {
    const t = e.touches[0];
    setDragging(true);
    dragOrigin.current = { mx: t.clientX, my: t.clientY, ix: pos.x, iy: pos.y };
  };
  const onTouchMove = useCallback((e) => {
    if (!dragging) return;
    const t = e.touches[0];
    const nx = dragOrigin.current.ix + (t.clientX - dragOrigin.current.mx);
    const ny = dragOrigin.current.iy + (t.clientY - dragOrigin.current.my);
    setPos(clamp(nx, ny, scale));
  }, [dragging, scale, clamp]);

  // Zoom
  const applyZoom = useCallback((delta) => {
    setScale(prev => {
      const minS = imgNatural.w && imgNatural.h
        ? Math.max(CROP_SIZE / imgNatural.w, CROP_SIZE / imgNatural.h)
        : 0.1;
      const next = Math.min(4, Math.max(minS, prev + delta));
      setPos(p => clamp(p.x, p.y, next));
      return next;
    });
  }, [imgNatural, clamp]);

  const onWheel = (e) => { e.preventDefault(); applyZoom(e.deltaY < 0 ? 0.06 : -0.06); };

  // Crop and output
  const handleConfirm = () => {
    const OUT = 400;
    const canvas = document.createElement('canvas');
    canvas.width = OUT; canvas.height = OUT;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      const srcX = (CIRCLE_CX - CIRCLE_R - pos.x) / scale;
      const srcY = (CIRCLE_CY - CIRCLE_R - pos.y) / scale;
      const srcW = CROP_SIZE / scale;
      const srcH = CROP_SIZE / scale;
      ctx.beginPath();
      ctx.arc(OUT / 2, OUT / 2, OUT / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, OUT, OUT);
      canvas.toBlob((blob) => {
        onConfirm(new File([blob], originalFile.name, { type: 'image/png' }), URL.createObjectURL(blob));
      }, 'image/png');
    };
    img.src = imageSrc;
  };

  const iw = imgNatural.w * scale;
  const ih = imgNatural.h * scale;

  const minScale = imgNatural.w && imgNatural.h
    ? Math.max(CROP_SIZE / imgNatural.w, CROP_SIZE / imgNatural.h)
    : 0.1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.93)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 2000, backdropFilter: 'blur(8px)'
      }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 4px', color: '#fff', fontSize: '1.1rem', fontWeight: '700' }}>
            Adjust Photo
          </h3>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem' }}>
            Drag · Pinch · Scroll to zoom
          </p>
        </div>

        {/* ── Crop viewport ── */}
        <div
          style={{
            width: CONTAINER_W, height: CONTAINER_H,
            position: 'relative', overflow: 'hidden',
            borderRadius: '14px', background: '#0a0a0a',
            cursor: dragging ? 'grabbing' : 'grab',
            touchAction: 'none', userSelect: 'none',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.08)'
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onMouseUp}
          onWheel={onWheel}
        >
          {/* Full photo — user drags this around */}
          <img
            src={imageSrc}
            alt="adjust"
            onLoad={onImgLoad}
            draggable={false}
            style={{
              position: 'absolute',
              left: pos.x, top: pos.y,
              width: iw, height: ih,
              userSelect: 'none', pointerEvents: 'none'
            }}
          />

          {/* Dimmed mask with circular cutout */}
          <svg
            width={CONTAINER_W}
            height={CONTAINER_H}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          >
            <defs>
              <mask id="circleMask">
                <rect width={CONTAINER_W} height={CONTAINER_H} fill="white" />
                <circle cx={CIRCLE_CX} cy={CIRCLE_CY} r={CIRCLE_R} fill="black" />
              </mask>
            </defs>
            <rect width={CONTAINER_W} height={CONTAINER_H} fill="rgba(0,0,0,0.55)" mask="url(#circleMask)" />
            <circle cx={CIRCLE_CX} cy={CIRCLE_CY} r={CIRCLE_R} fill="none" stroke="white" strokeWidth="2" />
          </svg>
        </div>

        {/* Zoom controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: CONTAINER_W }}>
          <button
            onClick={() => applyZoom(-0.1)}
            style={{
              background: 'rgba(255,255,255,0.1)', border: 'none',
              borderRadius: '8px', padding: '8px', cursor: 'pointer',
              color: 'white', display: 'flex', alignItems: 'center', flexShrink: 0
            }}
          >
            <ZoomOut size={17} />
          </button>
          <input
            type="range"
            min={minScale}
            max={4}
            step={0.01}
            value={scale}
            onChange={(e) => {
              const next = parseFloat(e.target.value);
              setScale(next);
              setPos(p => clamp(p.x, p.y, next));
            }}
            style={{ flex: 1, accentColor: '#6366f1', cursor: 'pointer' }}
          />
          <button
            onClick={() => applyZoom(0.1)}
            style={{
              background: 'rgba(255,255,255,0.1)', border: 'none',
              borderRadius: '8px', padding: '8px', cursor: 'pointer',
              color: 'white', display: 'flex', alignItems: 'center', flexShrink: 0
            }}
          >
            <ZoomIn size={17} />
          </button>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px', width: CONTAINER_W }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '12px', borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.75)',
              cursor: 'pointer', fontSize: '0.95rem', fontWeight: '500'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            style={{
              flex: 1, padding: '12px', borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white', cursor: 'pointer',
              fontSize: '0.95rem', fontWeight: '700',
              boxShadow: '0 4px 20px rgba(99,102,241,0.4)'
            }}
          >
            Use Photo
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Main Settings Component ──────────────────────────────────────────────────

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', bio: '',
    department: 'CS', semester: '1', studyStyle: 'Individual Study',
    settings: {
      notifications: { email: true, push: true, studyReminders: true, messages: true },
      privacy: { showProfile: true, showActivity: true },
      theme: 'dark', language: 'en', showAvatar: true
    }
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showAdjuster, setShowAdjuster] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const res = await fetch(`http://${window.location.hostname}:5000/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setFormData(prev => ({
            ...prev, ...data.user,
            settings: { ...prev.settings, ...data.user.settings }
          }));
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

  const handleInputChange = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleSettingChange = (category, key, value) =>
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...(category
          ? { [category]: { ...prev.settings[category], [key]: value } }
          : { [key]: value })
      }
    }));

  const handleThemeChange = (value) => {
    setFormData(prev => ({ ...prev, settings: { ...prev.settings, theme: value } }));
    document.documentElement.setAttribute('data-theme', value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = '';
    if (file.size > 50 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Photo too large! Max 50MB.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
      return;
    }
    setPendingFile(file);
    setRawImageSrc(URL.createObjectURL(file));
    setShowAdjuster(true);
  };

  const handleAdjusterConfirm = (croppedFile, croppedUrl) => {
    setSelectedFile(croppedFile);
    setPreviewImage(croppedUrl);
    handleSettingChange(null, 'showAvatar', false);
    setShowAdjuster(false);
    setRawImageSrc(null);
    setPendingFile(null);
  };

  const handleAdjusterCancel = () => {
    setShowAdjuster(false);
    setRawImageSrc(null);
    setPendingFile(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const dataToSend = new FormData();
      dataToSend.append('fullName', formData.fullName);
      dataToSend.append('phone', formData.phone || '');
      dataToSend.append('bio', formData.bio || '');
      dataToSend.append('department', formData.department);
      dataToSend.append('semester', formData.semester);
      dataToSend.append('studyStyle', formData.studyStyle);
      dataToSend.append('settings', JSON.stringify(formData.settings));
      if (selectedFile) dataToSend.append('profilePicture', selectedFile);

      const res = await fetch(`http://${window.location.hostname}:5000/api/auth/profile`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: dataToSend
      });
      const result = await res.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Settings updated successfully!' });
        const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify({ ...JSON.parse(storage.getItem('user')), ...result.user }));
        window.dispatchEvent(new Event('userUpdated'));
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to update.' });
      }
    } catch (err) {
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

  // 🟢 No more <PageTransition>, <DashboardSidebar>, <DashboardHeader>, or
  //    .settings/.mainArea wrappers. The parent DashboardLayout from App.jsx
  //    provides all of that. We just return the page CONTENT.
  return (
    <>
      {/* Toast (still fixed-position, so it sits on top of the layout) */}
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

      <div className={styles.content}>
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

            {/* ── PROFILE ── */}
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
                    <div className={styles.avatarOverlay}><Camera size={24} /></div>
                  </div>
                  <div className={styles.photoActions}>
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} accept="image/*" />
                    <button type="button" className={styles.uploadBtn} onClick={() => fileInputRef.current.click()}>
                      Change Photo
                    </button>
                    <p>JPG, GIF or PNG. Max size 50MB.</p>
                  </div>
                </div>

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
                    <input type="text" value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} />
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
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Semester</label>
                    <select value={formData.semester} onChange={(e) => handleInputChange('semester', e.target.value)}>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Phone Number</label>
                    <input type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Preferred Study Style</label>
                    <select value={formData.studyStyle} onChange={(e) => handleInputChange('studyStyle', e.target.value)}>
                      <option value="Individual Study">Individual Study</option>
                      <option value="Group Study">Group Study</option>
                      <option value="Mixed">Mixed</option>
                    </select>
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Bio</label>
                    <textarea value={formData.bio} placeholder="Write a short introduction about yourself..." onChange={(e) => handleInputChange('bio', e.target.value)} />
                  </div>
                </div>

                <div className={styles.saveAction}>
                  <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : <><Save size={16} /> Save Profile</>}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── PREFERENCES ── */}
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
                    <select value={formData.settings.language} onChange={(e) => handleSettingChange(null, 'language', e.target.value)}>
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

            {/* ── NOTIFICATIONS ── */}
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
                        <input type="checkbox" checked={formData.settings.notifications[item.key]} onChange={(e) => handleSettingChange('notifications', item.key, e.target.checked)} />
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

            {/* ── PRIVACY ── */}
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
                      <input type="checkbox" checked={formData.settings.privacy.showProfile} onChange={(e) => handleSettingChange('privacy', 'showProfile', e.target.checked)} />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                  <div className={styles.toggleItem}>
                    <div className={styles.toggleInfo}>
                      <h4>Show Online Status</h4>
                      <p>Let connections see when you are currently active.</p>
                    </div>
                    <label className={styles.toggle}>
                      <input type="checkbox" checked={formData.settings.privacy.showActivity} onChange={(e) => handleSettingChange('privacy', 'showActivity', e.target.checked)} />
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

            {/* ── ACCOUNT ── */}
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
                  <button type="button" className={styles.uploadBtn} onClick={() => alert("A password reset link would be sent to your email.")}>
                    Send Reset Link
                  </button>
                </div>
                <div className={styles.dangerZone}>
                  <div className={styles.dangerHeader}><h3>Danger Zone</h3></div>
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
      </div>

      {/* ── WhatsApp-style Photo Adjuster ── */}
      <AnimatePresence>
        {showAdjuster && rawImageSrc && pendingFile && (
          <PhotoAdjuster
            imageSrc={rawImageSrc}
            originalFile={pendingFile}
            onConfirm={handleAdjusterConfirm}
            onCancel={handleAdjusterCancel}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Settings;
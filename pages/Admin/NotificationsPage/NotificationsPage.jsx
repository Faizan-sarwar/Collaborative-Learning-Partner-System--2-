import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Send, Users, UserCheck, Bell, Clock, Heart, Settings, AlertTriangle, Info, Star, Megaphone, Shield, Zap, BookOpen, Trophy, Loader2 } from 'lucide-react';
import styles from './NotificationsPage.module.css';

const departments = [
  'Information Technology',
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Civil',
  'Electrical',
];

const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

const signIcons = [
  { id: 'bell', label: 'Bell', icon: Bell },
  { id: 'alert', label: 'Alert', icon: AlertTriangle },
  { id: 'info', label: 'Info', icon: Info },
  { id: 'star', label: 'Star', icon: Star },
  { id: 'megaphone', label: 'Megaphone', icon: Megaphone },
  { id: 'shield', label: 'Shield', icon: Shield },
  { id: 'zap', label: 'Urgent', icon: Zap },
  { id: 'book', label: 'Academic', icon: BookOpen },
  { id: 'trophy', label: 'Achievement', icon: Trophy },
  { id: 'heart', label: 'Welcome', icon: Heart },
];

const NotificationsPage = () => {
  const [notificationType, setNotificationType] = useState('all');
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('bell');
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedSemesters, setSelectedSemesters] = useState([]);
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const [semDropdownOpen, setSemDropdownOpen] = useState(false);
  const [notifCategory, setNotifCategory] = useState('announcement');
  const [isSending, setIsSending] = useState(false);

  //  Converted static history into state so we can add to it instantly
  const [sentHistory, setSentHistory] = useState([
    { id: 1, title: 'System Maintenance', message: 'Scheduled maintenance on Dec 15th', recipients: 'All Students', sentAt: '2024-03-14 10:00 AM', type: 'system', icon: 'shield' },
    { id: 2, title: 'New Course Available', message: 'Check out our new Python programming course', recipients: 'All Students', sentAt: '2024-03-13 02:30 PM', type: 'announcement', icon: 'megaphone' },
  ]);

  const deptRef = useRef(null);
  const semRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (deptRef.current && !deptRef.current.contains(e.target)) setDeptDropdownOpen(false);
      if (semRef.current && !semRef.current.contains(e.target)) setSemDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleDepartment = (dept) => {
    setSelectedDepartments(prev =>
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    );
  };

  const toggleSemester = (sem) => {
    setSelectedSemesters(prev =>
      prev.includes(sem) ? prev.filter(s => s !== sem) : [...prev, sem]
    );
  };

  //  The function that talks to the new backend route
  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      alert("Please provide both a title and a message.");
      return;
    }
    if (notificationType === 'selected' && selectedDepartments.length === 0 && selectedSemesters.length === 0) {
      alert("Please select at least one Department or Semester filter.");
      return;
    }

    setIsSending(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`http://${window.location.hostname}:5000/api/auth/admin/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          message,
          category: notifCategory,
          icon: selectedIcon,
          targetType: notificationType,
          departments: selectedDepartments,
          semesters: selectedSemesters
        })
      });

      const data = await res.json();

      if (data.success) {
        alert(data.message); // e.g., "Successfully sent to 45 student(s)!"
        
        // Push the new notification to the top of our history list visually
        setSentHistory(prev => [data.newHistoryItem, ...prev]);

        // Reset the form
        setTitle('');
        setMessage('');
        setSelectedDepartments([]);
        setSelectedSemesters([]);
        setNotificationType('all');
      } else {
        alert(data.message || "Failed to send notification.");
      }
    } catch (err) {
      console.error(err);
      alert("A network error occurred while sending.");
    } finally {
      setIsSending(false);
    }
  };

  const SelectedIcon = signIcons.find(i => i.id === selectedIcon)?.icon || Bell;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2>Notifications</h2>
          <p>Compose and send notifications to students</p>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.statBadge}>
            <Bell size={16} />
            <span>{sentHistory.length} Sent</span>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.composeCard}>
          <div className={styles.cardHeader}>
            <Send size={20} />
            <h3>Compose Notification</h3>
          </div>

          {/* Recipients */}
          <div className={styles.formGroup}>
            <label>Recipients</label>
            <div className={styles.recipientOptions}>
              <button
                className={`${styles.recipientBtn} ${notificationType === 'all' ? styles.active : ''}`}
                onClick={() => setNotificationType('all')}
              >
                <Users size={18} />
                All Students
              </button>
              <button
                className={`${styles.recipientBtn} ${notificationType === 'selected' ? styles.active : ''}`}
                onClick={() => setNotificationType('selected')}
              >
                <UserCheck size={18} />
                Selected Students
              </button>
            </div>
          </div>

          {/* Department & Semester dropdowns when selected */}
          {notificationType === 'selected' && (
            <div className={styles.filterRow}>
              {/* Department Dropdown */}
              <div className={styles.formGroup} ref={deptRef}>
                <label>Department</label>
                <div className={styles.customSelect} onClick={() => setDeptDropdownOpen(!deptDropdownOpen)}>
                  <div className={styles.selectDisplay}>
                    {selectedDepartments.length === 0 ? (
                      <span className={styles.placeholder}>Select departments...</span>
                    ) : (
                      <div className={styles.tagList}>
                        {selectedDepartments.map(dept => (
                          <span key={dept} className={styles.tag}>
                            {dept}
                            <X size={14} onClick={(e) => { e.stopPropagation(); toggleDepartment(dept); }} />
                          </span>
                        ))}
                      </div>
                    )}
                    <ChevronDown size={18} className={`${styles.chevron} ${deptDropdownOpen ? styles.open : ''}`} />
                  </div>
                  {deptDropdownOpen && (
                    <div className={styles.dropdownMenu}>
                      {departments.map(dept => (
                        <div
                          key={dept}
                          className={`${styles.dropdownItem} ${selectedDepartments.includes(dept) ? styles.selected : ''}`}
                          onClick={(e) => { e.stopPropagation(); toggleDepartment(dept); }}
                        >
                          <div className={styles.checkIndicator}>
                            {selectedDepartments.includes(dept) && <div className={styles.checkDot} />}
                          </div>
                          {dept}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Semester Dropdown */}
              <div className={styles.formGroup} ref={semRef}>
                <label>Semester</label>
                <div className={styles.customSelect} onClick={() => setSemDropdownOpen(!semDropdownOpen)}>
                  <div className={styles.selectDisplay}>
                    {selectedSemesters.length === 0 ? (
                      <span className={styles.placeholder}>Select semesters...</span>
                    ) : (
                      <div className={styles.tagList}>
                        {selectedSemesters.map(sem => (
                          <span key={sem} className={styles.tag}>
                            Sem {sem}
                            <X size={14} onClick={(e) => { e.stopPropagation(); toggleSemester(sem); }} />
                          </span>
                        ))}
                      </div>
                    )}
                    <ChevronDown size={18} className={`${styles.chevron} ${semDropdownOpen ? styles.open : ''}`} />
                  </div>
                  {semDropdownOpen && (
                    <div className={styles.dropdownMenu}>
                      {semesters.map(sem => (
                        <div
                          key={sem}
                          className={`${styles.dropdownItem} ${selectedSemesters.includes(sem) ? styles.selected : ''}`}
                          onClick={(e) => { e.stopPropagation(); toggleSemester(sem); }}
                        >
                          <div className={styles.checkIndicator}>
                            {selectedSemesters.includes(sem) && <div className={styles.checkDot} />}
                          </div>
                          Semester {sem}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <div className={styles.formGroup}>
            <label>Notification Title</label>
            <input
              type="text"
              placeholder="Enter notification title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Message */}
          <div className={styles.formGroup}>
            <label>Message</label>
            <textarea
              rows="4"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          {/* Notification Type */}
          <div className={styles.formGroup}>
            <label>Category</label>
            <div className={styles.categoryOptions}>
              {['announcement', 'reminder', 'system', 'welcome'].map(cat => (
                <button
                  key={cat}
                  className={`${styles.categoryBtn} ${notifCategory === cat ? styles.active : ''}`}
                  onClick={() => setNotifCategory(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Sign Icon Picker */}
          <div className={styles.formGroup}>
            <label>Attach Icon</label>
            <div className={styles.iconGrid}>
              {signIcons.map(({ id, label, icon: IconComp }) => (
                <button
                  key={id}
                  className={`${styles.iconPickerBtn} ${selectedIcon === id ? styles.active : ''}`}
                  onClick={() => setSelectedIcon(id)}
                  title={label}
                >
                  <IconComp size={20} />
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className={styles.previewBox}>
            <div className={styles.previewLabel}>Preview</div>
            <div className={styles.previewContent}>
              <div className={styles.previewIcon}>
                <SelectedIcon size={20} />
              </div>
              <div>
                <strong>{title || 'Notification Title'}</strong>
                <p>{message || 'Your message will appear here...'}</p>
              </div>
            </div>
          </div>

          {/*  Wired up the button with loading state */}
          <button 
            className={styles.sendBtn} 
            onClick={handleSendNotification}
            disabled={isSending}
            style={{ opacity: isSending ? 0.7 : 1, cursor: isSending ? 'wait' : 'pointer' }}
          >
            {isSending ? <Loader2 size={18} className={styles.spin} /> : <Send size={18} />}
            {isSending ? 'Sending Broadcast...' : 'Send Notification'}
          </button>
        </div>

        <div className={styles.historyCard}>
          <div className={styles.cardHeader}>
            <Clock size={20} />
            <h3>Sent Notifications</h3>
          </div>

          <div className={styles.notificationList}>
            {sentHistory.map((notif) => {
              const NotifIcon = signIcons.find(i => i.id === notif.icon)?.icon || Bell;
              return (
                <div key={notif.id} className={styles.notificationItem}>
                  <div className={`${styles.notifIcon} ${styles[notif.type]}`}>
                    <NotifIcon size={18} />
                  </div>
                  <div className={styles.notifContent}>
                    <h4>{notif.title}</h4>
                    <p>{notif.message}</p>
                    <div className={styles.notifMeta}>
                      <span className={styles.metaBadge}>{notif.recipients}</span>
                      <span>{notif.sentAt}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
import React, { useState } from 'react';
import styles from './NotificationsPage.module.css';

const NotificationsPage = () => {
  const [notificationType, setNotificationType] = useState('all');
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');

  const sentNotifications = [
    { id: 1, title: 'System Maintenance', message: 'Scheduled maintenance on Dec 15th', recipients: 'All Students', sentAt: '2024-03-14 10:00 AM', type: 'system' },
    { id: 2, title: 'New Course Available', message: 'Check out our new Python programming course', recipients: 'All Students', sentAt: '2024-03-13 02:30 PM', type: 'announcement' },
    { id: 3, title: 'Assignment Reminder', message: 'Your assignment is due tomorrow', recipients: 'CS Students', sentAt: '2024-03-12 09:00 AM', type: 'reminder' },
    { id: 4, title: 'Welcome Message', message: 'Welcome to StudyPal!', recipients: 'New Users', sentAt: '2024-03-11 11:00 AM', type: 'welcome' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Notifications</h2>
        <p>Send notifications to students</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.composeCard}>
          <h3>Compose Notification</h3>
          
          <div className={styles.formGroup}>
            <label>Recipients</label>
            <div className={styles.recipientOptions}>
              <button 
                className={`${styles.recipientBtn} ${notificationType === 'all' ? styles.active : ''}`}
                onClick={() => setNotificationType('all')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                All Students
              </button>
              <button 
                className={`${styles.recipientBtn} ${notificationType === 'selected' ? styles.active : ''}`}
                onClick={() => setNotificationType('selected')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <polyline points="17 11 19 13 23 9" />
                </svg>
                Selected Students
              </button>
            </div>
          </div>

          {notificationType === 'selected' && (
            <div className={styles.formGroup}>
              <label>Select Students</label>
              <input type="text" placeholder="Search and select students..." />
            </div>
          )}

          <div className={styles.formGroup}>
            <label>Notification Title</label>
            <input 
              type="text" 
              placeholder="Enter notification title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Message</label>
            <textarea 
              rows="5" 
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          <div className={styles.formGroup}>
            <label>Notification Type</label>
            <select>
              <option value="announcement">Announcement</option>
              <option value="reminder">Reminder</option>
              <option value="system">System</option>
              <option value="welcome">Welcome</option>
            </select>
          </div>

          <div className={styles.sendOptions}>
            <label className={styles.checkbox}>
              <input type="checkbox" />
              <span>Send as email</span>
            </label>
            <label className={styles.checkbox}>
              <input type="checkbox" defaultChecked />
              <span>Send as in-app notification</span>
            </label>
          </div>

          <button className={styles.sendBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            Send Notification
          </button>
        </div>

        <div className={styles.historyCard}>
          <h3>Sent Notifications</h3>
          
          <div className={styles.notificationList}>
            {sentNotifications.map((notif) => (
              <div key={notif.id} className={styles.notificationItem}>
                <div className={`${styles.notifIcon} ${styles[notif.type]}`}>
                  {notif.type === 'system' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                  )}
                  {notif.type === 'announcement' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0" />
                    </svg>
                  )}
                  {notif.type === 'reminder' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  )}
                  {notif.type === 'welcome' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  )}
                </div>
                <div className={styles.notifContent}>
                  <h4>{notif.title}</h4>
                  <p>{notif.message}</p>
                  <div className={styles.notifMeta}>
                    <span>{notif.recipients}</span>
                    <span>{notif.sentAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;

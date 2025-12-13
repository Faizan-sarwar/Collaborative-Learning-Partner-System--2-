import React, { useState } from 'react';
import styles from './ActivityLogs.module.css';

const mockLogs = [
  { id: 1, action: 'User Login', user: 'john.smith@email.com', userType: 'student', ip: '192.168.1.1', time: '2024-03-15 10:30:45', status: 'success' },
  { id: 2, action: 'Student Blocked', user: 'admin@studypal.com', userType: 'admin', ip: '192.168.1.2', time: '2024-03-15 10:25:12', status: 'success' },
  { id: 3, action: 'Failed Login Attempt', user: 'unknown@email.com', userType: 'unknown', ip: '192.168.1.100', time: '2024-03-15 10:20:00', status: 'failed' },
  { id: 4, action: 'Course Created', user: 'admin@studypal.com', userType: 'admin', ip: '192.168.1.2', time: '2024-03-15 10:15:30', status: 'success' },
  { id: 5, action: 'User Registration', user: 'newuser@email.com', userType: 'student', ip: '192.168.1.50', time: '2024-03-15 10:10:00', status: 'success' },
  { id: 6, action: 'Settings Updated', user: 'superadmin@studypal.com', userType: 'admin', ip: '192.168.1.1', time: '2024-03-15 10:05:00', status: 'success' },
  { id: 7, action: 'Password Reset', user: 'sarah.j@email.com', userType: 'student', ip: '192.168.1.75', time: '2024-03-15 10:00:00', status: 'success' },
  { id: 8, action: 'Database Backup', user: 'system', userType: 'system', ip: 'localhost', time: '2024-03-15 09:00:00', status: 'success' },
];

const ActivityLogs = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || log.userType === filter || log.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusClass = (status) => {
    return status === 'success' ? styles.success : styles.failed;
  };

  const getUserTypeClass = (userType) => {
    switch (userType) {
      case 'admin': return styles.admin;
      case 'student': return styles.student;
      case 'system': return styles.system;
      default: return styles.unknown;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>Activity Logs</h2>
          <span className={styles.count}>{filteredLogs.length} entries</span>
        </div>
        <button className={styles.exportBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export Logs
        </button>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filterButtons}>
          {['all', 'admin', 'student', 'system', 'success', 'failed'].map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.logsCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Action</th>
                <th>User</th>
                <th>Type</th>
                <th>IP Address</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td className={styles.action}>{log.action}</td>
                  <td className={styles.user}>{log.user}</td>
                  <td>
                    <span className={`${styles.userType} ${getUserTypeClass(log.userType)}`}>
                      {log.userType}
                    </span>
                  </td>
                  <td className={styles.ip}>{log.ip}</td>
                  <td className={styles.time}>{log.time}</td>
                  <td>
                    <span className={`${styles.status} ${getStatusClass(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.pagination}>
        <button className={styles.pageBtn} disabled>Previous</button>
        <div className={styles.pageNumbers}>
          <button className={`${styles.pageNum} ${styles.active}`}>1</button>
          <button className={styles.pageNum}>2</button>
          <button className={styles.pageNum}>3</button>
        </div>
        <button className={styles.pageBtn}>Next</button>
      </div>
    </div>
  );
};

export default ActivityLogs;

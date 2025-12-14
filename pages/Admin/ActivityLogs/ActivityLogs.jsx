import React, { useEffect, useState } from 'react';
import styles from './ActivityLogs.module.css';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch logs from backend
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/activity-logs');
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch activity logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // 🔹 Filtering Logic
  const filteredLogs = logs.filter((log) => {
    // Safety check: ensure properties exist before calling toLowerCase
    const action = log.action ? log.action.toLowerCase() : '';
    const user = log.user ? log.user.toLowerCase() : '';
    const term = searchTerm.toLowerCase();

    const matchesSearch = action.includes(term) || user.includes(term);

    const matchesFilter =
      filter === 'all' ||
      (log.userType && log.userType === filter) ||
      (log.status && log.status === filter);

    return matchesSearch && matchesFilter;
  });

  const getStatusClass = (status) =>
    status === 'success' ? styles.success : styles.failed;

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
          <span className={styles.count}>
            {filteredLogs.length} entries
          </span>
        </div>
        <div className={styles.headerActions}>
          {/* Added a refresh button for convenience */}
          <button className={styles.refreshBtn} onClick={fetchLogs} title="Refresh Logs">
            ↻
          </button>
          <button className={styles.exportBtn}>
            Export Logs
          </button>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchBox}>
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
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                    Loading...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                    No activity found
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log._id}>
                    <td>{log.action}</td>
                    <td>{log.user || 'Unknown User'}</td>
                    <td>
                      <span className={`${styles.userType} ${getUserTypeClass(log.userType)}`}>
                        {log.userType === 'unknown' ? 'Visitor' : log.userType}
                      </span>
                    </td>
                    <td>{log.ip}</td>
                    <td>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td>
                      <span className={`${styles.status} ${getStatusClass(log.status)}`}>
                        {log.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.pagination}>
        <button className={styles.pageBtn} disabled>Previous</button>
        <div className={styles.pageNumbers}>
          <button className={`${styles.pageNum} ${styles.active}`}>1</button>
        </div>
        <button className={styles.pageBtn} disabled>Next</button>
      </div>
    </div>
  );
};

export default ActivityLogs;
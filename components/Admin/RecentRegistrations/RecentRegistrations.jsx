import React, { useEffect, useState } from 'react';
import styles from './RecentRegistrations.module.css';

const RecentRegistrations = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ================= FETCH RECENT REGISTRATIONS =================
  const fetchRecentRegistrations = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/auth/admin/recent-registrations');
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch recent registrations');
      }

      setStudents(data.users);
      setError(null);
    } catch (err) {
      console.error('Recent registrations fetch error:', err);
      setError('Unable to load recent registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentRegistrations();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchRecentRegistrations, 30000);
    return () => clearInterval(interval);
  }, []);

  // ================= TIME FORMATTER =================
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'min', seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
      }
    }

    return 'Just now';
  };

  // ================= LOADING / ERROR =================
  if (loading) {
    return <div className={styles.card}>Loading recent registrations...</div>;
  }

  if (error) {
    return <div className={styles.card}>{error}</div>;
  }

  // ================= RENDER =================
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>Recent Registrations</h3>
        <button className={styles.viewAllBtn}>View All</button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Status</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>
                  No recent registrations
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student._id}>
                  <td>
                    <div className={styles.studentInfo}>
                      <div className={styles.avatar}>
                        {student.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </div>
                      <div className={styles.details}>
                        <span className={styles.name}>{student.fullName}</span>
                        <span className={styles.email}>{student.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`${styles.status} ${student.approved ? styles.active : styles.pending
                        }`}
                    >
                      {student.approved ? 'active' : 'pending'}
                    </span>
                  </td>
                  <td className={styles.date}>
                    {timeAgo(student.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentRegistrations;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Loader2, AlertCircle } from 'lucide-react';
import styles from './RecentRegistrations.module.css';

const RecentRegistrations = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ================= FETCH RECENT REGISTRATIONS =================
  const fetchRecentRegistrations = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) throw new Error('Authentication token missing.');

      const res = await fetch(`http://${window.location.hostname}:5000/api/auth/admin/recent-registrations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch recent registrations');
      }

      setStudents((data.users || []).slice(0, 5));
      setError(null);
    } catch (err) {
      console.error('Recent registrations fetch error:', err);
      if (students.length === 0) setError('Unable to load recent registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentRegistrations();
    // Poll every 30 seconds to keep the Online/Offline statuses fresh
    const interval = setInterval(fetchRecentRegistrations, 30000);
    return () => clearInterval(interval);
  }, []);

  // ================= ENTERPRISE TIME FORMATTER =================
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

  const getInitials = (name) => {
      if (!name) return 'ST';
      return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // ================= ONLINE/OFFLINE STATUS DETERMINATION =================
  const getStudentStatus = (student) => {
    // 1. Check if they are blocked by an admin first
    if (student.approved === false) {
      return { label: 'Blocked', className: styles.pending };
    }

    // 2. Replicate the backend 15-minute timeout logic
    const now = new Date();
    const lastLoginTime = new Date(student.lastLogin || 0);
    const fifteenMinutes = 15 * 60 * 1000;

    // Evaluates to true ONLY if isOnline is true AND they logged in within the last 15 mins
    const isActuallyOnline = student.isOnline && (now - lastLoginTime < fifteenMinutes);

    if (isActuallyOnline) {
      return { label: 'Online', className: styles.active }; // Needs to map to green in CSS
    }
    
    return { label: 'Offline', className: styles.offline }; // Needs to map to gray in CSS
  };

  // ================= LOADING / ERROR STATES =================
  if (loading && students.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.centerState}>
           <Loader2 size={28} className={styles.spinner} />
           <p>Loading latest users...</p>
        </div>
      </div>
    );
  }

  if (error && students.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.centerState}>
           <AlertCircle size={28} color="#ef4444" />
           <p className={styles.errorText}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <div className={styles.iconWrapper}>
            <Users size={18} />
          </div>
          <div>
            <h3>New Students</h3>
            <span className={styles.subtitle}>Latest platform signups</span>
          </div>
        </div>
        <button className={styles.viewAllBtn} onClick={() => navigate('/admin/students')}>
            View All
        </button>
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
                <td colSpan="3">
                  <div className={styles.emptyState}>No recent registrations</div>
                </td>
              </tr>
            ) : (
              students.map((student) => {
                const statusInfo = getStudentStatus(student);
                return (
                  <tr key={student._id}>
                    <td>
                      <div className={styles.studentInfo}>
                        <div className={styles.avatarWrapper}>
                          {student.picture ? (
                             <img 
                                src={`http://localhost:5000/api/auth/student/${student._id}/picture`} 
                                alt={student.fullName} 
                                className={styles.avatarImg}
                                onError={(e) => e.target.style.display = 'none'} 
                             />
                          ) : (
                             <div className={styles.avatarInitials}>
                                {getInitials(student.fullName)}
                             </div>
                          )}
                        </div>
                        <div className={styles.details}>
                          <span className={styles.name}>{student.fullName || 'Unknown User'}</span>
                          <span className={styles.email}>{student.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.status} ${statusInfo.className}`}>
                        <span className={styles.statusDot}></span>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className={styles.date}>
                      {timeAgo(student.createdAt)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentRegistrations;
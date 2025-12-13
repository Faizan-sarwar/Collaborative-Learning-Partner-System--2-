import React from 'react';
import styles from './RecentRegistrations.module.css';

const recentStudents = [
  { id: 1, name: 'John Smith', email: 'john.smith@email.com', date: '2 min ago', status: 'active' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.j@email.com', date: '15 min ago', status: 'active' },
  { id: 3, name: 'Mike Brown', email: 'mike.b@email.com', date: '1 hour ago', status: 'pending' },
  { id: 4, name: 'Emily Davis', email: 'emily.d@email.com', date: '2 hours ago', status: 'active' },
  { id: 5, name: 'Chris Wilson', email: 'chris.w@email.com', date: '3 hours ago', status: 'active' },
];

const RecentRegistrations = () => {
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
            {recentStudents.map((student) => (
              <tr key={student.id}>
                <td>
                  <div className={styles.studentInfo}>
                    <div className={styles.avatar}>
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className={styles.details}>
                      <span className={styles.name}>{student.name}</span>
                      <span className={styles.email}>{student.email}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`${styles.status} ${styles[student.status]}`}>
                    {student.status}
                  </span>
                </td>
                <td className={styles.date}>{student.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentRegistrations;

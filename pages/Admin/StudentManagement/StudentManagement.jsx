import React, { useState } from 'react';
import styles from './StudentManagement.module.css';

const mockStudents = [
  { id: 1, name: 'John Smith', email: 'john.smith@email.com', username: 'johnsmith', department: 'Computer Science', status: 'active', joinedDate: '2024-01-15' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.j@email.com', username: 'sarahj', department: 'Mathematics', status: 'active', joinedDate: '2024-01-20' },
  { id: 3, name: 'Mike Brown', email: 'mike.b@email.com', username: 'mikeb', department: 'Physics', status: 'inactive', joinedDate: '2024-02-01' },
  { id: 4, name: 'Emily Davis', email: 'emily.d@email.com', username: 'emilyd', department: 'Chemistry', status: 'active', joinedDate: '2024-02-10' },
  { id: 5, name: 'Chris Wilson', email: 'chris.w@email.com', username: 'chrisw', department: 'Biology', status: 'blocked', joinedDate: '2024-02-15' },
  { id: 6, name: 'Jessica Lee', email: 'jessica.l@email.com', username: 'jessical', department: 'Engineering', status: 'active', joinedDate: '2024-02-20' },
  { id: 7, name: 'David Martinez', email: 'david.m@email.com', username: 'davidm', department: 'Computer Science', status: 'active', joinedDate: '2024-03-01' },
  { id: 8, name: 'Amanda White', email: 'amanda.w@email.com', username: 'amandaw', department: 'Mathematics', status: 'inactive', joinedDate: '2024-03-05' },
];

const StudentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const toggleSelectStudent = (id) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter(sid => sid !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>All Students</h2>
          <span className={styles.count}>{filteredStudents.length} students</span>
        </div>
        <button className={styles.addBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Student
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
            placeholder="Search by name, email, or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filterButtons}>
          {['all', 'active', 'inactive', 'blocked'].map((status) => (
            <button
              key={status}
              className={`${styles.filterBtn} ${statusFilter === status ? styles.active : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {selectedStudents.length > 0 && (
        <div className={styles.bulkActions}>
          <span>{selectedStudents.length} selected</span>
          <div className={styles.bulkButtons}>
            <button className={styles.bulkBtn}>Activate</button>
            <button className={styles.bulkBtn}>Deactivate</button>
            <button className={`${styles.bulkBtn} ${styles.danger}`}>Block</button>
            <button className={`${styles.bulkBtn} ${styles.danger}`}>Delete</button>
          </div>
        </div>
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Student</th>
              <th>Username</th>
              <th>Department</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => toggleSelectStudent(student.id)}
                  />
                </td>
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
                <td className={styles.username}>@{student.username}</td>
                <td>{student.department}</td>
                <td>
                  <span className={`${styles.status} ${styles[student.status]}`}>
                    {student.status}
                  </span>
                </td>
                <td className={styles.date}>{student.joinedDate}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.actionBtn} title="View">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    <button className={styles.actionBtn} title="Edit">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button className={`${styles.actionBtn} ${styles.danger}`} title="Delete">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default StudentManagement;

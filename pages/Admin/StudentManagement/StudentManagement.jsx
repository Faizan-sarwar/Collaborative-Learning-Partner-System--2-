import React, { useState, useEffect } from 'react';
import styles from './StudentManagement.module.css';

const departments = ['Information Technology', 'Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];
const statuses = ['active', 'inactive', 'blocked'];

const StudentManagement = () => {
  // 🔹 State for Real Data
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Filter & UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudents, setSelectedStudents] = useState([]);
  
  // 🔹 Modal States
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'view', 'edit', 'delete'
  const [selectedStudent, setSelectedStudent] = useState(null);

  // 🔹 Fetch Students from Backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/admin/students');
        const data = await res.json();
        
        if (data.success) {
          // Map backend data to frontend structure
          const formattedStudents = data.students.map(s => ({
            id: s.id,
            name: s.name,
            email: s.email,
            username: s.username, // Using roll number as username based on auth.js
            department: s.department,
            status: s.status,
            joinedDate: s.joinedDate,
            semester: s.semester || 'N/A', // Handle if backend doesn't send semester yet
            rollNumber: s.username 
          }));
          setStudents(formattedStudents);
        }
      } catch (err) {
        console.error('Failed to fetch students', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // 🔹 Filtering Logic
  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      (student.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (student.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (student.username?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // 🔹 Selection Logic
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

  //  Modal Handlers
  const openModal = (mode, student = null) => {
    setModalMode(mode);
    setSelectedStudent(student);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };  

  // 🔹 Form Submission Handlers (Currently UI Only)
  const handleSaveStudent = (e) => {
    e.preventDefault();
    // TODO: Connect this to a POST/PUT API endpoint in auth.js
    console.log("Saving student logic goes here...");
    closeModal();
  };

  const handleDeleteStudent = () => {
    // TODO: Connect this to a DELETE API endpoint in auth.js
    if (selectedStudent) {
      setStudents(students.filter(s => s.id !== selectedStudent.id));
    }
    closeModal();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>All Students</h2>
          <span className={styles.count}>
            {loading ? 'Loading...' : `${filteredStudents.length} students`}
          </span>
        </div>
        <button className={styles.addBtn} onClick={() => openModal('add')}>
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
            {loading ? (
              <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>Loading Data...</td></tr>
            ) : filteredStudents.length === 0 ? (
               <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>No students found.</td></tr>
            ) : (
              filteredStudents.map((student) => (
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
                        {student.name ? student.name.split(' ').map(n => n[0]).join('') : '?'}
                      </div>
                      <div className={styles.details}>
                        <span className={styles.name}>{student.name}</span>
                        <span className={styles.email}>{student.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className={styles.username}>{student.username}</td>
                  <td>{student.department}</td>
                  <td>
                    <span className={`${styles.status} ${styles[student.status]}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className={styles.date}>{student.joinedDate}</td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.actionBtn} title="View" onClick={() => openModal('view', student)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                      <button className={styles.actionBtn} title="Edit" onClick={() => openModal('edit', student)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button className={`${styles.actionBtn} ${styles.danger}`} title="Delete" onClick={() => openModal('delete', student)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <button className={styles.pageBtn} disabled>Previous</button>
        <div className={styles.pageNumbers}>
          <button className={`${styles.pageNum} ${styles.active}`}>1</button>
        </div>
        <button className={styles.pageBtn} disabled>Next</button>
      </div>

      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>
                {modalMode === 'add' && 'Add New Student'}
                {modalMode === 'view' && 'Student Details'}
                {modalMode === 'edit' && 'Edit Student'}
                {modalMode === 'delete' && 'Delete Student'}
              </h3>
              <button className={styles.closeBtn} onClick={closeModal}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {modalMode === 'delete' ? (
              <div className={styles.deleteConfirm}>
                <div className={styles.deleteIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <p>Are you sure you want to delete <strong>{selectedStudent?.name}</strong>?</p>
                <p className={styles.deleteWarning}>This action cannot be undone. All student data will be permanently removed.</p>
                <div className={styles.modalActions}>
                  <button className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                  <button className={styles.deleteBtn} onClick={handleDeleteStudent}>Delete Student</button>
                </div>
              </div>
            ) : modalMode === 'view' ? (
              <div className={styles.viewMode}>
                <div className={styles.viewHeader}>
                  <div className={styles.avatarLarge}>
                    {selectedStudent?.name?.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4>{selectedStudent?.name}</h4>
                    <p>@{selectedStudent?.username}</p>
                  </div>
                </div>
                <div className={styles.viewRow}>
                  <div className={styles.viewField}>
                    <label>Email</label>
                    <span>{selectedStudent?.email}</span>
                  </div>
                  <div className={styles.viewField}>
                    <label>Roll Number</label>
                    <span>{selectedStudent?.rollNumber}</span>
                  </div>
                </div>
                <div className={styles.viewRow}>
                  <div className={styles.viewField}>
                    <label>Department</label>
                    <span>{selectedStudent?.department}</span>
                  </div>
                  <div className={styles.viewField}>
                    <label>Semester</label>
                    <span>{selectedStudent?.semester}</span>
                  </div>
                </div>
                <div className={styles.viewRow}>
                  <div className={styles.viewField}>
                    <label>Status</label>
                    <span className={`${styles.status} ${styles[selectedStudent?.status]}`}>{selectedStudent?.status}</span>
                  </div>
                  <div className={styles.viewField}>
                    <label>Joined Date</label>
                    <span>{selectedStudent?.joinedDate}</span>
                  </div>
                </div>
                <div className={styles.modalActions}>
                  <button className={styles.cancelBtn} onClick={closeModal}>Close</button>
                  <button className={styles.submitBtn} onClick={() => setModalMode('edit')}>Edit Student</button>
                </div>
              </div>
            ) : (
              <form className={styles.modalForm} onSubmit={handleSaveStudent}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Full Name</label>
                    <input type="text" placeholder="Enter full name" defaultValue={selectedStudent?.name || ''} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Username</label>
                    <input type="text" placeholder="Enter username" defaultValue={selectedStudent?.username || ''} required />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Email</label>
                    <input type="email" placeholder="Enter email" defaultValue={selectedStudent?.email || ''} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Roll Number</label>
                    <input type="text" placeholder="Enter roll number" defaultValue={selectedStudent?.rollNumber || ''} required />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Department</label>
                    <select defaultValue={selectedStudent?.department || ''} required>
                      <option value="">Select department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Semester</label>
                    <input type="text" placeholder="e.g., 4th" defaultValue={selectedStudent?.semester || ''} />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Status</label>
                  <select defaultValue={selectedStudent?.status || 'active'}>
                    {statuses.map(status => (
                      <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                  <button type="submit" className={styles.submitBtn}>
                    {modalMode === 'add' ? 'Add Student' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
import React, { useState, useEffect } from 'react';
import styles from './StudentManagement.module.css';

const departments = ['Information Technology', 'Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];
const statuses = ['active', 'logged out', 'blocked'];

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    semester: '',
    status: ''
  });

  // 🔹 Fetch Students
  const fetchStudents = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      const res = await fetch('http://localhost:5000/api/auth/admin/students');
      const data = await res.json();
      
      if (data.success) {
        const formattedStudents = data.students.map(s => ({
          id: s.id,
          name: s.name,
          email: s.email,
          username: s.username,
          department: s.department || 'N/A',
          semester: s.semester || 'N/A',
          status: s.status, 
          // 🔹 Use backend provided lastLogin or fallback
          lastLogin: s.lastLogin ? new Date(s.lastLogin).toLocaleString('en-US', {
             month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
          }) : 'Never',
          joinedDate: new Date(s.joinedDate).toLocaleDateString(),
          rollNumber: s.username 
        }));
        setStudents(formattedStudents);
      }
    } catch (err) {
      console.error('Failed to fetch students', err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  // 🔹 Auto-Refresh (10s)
  useEffect(() => {
    fetchStudents(); 
    const interval = setInterval(() => {
      fetchStudents(true); 
    }, 10000); 
    return () => clearInterval(interval); 
  }, []);

  // 🔹 Handlers
  const openModal = (mode, student = null) => {
    setModalMode(mode);
    setSelectedStudent(student);
    if (student && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: student.name,
        email: student.email,
        department: student.department,
        semester: student.semester,
        status: student.status === 'blocked' ? 'blocked' : 'active'
      });
    } else {
        setFormData({ name: '', email: '', department: '', semester: '', status: 'active' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    const url = modalMode === 'add' 
        ? 'http://localhost:5000/api/auth/signup' 
        : `http://localhost:5000/api/auth/admin/students/${selectedStudent.id}`;
    
    const method = modalMode === 'add' ? 'POST' : 'PUT';

    const payload = modalMode === 'add' 
        ? { 
            fullName: formData.name, 
            email: formData.email, 
            department: formData.department, 
            semester: formData.semester, 
            password: 'Student123!', 
            role: 'student', 
            approved: true 
          }
        : { ...formData };

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        
        if (data.success || res.ok) {
            alert(modalMode === 'add' ? 'Student added!' : 'Student updated!');
            fetchStudents();
            closeModal();
        } else {
            alert(data.message || 'Operation failed');
        }
    } catch (err) {
        console.error(err);
        alert('Server Error');
    }
  };

  const handleDeleteStudent = async () => {
    if (!selectedStudent) return;
    try {
        const res = await fetch(`http://localhost:5000/api/auth/admin/students/${selectedStudent.id}`, {
            method: 'DELETE'
        });
        const data = await res.json();
        
        if (data.success) {
            alert('Student deleted successfully.');
            fetchStudents(); 
            closeModal();
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error(err);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      (student.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (student.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (student.username?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
      if (status === 'active') return styles.active;
      if (status === 'blocked') return styles.blocked;
      return styles.inactive;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>All Students</h2>
          <span className={styles.count}>
            {filteredStudents.length} students found
          </span>
        </div>
        
        <div style={{display:'flex', gap:'10px'}}>
            <button className={styles.addBtn} onClick={() => fetchStudents()} title="Refresh List">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6"></path>
                <path d="M1 20v-6h6"></path>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
            </button>
            <button className={styles.addBtn} onClick={() => openModal('add')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Student
            </button>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filterButtons}>
          <button 
            className={`${styles.filterBtn} ${statusFilter === 'all' ? styles.active : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All
          </button>
          {statuses.map((status) => (
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

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Roll Number</th>
              <th>Department</th>
              <th>Status</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>Loading Data...</td></tr>
            ) : filteredStudents.length === 0 ? (
               <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No students found.</td></tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className={styles.studentInfo}>
                      {/* 🔹 Avatar Logic */}
                      <div className={styles.avatar}>
                        <img 
                            src={`http://localhost:5000/api/auth/student/${student.id}/picture`} 
                            alt="Profile"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', display: 'block' }}
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                        <div style={{ display: 'none', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#4f46e5' }}>
                            {student.name ? student.name.charAt(0).toUpperCase() : '?'}
                        </div>
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
                    <span className={`${styles.status} ${getStatusClass(student.status)}`}>
                      {student.status === 'active' ? 'Active' : 
                       student.status === 'blocked' ? 'Blocked' : 'Logged Out'}
                    </span>
                  </td>

                  <td className={styles.date} style={{color: student.status === 'active' ? '#10b981' : '#666'}}>
                    {student.lastLogin}
                  </td>

                  <td>
                    <div className={styles.actions}>
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

      {/* Modals */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{modalMode === 'delete' ? 'Delete Student' : 'Edit Student'}</h3>
              <button className={styles.closeBtn} onClick={closeModal}>×</button>
            </div>

            {modalMode === 'delete' ? (
              <div className={styles.deleteConfirm}>
                <p>Are you sure you want to delete <strong>{selectedStudent?.name}</strong>?</p>
                <p className={styles.deleteWarning}>
                    This will remove them from the database immediately. <br/>
                    They will see "Data does not exist" upon login.
                </p>
                <div className={styles.modalActions}>
                  <button className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                  <button className={styles.deleteBtn} onClick={handleDeleteStudent}>Delete</button>
                </div>
              </div>
            ) : (
              <form className={styles.modalForm} onSubmit={handleSaveStudent}>
                <div className={styles.formGroup}>
                    <label>Full Name</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                    <label>Email</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                    <label>Department</label>
                    <select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})}>
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label>Account Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                        <option value="active">Active / Allowed</option>
                        <option value="blocked">Blocked (Login Disabled)</option>
                    </select>
                </div>
                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                  <button type="submit" className={styles.submitBtn}>Save Changes</button>
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
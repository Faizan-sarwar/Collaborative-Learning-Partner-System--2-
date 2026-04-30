import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, RefreshCw, Edit, Trash2, X, 
  AlertCircle, Loader2, User, Mail, BookOpen, ShieldAlert, CheckCircle2 
} from 'lucide-react';
import styles from './StudentManagement.module.css';

const departments = ['Information Technology', 'Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];
const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];
const statuses = ['active', 'logged out', 'blocked'];

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', department: departments[0], semester: semesters[0], status: 'active'
  });

  const syncInterval = useRef(null);

  const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

  // 🟢 SECURE FETCH STUDENTS
  const fetchStudents = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      const token = getToken();
      if (!token) throw new Error("Authentication token missing");

      const res = await fetch(`http://${window.location.hostname}:5000/api/auth/admin/students`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success && Array.isArray(data.students)) {
        const formattedStudents = data.students.map(s => ({
          id: s.id || s._id,
          name: s.name || s.fullName,
          email: s.email,
          username: s.username || s.rollNumber,
          department: s.department || 'N/A',
          semester: s.semester || 'N/A',
          status: s.status || (s.approved ? 'active' : 'blocked'),
          lastLogin: s.lastLogin ? new Date(s.lastLogin).toLocaleString('en-US', {
             month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
          }) : 'Never',
          joinedDate: s.joinedDate ? new Date(s.joinedDate).toLocaleDateString() : 'N/A',
        }));
        setStudents(formattedStudents);
        setError(null);
      } else {
        throw new Error(data.message || "Failed to load students");
      }
    } catch (err) {
      console.error('Failed to fetch students', err);
      if (!isBackground) setError("Unable to load student directory.");
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(false); 
    syncInterval.current = setInterval(() => { fetchStudents(true); }, 10000); // 10s background poll
    return () => { if (syncInterval.current) clearInterval(syncInterval.current); };
  }, []);

  const openModal = (mode, student = null) => {
    setModalMode(mode);
    setSelectedStudent(student);
    if (student && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: student.name,
        email: student.email,
        department: student.department || departments[0],
        semester: student.semester || semesters[0],
        status: student.status === 'blocked' ? 'blocked' : 'active'
      });
    } else {
        setFormData({ name: '', email: '', department: departments[0], semester: semesters[0], status: 'active' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  // 🟢 SECURE SAVE STUDENT
  const handleSaveStudent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const url = modalMode === 'add' 
        ? `http://${window.location.hostname}:5000/api/auth/signup` 
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
            approved: formData.status === 'active',
            rollNumber: `STD-${Math.floor(1000 + Math.random() * 9000)}`, 
            gender: 'Male', 
            studyStyle: 'Individual Study' 
          }
        : { 
            name: formData.name, email: formData.email, department: formData.department, semester: formData.semester, status: formData.status
          };

    try {
        const res = await fetch(url, {
            method,
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        
        if (data.success || res.ok) {
            fetchStudents(true);
            closeModal();
        } else {
            alert(data.message || 'Operation failed');
        }
    } catch (err) {
        alert('Server Error connecting to database.');
    } finally {
        setIsSubmitting(false);
    }
  };

  // 🟢 SECURE DELETE
  const handleDeleteStudent = async () => {
    if (!selectedStudent) return;
    setIsSubmitting(true);
    try {
        const res = await fetch(`http://localhost:5000/api/auth/admin/students/${selectedStudent.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const data = await res.json();
        
        if (data.success) {
            fetchStudents(true); 
            closeModal();
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error(err);
    } finally {
        setIsSubmitting(false);
    }
  };

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'ST';

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

  const formatStatusText = (status) => {
      if (status === 'active') return 'Active';
      if (status === 'blocked') return 'Blocked';
      return 'Logged Out';
  };

  return (
    <div className={styles.container}>
      {/* 🟢 HEADER */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>Student Directory</h2>
          <span className={styles.count}>{filteredStudents.length} students found</span>
        </div>
        
        <div className={styles.headerActions}>
            <button className={styles.refreshBtn} onClick={() => fetchStudents(false)} title="Force Manual Refresh">
              <RefreshCw size={18} />
            </button>
            <button className={styles.addBtn} onClick={() => openModal('add')}>
              <Plus size={18} /> Add Student
            </button>
        </div>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {/* 🟢 FILTERS */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input type="text" placeholder="Search by name, email, or roll number..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className={styles.filterButtons}>
          <button className={`${styles.filterBtn} ${statusFilter === 'all' ? styles.activeFilter : ''}`} onClick={() => setStatusFilter('all')}>All</button>
          {statuses.map((status) => (
            <button key={status} className={`${styles.filterBtn} ${statusFilter === status ? styles.activeFilter : ''}`} onClick={() => setStatusFilter(status)}>
              {formatStatusText(status)}
            </button>
          ))}
        </div>
      </div>

      {/* 🟢 TABLE */}
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
            {loading && students.length === 0 ? (
              <tr><td colSpan="6"><div className={styles.centerState}><Loader2 size={24} className={styles.spinner}/><span>Loading Directory...</span></div></td></tr>
            ) : filteredStudents.length === 0 ? (
               <tr><td colSpan="6"><div className={styles.centerState}><User size={24} color="var(--text-muted)"/><span>No students found.</span></div></td></tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className={styles.studentInfo}>
                      <div className={styles.avatarWrapper}>
                        {student.id ? (
                           <img 
                              src={`http://localhost:5000/api/auth/student/${student.id}/picture`} 
                              alt="Profile"
                              className={styles.avatarImg}
                              onError={(e) => e.target.style.display = 'none'}
                           />
                        ) : null}
                        <div className={styles.avatarInitials}>{getInitials(student.name)}</div>
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
                    <span className={`${styles.statusBadge} ${getStatusClass(student.status)}`}>
                      <span className={styles.statusDot}></span> {formatStatusText(student.status)}
                    </span>
                  </td>
                  <td className={styles.date} style={{color: student.status === 'active' ? '#10b981' : 'var(--text-secondary)'}}>
                    {student.lastLogin}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.actionBtn} title="View Details" onClick={() => openModal('view', student)}>
                        <User size={16} />
                      </button>
                      <button className={styles.actionBtn} title="Edit Student" onClick={() => openModal('edit', student)}>
                        <Edit size={16} />
                      </button>
                      <button className={`${styles.actionBtn} ${styles.danger}`} title="Delete" onClick={() => openModal('delete', student)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🟢 MODALS */}
      <AnimatePresence>
        {showModal && (
          <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal}>
            <motion.div className={styles.modal} initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>{modalMode === 'delete' ? 'Remove Student' : modalMode === 'add' ? 'Add New Student' : modalMode === 'view' ? 'Student Profile' : 'Edit Student'}</h3>
                <button className={styles.closeBtn} onClick={closeModal}><X size={20} /></button>
              </div>

              {/* DELETE MODE */}
              {modalMode === 'delete' ? (
                <div className={styles.deleteConfirm}>
                  <div className={styles.deleteIcon}><ShieldAlert size={40} /></div>
                  <h4>Are you sure you want to delete {selectedStudent?.name}?</h4>
                  <p className={styles.deleteWarning}>This will permanently remove their data from the database. This action cannot be undone.</p>
                  <div className={styles.modalActions}>
                    <button className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                    <button className={styles.deleteBtn} onClick={handleDeleteStudent} disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 size={16} className={styles.spinnerIcon} /> : <Trash2 size={16} />} Delete
                    </button>
                  </div>
                </div>
              ) : modalMode === 'view' ? (
                /* VIEW MODE */
                <div className={styles.viewMode}>
                   <div className={styles.viewHeader}>
                      <div className={styles.avatarLarge}>{getInitials(selectedStudent?.name)}</div>
                      <div>
                          <h4>{selectedStudent?.name}</h4>
                          <p>{selectedStudent?.email}</p>
                      </div>
                   </div>
                   <div className={styles.viewRow}>
                      <div className={styles.viewField}><label>Department</label><span>{selectedStudent?.department}</span></div>
                      <div className={styles.viewField}><label>Semester</label><span>{selectedStudent?.semester}</span></div>
                      <div className={styles.viewField}><label>Status</label><span className={`${styles.statusBadge} ${getStatusClass(selectedStudent?.status)}`}>{formatStatusText(selectedStudent?.status)}</span></div>
                      <div className={styles.viewField}><label>Joined Date</label><span>{selectedStudent?.joinedDate}</span></div>
                   </div>
                   <div className={styles.modalActions}>
                      <button className={styles.cancelBtn} onClick={closeModal}>Close</button>
                      <button className={styles.submitBtn} onClick={() => setModalMode('edit')}><Edit size={16} /> Edit Student</button>
                   </div>
                </div>
              ) : (
                /* ADD / EDIT MODE */
                <form className={styles.modalForm} onSubmit={handleSaveStudent}>
                  <div className={styles.formGroup}>
                      <label>Full Name</label>
                      <input type="text" placeholder="Enter full name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className={styles.formGroup}>
                      <label>Email Address</label>
                      <input type="email" placeholder="student@university.edu" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                  </div>
                  <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                          <label>Department</label>
                          <select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})}>
                              {departments.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                      </div>
                      <div className={styles.formGroup}>
                          <label>Semester</label>
                          <select value={formData.semester} onChange={(e) => setFormData({...formData, semester: e.target.value})}>
                              {semesters.map(s => <option key={s} value={s}>Semester {s}</option>)}
                          </select>
                      </div>
                  </div>
                  <div className={styles.formGroup}>
                      <label>Account Status</label>
                      <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                          <option value="active">Active (Allowed)</option>
                          <option value="blocked">Blocked (Login Disabled)</option>
                      </select>
                  </div>
                  <div className={styles.modalActions}>
                    <button type="button" className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                    <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 size={16} className={styles.spinnerIcon} /> : <CheckCircle2 size={16} />} 
                        {modalMode === 'add' ? 'Create Student' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentManagement;
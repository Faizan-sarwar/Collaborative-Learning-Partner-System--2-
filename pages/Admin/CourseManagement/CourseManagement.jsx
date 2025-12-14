import React, { useState, useEffect } from 'react';
import styles from './CourseManagement.module.css';

// Categories for classification (Frontend Only)
const categories = ['Core Subject', 'Technical', 'Advanced', 'Elective'];

const CourseManagement = () => {
  // 🔹 State for Real Data
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedCourse, setSelectedCourse] = useState(null);

  // 🔹 Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Core Subject',
    status: 'active',
    description: ''
  });

  // 🔹 Fetch Courses from Backend
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/studygroup'); 
      const data = await res.json();
      
      if (data.success) {
        const mappedCourses = data.groups.map(g => ({
          id: g._id,
          title: g.name || 'Untitled',
          category: (g.subjects && g.subjects.length > 0) ? 'Technical' : 'Core Subject', 
          students: (g.members && Array.isArray(g.members)) ? g.members.length : 0,
          status: g.active ? 'active' : 'disabled',
          createdAt: g.createdAt ? new Date(g.createdAt).toLocaleDateString() : 'N/A',
          description: g.description || ''
        }));
        setCourses(mappedCourses);
      }
    } catch (err) {
      console.error('Failed to fetch courses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // 🔹 Calculate Stats (Live)
  const totalCourses = courses.length;
  const activeCourses = courses.filter(c => c.status === 'active').length;
  const disabledCourses = courses.filter(c => c.status === 'disabled').length;
  const totalEnrollments = courses.reduce((total, course) => total + (Number(course.students) || 0), 0);

  // 🔹 Filter Logic
  const filteredCourses = courses.filter((course) =>
    (course.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (course.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // 🔹 Modal Handlers
  const openModal = (mode, course = null) => {
    setModalMode(mode);
    setSelectedCourse(course);

    if (mode === 'add') {
      setFormData({
        title: '',
        category: 'Core Subject',
        status: 'active',
        description: ''
      });
    } else if (course) {
      setFormData({
        title: course.title,
        category: course.category,
        status: course.status,
        description: course.description || ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
    setModalMode('add');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 API Actions
  const handleSaveCourse = async () => {
    if (!formData.title) return alert('Course Title is required');

    const creatorId = "65d4c8e9f1a2b3c4d5e6f7a8"; 

    const payload = {
      name: formData.title,
      description: formData.description,
      subjects: [formData.title], 
      // Ensure this boolean conversion is correct
      active: formData.status === 'active', 
      creatorId
    };

    const url = modalMode === 'add' 
      ? 'http://localhost:5000/studygroup' 
      : `http://localhost:5000/studygroup/${selectedCourse.id}`;
    
    const method = modalMode === 'add' ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (data.success) {
        alert(modalMode === 'add' ? 'Course added!' : 'Course updated!');
        fetchCourses(); // 3. Refresh list to reflect status change immediately
        closeModal();
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch (err) {
      console.error('Error saving course:', err);
    }
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;

    try {
      const res = await fetch(`http://localhost:5000/studygroup/${selectedCourse.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (data.success) {
        alert('Course deleted successfully');
        fetchCourses();
        closeModal();
      } else {
        alert(data.message || 'Delete failed');
      }
    } catch (err) {
      console.error('Error deleting course:', err);
    }
  };

  const getModalTitle = () => {
    switch (modalMode) {
      case 'view': return 'Course Details';
      case 'edit': return 'Edit Course';
      case 'delete': return 'Delete Course';
      default: return 'Add New Course';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>Course Management</h2>
          <span className={styles.count}>{loading ? 'Loading...' : `${totalCourses} courses`}</span>
        </div>
        <button className={styles.addBtn} onClick={() => openModal('add')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Course
        </button>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statBox}>
          <span className={styles.statValue}>{totalCourses}</span>
          <span className={styles.statLabel}>Total Courses</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statValue}>{activeCourses}</span>
          <span className={styles.statLabel}>Active</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statValue}>{disabledCourses}</span>
          <span className={styles.statLabel}>Disabled</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statValue}>{totalEnrollments.toLocaleString()}</span>
          <span className={styles.statLabel}>Total Enrollments</span>
        </div>
      </div>

      <div className={styles.searchBox}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.courseGrid}>
        {loading ? (
             <div style={{width: '100%', textAlign: 'center', padding: '20px'}}>Loading Courses...</div>
        ) : filteredCourses.length === 0 ? (
             <div style={{width: '100%', textAlign: 'center', padding: '20px'}}>No courses found. Try adding one!</div>
        ) : (
            filteredCourses.map((course) => (
            <div key={course.id} className={styles.courseCard}>
                <div className={styles.courseHeader}>
                <span className={styles.category}>{course.category || 'General'}</span>
                <span className={`${styles.status} ${styles[course.status]}`}>
                    {course.status}
                </span>
                </div>
                <h3 className={styles.courseTitle}>{course.title}</h3>
                <div className={styles.courseMeta}>
                <div className={styles.metaItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    </svg>
                    <span>{course.students} students</span>
                </div>
                <div className={styles.metaItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>{course.createdAt}</span>
                </div>
                </div>
                <div className={styles.courseActions}>
                <button className={styles.courseBtn} onClick={() => openModal('view', course)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                    </svg>
                    View
                </button>
                <button className={styles.courseBtn} onClick={() => openModal('edit', course)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                </button>
                <button className={`${styles.courseBtn} ${styles.danger}`} onClick={() => openModal('delete', course)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                </button>
                </div>
            </div>
            ))
        )}
      </div>

      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{getModalTitle()}</h3>
              <button className={styles.closeBtn} onClick={closeModal}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              {/* Delete Confirmation */}
              {modalMode === 'delete' && selectedCourse && (
                <div className={styles.deleteConfirm}>
                  <div className={styles.deleteIcon}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  </div>
                  <h4>Are you sure you want to delete this course?</h4>
                  <p>Course: <strong>{selectedCourse.title}</strong></p>
                  <p className={styles.deleteWarning}>This action cannot be undone. All {selectedCourse.students} enrolled students will be removed from this course.</p>
                </div>
              )}

              {/* View Mode */}
              {modalMode === 'view' && selectedCourse && (
                <div className={styles.viewMode}>
                  <div className={styles.viewHeader}>
                    <span className={styles.category}>{selectedCourse.category}</span>
                    <span className={`${styles.status} ${styles[selectedCourse.status]}`}>
                      {selectedCourse.status}
                    </span>
                  </div>
                  <div className={styles.viewField}>
                    <label>Course Title</label>
                    <p>{selectedCourse.title}</p>
                  </div>
                  <div className={styles.viewField}>
                    <label>Description</label>
                    <p>{selectedCourse.description || 'No description available.'}</p>
                  </div>
                  <div className={styles.viewRow}>
                    <div className={styles.viewField}>
                      <label>Enrolled Students</label>
                      <p>{selectedCourse.students}</p>
                    </div>
                    <div className={styles.viewField}>
                      <label>Created Date</label>
                      <p>{selectedCourse.createdAt}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Add/Edit Mode */}
              {(modalMode === 'add' || modalMode === 'edit') && (
                <form>
                  <div className={styles.formGroup}>
                    <label>Course Title</label>
                    <input 
                      type="text" 
                      name="title"
                      placeholder="Enter course title (e.g. Artificial Intelligence)" 
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Category</label>
                    <select name="category" value={formData.category} onChange={handleChange}>
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleChange}>
                      <option value="active">Active</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea 
                        name="description"
                        rows="4" 
                        placeholder="Enter course description"
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
                  </div>
                </form>
              )}
            </div>
            <div className={styles.modalFooter}>
              {modalMode === 'delete' ? (
                <>
                  <button className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                  <button className={styles.deleteBtn} onClick={handleDeleteCourse}>Delete Course</button>
                </>
              ) : modalMode === 'view' ? (
                <>
                  <button className={styles.cancelBtn} onClick={closeModal}>Close</button>
                  <button className={styles.submitBtn} onClick={() => openModal('edit', selectedCourse)}>Edit Course</button>
                </>
              ) : (
                <>
                  <button className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                  <button className={styles.submitBtn} onClick={handleSaveCourse}>
                    {modalMode === 'edit' ? 'Save Changes' : 'Create Course'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
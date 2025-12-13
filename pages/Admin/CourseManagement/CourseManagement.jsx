import React, { useState } from 'react';
import styles from './CourseManagement.module.css';

// Subjects matching the signup page
const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Computer Science',
  'Data Structures',
  'Algorithms',
  'Database Management',
  'Web Development',
  'Machine Learning',
  'Networking',
];

const mockCourses = [
  { id: 1, title: 'Mathematics', category: 'Core Subject', students: 450, status: 'active', createdAt: '2024-01-10' },
  { id: 2, title: 'Physics', category: 'Core Subject', students: 380, status: 'active', createdAt: '2024-01-15' },
  { id: 3, title: 'Chemistry', category: 'Core Subject', students: 320, status: 'active', createdAt: '2024-01-20' },
  { id: 4, title: 'Computer Science', category: 'Technical', students: 510, status: 'active', createdAt: '2024-02-01' },
  { id: 5, title: 'Data Structures', category: 'Technical', students: 420, status: 'active', createdAt: '2024-02-05' },
  { id: 6, title: 'Algorithms', category: 'Technical', students: 390, status: 'active', createdAt: '2024-02-10' },
  { id: 7, title: 'Database Management', category: 'Technical', students: 340, status: 'active', createdAt: '2024-02-15' },
  { id: 8, title: 'Web Development', category: 'Technical', students: 480, status: 'active', createdAt: '2024-02-20' },
  { id: 9, title: 'Machine Learning', category: 'Advanced', students: 290, status: 'active', createdAt: '2024-03-01' },
  { id: 10, title: 'Networking', category: 'Technical', students: 260, status: 'disabled', createdAt: '2024-03-05' },
];

const CourseManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'view', 'edit', 'delete'
  const [selectedCourse, setSelectedCourse] = useState(null);

  const filteredCourses = mockCourses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (mode, course = null) => {
    setModalMode(mode);
    setSelectedCourse(course);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
    setModalMode('add');
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
          <span className={styles.count}>{mockCourses.length} courses</span>
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
          <span className={styles.statValue}>{mockCourses.length}</span>
          <span className={styles.statLabel}>Total Courses</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statValue}>{mockCourses.filter(c => c.status === 'active').length}</span>
          <span className={styles.statLabel}>Active</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statValue}>{mockCourses.filter(c => c.status === 'disabled').length}</span>
          <span className={styles.statLabel}>Disabled</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statValue}>{mockCourses.reduce((acc, c) => acc + c.students, 0).toLocaleString()}</span>
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
        {filteredCourses.map((course) => (
          <div key={course.id} className={styles.courseCard}>
            <div className={styles.courseHeader}>
              <span className={styles.category}>{course.category}</span>
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
        ))}
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
                    <label>Category</label>
                    <p>{selectedCourse.category}</p>
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
                  <div className={styles.viewField}>
                    <label>Status</label>
                    <p style={{ textTransform: 'capitalize' }}>{selectedCourse.status}</p>
                  </div>
                </div>
              )}

              {/* Add/Edit Mode */}
              {(modalMode === 'add' || modalMode === 'edit') && (
                <>
                  <div className={styles.formGroup}>
                    <label>Course Title</label>
                    <input 
                      type="text" 
                      placeholder="Enter course title" 
                      defaultValue={selectedCourse?.title || ''}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Subject</label>
                    <select defaultValue={selectedCourse?.title || ''}>
                      <option value="">Select subject</option>
                      {subjects.map((subject) => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Category</label>
                    <select defaultValue={selectedCourse?.category || ''}>
                      <option value="">Select category</option>
                      <option value="Core Subject">Core Subject</option>
                      <option value="Technical">Technical</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Status</label>
                    <select defaultValue={selectedCourse?.status || 'active'}>
                      <option value="active">Active</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea rows="4" placeholder="Enter course description"></textarea>
                  </div>
                </>
              )}
            </div>
            <div className={styles.modalFooter}>
              {modalMode === 'delete' ? (
                <>
                  <button className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                  <button className={styles.deleteBtn}>Delete Course</button>
                </>
              ) : modalMode === 'view' ? (
                <>
                  <button className={styles.cancelBtn} onClick={closeModal}>Close</button>
                  <button className={styles.submitBtn} onClick={() => setModalMode('edit')}>Edit Course</button>
                </>
              ) : (
                <>
                  <button className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                  <button className={styles.submitBtn}>
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

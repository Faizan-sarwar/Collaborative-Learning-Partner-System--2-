import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Plus, Search, Users, Calendar,
  Eye, Edit, Trash2, X, AlertCircle, Loader2, Activity, CheckCircle2
} from 'lucide-react';
import styles from './CourseManagement.module.css';

const categories = ['Core Subject', 'Technical', 'Advanced', 'Elective'];

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Core Subject',
    status: 'active',
    description: ''
  });

  const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');
  const getCurrentUser = () => JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');

  //  SECURE FETCH COURSES
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) throw new Error("Authentication required");

      const res = await fetch(`http://${window.location.hostname}:5000/studygroup`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
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
        setError(null);
      } else {
        throw new Error(data.message || "Failed to load courses");
      }
    } catch (err) {
      console.error('Failed to fetch courses', err);
      setError("Unable to load course data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Calculate Stats
  const totalCourses = courses.length;
  const activeCourses = courses.filter(c => c.status === 'active').length;
  const disabledCourses = courses.filter(c => c.status === 'disabled').length;
  const totalEnrollments = courses.reduce((total, course) => total + (Number(course.students) || 0), 0);

  const filteredCourses = courses.filter((course) =>
    (course.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (course.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const openModal = (mode, course = null) => {
    setModalMode(mode);
    setSelectedCourse(course);

    if (mode === 'add') {
      setFormData({ title: '', category: 'Core Subject', status: 'active', description: '' });
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
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  //  SECURE SAVE COURSE
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert('Course Title is required');

    setIsSubmitting(true);
    const currentUser = getCurrentUser();
    const creatorId = currentUser._id; //  FIXED: No longer hardcoded!

    if (!creatorId) {
      alert("Session expired. Please log in again.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      name: formData.title,
      description: formData.description,
      subjects: [formData.title],
      active: formData.status === 'active',
      creatorId
    };

    const url = modalMode === 'add'
      ? `http://${window.location.hostname}:5000/studygroup`
      : `http://localhost:5000/studygroup/${selectedCourse.id}`;

    const method = modalMode === 'add' ? 'POST' : 'PUT';

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

      if (data.success) {
        fetchCourses();
        closeModal();
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch (err) {
      console.error('Error saving course:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  //  SECURE DELETE
  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`http://localhost:5000/studygroup/${selectedCourse.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await res.json();

      if (data.success) {
        fetchCourses();
        closeModal();
      } else {
        alert(data.message || 'Delete failed');
      }
    } catch (err) {
      console.error('Error deleting course:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getModalTitle = () => {
    switch (modalMode) {
      case 'view': return 'Course Details';
      case 'edit': return 'Edit Course';
      case 'delete': return 'Confirm Deletion';
      default: return 'Add New Course';
    }
  };

  if (loading && courses.length === 0) {
    return (
      <div className={styles.centerState}>
        <Loader2 size={32} className={styles.spinner} />
        <p>Loading course catalogue...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>Course Management</h2>
          <span className={styles.count}>{totalCourses} courses</span>
        </div>
        <button className={styles.addBtn} onClick={() => openModal('add')}>
          <Plus size={18} /> Add Course
        </button>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {/* STATS CARDS */}
      <div className={styles.statsRow}>
        <div className={styles.statBox}>
          <div className={styles.statIconWrapper} style={{ color: '#3b82f6', background: 'rgba(59,130,246,0.1)' }}><BookOpen size={24} /></div>
          <div className={styles.statDetails}>
            <span className={styles.statValue}>{totalCourses}</span>
            <span className={styles.statLabel}>Total Courses</span>
          </div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statIconWrapper} style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)' }}><Activity size={24} /></div>
          <div className={styles.statDetails}>
            <span className={styles.statValue}>{activeCourses}</span>
            <span className={styles.statLabel}>Active</span>
          </div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statIconWrapper} style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}><AlertCircle size={24} /></div>
          <div className={styles.statDetails}>
            <span className={styles.statValue}>{disabledCourses}</span>
            <span className={styles.statLabel}>Disabled</span>
          </div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statIconWrapper} style={{ color: '#8b5cf6', background: 'rgba(139,92,246,0.1)' }}><Users size={24} /></div>
          <div className={styles.statDetails}>
            <span className={styles.statValue}>{totalEnrollments.toLocaleString()}</span>
            <span className={styles.statLabel}>Enrollments</span>
          </div>
        </div>
      </div>

      <div className={styles.searchBox}>
        <Search size={18} className={styles.searchIcon} />
        <input type="text" placeholder="Search by course title or category..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {/* COURSE GRID */}
      <div className={styles.courseGrid}>
        {filteredCourses.length === 0 ? (
          <div className={styles.emptyState}>No courses found matching your criteria.</div>
        ) : (
          filteredCourses.map((course) => (
            <motion.div key={course.id} className={styles.courseCard} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className={styles.courseHeader}>
                <span className={styles.category}>{course.category || 'General'}</span>
                <span className={`${styles.status} ${styles[course.status]}`}>
                  <span className={styles.statusDot}></span> {course.status}
                </span>
              </div>
              <h3 className={styles.courseTitle}>{course.title}</h3>
              <div className={styles.courseMeta}>
                <div className={styles.metaItem}>
                  <Users size={16} /> <span>{course.students} enrolled</span>
                </div>
                <div className={styles.metaItem}>
                  <Calendar size={16} /> <span>{course.createdAt}</span>
                </div>
              </div>
              <div className={styles.courseActions}>
                <button className={styles.courseBtn} onClick={() => openModal('view', course)} title="View Details">
                  <Eye size={16} />
                </button>
                <button className={styles.courseBtn} onClick={() => openModal('edit', course)} title="Edit Course">
                  <Edit size={16} />
                </button>
                <button className={`${styles.courseBtn} ${styles.danger}`} onClick={() => openModal('delete', course)} title="Delete Course">
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {showModal && (
          <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal}>
            <motion.div className={styles.modal} initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>{getModalTitle()}</h3>
                <button className={styles.closeBtn} onClick={closeModal}><X size={20} /></button>
              </div>

              <div className={styles.modalBody}>
                {/* Delete Confirmation */}
                {modalMode === 'delete' && selectedCourse && (
                  <div className={styles.deleteConfirm}>
                    <div className={styles.deleteIcon}><AlertCircle size={40} /></div>
                    <h4>Remove this course?</h4>
                    <p>Course: <strong>{selectedCourse.title}</strong></p>
                    <p className={styles.deleteWarning}>This action cannot be undone. All {selectedCourse.students} enrolled students will lose access.</p>
                  </div>
                )}

                {/* View Mode */}
                {modalMode === 'view' && selectedCourse && (
                  <div className={styles.viewMode}>
                    <div className={styles.viewHeader}>
                      <span className={styles.categoryBadge}>{selectedCourse.category}</span>
                      <span className={`${styles.status} ${styles[selectedCourse.status]}`}>
                        <span className={styles.statusDot}></span> {selectedCourse.status}
                      </span>
                    </div>
                    <div className={styles.viewField}>
                      <label>Course Title</label>
                      <p>{selectedCourse.title}</p>
                    </div>
                    <div className={styles.viewField}>
                      <label>Description</label>
                      <p className={styles.descriptionText}>{selectedCourse.description || 'No description available.'}</p>
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

                {/* Add/Edit Form */}
                {(modalMode === 'add' || modalMode === 'edit') && (
                  <form id="courseForm" onSubmit={handleSaveCourse} className={styles.formWrapper}>
                    <div className={styles.formGroup}>
                      <label>Course Title</label>
                      <input type="text" name="title" required placeholder="e.g. Artificial Intelligence" value={formData.title} onChange={handleChange} />
                    </div>
                    <div className={styles.formRow}>
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
                    </div>
                    <div className={styles.formGroup}>
                      <label>Description</label>
                      <textarea name="description" rows="4" placeholder="Detailed description of the course..." value={formData.description} onChange={handleChange}></textarea>
                    </div>
                  </form>
                )}
              </div>

              <div className={styles.modalFooter}>
                {modalMode === 'delete' ? (
                  <>
                    <button className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                    <button className={styles.deleteBtn} onClick={handleDeleteCourse} disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 size={16} className={styles.spinnerIcon} /> : <Trash2 size={16} />} Delete Course
                    </button>
                  </>
                ) : modalMode === 'view' ? (
                  <>
                    <button className={styles.cancelBtn} onClick={closeModal}>Close</button>
                    <button className={styles.submitBtn} onClick={() => openModal('edit', selectedCourse)}>
                      <Edit size={16} /> Edit Course
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                    <button type="submit" form="courseForm" className={styles.submitBtn} disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 size={16} className={styles.spinnerIcon} /> : <CheckCircle2 size={16} />}
                      {modalMode === 'edit' ? 'Save Changes' : 'Create Course'}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseManagement;
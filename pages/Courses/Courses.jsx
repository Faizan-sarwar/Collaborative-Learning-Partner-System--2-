import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './Courses.module.css';

const Courses = () => {
  // 🔹 State Management
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentCourse, setCurrentCourse] = useState(null);
  
  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subjects: ''
  });

  // 🔹 Helper: Get Icon based on course name
  const getCourseIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('math')) return '📐';
    if (lower.includes('phys')) return '⚡';
    if (lower.includes('chem')) return '🧪';
    if (lower.includes('bio')) return '🧬';
    if (lower.includes('comp') || lower.includes('code')) return '💻';
    if (lower.includes('engl') || lower.includes('lit')) return '📚';
    if (lower.includes('hist')) return '🏛️';
    if (lower.includes('art')) return '🎨';
    return '🎓'; // Default icon
  };

  // 🔹 Fetch Courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Using the /studygroup endpoint as "Courses"
      const res = await fetch('http://localhost:5000/studygroup');
      const data = await res.json();
      
      if (data.success) {
        // Transform backend data to match UI
        const mappedCourses = data.groups.map(g => ({
          id: g._id,
          name: g.name,
          description: g.description,
          progress: Math.floor(Math.random() * 100), // Random progress for demo (backend doesn't store this yet)
          lessons: g.subjects.length > 0 ? g.subjects.length * 5 : 12, // Estimate lessons
          icon: getCourseIcon(g.name),
          subjects: g.subjects
        }));
        setCourses(mappedCourses);
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // 🔹 Modal Handlers
  const openModal = (mode, course = null) => {
    setModalMode(mode);
    setCurrentCourse(course);
    if (mode === 'edit' && course) {
      setFormData({
        name: course.name,
        description: course.description || '',
        subjects: course.subjects ? course.subjects.join(', ') : ''
      });
    } else {
      setFormData({ name: '', description: '', subjects: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentCourse(null);
  };

  // 🔹 API Actions
  const handleSave = async (e) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      subjects: formData.subjects.split(',').map(s => s.trim()).filter(Boolean),
      creatorId // Required by your backend validation
    };

    const url = modalMode === 'add' 
      ? 'http://localhost:5000/studygroup' 
      : `http://localhost:5000/studygroup/${currentCourse.id}`;
    
    const method = modalMode === 'add' ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.success) {
        fetchCourses();
        closeModal();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Error saving course:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const res = await fetch(`http://localhost:5000/studygroup/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      
      if (data.success) {
        setCourses(courses.filter(c => c.id !== id));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Error deleting course:', err);
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout title="Courses">
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className={styles.header} variants={itemVariants}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>My Courses</h1>
            <p className={styles.subtitle}>Manage and track your course progress</p>
          </div>
          <button className={styles.addBtn} onClick={() => openModal('add')}>
            <span>+</span> Add New Course
          </button>
        </motion.div>

        <motion.div className={styles.stats} variants={itemVariants}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{courses.length}</span>
            <span className={styles.statLabel}>Total Courses</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{courses.filter(c => c.progress > 0 && c.progress < 100).length}</span>
            <span className={styles.statLabel}>In Progress</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{courses.filter(c => c.progress === 100).length}</span>
            <span className={styles.statLabel}>Completed</span>
          </div>
        </motion.div>

        {loading ? (
          <div className={styles.loading}>Loading courses...</div>
        ) : (
          <div className={styles.coursesGrid}>
            {courses.length === 0 ? (
                <div className={styles.noData}>No courses found. Add one to get started!</div>
            ) : (
                courses.map((course) => (
                <motion.div 
                    key={course.id} 
                    className={styles.courseCard}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                >
                    <div className={styles.cardHeader}>
                        <div className={styles.courseIcon}>{course.icon}</div>
                        <div className={styles.cardActions}>
                            <button 
                                className={styles.iconBtn} 
                                onClick={(e) => { e.stopPropagation(); openModal('edit', course); }}
                                title="Edit"
                            >
                                ✏️
                            </button>
                            <button 
                                className={`${styles.iconBtn} ${styles.deleteBtn}`} 
                                onClick={(e) => { e.stopPropagation(); handleDelete(course.id); }}
                                title="Delete"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                    
                    <div className={styles.courseInfo}>
                    <h3>{course.name}</h3>
                    <p className={styles.desc}>{course.description || `${course.lessons} lessons included`}</p>
                    </div>

                    <div className={styles.progressSection}>
                    <div className={styles.progressBar}>
                        <div 
                        className={styles.progressFill} 
                        style={{ width: `${course.progress}%` }}
                        />
                    </div>
                    <span className={styles.progressText}>{course.progress}% complete</span>
                    </div>

                    <button className={styles.startBtn}>
                    {course.progress > 0 ? 'Continue' : 'Start Learning'}
                    </button>
                </motion.div>
                ))
            )}
          </div>
        )}
      </motion.div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div 
              className={styles.modalContent}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{modalMode === 'add' ? 'Add New Course' : 'Edit Course'}</h2>
              
              <form onSubmit={handleSave} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Course Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Advanced Physics"
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Brief description of the course..."
                    rows="3"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Subjects / Topics (comma separated)</label>
                  <input 
                    type="text" 
                    value={formData.subjects}
                    onChange={(e) => setFormData({...formData, subjects: e.target.value})}
                    placeholder="e.g. Mechanics, Thermodynamics, Optics"
                  />
                </div>

                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                  <button type="submit" className={styles.submitBtn}>
                    {modalMode === 'add' ? 'Create Course' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Courses;
import React from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './Courses.module.css';

const courses = [
  { id: 1, name: 'Mathematics', progress: 0, lessons: 24, icon: '📐' },
  { id: 2, name: 'Physics', progress: 0, lessons: 18, icon: '⚡' },
  { id: 3, name: 'Chemistry', progress: 0, lessons: 20, icon: '🧪' },
  { id: 4, name: 'Biology', progress: 0, lessons: 22, icon: '🧬' },
  { id: 5, name: 'Computer Science', progress: 0, lessons: 30, icon: '💻' },
  { id: 6, name: 'English', progress: 0, lessons: 16, icon: '📚' },
];

const Courses = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
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
          <h1 className={styles.title}>My Courses</h1>
          <p className={styles.subtitle}>Manage and track your course progress</p>
        </motion.div>

        <motion.div className={styles.stats} variants={itemVariants}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{courses.length}</span>
            <span className={styles.statLabel}>Total Courses</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>0</span>
            <span className={styles.statLabel}>In Progress</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>0</span>
            <span className={styles.statLabel}>Completed</span>
          </div>
        </motion.div>

        <div className={styles.coursesGrid}>
          {courses.map((course) => (
            <motion.div 
              key={course.id} 
              className={styles.courseCard}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className={styles.courseIcon}>{course.icon}</div>
              <div className={styles.courseInfo}>
                <h3>{course.name}</h3>
                <p>{course.lessons} lessons</p>
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
                {course.progress > 0 ? 'Continue' : 'Start'}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div className={styles.addCourse} variants={itemVariants}>
          <button className={styles.addBtn}>
            <span>+</span> Add New Course
          </button>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Courses;

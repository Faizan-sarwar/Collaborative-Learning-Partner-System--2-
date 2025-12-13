import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Dashboard.module.css';
import PageTransition from '../../components/PageTransition/PageTransition';
import DashboardSidebar from '../../components/Dashboard/DashboardSidebar/DashboardSidebar';
import DashboardHeader from '../../components/Dashboard/DashboardHeader/DashboardHeader';
import WelcomeBanner from '../../components/Dashboard/WelcomeBanner/WelcomeBanner';
import KnowledgeCards from '../../components/Dashboard/KnowledgeCards/KnowledgeCards';
import WeeklyStudyTime from '../../components/Dashboard/WeeklyStudyTime/WeeklyStudyTime';
import StudyAccountability from '../../components/Dashboard/StudyAccountability/StudyAccountability';
import UpcomingDeadlines from '../../components/Dashboard/UpcomingDeadlines/UpcomingDeadlines';
import QuickActions from '../../components/Dashboard/QuickActions/QuickActions';
import MiniCalendar from '../../components/Dashboard/MiniCalendar/MiniCalendar';
import TodoList from '../../components/Dashboard/TodoList/TodoList';
import StudyMood from '../../components/Dashboard/StudyMood/StudyMood';
import StudyStreak from '../../components/Dashboard/StudyStreak/StudyStreak';
import QuickLinks from '../../components/Dashboard/QuickLinks/QuickLinks';

const Dashboard = () => {
  const [username, setUsername] = useState('Student');

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) setUsername(savedName);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <PageTransition>
      <div className={styles.dashboard}>
        <DashboardSidebar />
        
        <div className={styles.mainArea}>
          <DashboardHeader username={username} />
          
          <motion.main 
            className={styles.content}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <WelcomeBanner username={username} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <KnowledgeCards />
            </motion.div>

            <div className={styles.mainGrid}>
              <div className={styles.leftColumn}>
                <motion.div variants={itemVariants}>
                  <WeeklyStudyTime />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <StudyAccountability />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <UpcomingDeadlines />
                </motion.div>
              </div>

              <div className={styles.rightColumn}>
                <motion.div variants={itemVariants}>
                  <QuickActions />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <MiniCalendar />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <TodoList />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <StudyMood />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <StudyStreak />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <QuickLinks />
                </motion.div>
              </div>
            </div>
          </motion.main>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;

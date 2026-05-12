import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './DashboardLayout.module.css';
import DashboardSidebar from '../DashboardSidebar/DashboardSidebar';
import DashboardHeader from '../DashboardHeader/DashboardHeader';
import PageWrapper from '../../../src/motion/PageWrapper';
import { springs } from '../../../src/motion/motion';

const DashboardLayout = ({ children, title, hideSidebar = false }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((v) => !v);

  return (
    <PageWrapper>
      <div className={`${styles.dashboard} ${hideSidebar ? styles.dashboardFull : ''}`}>
        {!hideSidebar && (
          <DashboardSidebar
            isOpen={isSidebarOpen}
            closeSidebar={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Overlay — AnimatePresence handles fade in/out cleanly */}
        <AnimatePresence>
          {isSidebarOpen && !hideSidebar && (
            <motion.div
              key="overlay"
              className={styles.overlay}
              onClick={() => setIsSidebarOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
          )}
        </AnimatePresence>

        <div className={`${styles.mainArea} ${hideSidebar ? styles.mainAreaFull : ''}`}>
          <DashboardHeader
            title={title}
            isFullWidth={hideSidebar}
            toggleSidebar={toggleSidebar}
          />

          <main className={styles.content}>
            {/* Content fades + slides up on every page load */}
            <motion.div
              key={title}
              className={styles.contentInner}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={springs.soft}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </PageWrapper>
  );
};

export default DashboardLayout;
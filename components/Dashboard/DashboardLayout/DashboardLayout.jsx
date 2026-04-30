import React, { useState } from 'react';
import styles from './DashboardLayout.module.css';
import PageTransition from '../../PageTransition/PageTransition';
import DashboardSidebar from '../DashboardSidebar/DashboardSidebar';
import DashboardHeader from '../DashboardHeader/DashboardHeader';

const DashboardLayout = ({ children, title, hideSidebar = false }) => {
  // 🟢 NEW: Mobile sidebar state (Just like we did in Dashboard.jsx)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <PageTransition>
      <div className={`${styles.dashboard} ${hideSidebar ? styles.dashboardFull : ''}`}>
        
        {/* 🟢 NEW: Pass state to Sidebar */}
        {!hideSidebar && (
          <DashboardSidebar 
            isOpen={isSidebarOpen} 
            closeSidebar={() => setIsSidebarOpen(false)} 
          />
        )}
        
        {/* 🟢 NEW: Dark overlay for mobile when sidebar is open */}
        {isSidebarOpen && !hideSidebar && (
          <div className={styles.overlay} onClick={() => setIsSidebarOpen(false)}></div>
        )}
        
        <div className={`${styles.mainArea} ${hideSidebar ? styles.mainAreaFull : ''}`}>
          
          {/* 🟢 NEW: Pass toggle function to Header */}
          <DashboardHeader 
            title={title} 
            isFullWidth={hideSidebar} 
            toggleSidebar={toggleSidebar} 
          />
          
          <main className={styles.content}>
            <div className={styles.contentInner}>
              {children}
            </div>
          </main>
        </div>
        
      </div>
    </PageTransition>
  );
};

export default DashboardLayout;
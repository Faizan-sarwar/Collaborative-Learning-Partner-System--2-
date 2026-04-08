import React from 'react';
import styles from './DashboardLayout.module.css';
import PageTransition from '../../PageTransition/PageTransition';
import DashboardSidebar from '../DashboardSidebar/DashboardSidebar';
import DashboardHeader from '../DashboardHeader/DashboardHeader';

const DashboardLayout = ({ children, title, hideSidebar = false }) => {
  return (
    <PageTransition>
      <div className={`${styles.dashboard} ${hideSidebar ? styles.dashboardFull : ''}`}>
        
        {!hideSidebar && <DashboardSidebar />}
        
        <div className={`${styles.mainArea} ${hideSidebar ? styles.mainAreaFull : ''}`}>
          <DashboardHeader title={title} isFullWidth={hideSidebar} />
          
          <main className={styles.content}>
            {/* 🟢 NEW: Inner wrapper to prevent ultra-wide monitor stretching */}
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
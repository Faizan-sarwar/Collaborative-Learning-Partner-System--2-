import React from 'react';
import styles from './DashboardLayout.module.css';
import PageTransition from '../../PageTransition/PageTransition';
import DashboardSidebar from '../DashboardSidebar/DashboardSidebar';
import DashboardHeader from '../DashboardHeader/DashboardHeader';

const DashboardLayout = ({ children, title, hideSidebar = false }) => {
  return (
    <PageTransition>
      <div 
        className={styles.dashboard} 
        // 🟢 FIX: Use block display to remove all grid constraints when full width
        style={hideSidebar ? { display: 'block', paddingLeft: 0 } : {}}
      >
        {!hideSidebar && <DashboardSidebar />}
        
        <div 
            className={styles.mainArea}
            // 🟢 FIX: Ensure main area takes full width
            style={hideSidebar ? { width: '100%', marginLeft: 0, maxWidth: '100%' } : {}}
        >
          {/* Pass prop to header */}
          <DashboardHeader title={title} isFullWidth={hideSidebar} />
          
          <main className={styles.content}>
            {children}
          </main>
        </div>
      </div>
    </PageTransition>
  );
};

export default DashboardLayout;
import React from 'react';
import styles from './DashboardLayout.module.css';
import PageTransition from '../../PageTransition/PageTransition';
import DashboardSidebar from '../DashboardSidebar/DashboardSidebar';
import DashboardHeader from '../DashboardHeader/DashboardHeader';

const DashboardLayout = ({ children, title }) => {
  return (
    <PageTransition>
      <div className={styles.dashboard}>
        <DashboardSidebar />
        
        <div className={styles.mainArea}>
          <DashboardHeader title={title} />
          
          <main className={styles.content}>
            {children}
          </main>
        </div>
      </div>
    </PageTransition>
  );
};

export default DashboardLayout;

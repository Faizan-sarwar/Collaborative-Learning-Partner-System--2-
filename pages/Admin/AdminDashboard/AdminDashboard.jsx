import React from 'react';
import styles from './AdminDashboard.module.css';
import StatsCards from '../../../components/Admin/StatsCards/StatsCards';
import AnalyticsCharts from '../../../components/Admin/AnalyticsCharts/AnalyticsCharts';
import RecentRegistrations from '../../../components/Admin/RecentRegistrations/RecentRegistrations';
import RecentActivity from '../../../components/Admin/RecentActivity/RecentActivity';

const AdminDashboard = () => {
  return (
    <div className={styles.dashboard}>
      <StatsCards />
      <AnalyticsCharts />
      
      <div className={styles.bottomGrid}>
        <RecentRegistrations />
        <RecentActivity />
      </div>
    </div>
  );
};

export default AdminDashboard;

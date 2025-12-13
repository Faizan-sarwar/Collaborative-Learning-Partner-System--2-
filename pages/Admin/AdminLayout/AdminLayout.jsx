import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import styles from './AdminLayout.module.css';
import AdminSidebar from '../../../components/Admin/AdminSidebar/AdminSidebar';
import AdminNavbar from '../../../components/Admin/AdminNavbar/AdminNavbar';
import PageTransition from '../../../components/PageTransition/PageTransition';

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <PageTransition>
      <div className={styles.adminLayout}>
        <AdminSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={toggleSidebar}
        />
        
        <div className={`${styles.mainArea} ${sidebarCollapsed ? styles.expanded : ''}`}>
          <AdminNavbar onMenuClick={toggleSidebar} />
          
          <main className={styles.content}>
            <Outlet />
          </main>
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminLayout;

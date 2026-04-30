import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styles from './AdminLayout.module.css'; // 🟢 CRITICAL: Import your CSS module!
import AdminSidebar from '../../../components/Admin/AdminSidebar/AdminSidebar';
import AdminNavbar from '../../../components/Admin/AdminNavbar/AdminNavbar';
import PageTransition from '../../../components/PageTransition/PageTransition';

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <PageTransition>
      <div className={styles.adminLayout}>
        
        <AdminSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={toggleSidebar}
          mobileOpen={mobileMenuOpen}
        />
        
        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div 
            className={styles.overlay} 
            onClick={() => setMobileMenuOpen(false)} 
          />
        )}
        
        {/* 🟢 Main Area uses CSS modules to dynamically switch margins */}
        <div className={`${styles.mainArea} ${sidebarCollapsed ? styles.expanded : ''}`}>
          <AdminNavbar onMenuClick={toggleMobileMenu} />
          
          <main className={styles.content}>
            <Outlet />
          </main>
        </div>
        
      </div>
    </PageTransition>
  );
};

export default AdminLayout;
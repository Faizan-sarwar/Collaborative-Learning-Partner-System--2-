import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, ShieldAlert, BookOpen, 
  Bell, FileText, Settings, ChevronLeft, ChevronRight, ShieldCheck 
} from 'lucide-react';
import styles from './AdminSidebar.module.css';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { id: 'students', label: 'Students', icon: Users, path: '/admin/students' },
  { id: 'admins', label: 'Admins', icon: ShieldAlert, path: '/admin/admins' },
  { id: 'courses', label: 'Courses', icon: BookOpen, path: '/admin/courses' },
  { id: 'notifications', label: 'Notifications', icon: Bell, path: '/admin/notifications' },
  { id: 'logs', label: 'Activity Logs', icon: FileText, path: '/admin/logs' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
];

const AdminSidebar = ({ collapsed, onToggle, mobileOpen }) => {
  const location = useLocation();
  
  const [user, setUser] = useState(null);
  const [imgError, setImgError] = useState(false);

  // 🟢 ENTERPRISE UPGRADE: Live Sync User Data
  // This ensures if the admin changes their photo or name in settings, 
  // the sidebar updates instantly without requiring a page refresh.
  const loadUser = () => {
    const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    if (storedUser && storedUser._id) {
      setUser(storedUser);
      setImgError(false); // Reset error state on new data
    }
  };

  useEffect(() => {
    loadUser();
    window.addEventListener('userUpdated', loadUser);
    return () => window.removeEventListener('userUpdated', loadUser);
  }, []);

  const renderProfileImage = () => {
    if (user && user._id && !imgError) {
      return (
        <div className={styles.profileImageWrapper}>
            <img 
              src={`http://localhost:5000/api/auth/student/${user._id}/picture?t=${Date.now()}`} 
              alt="Admin Profile"
              onError={() => setImgError(true)}
              className={styles.profileImage}
            />
        </div>
      );
    }
    
    // Fallback Initials
    const initials = user?.fullName 
      ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
      : 'AD';

    return <div className={styles.adminAvatar}>{initials}</div>;
  };

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''} ${mobileOpen ? styles.mobileOpen : ''}`}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <ShieldCheck size={22} strokeWidth={2.5} />
          </div>
          {!collapsed && <span className={styles.logoText}>Admin Panel</span>}
        </div>
        <button className={styles.toggleBtn} onClick={onToggle} title={collapsed ? "Expand Menu" : "Collapse Menu"}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === '/admin'}
              title={collapsed ? item.label : ''} // 🟢 Accessibility tooltips for collapsed mode
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}><Icon size={20} /></span>
              {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* FOOTER: Dynamic Admin Info */}
      <div className={styles.footer}>
        {!collapsed ? (
          <div className={styles.adminInfo}>
            {renderProfileImage()}
            <div className={styles.adminDetails}>
              <span className={styles.adminName}>{user?.fullName || 'Admin User'}</span>
              <span className={styles.adminRole}>
                {user?.role === 'super-admin' ? 'Super Administrator' : 'Administrator'}
              </span>
            </div>
          </div>
        ) : (
          <div className={styles.adminInfoCollapsed} title={`${user?.fullName} (${user?.role})`}>
             {renderProfileImage()}
          </div>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;
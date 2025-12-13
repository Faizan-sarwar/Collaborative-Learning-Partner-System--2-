import React, { useState } from 'react';
import styles from './AdminManagement.module.css';

const mockAdmins = [
  { id: 1, name: 'Super Admin', email: 'superadmin@studypal.com', role: 'Super Admin', status: 'active', lastLogin: '2024-03-15 10:30 AM' },
  { id: 2, name: 'Admin User', email: 'admin@studypal.com', role: 'Admin', status: 'active', lastLogin: '2024-03-15 09:15 AM' },
  { id: 3, name: 'John Moderator', email: 'john.mod@studypal.com', role: 'Moderator', status: 'active', lastLogin: '2024-03-14 04:45 PM' },
  { id: 4, name: 'Sarah Admin', email: 'sarah.admin@studypal.com', role: 'Admin', status: 'inactive', lastLogin: '2024-03-10 02:00 PM' },
];

const AdminManagement = () => {
  const [showModal, setShowModal] = useState(false);

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Super Admin': return styles.superAdmin;
      case 'Admin': return styles.admin;
      case 'Moderator': return styles.moderator;
      default: return '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>Admin Management</h2>
          <span className={styles.count}>{mockAdmins.length} admins</span>
        </div>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Admin
        </button>
      </div>

      <div className={styles.rolesInfo}>
        <div className={styles.roleCard}>
          <div className={`${styles.roleIcon} ${styles.superAdminIcon}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className={styles.roleInfo}>
            <h4>Super Admin</h4>
            <p>Full system access</p>
          </div>
          <span className={styles.roleCount}>1</span>
        </div>
        
        <div className={styles.roleCard}>
          <div className={`${styles.roleIcon} ${styles.adminIcon}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className={styles.roleInfo}>
            <h4>Admin</h4>
            <p>Manage users & content</p>
          </div>
          <span className={styles.roleCount}>2</span>
        </div>
        
        <div className={styles.roleCard}>
          <div className={`${styles.roleIcon} ${styles.moderatorIcon}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className={styles.roleInfo}>
            <h4>Moderator</h4>
            <p>Content moderation</p>
          </div>
          <span className={styles.roleCount}>1</span>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Admin</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockAdmins.map((admin) => (
              <tr key={admin.id}>
                <td>
                  <div className={styles.adminInfo}>
                    <div className={styles.avatar}>
                      {admin.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className={styles.details}>
                      <span className={styles.name}>{admin.name}</span>
                      <span className={styles.email}>{admin.email}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`${styles.roleBadge} ${getRoleBadgeClass(admin.role)}`}>
                    {admin.role}
                  </span>
                </td>
                <td>
                  <span className={`${styles.status} ${styles[admin.status]}`}>
                    {admin.status}
                  </span>
                </td>
                <td className={styles.date}>{admin.lastLogin}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.actionBtn} title="Edit">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button className={styles.actionBtn} title="Activity Log">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                      </svg>
                    </button>
                    <button className={`${styles.actionBtn} ${styles.danger}`} title="Deactivate">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Add New Admin</h3>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input type="text" placeholder="Enter full name" />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input type="email" placeholder="Enter email address" />
              </div>
              <div className={styles.formGroup}>
                <label>Role</label>
                <select>
                  <option value="">Select role</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Temporary Password</label>
                <input type="password" placeholder="Enter temporary password" />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={styles.submitBtn}>Create Admin</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;

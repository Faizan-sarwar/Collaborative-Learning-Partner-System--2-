import React, { useState, useEffect } from 'react';
import styles from './AdminManagement.module.css';

const AdminManagement = () => {
  // 🔹 State Management
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentAdmin, setCurrentAdmin] = useState(null);
  
  // 🔹 Store logged-in user
  const [currentUser, setCurrentUser] = useState(null);

  // 🔹 Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'admin',
    password: '',
    status: 'active'
  });

  // 🔹 Fetch Admins
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/auth/admin/admins');
      const data = await res.json();
      
      if (data.success) {
        // 1. Force Super Admin role for specific email (Fixes wrong DB role)
        const processedAdmins = data.admins.map(user => {
          if (user.email === 'faizan@admin.com') {
            return { ...user, role: 'super-admin' }; // 👑 Force Override
          }
          return user;
        });

        // 2. Filter to show ONLY Admin roles (Hide Students)
        const allowedRoles = ['super-admin', 'admin', 'moderator'];
        const filteredList = processedAdmins.filter(user => 
          user.role && allowedRoles.includes(user.role.toLowerCase())
        );

        setAdmins(filteredList);
      }
    } catch (err) {
      console.error('Error fetching admins:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // 🔹 Handlers
  const openModal = (mode, admin = null) => {
    setModalMode(mode);
    setCurrentAdmin(admin);
    if (mode === 'edit' && admin) {
      setFormData({
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
        password: '',
        status: admin.approved ? 'active' : 'inactive'
      });
    } else {
      setFormData({
        fullName: '',
        email: '',
        role: 'admin',
        password: '',
        status: 'active'
      });
    }
    setShowModal(true);
  };

  const handleDelete = async (id, role) => {
    // 🔒 Security: Cannot delete Super Admin
    if (role === 'super-admin') {
      alert("Action Denied: You cannot delete the Super Admin.");
      return;
    }
    // 🔒 Security: Cannot delete self
    if (currentUser && currentUser._id === id) {
      alert("Action Denied: You cannot delete your own account.");
      return;
    }

    if (!window.confirm('Are you sure you want to remove this admin?')) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/auth/admin/admins/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        alert('Admin removed');
        fetchAdmins();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleSubmit = async () => {
    const url = modalMode === 'add' 
      ? 'http://localhost:5000/api/auth/admin/create-admin'
      : `http://localhost:5000/api/auth/admin/admins/${currentAdmin._id}`;
    
    const method = modalMode === 'add' ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        alert(modalMode === 'add' ? 'Admin created!' : 'Admin updated!');
        setShowModal(false);
        fetchAdmins();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Submit failed:', err);
    }
  };

  // 🔹 Styles Helper
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'super-admin': return styles.superAdmin;
      case 'admin': return styles.admin;
      case 'moderator': return styles.moderator;
      default: return '';
    }
  };

  // 🔹 Stats Logic (Will now be correct due to override)
  const superAdminCount = admins.filter(a => a.role === 'super-admin').length;
  const adminCount = admins.filter(a => a.role === 'admin').length;
  const modCount = admins.filter(a => a.role === 'moderator').length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>Admin Management</h2>
          <span className={styles.count}>{admins.length} accounts</span>
        </div>
        <button className={styles.addBtn} onClick={() => openModal('add')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Admin
        </button>
      </div>

      <div className={styles.rolesInfo}>
        {/* SUPER ADMIN CARD */}
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
          <span className={styles.roleCount}>{superAdminCount}</span>
        </div>
        
        {/* ADMIN CARD */}
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
          <span className={styles.roleCount}>{adminCount}</span>
        </div>
        
        {/* MODERATOR CARD */}
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
          <span className={styles.roleCount}>{modCount}</span>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Admin</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="5" style={{textAlign:'center', padding:'20px'}}>Loading...</td></tr>
            ) : admins.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign:'center', padding:'20px'}}>No admins found.</td></tr>
            ) : (
                admins.map((admin) => {
                  const isSelf = currentUser && currentUser._id === admin._id;
                  const isSuperAdminTarget = admin.role === 'super-admin';
                  const isDisabled = isSuperAdminTarget || isSelf;

                  return (
                    <tr key={admin._id}>
                      <td>
                        <div className={styles.adminInfo}>
                          <div className={styles.avatar}>
                            {admin.fullName ? admin.fullName.charAt(0).toUpperCase() : 'A'}
                          </div>
                          <div className={styles.details}>
                            <span className={styles.name}>
                              {admin.fullName} {isSelf && <strong>(You)</strong>}
                            </span>
                            <span className={styles.email}>{admin.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`${styles.roleBadge} ${getRoleBadgeClass(admin.role)}`}>
                          {admin.role === 'super-admin' ? 'Super Admin' : 
                           admin.role.charAt(0).toUpperCase() + admin.role.slice(1)}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.status} ${admin.approved ? styles.active : styles.inactive}`}>
                          {admin.approved ? 'active' : 'inactive'}
                        </span>
                      </td>
                      <td className={styles.date}>
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button 
                            className={styles.actionBtn} 
                            title="Edit" 
                            onClick={() => openModal('edit', admin)}
                            disabled={isDisabled}
                            style={isDisabled ? {opacity: 0.3, cursor: 'not-allowed'} : {}}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button 
                            className={`${styles.actionBtn} ${styles.danger}`} 
                            title="Remove"
                            onClick={() => handleDelete(admin._id, admin.role)}
                            disabled={isDisabled}
                            style={isDisabled ? {opacity: 0.3, cursor: 'not-allowed'} : {}}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{modalMode === 'add' ? 'Add New Admin' : 'Edit Admin'}</h3>
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
                <input 
                  type="text" 
                  placeholder="Enter full name" 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input 
                  type="email" 
                  placeholder="Enter email address" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Role</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>
              {modalMode === 'edit' && (
                <div className={styles.formGroup}>
                  <label>Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              )}
              {modalMode === 'add' && (
                <div className={styles.formGroup}>
                  <label>Password</label>
                  <input 
                    type="password" 
                    placeholder="Create password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={styles.submitBtn} onClick={handleSubmit}>
                {modalMode === 'add' ? 'Create Admin' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
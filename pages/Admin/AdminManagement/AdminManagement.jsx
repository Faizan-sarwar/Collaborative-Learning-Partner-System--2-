import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ShieldAlert, Shield, Plus, X, 
  Edit, Trash2, Loader2, AlertCircle, CheckCircle2 
} from 'lucide-react';
import styles from './AdminManagement.module.css';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'admin',
    password: '',
    status: 'active'
  });

  const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

  // 🟢 SECURE FETCH
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) throw new Error("Authentication token missing");

      const res = await fetch(`http://${window.location.hostname}:5000/api/auth/admin/admins`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        // Force Super Admin role for specific email (Retained your override logic)
        const processedAdmins = data.admins.map(user => {
          if (user.email === 'faizan@admin.com') return { ...user, role: 'super-admin' };
          return user;
        });

        const allowedRoles = ['super-admin', 'admin', 'moderator'];
        const filteredList = processedAdmins.filter(user => 
          user.role && allowedRoles.includes(user.role.toLowerCase())
        );

        setAdmins(filteredList);
        setError(null);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error('Error fetching admins:', err);
      setError('Failed to load admin accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
    const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    if (storedUser && storedUser._id) setCurrentUser(storedUser);
  }, []);

  const openModal = (mode, admin = null) => {
    setModalMode(mode);
    setCurrentAdmin(admin);
    setFormData({
      fullName: admin?.fullName || '',
      email: admin?.email || '',
      role: admin?.role || 'admin',
      password: '',
      status: admin ? (admin.approved ? 'active' : 'inactive') : 'active'
    });
    setShowModal(true);
  };

  // 🟢 SECURE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || (modalMode === 'add' && !formData.password)) {
      return alert("Please fill in all required fields.");
    }

    setIsSubmitting(true);
    const url = modalMode === 'add' 
      ? `http://${window.location.hostname}:5000/api/auth/admin/create-admin`
      : `http://localhost:5000/api/auth/admin/admins/${currentAdmin._id}`;
    
    try {
      const res = await fetch(url, {
        method: modalMode === 'add' ? 'POST' : 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        setShowModal(false);
        fetchAdmins();
      } else {
        alert(data.message || "Failed to save admin");
      }
    } catch (err) {
      console.error('Submit failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🟢 SECURE DELETE
  const handleDelete = async () => {
    if (!showDeleteModal) return;
    const { _id } = showDeleteModal;

    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/auth/admin/admins/${_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setShowDeleteModal(null);
        fetchAdmins();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const attemptDelete = (admin) => {
    if (admin.role === 'super-admin') return alert("Action Denied: Cannot delete the Super Admin.");
    if (currentUser && currentUser._id === admin._id) return alert("Action Denied: Cannot delete your own account.");
    setShowDeleteModal(admin);
  };

  const getInitials = (name) => {
    if (!name) return 'AD';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const superAdminCount = admins.filter(a => a.role === 'super-admin').length;
  const adminCount = admins.filter(a => a.role === 'admin').length;
  const modCount = admins.filter(a => a.role === 'moderator').length;

  if (loading && admins.length === 0) {
    return (
      <div className={styles.centerState}>
         <Loader2 size={32} className={styles.spinner} />
         <p>Loading admin directory...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>Admin Management</h2>
          <span className={styles.count}>{admins.length} accounts</span>
        </div>
        <button className={styles.addBtn} onClick={() => openModal('add')}>
          <Plus size={18} /> Add Admin
        </button>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {/* 🟢 STATS CARDS */}
      <div className={styles.rolesInfo}>
        <div className={styles.roleCard}>
          <div className={`${styles.roleIcon} ${styles.superAdminIcon}`}><ShieldCheck size={22} /></div>
          <div className={styles.roleInfo}>
            <h4>Super Admin</h4>
            <p>Full system access</p>
          </div>
          <span className={styles.roleCount}>{superAdminCount}</span>
        </div>
        
        <div className={styles.roleCard}>
          <div className={`${styles.roleIcon} ${styles.adminIcon}`}><ShieldAlert size={22} /></div>
          <div className={styles.roleInfo}>
            <h4>Admin</h4>
            <p>Manage users & content</p>
          </div>
          <span className={styles.roleCount}>{adminCount}</span>
        </div>
        
        <div className={styles.roleCard}>
          <div className={`${styles.roleIcon} ${styles.moderatorIcon}`}><Shield size={22} /></div>
          <div className={styles.roleInfo}>
            <h4>Moderator</h4>
            <p>Content moderation</p>
          </div>
          <span className={styles.roleCount}>{modCount}</span>
        </div>
      </div>

      {/* 🟢 ADMINS TABLE */}
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
            {admins.length === 0 ? (
                <tr><td colSpan="5" className={styles.emptyState}>No admins found.</td></tr>
            ) : (
                admins.map((admin) => {
                  const isSelf = currentUser && currentUser._id === admin._id;
                  const isSuperAdminTarget = admin.role === 'super-admin';
                  const isDisabled = isSuperAdminTarget || isSelf;

                  return (
                    <tr key={admin._id}>
                      <td>
                        <div className={styles.adminInfo}>
                          <div className={styles.avatar}>{getInitials(admin.fullName)}</div>
                          <div className={styles.details}>
                            <span className={styles.name}>
                              {admin.fullName} {isSelf && <strong className={styles.selfTag}>(You)</strong>}
                            </span>
                            <span className={styles.email}>{admin.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`${styles.roleBadge} ${styles[admin.role] || styles.admin}`}>
                          {admin.role === 'super-admin' ? 'Super Admin' : admin.role.charAt(0).toUpperCase() + admin.role.slice(1)}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.status} ${admin.approved ? styles.active : styles.inactive}`}>
                          <span className={styles.statusDot}></span>
                          {admin.approved ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className={styles.date}>{new Date(admin.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className={styles.actions}>
                          <button 
                            className={styles.actionBtn} 
                            onClick={() => openModal('edit', admin)}
                            disabled={isDisabled}
                            title={isDisabled ? "Cannot edit this user" : "Edit Admin"}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className={`${styles.actionBtn} ${styles.danger}`} 
                            onClick={() => attemptDelete(admin)}
                            disabled={isDisabled}
                            title={isDisabled ? "Cannot delete this user" : "Remove Admin"}
                          >
                            <Trash2 size={16} />
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

      {/* 🟢 ADD / EDIT MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={styles.modal} initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}>
              <div className={styles.modalHeader}>
                <h3>{modalMode === 'add' ? 'Add New Admin' : 'Edit Admin Details'}</h3>
                <button className={styles.closeBtn} onClick={() => setShowModal(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className={styles.modalBody}>
                  <div className={styles.formGroup}>
                    <label>Full Name</label>
                    <input type="text" required placeholder="Enter full name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Email Address</label>
                    <input type="email" required placeholder="Enter email address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Role</label>
                      <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                        <option value="admin">Admin</option>
                        <option value="moderator">Moderator</option>
                      </select>
                    </div>
                    {modalMode === 'edit' && (
                      <div className={styles.formGroup}>
                        <label>Status</label>
                        <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    )}
                  </div>
                  {modalMode === 'add' && (
                    <div className={styles.formGroup}>
                      <label>Temporary Password</label>
                      <input type="password" required placeholder="Create initial password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    </div>
                  )}
                </div>
                <div className={styles.modalFooter}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 size={16} className={styles.spinnerIcon} /> : <CheckCircle2 size={16} />}
                    {modalMode === 'add' ? 'Create Account' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🟢 DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={styles.confirmModal} initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className={styles.confirmIcon}><ShieldAlert size={36} color="#ef4444" /></div>
              <h3>Remove Administrator?</h3>
              <p>Are you sure you want to permanently revoke access for <strong>{showDeleteModal.fullName}</strong>? This action cannot be undone.</p>
              <div className={styles.confirmActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowDeleteModal(null)}>Cancel</button>
                <button type="button" className={styles.confirmDangerBtn} onClick={handleDelete} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 size={16} className={styles.spinnerIcon} /> : <Trash2 size={16} />} Remove
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminManagement;
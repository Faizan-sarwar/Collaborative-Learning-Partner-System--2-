import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  // 🔹 CHANGE: Read from sessionStorage
  const userString = sessionStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // 1. Check if logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Check for role permission
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If Admin tries to go to student dashboard -> Send to Admin Panel
    if (user.role === 'admin') {
        return <Navigate to="/admin" replace />;
    }
    // If Student tries to go to Admin panel -> Send to Student Dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import React, { useEffect } from "react"; // 🔹 Added useEffect here
import Index from "../pages/Index";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import StudyTime from "../pages/StudyTime/StudyTime";
import Courses from "../pages/Courses/Courses";
import Social from "../pages/Social/Social";
import Analytics from "../pages/Analytics/Analytics";
import Signup from "../pages/Signup/Signup";
import Privacy from "../pages/Privacy/Privacy";
import Terms from "../pages/Terms/Terms";
import Help from "../pages/Help/Help";
import ThemeToggle from "../components/ThemeToggle/ThemeToggle";
import PageTransition from "../components/PageTransition/PageTransition";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../pages/ProtectedRoutes"; 
import "./App.css";

// Admin imports
import AdminLayout from "../pages/Admin/AdminLayout/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard/AdminDashboard";
import StudentManagement from "../pages/Admin/StudentManagement/StudentManagement";
import AdminManagement from "../pages/Admin/AdminManagement/AdminManagement";
import CourseManagement from "../pages/Admin/CourseManagement/CourseManagement";
import NotificationsPage from "../pages/Admin/NotificationsPage/NotificationsPage";
import ActivityLogs from "../pages/Admin/ActivityLogs/ActivityLogs";
import AdminProfile from "../pages/Admin/AdminProfile/AdminProfile";
import SettingsPage from "../pages/Admin/SettingsPage/SettingsPage";

const dashboardRoutes = ['/dashboard', '/study-time', '/courses', '/social', '/analytics'];

const AnimatedRoutes = () => {
  const location = useLocation();
  const isDashboardRoute = dashboardRoutes.some(route => location.pathname.startsWith(route));

  // 🔹 NEW: Session Heartbeat
  // This runs once when the app loads (refresh or new tab) to update "Last Active" time in DB
  useEffect(() => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    
    if (token) {
      fetch('http://localhost:5000/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(err => console.log("Background session update failed", err));
    }
  }, []);

  return (
    <>
      {!isDashboardRoute && <ThemeToggle />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
          <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
          <Route path="/help" element={<PageTransition><Help /></PageTransition>} />

          {/* ================= STUDENT ROUTES (Protected) ================= */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/study-time" element={<StudyTime />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/social" element={<Social />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* ================= ADMIN ROUTES (Protected) ================= */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'super-admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="students" element={<StudentManagement />} />
              <Route path="admins" element={<AdminManagement />} />
              <Route path="courses" element={<CourseManagement />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="logs" element={<ActivityLogs />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />

        </Routes>
      </AnimatePresence>
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <ThemeToggle />
    <AnimatedRoutes />
  </BrowserRouter>
);

export default App;
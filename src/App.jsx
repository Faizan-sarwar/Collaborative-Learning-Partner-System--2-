import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
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
import React from "react";
import "./App.css";

// Admin imports
import AdminLayout from "../pages/Admin/AdminLayout/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard/AdminDashboard";
import StudentManagement from "../pages/Admin/StudentManagement/StudentManagement";
import AdminManagement from "../pages/Admin/AdminManagement/AdminManagement";
import CourseManagement from "../pages/Admin/CourseManagement/CourseManagement";
import NotificationsPage from "../pages/Admin/NotificationsPage/NotificationsPage";
import ActivityLogs from "../pages/Admin/ActivityLogs/ActivityLogs";
import SettingsPage from "../pages/Admin/SettingsPage/SettingsPage";

const dashboardRoutes = ['/dashboard', '/study-time', '/courses', '/social', '/analytics'];

const AnimatedRoutes = () => {
  const location = useLocation();
  const isDashboardRoute = dashboardRoutes.some(route => location.pathname.startsWith(route));

  return (
    <>
      {!isDashboardRoute && <ThemeToggle />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/study-time" element={<StudyTime />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/social" element={<Social />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
          <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
          <Route path="/help" element={<PageTransition><Help /></PageTransition>} />


          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="admins" element={<AdminManagement />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="logs" element={<ActivityLogs />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

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

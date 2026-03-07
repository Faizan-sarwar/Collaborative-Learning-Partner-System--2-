import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import Index from "../pages/Index";
import Login from "../pages/Login/Login";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import VerifyOTP from "../pages/VerifyOTP/VerifyOTP";
import Dashboard from "../pages/Dashboard/Dashboard";
import StudyTime from "../pages/StudyTime/StudyTime";
import Courses from "../pages/Courses/Courses";
// import Social from "../pages/Social/Social";
import Analytics from "../pages/Analytics/Analytics";
import Signup from "../pages/Signup/Signup";
import Privacy from "../pages/Privacy/Privacy";
import Terms from "../pages/Terms/Terms";
import Help from "../pages/Help/Help";
import ThemeToggle from "../components/ThemeToggle/ThemeToggle";
import PageTransition from "../components/PageTransition/PageTransition";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../pages/ProtectedRoutes";
import StudyRoom from "../pages/StudyRoom/StudyRoom";
import UserProfile from "../pages/UserProfile/UserProfile";
import Messages from "../pages/Messages/Messages";
import Quiz from "../pages/Quiz/Quiz";
import Gamification from "../pages/Gamification/Gamification";
// import Refer from "../pages/Refer/Refer";
import PendingConnections from "../pages/PendingConnections/PendingConnections";
import Connections from "../pages/Connections/Connections";
import StudyMatches from "../pages/StudyMatches/StudyMatches";
import StudyRoomWaiting from "../pages/StudyRoomWaiting/StudyRoomWaiting";
import StudyRoomActive from "../pages/StudyRoomActive/StudyRoomActive";
import Settings from "../pages/Settings/Settings";
import ChatBot from "../pages/ChatBot/ChatBot"; 
import XP from "../pages/XP/Xp";
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

const dashboardRoutes = [
  '/dashboard',
  '/study-time',
  '/courses',
  '/social',
  '/analytics',
  '/study-room',
  '/profile',
  '/messages',
  '/quiz',
  '/gamification',
  // '/refer',
  '/study-matches',
  '/user-profile',
  '/pending-connections',
  '/connections',
  '/settings',
  '/chatbot',
  '/admin' 
];

const AnimatedRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboardRoute = dashboardRoutes.some(route => location.pathname.startsWith(route));
  const [isChecking, setIsChecking] = useState(true);

  // 🔹 GUARD LOGIC
  useEffect(() => {
    const checkStatus = async () => {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        const storedUserString = sessionStorage.getItem('user') || localStorage.getItem('user');

        if (!token || !storedUserString) {
            setIsChecking(false);
            return;
        }

        let user = JSON.parse(storedUserString);
        
        if (user.role === 'admin' || user.role === 'super-admin') {
            setIsChecking(false);
            return; 
        }

        const hasStrengths = user.academicStrengths && user.academicStrengths.length > 0;
        
        if (user.quizCompleted) {
            setIsChecking(false);
            return;
        }

        if (hasStrengths && !user.quizCompleted) {
            try {
                const res = await fetch('http://localhost:5000/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                
                if (data.success && data.user.quizCompleted) {
                    sessionStorage.setItem('user', JSON.stringify(data.user));
                    setIsChecking(false);
                    return;
                }
            } catch (err) {
                console.error("Auth check failed", err);
            }

            if (location.pathname !== '/quiz' && location.pathname !== '/login') {
                navigate('/quiz');
            }
        }
        setIsChecking(false);
    };

    checkStatus();
  }, [location.pathname, navigate]);

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
          <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
          <Route path="/verify-otp" element={<PageTransition><VerifyOTP /></PageTransition>} />

          {/* ================= STUDENT ROUTES (Protected) ================= */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/study-time" element={<StudyTime />} />
            <Route path="/courses" element={<Courses />} />
            {/* <Route path="/social" element={<Social />} /> */}
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/study-room" element={<StudyRoom />} />
            <Route path="/study-room/waiting/:roomId" element={<StudyRoomWaiting />} />
            <Route path="/study-room/active/:roomId" element={<StudyRoomActive />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/gamification" element={<Gamification />} />
            {/* <Route path="/refer" element={<Refer />} /> */}
            <Route path="/study-matches" element={<StudyMatches />} />
            <Route path="/user-profile/:userId" element={<UserProfile />} />
            <Route path="/pending-connections" element={<PendingConnections />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/chatbot" element={<ChatBot />} />
            <Route path="/xp" element={<XP />} />
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
    {/* 🛑 MAKE SURE CHATBOT IS NOT HERE */}
    <AnimatedRoutes />
  </BrowserRouter>
);

export default App;
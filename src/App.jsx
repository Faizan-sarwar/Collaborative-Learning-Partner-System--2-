import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { SettingsProvider, useSettings } from '../src/context/SettingsContext';
import { NotificationProvider } from '../src/context/NotificationContext';

import Index from "../pages/Index";
import Login from "../pages/Login/Login";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import VerifyOTP from "../pages/VerifyOTP/VerifyOTP";
import Dashboard from "../pages/Dashboard/Dashboard";
import StudyTime from "../pages/StudyTime/StudyTime";
import Courses from "../pages/Courses/Courses";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import Social from "../pages/Social/Social";
import Analytics from "../pages/Analytics/Analytics";
import Signup from "../pages/Signup/Signup";
import Privacy from "../pages/Privacy/Privacy";
import Terms from "../pages/Terms/Terms";
import Help from "../pages/Help/Help";
import ThemeToggle from "../components/ThemeToggle/ThemeToggle";
import PageTransition from "../components/PageTransition/PageTransition";
import NotFound from "../pages/NotFound/NotFound";
import ProtectedRoute from "../pages/ProtectedRoutes";
import StudyRoom from "../pages/StudyRoom/StudyRoom";
import UserProfile from "../pages/UserProfile/UserProfile";
import Messages from "../pages/Messages/Messages";
import Quiz from "../pages/Quiz/Quiz";
import Gamification from "../pages/Gamification/Gamification";
import Refer from "../pages/Refer/Refer";
import PendingConnections from "../pages/PendingConnections/PendingConnections";
import Connections from "../pages/Connections/Connections";
import StudyMatches from "../pages/StudyMatches/StudyMatches";
import StudyRoomWaiting from "../pages/StudyRoomWaiting/StudyRoomWaiting";
import StudyRoomActive from "../pages/StudyRoomActive/StudyRoomActive";
import Settings from "../pages/Settings/Settings";
import ChatBot from "../pages/ChatBot/ChatBot";
import FAQ from "../components/FAQ/FAQ";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
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
  const { settings } = useSettings();

  // Get the base URL from Vite .env, fallback to localhost if it's missing
  const apiUrl = `http://${window.location.hostname}:5000`;

  useEffect(() => {
    const checkStatus = async () => {
      if (!settings) return;

      try {
        const token = (localStorage.getItem('token') || sessionStorage.getItem('token'));
        const storedUserString = (localStorage.getItem('user') || sessionStorage.getItem('user'));

        let user = null;
        if (storedUserString) {
          try { user = JSON.parse(storedUserString); } catch (e) { console.error("Failed to parse user", e); }
        }

        // 1. GLOBAL HARD LOCKDOWN (Maintenance Mode)
        if (settings?.maintenanceMode) {
          const isAdmin = user?.role === 'admin' || user?.role === 'super-admin';
          if (!isAdmin && location.pathname !== '/maintenance') {
            navigate('/maintenance');
            return;
          }
        } else {
          if (location.pathname === '/maintenance') {
            navigate('/');
          }
        }

        // 2. GLOBAL REGISTRATION LOCK
        if (settings?.allowRegistrations === false && location.pathname === '/signup') {
          alert("New registrations are currently disabled by the administrator.");
          navigate('/login');
          return;
        }

        // If no token or user, stop checking (let public routes handle it)
        if (!token || !user) {
          return;
        }

        const isPublicPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup';

        // 3. ADMIN REDIRECT LOGIC
        if (user.role === 'admin' || user.role === 'super-admin') {
          if (isPublicPage) navigate('/admin');
          return;
        }

        // 4. STUDENT QUIZ LOGIC
        const hasStrengths = user.academicStrengths && user.academicStrengths.length > 0;

        if (user.quizCompleted) {
          if (isPublicPage) navigate('/dashboard');
          return;
        }

        if (hasStrengths && !user.quizCompleted) {
          try {
            // FIXED: Using dynamic apiUrl instead of hardcoded localhost
            const res = await fetch(`${apiUrl}/api/auth/me`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success && data.user.quizCompleted) {
              if (localStorage.getItem('token')) {
                localStorage.setItem('user', JSON.stringify(data.user));
              } else {
                sessionStorage.setItem('user', JSON.stringify(data.user));
              }

              if (isPublicPage) navigate('/dashboard');
              return;
            }
          } catch (err) {
            console.error("Auth check failed (Server might be down):", err);
          }

          if (location.pathname !== '/quiz' && location.pathname !== '/login') {
            navigate('/quiz');
          }
        }
      } catch (error) {
         console.error("Critical error during app initialization:", error);
      } finally {
        // FIXED: The spinner will ALWAYS shut off, no matter what happens above
        setIsChecking(false);
      }
    };

    checkStatus();
  }, [location.pathname, navigate, settings, apiUrl]);

  if (isChecking) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: '#8b5cf6' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
          <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
        </svg>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

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
          <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />

          {/* Fallback route for maintenance mode */}
          <Route path="/maintenance" element={
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>We'll be back soon!</h1>
              <p style={{ fontSize: '1.2rem', color: '#666' }}>The platform is currently undergoing scheduled maintenance. Please check back later.</p>
            </div>
          } />

          {/* ================= STUDENT ROUTES (Protected) ================= */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/study-time" element={<StudyTime />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/social" element={<Social />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/study-room" element={<StudyRoom />} />
            <Route path="/study-room/waiting/:roomId" element={<StudyRoomWaiting />} />
            <Route path="/study-room/active/:roomId" element={<StudyRoomActive />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/gamification" element={<Gamification />} />
            <Route path="/refer" element={<Refer />} />
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
  <SettingsProvider>
    <NotificationProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </NotificationProvider>
  </SettingsProvider>
);

export default App;
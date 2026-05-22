import '../pages/Analytics/sessionTracker.js';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState, Suspense, lazy } from "react";
import { SettingsProvider, useSettings } from '../src/context/SettingsContext';
import { NotificationProvider } from '../src/context/NotificationContext';
import "./App.css";

import ThemeToggle from "../components/ThemeToggle/ThemeToggle";
import PageTransition from "../components/PageTransition/PageTransition";
import ProtectedRoute from "../pages/ProtectedRoutes";
import FAQ from "../components/FAQ/FAQ";
import Footer from "../components/Footer/Footer";

// 🟢 DashboardLayout is now a PERSISTENT layout route — import eagerly (it's always needed once logged in)
import DashboardLayout from "../components/Dashboard/DashboardLayout/DashboardLayout.jsx";

// 🟢 Lazy Loading for Public Pages
const Index = lazy(() => import("../pages/Index"));
const Login = lazy(() => import("../pages/Login/Login"));
const Signup = lazy(() => import("../pages/Signup/Signup"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword/ForgotPassword"));
const VerifyOTP = lazy(() => import("../pages/VerifyOTP/VerifyOTP"));
const ResetPassword = lazy(() => import("../pages/ResetPassword/ResetPassword"));
const Privacy = lazy(() => import("../pages/Privacy/Privacy"));
const Terms = lazy(() => import("../pages/Terms/Terms"));
const Help = lazy(() => import("../pages/Help/Help"));
const About = lazy(() => import("../pages/About/About"));
const Contact = lazy(() => import("../pages/Contact/Contact"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));

// 🟢 Student Pages
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const StudyTime = lazy(() => import("../pages/StudyTime/StudyTime"));
const Courses = lazy(() => import("../pages/Courses/Courses"));
const Social = lazy(() => import("../pages/Social/Social"));
const Analytics = lazy(() => import("../pages/Analytics/Analytics"));
const StudyRoom = lazy(() => import("../pages/StudyRoom/StudyRoom"));
const StudyRoomWaiting = lazy(() => import("../pages/StudyRoomWaiting/StudyRoomWaiting"));
const StudyRoomActive = lazy(() => import("../pages/StudyRoomActive/StudyRoomActive"));
const UserProfile = lazy(() => import("../pages/UserProfile/UserProfile"));
const Messages = lazy(() => import("../pages/Messages/Messages"));
const Quiz = lazy(() => import("../pages/Quiz/Quiz"));
const Gamification = lazy(() => import("../pages/Gamification/Gamification"));
const Refer = lazy(() => import("../pages/Refer/Refer"));
const PendingConnections = lazy(() => import("../pages/PendingConnections/PendingConnections"));
const Connections = lazy(() => import("../pages/Connections/Connections"));
const StudyMatches = lazy(() => import("../pages/StudyMatches/StudyMatches"));
const Settings = lazy(() => import("../pages/Settings/Settings"));
const ChatBot = lazy(() => import("../pages/ChatBot/ChatBot"));
const XP = lazy(() => import("../pages/XP/Xp"));

// 🟢 Admin Pages
const AdminLayout = lazy(() => import("../pages/Admin/AdminLayout/AdminLayout"));
const AdminDashboard = lazy(() => import("../pages/Admin/AdminDashboard/AdminDashboard"));
const StudentManagement = lazy(() => import("../pages/Admin/StudentManagement/StudentManagement"));
const AdminManagement = lazy(() => import("../pages/Admin/AdminManagement/AdminManagement"));
const CourseManagement = lazy(() => import("../pages/Admin/CourseManagement/CourseManagement"));
const NotificationsPage = lazy(() => import("../pages/Admin/NotificationsPage/NotificationsPage"));
const ActivityLogs = lazy(() => import("../pages/Admin/ActivityLogs/ActivityLogs"));
const AdminProfile = lazy(() => import("../pages/Admin/AdminProfile/AdminProfile"));
const SettingsPage = lazy(() => import("../pages/Admin/SettingsPage/SettingsPage"));

const dashboardRoutes = [
  '/dashboard', '/study-time', '/courses', '/social', '/analytics', '/study-room',
  '/profile', '/messages', '/quiz', '/gamification', '/study-matches', '/user-profile',
  '/pending-connections', '/connections', '/settings', '/chatbot', '/admin', '/refer', '/xp'
];

// 🟢 Fallback Spinner for lazy-loaded pages
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div style={{ width: '40px', height: '40px', border: '3px solid transparent', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboardRoute = dashboardRoutes.some(route => location.pathname.startsWith(route));

  const [isChecking, setIsChecking] = useState(true);
  const { settings } = useSettings();

  const apiUrl = `http://${window.location.hostname}:5000`;

  // 🟢 PRESERVED: Original auth + maintenance check logic, untouched
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

        if (settings?.maintenanceMode) {
          const isAdmin = user?.role === 'admin' || user?.role === 'super-admin';
          if (!isAdmin && location.pathname !== '/maintenance') {
            navigate('/maintenance');
            return;
          }
        } else {
          if (location.pathname === '/maintenance') navigate('/');
        }

        if (settings?.allowRegistrations === false && location.pathname === '/signup') {
          alert("New registrations are currently disabled by the administrator.");
          navigate('/login');
          return;
        }

        if (!token || !user) return;

        const isPublicPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup';

        if (user.role === 'admin' || user.role === 'super-admin') {
          if (isPublicPage) navigate('/admin');
          return;
        }

        const hasStrengths = user.academicStrengths && user.academicStrengths.length > 0;

        if (user.quizCompleted) {
          if (isPublicPage) navigate('/dashboard');
          return;
        }

        if (hasStrengths && !user.quizCompleted) {
          try {
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
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>

            {/* ─── Public routes ─── */}
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

            <Route path="/maintenance" element={
              <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>We'll be back soon!</h1>
                <p style={{ fontSize: '1.2rem', color: '#666' }}>The platform is currently undergoing scheduled maintenance. Please check back later.</p>
              </div>
            } />
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/study-time" element={<StudyTime />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/social" element={<Social />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/study-room" element={<StudyRoom />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/messages" element={<Messages />} />
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
              <Route element={<DashboardLayout hideSidebar />}>
                <Route path="/study-room/waiting/:roomId" element={<StudyRoomWaiting />} />
                <Route path="/study-room/active/:roomId" element={<StudyRoomActive />} />
                <Route path="/quiz" element={<Quiz />} />
              </Route>
            </Route>

            {/* ─── ADMIN routes */}
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

            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />

          </Routes>
        </Suspense>
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
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
import React from "react";
import "./App.css";

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

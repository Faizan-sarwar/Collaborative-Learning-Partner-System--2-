import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "../pages/Index";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import Privacy from "../pages/Privacy/Privacy";
import Terms from "../pages/Terms/Terms";
import Help from "../pages/Help/Help";
import ThemeToggle from "../components/ThemeToggle/ThemeToggle";
import PageTransition from "../components/PageTransition/PageTransition";
import React from "react";
import "./App.css";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
        <Route path="/help" element={<PageTransition><Help /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <BrowserRouter>
    <ThemeToggle />
    <AnimatedRoutes />
  </BrowserRouter>
);
export default App;

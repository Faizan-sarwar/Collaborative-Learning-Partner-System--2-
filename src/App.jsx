import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login/Login";
import Index from "../pages/Index";
import Privacy from "../pages/Privacy/Privacy";
import Terms from "../pages/Terms/Terms";
import Help from "../pages/Help/Help";
import ThemeToggle from "../components/ThemeToggle/ThemeToggle";
import Signup from "../components/Signup/Signup";
import React from "react";
import "./App.css";

function App() {
  return (
    <Router>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/help" element={<Help />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import LoginPage from "./pages/LoginPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

function App() {
  const [auth, setAuth] = useState(() => {
    return {
      email: localStorage.getItem("email"),
      role: localStorage.getItem("role"),
    };
  });

  useEffect(() => {
    // Listen for storage changes
    const handleStorageChange = () => {
      setAuth({
        email: localStorage.getItem("email"),
        role: localStorage.getItem("role"),
      });
    };

    // Listen for custom storage event
    window.addEventListener("storage", handleStorageChange);
    
    // Also check periodically (for same-tab updates)
    const interval = setInterval(() => {
      const currentEmail = localStorage.getItem("email");
      const currentRole = localStorage.getItem("role");
      if (currentEmail !== auth.email || currentRole !== auth.role) {
        setAuth({
          email: currentEmail,
          role: currentRole,
        });
      }
    }, 100);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [auth.email, auth.role]);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/user"
            element={
              auth.email && auth.role === "user" ? <UserDashboard /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/admin"
            element={
              auth.email && auth.role === "admin" ? <AdminDashboard /> : <Navigate to="/login" replace />
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;


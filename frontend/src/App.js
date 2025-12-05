import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import LoginPage from "./pages/LoginPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

function App() {
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/user"
            element={
              email && role === "user" ? <UserDashboard /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin"
            element={
              email && role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;


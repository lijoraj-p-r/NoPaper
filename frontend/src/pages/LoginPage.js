import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import "./LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        const res = await axios.post(`${API_URL}/login`, {
          email,
          password,
        });
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        localStorage.setItem("role", res.data.role);
        if (res.data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      } else {
        // signup
        await axios.post(`${API_URL}/register`, {
          email,
          password,
        });
        setMode("login");
        setError("Account created. Please sign in.");
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (mode === "signup") {
        if (detail === "Email already registered") {
          setError("An account with this email already exists. Please sign in.");
        } else {
          setError(detail || "Sign up failed. Please try again.");
        }
      } else {
        if (detail === "Incorrect email or password") {
          setError("Incorrect email or password.");
        } else {
          setError(detail || "Login failed. Please try again.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-shell">
        <div className="brand-panel">
          <div className="brand-mark">NB</div>
          <h1>NoPaper Books</h1>
          <p>Curated digital books, instant access in a few clicks.</p>
        </div>
        <div className="login-card">
          <div className="tab-row">
            <button
              type="button"
              className={mode === "login" ? "tab active" : "tab"}
              onClick={() => {
                setMode("login");
                setError("");
              }}
            >
              Sign in
            </button>
            <button
              type="button"
              className={mode === "signup" ? "tab active" : "tab"}
              onClick={() => {
                setMode("signup");
                setError("");
              }}
            >
              Create account
            </button>
          </div>
          <p className="subtitle">
            {mode === "login"
              ? "Welcome back. Enter your details to continue."
              : "Use your email to create a reader account."}
          </p>
          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="password-row">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
            {error && <div className="error-text">{error}</div>}
            <button type="submit" disabled={loading}>
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign in"
                : "Sign up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;



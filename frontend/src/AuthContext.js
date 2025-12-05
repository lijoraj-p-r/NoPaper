import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    return {
      email: localStorage.getItem("email"),
      role: localStorage.getItem("role"),
      isAuthenticated: !!localStorage.getItem("email"),
    };
  });

  const updateAuth = useCallback((email, role) => {
    const newAuth = {
      email: email || null,
      role: role || null,
      isAuthenticated: !!email,
    };
    setAuth(newAuth);
    // Also update localStorage
    if (email) {
      localStorage.setItem("email", email);
      if (role) localStorage.setItem("role", role);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    localStorage.removeItem("role");
    setAuth({
      email: null,
      role: null,
      isAuthenticated: false,
    });
  }, []);

  useEffect(() => {
    // Check for auth changes
    const checkAuth = () => {
      const email = localStorage.getItem("email");
      const role = localStorage.getItem("role");
      const isAuthenticated = !!email;
      
      setAuth(prevAuth => {
        if (email !== prevAuth.email || role !== prevAuth.role || isAuthenticated !== prevAuth.isAuthenticated) {
          return {
            email: email || null,
            role: role || null,
            isAuthenticated,
          };
        }
        return prevAuth;
      });
    };

    // Check on storage events (cross-tab)
    window.addEventListener("storage", checkAuth);
    
    // Check periodically (same-tab)
    const interval = setInterval(checkAuth, 200);

    return () => {
      window.removeEventListener("storage", checkAuth);
      clearInterval(interval);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ auth, updateAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


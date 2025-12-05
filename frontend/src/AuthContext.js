import React, { createContext, useContext, useState, useEffect } from 'react';

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

  const updateAuth = (email, role) => {
    const newAuth = {
      email: email || null,
      role: role || null,
      isAuthenticated: !!email,
    };
    setAuth(newAuth);
  };

  const logout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    localStorage.removeItem("role");
    updateAuth(null, null);
  };

  useEffect(() => {
    // Check for auth changes
    const checkAuth = () => {
      const email = localStorage.getItem("email");
      const role = localStorage.getItem("role");
      if (email !== auth.email || role !== auth.role) {
        updateAuth(email, role);
      }
    };

    // Check on storage events (cross-tab)
    window.addEventListener("storage", checkAuth);
    
    // Check periodically (same-tab)
    const interval = setInterval(checkAuth, 200);

    return () => {
      window.removeEventListener("storage", checkAuth);
      clearInterval(interval);
    };
  }, [auth.email, auth.role]);

  return (
    <AuthContext.Provider value={{ auth, updateAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


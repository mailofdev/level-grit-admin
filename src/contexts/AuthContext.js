import React, { createContext, useContext, useState, useEffect } from "react";
import { decryptToken } from "../utils/crypto";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    try {
      // Try sessionStorage first (active session)
      let encryptedToken = sessionStorage.getItem("auth_data");
      
      // If no active session, try to restore from localStorage
      if (!encryptedToken) {
        const persistedAuth = localStorage.getItem("auth_data");
        const timestamp = localStorage.getItem("auth_timestamp");
        
        if (persistedAuth && timestamp) {
          const sessionAge = Date.now() - parseInt(timestamp, 10);
          const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
          
          if (sessionAge < SESSION_DURATION) {
            // Restore to sessionStorage
            sessionStorage.setItem("auth_data", persistedAuth);
            encryptedToken = persistedAuth;
          } else {
            // Session expired
            localStorage.removeItem("auth_data");
            localStorage.removeItem("auth_timestamp");
            return false;
          }
        }
      }
      
      if (encryptedToken) {
        const token = decryptToken(encryptedToken);
        return !!token;
      }
    } catch (err) {
      // Error reading access token
    }
    return false;
  };

  // Initialize auth state
  useEffect(() => {
    setIsAuthenticated(checkAuth());

    // Listen for changes from other tabs/windows
    const handleStorageChange = () => setIsAuthenticated(checkAuth());
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (token) => {
    sessionStorage.setItem("auth_data", token);
    // Also persist to localStorage for PWA session restoration
    localStorage.setItem("auth_data", token);
    localStorage.setItem("auth_timestamp", Date.now().toString());
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem("auth_data");
    localStorage.removeItem("auth_data");
    localStorage.removeItem("auth_timestamp");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

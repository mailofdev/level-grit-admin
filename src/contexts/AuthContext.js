import React, { createContext, useContext, useState, useEffect } from "react";
import { decryptToken } from "../utils/crypto";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    try {
      const encryptedToken = sessionStorage.getItem("access_token");
      if (encryptedToken) {
        const token = decryptToken(encryptedToken);
        return !!token;
      }
    } catch (err) {
      console.error("Error reading access token:", err);
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
    sessionStorage.setItem("access_token", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.clear();
    localStorage.clear();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

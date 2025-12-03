// src/components/navigation/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getDecryptedUser } from "../common/CommonFunctions";
import { getUserRole, hasAnyRole, ROLES } from "../../utils/roles";
import { restoreSession } from "../../hooks/usePWASession";

/**
 * ProtectedRoute Component
 * 
 * Protects routes by requiring authentication and optionally specific roles.
 * Handles session restoration for PWA resume scenarios.
 * 
 * @param {React.ReactNode} children - Child components to render if access is granted
 * @param {number[]} allowedRoles - Optional array of role codes that can access this route
 * @param {boolean} requireAuth - Whether authentication is required (default: true)
 */
export default function ProtectedRoute({ children, allowedRoles, requireAuth = true }) {
  const { user, token } = useSelector((state) => state.auth);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [storedToken, setStoredToken] = useState(sessionStorage.getItem("auth_data"));
  
  // Restore session on mount (for PWA resume scenarios)
  useEffect(() => {
    const checkAndRestoreSession = async () => {
      if (!storedToken) {
        // Try to restore from localStorage
        const restored = restoreSession();
        if (restored) {
          const restoredToken = sessionStorage.getItem("auth_data");
          setStoredToken(restoredToken);
        }
      }
      setIsCheckingSession(false);
    };

    checkAndRestoreSession();
  }, [storedToken]);
  
  // Show loading state while checking session
  if (isCheckingSession && !storedToken && !token) {
    return null; // Or return a loading spinner
  }

  // Check authentication
  if (requireAuth && !token && !storedToken) {
    return <Navigate to="/login" replace />;
  }

  // If no role restriction, allow access
  if (!allowedRoles || allowedRoles.length === 0) {
    return children;
  }

  // Get user role for role-based access control
  const decryptedUser = getDecryptedUser();
  if (!decryptedUser) {
    return <Navigate to="/login" replace />;
  }

  const userRole = getUserRole(decryptedUser) ?? getUserRole(user);

  // Check if user has required role
  if (!hasAnyRole(userRole, allowedRoles)) {
    // Redirect to appropriate dashboard based on role or show 403
    if (userRole === ROLES.CLIENT) {
      return <Navigate to="/client-dashboard" replace />;
    } else if (userRole === ROLES.TRAINER) {
      return <Navigate to="/trainer-dashboard" replace />;
    } else if (userRole === ROLES.ADMINISTRATOR) {
      return <Navigate to="/admin-dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}

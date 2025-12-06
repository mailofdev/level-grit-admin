// src/components/navigation/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { getDecryptedUser } from "../common/CommonFunctions";
import { getUserRole, hasAnyRole, ROLES } from "../../utils/roles";
import { restoreSession as restoreSessionAction } from "../../features/auth/authSlice";

/**
 * Synchronously checks and restores session from localStorage
 * This is critical for mobile back button/swipe gestures where
 * the component needs to check auth immediately before rendering
 */
const checkAndRestoreSessionSync = () => {
  // Check sessionStorage first (active session)
  let token = sessionStorage.getItem("auth_data");
  
  // If no active session, check localStorage
  if (!token) {
    const persistedAuth = localStorage.getItem("auth_data");
    const timestamp = localStorage.getItem("auth_timestamp");
    
    if (persistedAuth && timestamp) {
      const sessionAge = Date.now() - parseInt(timestamp, 10);
      const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
      
      if (sessionAge < SESSION_DURATION) {
        // Restore to sessionStorage immediately
        sessionStorage.setItem("auth_data", persistedAuth);
        token = persistedAuth;
      } else {
        // Session expired, clear it
        localStorage.removeItem("auth_data");
        localStorage.removeItem("auth_timestamp");
        return null;
      }
    }
  }
  
  return token;
};

/**
 * ProtectedRoute Component
 * 
 * Protects routes by requiring authentication and optionally specific roles.
 * Handles session restoration for PWA resume scenarios and mobile back button.
 * 
 * @param {React.ReactNode} children - Child components to render if access is granted
 * @param {number[]} allowedRoles - Optional array of role codes that can access this route
 * @param {boolean} requireAuth - Whether authentication is required (default: true)
 */
export default function ProtectedRoute({ children, allowedRoles, requireAuth = true }) {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  
  // Synchronously check and restore session on mount (critical for mobile back button)
  const [hasValidSession, setHasValidSession] = useState(() => {
    const restoredToken = checkAndRestoreSessionSync();
    return !!restoredToken;
  });
  
  // Restore session to Redux state (async, but we already checked localStorage synchronously)
  useEffect(() => {
    // If no token in Redux state, restore from localStorage to Redux
    if (!token) {
      dispatch(restoreSessionAction());
    }
  }, [dispatch, token]);
  
  // Re-check session when Redux state updates
  useEffect(() => {
    const currentToken = token || sessionStorage.getItem("auth_data") || localStorage.getItem("auth_data");
    setHasValidSession(!!currentToken);
  }, [token]);
  
  // Check authentication - use multiple sources for reliability
  const authToken = useMemo(() => {
    return token || sessionStorage.getItem("auth_data") || localStorage.getItem("auth_data");
  }, [token]);
  
  if (requireAuth && !authToken && !hasValidSession) {
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

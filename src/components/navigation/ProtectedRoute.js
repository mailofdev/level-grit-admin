// src/components/navigation/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getDecryptedUser } from "../common/CommonFunctions";
import { getUserRole, hasAnyRole, ROLES } from "../../utils/roles";
import { restoreSession as restoreSessionAction } from "../../features/auth/authSlice";

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
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  
  // Restore session on mount (for PWA resume scenarios)
  useEffect(() => {
    const checkAndRestoreSession = () => {
      // If no token in Redux state, try to restore from localStorage
      if (!token) {
        dispatch(restoreSessionAction());
      }
      setIsCheckingSession(false);
    };

    checkAndRestoreSession();
  }, [dispatch, token]);
  
  // Show loading state while checking session
  if (isCheckingSession && !token) {
    return null; // Or return a loading spinner
  }

  // Check authentication - use localStorage as fallback if Redux state is not yet updated
  const hasToken = token || sessionStorage.getItem("auth_data") || localStorage.getItem("auth_data");
  
  if (requireAuth && !hasToken) {
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

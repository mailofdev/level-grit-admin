// src/components/navigation/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getDecryptedUser } from "../common/CommonFunctions";
import { getUserRole, hasAnyRole, ROLES } from "../../utils/roles";

/**
 * ProtectedRoute Component
 * 
 * Protects routes by requiring authentication and optionally specific roles.
 * 
 * @param {React.ReactNode} children - Child components to render if access is granted
 * @param {number[]} allowedRoles - Optional array of role codes that can access this route
 * @param {boolean} requireAuth - Whether authentication is required (default: true)
 */
export default function ProtectedRoute({ children, allowedRoles, requireAuth = true }) {
  const { user, token } = useSelector((state) => state.auth);
  let storedToken = sessionStorage.getItem("auth_data");
  
  // If no active session, try to restore from localStorage
  if (!storedToken) {
    const persistedAuth = localStorage.getItem("auth_data");
    const timestamp = localStorage.getItem("auth_timestamp");
    
    if (persistedAuth && timestamp) {
      const sessionAge = Date.now() - parseInt(timestamp, 10);
      const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
      
      if (sessionAge < SESSION_DURATION) {
        // Restore to sessionStorage
        sessionStorage.setItem("auth_data", persistedAuth);
        storedToken = persistedAuth;
      } else {
        // Session expired
        localStorage.removeItem("auth_data");
        localStorage.removeItem("auth_timestamp");
      }
    }
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

// src/components/navigation/PublicRoute.js
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getDecryptedUser } from "../common/CommonFunctions";
import { getUserRole, ROLES } from "../../utils/roles";
import { restoreSession as restoreSessionAction } from "../../features/auth/authSlice";

/**
 * Synchronously checks if user is authenticated
 */
const checkAuthSync = () => {
  const token = sessionStorage.getItem("auth_data") || localStorage.getItem("auth_data");
  if (!token) return false;
  
  // Check if session is still valid
  const timestamp = localStorage.getItem("auth_timestamp");
  if (timestamp) {
    const sessionAge = Date.now() - parseInt(timestamp, 10);
    const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
    if (sessionAge >= SESSION_DURATION) {
      return false;
    }
  }
  
  return !!token;
};

/**
 * Gets user's dashboard route based on role
 */
const getUserDashboard = () => {
  const user = getDecryptedUser();
  if (!user) return '/login';
  
  const userRole = getUserRole(user);
  if (userRole === ROLES.CLIENT) return '/client-dashboard';
  if (userRole === ROLES.TRAINER) return '/trainer-dashboard';
  if (userRole === ROLES.ADMINISTRATOR) return '/admin-dashboard';
  return '/login';
};

/**
 * PublicRoute Component
 * 
 * STRICT RULE: Blocks authenticated users from accessing public routes.
 * Only unauthenticated users can access public routes like landing page, login, register.
 * 
 * @param {React.ReactNode} children - Child components to render if access is granted
 */
export default function PublicRoute({ children }) {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => checkAuthSync());
  
  // Restore session to Redux state
  useEffect(() => {
    if (!token) {
      dispatch(restoreSessionAction());
    }
    setIsChecking(false);
  }, [dispatch, token]);
  
  // Re-check authentication when Redux state updates
  useEffect(() => {
    const currentAuth = checkAuthSync() || !!token;
    setIsAuthenticated(currentAuth);
  }, [token]);
  
  // STRICT RULE: If authenticated, redirect to dashboard
  if (isChecking) {
    return null; // Show nothing while checking
  }
  
  if (isAuthenticated) {
    const dashboard = getUserDashboard();
    return <Navigate to={dashboard} replace />;
  }
  
  return children;
}


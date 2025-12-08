/**
 * Back Button Handler Component
 * 
 * Handles browser back button intelligently:
 * - STRICT RULE: Once logged in, only logout button can logout
 * - Prevents navigation to landing page for authenticated users
 * - Blocks back button/swipe gestures from going to public routes
 * - Only shows logout confirmation when at root dashboard (no history to go back to)
 */

import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import LogoutModal from '../topbar/LogoutModal';
import { getDecryptedUser } from '../common/CommonFunctions';
import { getUserRole, ROLES } from '../../utils/roles';

// Root dashboard routes (where we show logout confirmation if no history)
const ROOT_DASHBOARD_ROUTES = [
  '/trainer-dashboard',
  '/client-dashboard',
  '/admin-dashboard',
];

// Public routes that authenticated users should NOT access
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/reset-password',
];

// Helper function to check if user is authenticated
const isAuthenticated = () => {
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

// Helper function to get user's dashboard route
const getUserDashboard = () => {
  const user = getDecryptedUser();
  if (!user) return '/login';
  
  const userRole = getUserRole(user);
  if (userRole === ROLES.CLIENT) return '/client-dashboard';
  if (userRole === ROLES.TRAINER) return '/trainer-dashboard';
  if (userRole === ROLES.ADMINISTRATOR) return '/admin-dashboard';
  return '/login';
};

const BackButtonHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const historyStackRef = useRef([]);
  const isInitialMountRef = useRef(true);
  const isNavigatingRef = useRef(false);

  // Check if user is authenticated
  const authenticated = isAuthenticated() || !!token;

  // STRICT RULE: Block navigation to public routes for authenticated users
  useEffect(() => {
    if (!authenticated) return;

    const currentPath = location.pathname;
    
    // If authenticated user tries to access public route, redirect to dashboard
    if (PUBLIC_ROUTES.includes(currentPath)) {
      const dashboard = getUserDashboard();
      isNavigatingRef.current = true;
      navigate(dashboard, { replace: true });
      return;
    }
  }, [location.pathname, authenticated, navigate]);

  // Track navigation history (only for protected routes)
  useEffect(() => {
    // Skip initial mount
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      // Only track protected routes
      if (!PUBLIC_ROUTES.includes(location.pathname)) {
        historyStackRef.current = [location.pathname];
      }
      return;
    }

    // If we're programmatically navigating, don't add to stack
    if (isNavigatingRef.current) {
      isNavigatingRef.current = false;
      return;
    }

    // Only track protected routes in history
    const currentPath = location.pathname;
    if (PUBLIC_ROUTES.includes(currentPath)) {
      return; // Don't track public routes
    }

    const lastPath = historyStackRef.current[historyStackRef.current.length - 1];
    
    if (currentPath !== lastPath) {
      historyStackRef.current.push(currentPath);
      if (historyStackRef.current.length > 50) {
        historyStackRef.current.shift();
      }
    }
  }, [location.pathname]);

  // Global popstate handler - blocks navigation to public routes for authenticated users
  useEffect(() => {
    if (!authenticated) return;

    const handlePopState = (event) => {
      // Get the path we're trying to navigate to
      const targetPath = window.location.pathname;
      
      // STRICT RULE: Block navigation to public routes
      if (PUBLIC_ROUTES.includes(targetPath)) {
        event.preventDefault();
        
        // Push current state back to prevent navigation
        window.history.pushState(null, '', location.pathname);
        
        // If at root dashboard, show logout modal
        const isRootDashboard = ROOT_DASHBOARD_ROUTES.some(route => 
          location.pathname === route
        );
        
        if (isRootDashboard && !showLogoutModal) {
          setShowLogoutModal(true);
        } else if (!isRootDashboard) {
          // If not at root, just prevent navigation (stay on current page)
          // Or navigate to dashboard if somehow we got here
          const dashboard = getUserDashboard();
          if (location.pathname !== dashboard) {
            isNavigatingRef.current = true;
            navigate(dashboard, { replace: true });
          }
        }
        return;
      }

      // Allow navigation within protected routes
      // Check if we have valid history
      const hasHistory = historyStackRef.current.length > 1;
      
      if (hasHistory && historyStackRef.current.length > 1) {
        // Remove current from stack and navigate to previous
        historyStackRef.current.pop();
        const previousPath = historyStackRef.current[historyStackRef.current.length - 1];
        
        // Make sure previous path is also a protected route
        if (previousPath && !PUBLIC_ROUTES.includes(previousPath) && previousPath !== location.pathname) {
          isNavigatingRef.current = true;
          navigate(previousPath, { replace: false });
        } else {
          // Previous path is public or invalid, prevent navigation
          event.preventDefault();
          window.history.pushState(null, '', location.pathname);
          
          // Show logout modal if at root dashboard
          const isRootDashboard = ROOT_DASHBOARD_ROUTES.some(route => 
            location.pathname === route
          );
          if (isRootDashboard && !showLogoutModal) {
            setShowLogoutModal(true);
          }
        }
        return;
      }

      // No valid history - we're at root dashboard, show logout confirmation
      event.preventDefault();
      
      const isRootDashboard = ROOT_DASHBOARD_ROUTES.some(route => 
        location.pathname === route
      );
      
      if (isRootDashboard && !showLogoutModal) {
        setShowLogoutModal(true);
      }
      
      // Push state again to keep user on current page
      window.history.pushState(null, '', location.pathname);
    };

    // Add history state to prevent back navigation to public routes
    window.history.pushState(null, '', location.pathname);

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname, navigate, showLogoutModal, authenticated]);

  const handleLogoutConfirm = () => {
    // Clear all session data
    dispatch(logout());
    sessionStorage.removeItem("auth_data");
    localStorage.removeItem("auth_data");
    localStorage.removeItem("auth_timestamp");
    setShowLogoutModal(false);
    historyStackRef.current = [];
    isNavigatingRef.current = true;
    // Navigate to landing page after logout
    navigate('/', { replace: true });
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
    // Push state again to prevent navigation
    window.history.pushState(null, '', location.pathname);
  };

  return (
    <LogoutModal
      show={showLogoutModal}
      onConfirm={handleLogoutConfirm}
      onCancel={handleLogoutCancel}
    />
  );
};

export default BackButtonHandler;


/**
 * Back Button Handler Component
 * 
 * Handles browser back button intelligently:
 * - Allows proper in-app navigation (back through app history)
 * - Only shows logout confirmation when at root dashboard (no history to go back to)
 * - Does NOT interfere with native gestures or PWA navigation
 */

import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import LogoutModal from '../topbar/LogoutModal';

// Root dashboard routes (where we show logout confirmation if no history)
const ROOT_DASHBOARD_ROUTES = [
  '/trainer-dashboard',
  '/client-dashboard',
  '/admin-dashboard',
];

const BackButtonHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const historyStackRef = useRef([]);
  const isInitialMountRef = useRef(true);
  const isNavigatingRef = useRef(false);

  // Track navigation history
  useEffect(() => {
    // Skip initial mount
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      historyStackRef.current = [location.pathname];
      return;
    }

    // If we're programmatically navigating, don't add to stack
    if (isNavigatingRef.current) {
      isNavigatingRef.current = false;
      return;
    }

    // Add current path to history stack (limit to 50 entries)
    const currentPath = location.pathname;
    const lastPath = historyStackRef.current[historyStackRef.current.length - 1];
    
    if (currentPath !== lastPath) {
      historyStackRef.current.push(currentPath);
      if (historyStackRef.current.length > 50) {
        historyStackRef.current.shift();
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    // Only handle back button on root dashboard routes
    const isRootDashboard = ROOT_DASHBOARD_ROUTES.some(route => 
      location.pathname === route
    );

    if (!isRootDashboard) {
      return;
    }

    // Check if we have navigation history (more than just current page)
    const hasHistory = historyStackRef.current.length > 1;

    const handlePopState = (event) => {
      // If we have history, allow normal navigation
      if (hasHistory && historyStackRef.current.length > 1) {
        // Remove current from stack and navigate to previous
        historyStackRef.current.pop();
        const previousPath = historyStackRef.current[historyStackRef.current.length - 1];
        if (previousPath && previousPath !== location.pathname) {
          isNavigatingRef.current = true;
          navigate(previousPath, { replace: false });
        }
        return;
      }

      // No history - we're at root dashboard, show logout confirmation
      event.preventDefault();
      
      if (!showLogoutModal) {
        setShowLogoutModal(true);
      }
      
      // Push state again to keep user on current page
      window.history.pushState(null, '', location.pathname);
    };

    // Only add history state if we're at root and don't have history
    if (!hasHistory) {
      window.history.pushState(null, '', location.pathname);
    }

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname, navigate, showLogoutModal]);

  const handleLogoutConfirm = () => {
    dispatch(logout());
    // Clear session from both storages
    sessionStorage.removeItem("auth_data");
    localStorage.removeItem("auth_data");
    localStorage.removeItem("auth_timestamp");
    setShowLogoutModal(false);
    historyStackRef.current = [];
    isNavigatingRef.current = true;
    navigate('/login', { replace: true });
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


/**
 * Back Button Handler Component
 * 
 * Handles browser back button on dashboard pages by showing
 * logout confirmation modal instead of navigating away.
 */

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import LogoutModal from '../topbar/LogoutModal';

// Dashboard routes that should show logout confirmation on back button
const DASHBOARD_ROUTES = [
  '/trainer-dashboard',
  '/client-dashboard',
  '/admin-dashboard',
  '/AllClients',
  '/payment-management',
];

const BackButtonHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isDashboardRoute, setIsDashboardRoute] = useState(false);

  useEffect(() => {
    // Check if current route is a dashboard route
    const isDashboard = DASHBOARD_ROUTES.some(route => 
      location.pathname === route || location.pathname.startsWith(route + '/')
    );
    setIsDashboardRoute(isDashboard);
  }, [location.pathname]);

  useEffect(() => {
    if (!isDashboardRoute) return;

    // Push a new state to history to prevent immediate back navigation
    window.history.pushState(null, '', location.pathname);

    const handlePopState = (event) => {
      // Prevent default back navigation
      event.preventDefault();
      
      // Show logout confirmation modal
      if (!showLogoutModal) {
        setShowLogoutModal(true);
      }
      
      // Push state again to keep user on current page
      window.history.pushState(null, '', location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isDashboardRoute, location.pathname, showLogoutModal]);

  const handleLogoutConfirm = () => {
    dispatch(logout());
    // Clear session from both storages
    sessionStorage.removeItem("auth_data");
    localStorage.removeItem("auth_data");
    localStorage.removeItem("auth_timestamp");
    setShowLogoutModal(false);
    navigate('/login', { replace: true });
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
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


/**
 * ProtectedRoute component for authentication-based route protection
 * Handles authentication checks, role-based access, and session management
 */
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { decryptToken } from '../../utils/crypto';
import { selectIsAuthenticated, selectUser, selectIsSessionExpired } from '../../features/auth/authSlice';
import { logout } from '../../features/auth/authSlice';
import Loader from '../display/Loader';

/**
 * ProtectedRoute component that wraps routes requiring authentication
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {Array} props.allowedRoles - Array of allowed user roles (optional)
 * @param {boolean} props.requireAuth - Whether authentication is required (default: true)
 * @returns {JSX.Element} Protected route component
 */
export default function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  requireAuth = true 
}) {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  
  // Redux selectors
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const isSessionExpired = useSelector(selectIsSessionExpired);

  /**
   * Validate stored authentication data
   */
  const validateStoredAuth = () => {
    try {
      const storedToken = sessionStorage.getItem('auth_data');
      
      if (!storedToken) {
        return false;
      }

      const decrypted = decryptToken(storedToken);
      if (!decrypted) {
        // Invalid token, clear it
        sessionStorage.removeItem('auth_data');
        return false;
      }

      const authData = JSON.parse(decrypted);
      return !!(authData?.accessToken && authData?.userInfo);
    } catch (error) {
      console.warn('Failed to validate stored auth:', error);
      sessionStorage.removeItem('auth_data');
      return false;
    }
  };

  /**
   * Check if user has required role
   */
  const hasRequiredRole = () => {
    if (!allowedRoles.length) {
      return true; // No role restrictions
    }

    if (!user?.role) {
      return false;
    }

    return allowedRoles.includes(user.role);
  };

  /**
   * Handle session expiry
   */
  const handleSessionExpiry = () => {
    console.warn('Session expired, logging out user');
    dispatch(logout());
  };

  // Effect to validate authentication on mount and route changes
  useEffect(() => {
    const validateAuth = async () => {
      setIsValidating(true);

      // Check if session is expired
      if (isSessionExpired) {
        handleSessionExpiry();
        setIsValidating(false);
        return;
      }

      // If not authenticated in Redux, check stored token
      if (!isAuthenticated) {
        const hasValidToken = validateStoredAuth();
        if (!hasValidToken) {
          setIsValidating(false);
          return;
        }
      }

      setIsValidating(false);
    };

    validateAuth();
  }, [isAuthenticated, isSessionExpired, dispatch, location.pathname]);

  // Show loading while validating
  if (isValidating) {
    return <Loader fullScreen text="Validating access..." />;
  }

  // If authentication is not required, render children
  if (!requireAuth) {
    return children;
  }

  // Check authentication
  if (!isAuthenticated) {
    // Store the attempted location for redirect after login
    const from = location.pathname + location.search;
    return <Navigate to="/login" state={{ from }} replace />;
  }

  // Check role-based access
  if (!hasRequiredRole()) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h2 className="text-danger mb-3">Access Denied</h2>
          <p className="text-muted mb-4">
            You don't have permission to access this page.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // All checks passed, render protected content
  return children;
}

/**
 * Higher-order component for role-based route protection
 * @param {Array} allowedRoles - Array of allowed roles
 * @returns {Function} HOC function
 */
export const withRoleProtection = (allowedRoles) => {
  return function RoleProtectedRoute(props) {
    return (
      <ProtectedRoute allowedRoles={allowedRoles} {...props} />
    );
  };
};

/**
 * Higher-order component for admin-only routes
 */
export const AdminRoute = withRoleProtection(['Administrator']);

/**
 * Higher-order component for trainer-only routes
 */
export const TrainerRoute = withRoleProtection(['Trainer', 'Administrator']);

/**
 * Higher-order component for client-only routes
 */
export const ClientRoute = withRoleProtection(['Client', 'Administrator']);

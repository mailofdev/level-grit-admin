/**
 * Axios Instance Configuration
 * 
 * Centralized HTTP client configuration for all API requests.
 * Handles authentication, error handling, and request/response interceptors.
 * 
 * Features:
 * - Automatic token injection from encrypted session storage
 * - Global error handling and formatting
 * - Automatic logout on 401 Unauthorized
 * - Request/response logging for debugging
 */

import axios from "axios";
import { decryptToken } from "../utils/crypto";
import { formatErrorMessage, logError } from "../utils/errorHandler";

// ============================================
// Axios Instance Configuration
// ============================================
/**
 * Create axios instance with base URL and timeout
 * 
 * Configuration:
 * - baseURL: Backend API endpoint
 * - timeout: Request timeout in milliseconds (10 seconds)
 * 
 * Note: Update baseURL for production deployment
 */
const axiosInstance = axios.create({
  baseURL: "https://api.levelgrit.com/Levelgrit/API",
  // Production URL
  timeout: 10000, // 10 seconds
});

// ============================================
// Request Interceptor
// ============================================
/**
 * Automatically injects authentication token into request headers
 * 
 * Flow:
 * 1. Retrieves encrypted auth data from sessionStorage
 * 2. Decrypts and extracts access token
 * 3. Adds Authorization header with Bearer token
 * 4. Handles decryption errors gracefully
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Try sessionStorage first (active session), then localStorage (restored session)
    let encrypted = sessionStorage.getItem("auth_data");
    
    // If no active session, try to restore from localStorage
    if (!encrypted) {
      const persistedAuth = localStorage.getItem("auth_data");
      const timestamp = localStorage.getItem("auth_timestamp");
      
      // Check if session is still valid (7 days)
      if (persistedAuth && timestamp) {
        const sessionAge = Date.now() - parseInt(timestamp, 10);
        const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
        
        if (sessionAge < SESSION_DURATION) {
          // Restore to sessionStorage
          sessionStorage.setItem("auth_data", persistedAuth);
          encrypted = persistedAuth;
        } else {
          // Session expired, clear it
          localStorage.removeItem("auth_data");
          localStorage.removeItem("auth_timestamp");
        }
      }
    }
    
    if (encrypted) {
      try {
        const decrypted = decryptToken(encrypted);
        const authData = JSON.parse(decrypted || "{}");
        if (authData?.accessToken) {
          config.headers.Authorization = `Bearer ${authData.accessToken}`;
        }
      } catch (error) {
        // If decryption fails, clear invalid auth data
        logError(error, "Axios Request Interceptor");
        sessionStorage.removeItem("auth_data");
        localStorage.removeItem("auth_data");
        localStorage.removeItem("auth_timestamp");
      }
    }
    return config;
  },
  (error) => {
    // Handle request setup errors
    logError(error, "Axios Request Error");
    return Promise.reject(error);
  }
);

// ============================================
// Response Interceptor
// ============================================
/**
 * Handles all API responses and errors globally
 * 
 * Features:
 * - Automatic logout on 401 Unauthorized
 * - User-friendly error message formatting
 * - Error logging for debugging
 * - Preserves original error structure for debugging
 */
axiosInstance.interceptors.response.use(
  // Success handler - pass through successful responses
  (res) => res,
  
  // Error handler - process and format errors
  (err) => {
    // Log error for debugging (development only)
    if (process.env.NODE_ENV === 'development') {
      logError(err, "Axios Response Error");
    }

    // Handle network errors
    if (!err.response) {
      const networkError = new Error("Network error. Please check your internet connection and try again.");
      networkError.isNetworkError = true;
      networkError.originalError = err;
      return Promise.reject(networkError);
    }

    // Handle 401 Unauthorized - Session expired or invalid token
    if (err.response?.status === 401) {
      // Clear all session data (both active and persistent)
      sessionStorage.removeItem("auth_data");
      localStorage.removeItem("auth_data");
      localStorage.removeItem("auth_timestamp");
      
      // Only redirect if we're not already on login page
      // This prevents redirect loops when app resumes
      if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
        // Redirect to login page
        // Using setTimeout to avoid navigation during render cycle
        setTimeout(() => {
          window.location.href = "/login";
        }, 100);
      }
      
      return Promise.reject(err);
    }

    // Handle 404 Not Found
    if (err.response?.status === 404) {
      const notFoundError = new Error("The requested resource was not found.");
      notFoundError.response = err.response;
      notFoundError.request = err.request;
      notFoundError.config = err.config;
      return Promise.reject(notFoundError);
    }

    // Handle 500+ server errors
    if (err.response?.status >= 500) {
      const serverError = new Error("Server error. Please try again later or contact support if the problem persists.");
      serverError.response = err.response;
      serverError.request = err.request;
      serverError.config = err.config;
      return Promise.reject(serverError);
    }

    // Format error message for better user experience
    // Preserve original error structure for debugging
    const formattedError = new Error(formatErrorMessage(err));
    formattedError.response = err.response;
    formattedError.request = err.request;
    formattedError.config = err.config;
    
    return Promise.reject(formattedError);
  }
);

export default axiosInstance;

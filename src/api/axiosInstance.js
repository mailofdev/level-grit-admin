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
  baseURL: "http://84.46.254.249/levelgrit/api",
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
    const encrypted = sessionStorage.getItem("auth_data");
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
    logError(err, "Axios Response Error");

    // Handle 401 Unauthorized - Session expired or invalid token
    if (err.response?.status === 401) {
      // Clear all session data
      sessionStorage.clear();
      
      // Redirect to login page
      // Using setTimeout to avoid navigation during render cycle
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
      
      return Promise.reject(err);
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

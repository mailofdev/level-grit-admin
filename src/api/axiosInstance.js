/**
 * Axios instance configuration for API requests
 * Handles authentication, error handling, and request/response interceptors
 */
import axios from 'axios';
import { decryptToken } from '../utils/crypto';

// API Configuration
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://localhost:7240',
  timeout: 30000, // Increased timeout for better reliability
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Create axios instance with configuration
const axiosInstance = axios.create(API_CONFIG);

/**
 * Request interceptor to add authentication token and logging
 * @param {Object} config - Axios request config
 * @returns {Object} Modified config
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Add timestamp for request tracking
    config.metadata = { startTime: new Date() };

    // Add authentication token if available
    try {
      const encrypted = sessionStorage.getItem('auth_data');
      if (encrypted) {
        const decrypted = decryptToken(encrypted);
        const authData = JSON.parse(decrypted || '{}');
        if (authData?.accessToken) {
          config.headers.Authorization = `Bearer ${authData.accessToken}`;
        }
      }
    } catch (error) {
      console.warn('Failed to decrypt auth token:', error);
      // Clear invalid token
      sessionStorage.removeItem('auth_data');
    }

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle responses, errors, and logging
 * @param {Object} response - Axios response
 * @returns {Object} Response data
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = new Date() - response.config.metadata.startTime;

    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`,
        {
          status: response.status,
          duration: `${duration}ms`,
          data: response.data,
        }
      );
    }

    return response;
  },
  (error) => {
    // Calculate request duration for errors
    const duration = error.config?.metadata?.startTime
      ? new Date() - error.config.metadata.startTime
      : 0;

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        {
          status: error.response?.status,
          duration: `${duration}ms`,
          message: error.message,
          data: error.response?.data,
        }
      );
    }

    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear auth data and redirect to login
          console.warn('Unauthorized access - redirecting to login');
          sessionStorage.clear();
          localStorage.removeItem('app-theme'); // Preserve theme preference
          window.location.href = '/login';
          break;

        case 403:
          // Forbidden - user doesn't have permission
          console.warn('Access forbidden:', data?.message || 'Insufficient permissions');
          break;

        case 404:
          // Not found
          console.warn('Resource not found:', data?.message || 'Requested resource not found');
          break;

        case 429:
          // Rate limited
          console.warn('Rate limited:', data?.message || 'Too many requests');
          break;

        case 500:
          // Server error
          console.error('Server error:', data?.message || 'Internal server error');
          break;

        default:
          console.error(`API Error ${status}:`, data?.message || error.message);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
    } else {
      // Other error
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Utility function to create API endpoints
 * @param {string} endpoint - API endpoint
 * @returns {string} Full API URL
 */
export const createApiUrl = (endpoint) => {
  const baseUrl = API_CONFIG.baseURL.endsWith('/')
    ? API_CONFIG.baseURL.slice(0, -1)
    : API_CONFIG.baseURL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

/**
 * Utility function to handle API errors consistently
 * @param {Error} error - Axios error
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};

export default axiosInstance;

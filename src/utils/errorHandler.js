/**
 * Centralized Error Handling Utility
 * Provides consistent, user-friendly error messages throughout the application
 */

/**
 * Extracts error message from error response body (prioritizes response.data over error.message)
 * This is useful when error.message might be a generic axios message but response.data has the actual API message
 * @param {Error|string|object} error - The error object or message
 * @returns {string|null} Extracted error message or null if not found
 */
export const extractErrorMessageFromResponse = (error) => {
  if (!error) return null;

  // Check if error has originalError (from thunks that preserve structure)
  const errorToCheck = error?.originalError || error;

  // Try to extract from error.response.data (API response body) - PRIORITY 1
  if (errorToCheck?.response?.data) {
    const data = errorToCheck.response.data;
    
    // Handle plain string response (e.g., "Invalid credentials")
    if (typeof data === "string") {
      return data.trim();
    }
    
    // Handle JSON object response
    if (typeof data === "object" && data !== null) {
      // Prefer user-friendly message if available
      if (data.message) return data.message;
      if (data.error) return data.error;
      if (data.errorMessage) return data.errorMessage;
      if (data.successMessage) return data.successMessage;
      
      // Handle validation errors
      if (data.errors && Array.isArray(data.errors)) {
        return data.errors.join(", ");
      }
      
      // Handle object with error messages
      if (!Array.isArray(data)) {
        const messages = Object.values(data).filter(msg => typeof msg === "string");
        if (messages.length > 0) return messages.join(", ");
      }
    }
  }

  // Also check error.response directly (in case response is preserved)
  if (error?.response?.data) {
    const data = error.response.data;
    
    // Handle plain string response
    if (typeof data === "string") {
      return data.trim();
    }
    
    // Handle JSON object response
    if (typeof data === "object" && data !== null) {
      if (data.message) return data.message;
      if (data.error) return data.error;
      if (data.errorMessage) return data.errorMessage;
    }
  }

  return null;
};

/**
 * Formats error messages for display to users
 * @param {Error|string|object} error - The error object or message
 * @param {string} defaultMessage - Default message if error parsing fails
 * @returns {string} User-friendly error message
 */
export const formatErrorMessage = (error, defaultMessage = "An unexpected error occurred. Please try again.") => {
  if (!error) return defaultMessage;

  // If it's already a string, return it
  if (typeof error === "string") {
    return error;
  }

  // PRIORITY 1: Extract from response body (API message)
  const responseMessage = extractErrorMessageFromResponse(error);
  if (responseMessage) {
    return responseMessage;
  }

  // PRIORITY 2: Handle error objects with message property
  // But skip generic axios messages if we have response data
  if (error?.message) {
    // Don't show generic axios error messages if we have response data
    if (error.message.includes("status code") && error?.response?.data) {
      // Try one more time to extract from response
      const data = error.response.data;
      if (typeof data === "string") return data.trim();
      if (data?.message) return data.message;
      if (data?.error) return data.error;
    }
    return error.message;
  }

  // Handle network errors
  if (error?.code === "NETWORK_ERROR" || error?.message?.includes("Network")) {
    return "Network error. Please check your internet connection and try again.";
  }

  // Handle timeout errors
  if (error?.code === "ECONNABORTED" || error?.message?.includes("timeout")) {
    return "Request timed out. Please try again.";
  }

  // Handle 401 Unauthorized (but only if we haven't already extracted a message)
  // For login errors, we want to show the actual API message, not a generic one
  if (error?.response?.status === 401) {
    // Only return generic message if we're on a protected route (not login)
    // For login, the response body should have the actual error message
    const path = window?.location?.pathname || "";
    if (path.includes("/login") || path.includes("/register")) {
      // For auth pages, prefer the response message (already checked above)
      // Fallback to generic only if no message found
      return defaultMessage;
    }
    return "Your session has expired. Please log in again.";
  }

  // Handle 403 Forbidden
  if (error?.response?.status === 403) {
    return "You don't have permission to perform this action.";
  }

  // Handle 404 Not Found
  if (error?.response?.status === 404) {
    return "The requested resource was not found.";
  }

  // Handle 500 Server Error
  if (error?.response?.status === 500) {
    return "Server error. Please try again later or contact support if the problem persists.";
  }

  // Handle 503 Service Unavailable
  if (error?.response?.status === 503) {
    return "Service temporarily unavailable. Please try again in a few moments.";
  }

  // Default fallback
  return defaultMessage;
};

/**
 * Logs errors for debugging (only in development)
 * @param {Error|string|object} error - The error to log
 * @param {string} context - Context where the error occurred
 */
export const logError = (error, context = "Unknown") => {
  if (process.env.NODE_ENV === "development") {
    console.error(`[${context}] Error:`, error);
    
    // Log stack trace if available
    if (error?.stack) {
      console.error("Stack trace:", error.stack);
    }
    
    // Log API response details if available
    if (error?.response) {
      console.error("API Response:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    }
  }
  
  // In production, you might want to send to error tracking service
  // Example: Sentry.captureException(error, { extra: { context } });
};

/**
 * Creates an error object that preserves the original error structure for Redux thunks
 * This allows components to extract messages from response.body even after formatErrorMessage
 * @param {Error|object} error - The original error
 * @param {string} formattedMessage - The formatted error message
 * @returns {Error} Error object with preserved structure
 */
export const createPreservedError = (error, formattedMessage) => {
  const errorWithResponse = new Error(formattedMessage);
  errorWithResponse.originalError = error;
  errorWithResponse.response = error?.response;
  return errorWithResponse;
};

/**
 * Creates a user-friendly error handler for async operations
 * @param {Function} asyncFn - Async function to wrap
 * @param {string} context - Context for error logging
 * @param {string} defaultMessage - Default error message
 * @returns {Function} Wrapped function with error handling
 */
export const withErrorHandling = (asyncFn, context = "Operation", defaultMessage = null) => {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      logError(error, context);
      const message = formatErrorMessage(error, defaultMessage || `${context} failed. Please try again.`);
      throw new Error(message);
    }
  };
};

/**
 * Error messages for common scenarios
 */
export const ERROR_MESSAGES = {
  NETWORK: "Network error. Please check your internet connection and try again.",
  TIMEOUT: "Request timed out. Please try again.",
  UNAUTHORIZED: "Your session has expired. Please log in again.",
  FORBIDDEN: "You don't have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "Server error. Please try again later or contact support if the problem persists.",
  VALIDATION: "Please check your input and try again.",
  GENERIC: "An unexpected error occurred. Please try again.",
};


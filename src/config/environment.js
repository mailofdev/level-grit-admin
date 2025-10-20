/**
 * Environment configuration
 * Centralized configuration management for different environments
 */

// Environment variables with fallbacks
const config = {
  // API Configuration
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://localhost:7240',
  
  // Security Configuration
  CRYPTO_SECRET: process.env.REACT_APP_CRYPTO_SECRET || 'default_secret_key',
  
  // Firebase Configuration
  FIREBASE: {
    API_KEY: process.env.REACT_APP_FIREBASE_API_KEY,
    AUTH_DOMAIN: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    STORAGE_BUCKET: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    MESSAGING_SENDER_ID: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    APP_ID: process.env.REACT_APP_FIREBASE_APP_ID,
  },
  
  // Analytics Configuration
  ANALYTICS: {
    GOOGLE_ANALYTICS_ID: process.env.REACT_APP_GOOGLE_ANALYTICS_ID,
    SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN,
  },
  
  // Feature Flags
  FEATURES: {
    ENABLE_ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    ENABLE_ERROR_REPORTING: process.env.REACT_APP_ENABLE_ERROR_REPORTING === 'true',
    ENABLE_DEBUG_MODE: process.env.REACT_APP_ENABLE_DEBUG_MODE === 'true',
  },
  
  // App Configuration
  APP: {
    NODE_ENV: process.env.NODE_ENV || 'development',
    VERSION: process.env.REACT_APP_VERSION || '1.0.0',
    NAME: 'Level Grit Admin',
  },
  
  // Security Settings
  SECURITY: {
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes in milliseconds
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes in milliseconds
    PASSWORD_MIN_LENGTH: 8,
    TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
  },
  
  // API Settings
  API: {
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
  },
};

// Validation function to check required environment variables
export const validateEnvironment = () => {
  const errors = [];
  
  // Check for required environment variables in production
  if (config.APP.NODE_ENV === 'production') {
    if (config.CRYPTO_SECRET === 'default_secret_key') {
      errors.push('REACT_APP_CRYPTO_SECRET must be set in production');
    }
    
    if (config.API_BASE_URL.includes('localhost')) {
      errors.push('REACT_APP_API_BASE_URL must point to production API');
    }
  }
  
  // Log warnings for development
  if (config.APP.NODE_ENV === 'development') {
    if (config.CRYPTO_SECRET === 'default_secret_key') {
      console.warn('⚠️  Using default crypto secret key in development');
    }
  }
  
  if (errors.length > 0) {
    console.error('❌ Environment validation failed:', errors);
    throw new Error(`Environment validation failed: ${errors.join(', ')}`);
  }
  
  return true;
};

// Initialize environment validation
if (typeof window !== 'undefined') {
  try {
    validateEnvironment();
  } catch (error) {
    console.error('Environment validation error:', error);
  }
}

export default config;

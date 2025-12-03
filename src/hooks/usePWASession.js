/**
 * PWA Session Management Hook
 * 
 * Handles PWA-specific session persistence and restoration.
 * Maintains user session across app minimize/resume cycles.
 */

import { useEffect } from 'react';
import { getDecryptedUser } from '../components/common/CommonFunctions';

const AUTH_STORAGE_KEY = 'auth_data';
const SESSION_TIMESTAMP_KEY = 'auth_timestamp';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

/**
 * Restores session from localStorage to sessionStorage on app resume
 */
export const restoreSession = () => {
  try {
    // Check if we have a session in localStorage
    const persistedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    const timestamp = localStorage.getItem(SESSION_TIMESTAMP_KEY);
    
    if (!persistedAuth || !timestamp) {
      return false;
    }

    // Check if session is still valid (not expired)
    const sessionAge = Date.now() - parseInt(timestamp, 10);
    if (sessionAge > SESSION_DURATION) {
      // Session expired, clear it
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(SESSION_TIMESTAMP_KEY);
      return false;
    }

    // Restore to sessionStorage for active use
    sessionStorage.setItem(AUTH_STORAGE_KEY, persistedAuth);
    return true;
  } catch (error) {
    console.error('Error restoring session:', error);
    return false;
  }
};

/**
 * Persists session from sessionStorage to localStorage
 */
export const persistSession = () => {
  try {
    const authData = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (authData) {
      localStorage.setItem(AUTH_STORAGE_KEY, authData);
      localStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error persisting session:', error);
    return false;
  }
};

/**
 * Clears both sessionStorage and localStorage auth data
 */
export const clearSession = () => {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(SESSION_TIMESTAMP_KEY);
};

/**
 * Hook to manage PWA session lifecycle
 */
export const usePWASession = () => {

  // Restore session on mount
  useEffect(() => {
    // If no active session, try to restore from localStorage
    if (!sessionStorage.getItem(AUTH_STORAGE_KEY)) {
      const restored = restoreSession();
      if (restored) {
        // Session restored, verify user is still valid
        const user = getDecryptedUser();
        if (!user) {
          // Invalid session, clear it
          clearSession();
        }
      }
    } else {
      // Active session exists, persist it
      persistSession();
    }
  }, []);

  // Persist session periodically and on visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // App became visible/resumed, restore session if needed
        if (!sessionStorage.getItem(AUTH_STORAGE_KEY)) {
          const restored = restoreSession();
          if (restored) {
            // Verify restored session is valid
            const user = getDecryptedUser();
            if (!user) {
              // Invalid session, clear it
              clearSession();
            } else {
              // Valid session restored, trigger a re-render by dispatching storage event
              window.dispatchEvent(new Event('storage'));
            }
          }
        } else {
          // Active session exists, update persistence timestamp
          persistSession();
        }
      } else {
        // App hidden/minimized, persist current session
        persistSession();
      }
    };

    const handleBeforeUnload = () => {
      // Persist session before page unload
      persistSession();
    };

    // Handle page focus (when app is brought to foreground)
    const handleFocus = () => {
      if (!sessionStorage.getItem(AUTH_STORAGE_KEY)) {
        restoreSession();
      } else {
        persistSession();
      }
    };

    // Handle page blur (when app goes to background)
    const handleBlur = () => {
      persistSession();
    };

    // Persist session every 5 minutes
    const persistInterval = setInterval(() => {
      if (sessionStorage.getItem(AUTH_STORAGE_KEY)) {
        persistSession();
      }
    }, 5 * 60 * 1000);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      clearInterval(persistInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return { restoreSession, persistSession, clearSession };
};


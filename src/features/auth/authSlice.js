/**
 * Authentication slice for Redux store
 * Manages user authentication state, login, registration, and profile updates
 */
import { createSlice } from '@reduxjs/toolkit';
import {
  loginThunk,
  registerThunk,
  getCurrentUserThunk,
  updateProfileThunk,
  changePasswordThunk,
  logoutThunk,
} from './authThunks';

// Initial state for authentication
const initialState = {
  user: null,
  token: sessionStorage.getItem('auth_data') || null,
  loading: false,
  error: null,
  isAuthenticated: false,
  lastActivity: null,
  sessionExpiry: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Clear error message
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Clear loading state
     */
    clearLoading: (state) => {
      state.loading = false;
    },

    /**
     * Logout action - clears all auth data
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      state.isAuthenticated = false;
      state.lastActivity = null;
      state.sessionExpiry = null;
      
      // Clear storage
      sessionStorage.removeItem('auth_data');
      sessionStorage.clear();
      localStorage.clear();
    },

    /**
     * Update user profile data
     * @param {Object} state - Current state
     * @param {Object} action - Action with payload containing updated user data
     */
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    /**
     * Set authentication status
     * @param {Object} state - Current state
     * @param {Object} action - Action with payload containing auth status
     */
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },

    /**
     * Update last activity timestamp
     * @param {Object} state - Current state
     */
    updateLastActivity: (state) => {
      state.lastActivity = new Date().toISOString();
    },

    /**
     * Set session expiry
     * @param {Object} state - Current state
     * @param {Object} action - Action with payload containing expiry time
     */
    setSessionExpiry: (state, action) => {
      state.sessionExpiry = action.payload;
    },

    /**
     * Initialize auth state from stored data
     * @param {Object} state - Current state
     * @param {Object} action - Action with payload containing stored auth data
     */
    initializeAuth: (state, action) => {
      const { user, token, isAuthenticated } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = isAuthenticated;
      state.lastActivity = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN THUNK
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.userInfo;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
        state.lastActivity = new Date().toISOString();
        state.sessionExpiry = action.payload.expiresAt || null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // REGISTER THUNK
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // Don't auto-login after registration, let user login manually
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })

      // GET CURRENT USER THUNK
      .addCase(getCurrentUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        state.lastActivity = new Date().toISOString();
      })
      .addCase(getCurrentUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load user';
        state.isAuthenticated = false;
      })

      // UPDATE PROFILE THUNK
      .addCase(updateProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
        state.error = null;
        state.lastActivity = new Date().toISOString();
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update profile';
      })

      // CHANGE PASSWORD THUNK
      .addCase(changePasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.lastActivity = new Date().toISOString();
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to change password';
      })

      // LOGOUT THUNK
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
        state.loading = false;
        state.isAuthenticated = false;
        state.lastActivity = null;
        state.sessionExpiry = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        // Even if logout fails on server, clear local state
        state.user = null;
        state.token = null;
        state.error = action.payload || 'Logout failed';
        state.loading = false;
        state.isAuthenticated = false;
        state.lastActivity = null;
        state.sessionExpiry = null;
      });
  },
});

// Export actions
export const {
  logout,
  clearError,
  clearLoading,
  updateUserProfile,
  setAuthenticated,
  updateLastActivity,
  setSessionExpiry,
  initializeAuth,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;

// Selectors for easy access to auth state
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectToken = (state) => state.auth.token;
export const selectLastActivity = (state) => state.auth.lastActivity;
export const selectSessionExpiry = (state) => state.auth.sessionExpiry;

// Computed selectors
export const selectUserRole = (state) => state.auth.user?.role || null;
export const selectUserId = (state) => state.auth.user?.id || null;
export const selectUserEmail = (state) => state.auth.user?.email || null;
export const selectUserName = (state) => state.auth.user?.name || null;

// Session management selectors
export const selectIsSessionExpired = (state) => {
  const { sessionExpiry } = state.auth;
  if (!sessionExpiry) return false;
  return new Date() > new Date(sessionExpiry);
};

export const selectTimeUntilExpiry = (state) => {
  const { sessionExpiry } = state.auth;
  if (!sessionExpiry) return null;
  const now = new Date();
  const expiry = new Date(sessionExpiry);
  return Math.max(0, expiry.getTime() - now.getTime());
};

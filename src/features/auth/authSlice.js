// src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { 
  loginThunk, 
  registerThunk, 
  getCurrentUserThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
} from "./authThunks";
import { decryptToken } from "../../utils/crypto";

// Helper function to restore token from localStorage if sessionStorage is empty
const getInitialToken = () => {
  // Try sessionStorage first (active session)
  let token = sessionStorage.getItem("auth_data");
  
  // If no active session, try to restore from localStorage
  if (!token) {
    const persistedAuth = localStorage.getItem("auth_data");
    const timestamp = localStorage.getItem("auth_timestamp");
    
    if (persistedAuth && timestamp) {
      const sessionAge = Date.now() - parseInt(timestamp, 10);
      const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
      
      if (sessionAge < SESSION_DURATION) {
        // Restore to sessionStorage
        sessionStorage.setItem("auth_data", persistedAuth);
        token = persistedAuth;
      } else {
        // Session expired, clear it
        localStorage.removeItem("auth_data");
        localStorage.removeItem("auth_timestamp");
        return null;
      }
    }
  }
  
  return token;
};

// Helper function to get initial user from token
const getInitialUser = () => {
  const token = getInitialToken();
  if (!token) return null;
  
  try {
    const decrypted = decryptToken(token);
    const parsed = JSON.parse(decrypted || "{}");
    return parsed?.userInfo || null;
  } catch {
    return null;
  }
};

const initialState = {
  user: getInitialUser(),
  token: getInitialToken(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Clear error message
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear loading state
    clearLoading: (state) => {
      state.loading = false;
    },
    
    // Restore session from localStorage (for PWA resume scenarios)
    restoreSession: (state) => {
      // If already have token, no need to restore
      if (state.token) {
        return;
      }
      
      // Try to restore from localStorage
      const persistedAuth = localStorage.getItem("auth_data");
      const timestamp = localStorage.getItem("auth_timestamp");
      
      if (persistedAuth && timestamp) {
        const sessionAge = Date.now() - parseInt(timestamp, 10);
        const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
        
        if (sessionAge < SESSION_DURATION) {
          // Restore to sessionStorage
          sessionStorage.setItem("auth_data", persistedAuth);
          state.token = persistedAuth;
          
          // Restore user info
          try {
            const decrypted = decryptToken(persistedAuth);
            const parsed = JSON.parse(decrypted || "{}");
            state.user = parsed?.userInfo || null;
          } catch {
            // If decryption fails, clear invalid data
            state.token = null;
            state.user = null;
            sessionStorage.removeItem("auth_data");
            localStorage.removeItem("auth_data");
            localStorage.removeItem("auth_timestamp");
          }
        } else {
          // Session expired, clear it
          localStorage.removeItem("auth_data");
          localStorage.removeItem("auth_timestamp");
          state.token = null;
          state.user = null;
        }
      }
    },
    
    // Logout action
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      sessionStorage.removeItem("auth_data");
      localStorage.removeItem("auth_data");
      localStorage.removeItem("auth_timestamp");
    },
    
    // Update user profile (for profile updates)
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // ✅ LOGIN THUNK
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.userInfo;
        // Get the encrypted token from sessionStorage (set by loginThunk)
        state.token = sessionStorage.getItem("auth_data");
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.user = null;
      })
      
      // ✅ REGISTER THUNK
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Don't auto-login after registration, let user login manually
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })
      
      // ✅ GET CURRENT USER THUNK
      .addCase(getCurrentUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getCurrentUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load user";
      })
      
      // ✅ FORGOT PASSWORD THUNK
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to send reset link";
      })
      
      // ✅ RESET PASSWORD THUNK
      .addCase(resetPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to reset password";
      });
  },
});

export const { 
  logout, 
  clearError, 
  clearLoading, 
  updateUserProfile,
  restoreSession
} = authSlice.actions;

export default authSlice.reducer;

// ✅ Selectors for easy access to auth state
export const selectAuth = (state) => state;
export const selectUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

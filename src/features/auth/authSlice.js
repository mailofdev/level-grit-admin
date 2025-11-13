// src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { 
  loginThunk, 
  registerThunk, 
  getCurrentUserThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
} from "./authThunks";

const initialState = {
  user: null,
  token: sessionStorage.getItem("auth_data") || null,
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
    
    // Logout action
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      sessionStorage.removeItem("auth_data");
      sessionStorage.clear();
      localStorage.clear();
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
  updateUserProfile 
} = authSlice.actions;

export default authSlice.reducer;

// ✅ Selectors for easy access to auth state
export const selectAuth = (state) => state;
export const selectUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

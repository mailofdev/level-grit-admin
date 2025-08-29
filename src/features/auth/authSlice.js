// src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { loginThunk, registerThunk, getCurrentUserThunk } from "./authThunks";

const initialState = {
  user: null,
 token: sessionStorage.getItem("access_token") || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("user_id");
       sessionStorage.clear();
    localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        sessionStorage.setItem("access_token", action.payload.accessToken);
        sessionStorage.setItem("user_id", action.payload.user.id);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
            // ✅ handle current user fetch
      .addCase(getCurrentUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(getCurrentUserThunk.rejected, (state, action) => {
        state.error = action.payload || "Failed to load user";
      });

  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

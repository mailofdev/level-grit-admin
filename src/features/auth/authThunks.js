// src/features/auth/authThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserById, loginUser, registerUser } from "../../api/authAPI";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      return await loginUser(credentials);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      return await registerUser(userData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

// ✅ NEW: Fetch logged-in user's data
export const getCurrentUserThunk = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const userId = sessionStorage.getItem("user_id"); // we'll save this on login
      if (!userId) return rejectWithValue("No user ID found in session");

      return await getUserById(userId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch user");
    }
  }
);
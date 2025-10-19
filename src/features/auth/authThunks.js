// src/features/auth/authThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserById, loginUser, registerUser, UpdateProfileData, ChangePassword } from "../../api/authAPI";
import { encryptToken } from "../../utils/crypto";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const result = await loginUser(credentials);

      // Combine all auth info
      const authData = {
        accessToken: result.token,
        userInfo: result
      };

      // Encrypt and store in sessionStorage
      const encryptedAuth = encryptToken(JSON.stringify(authData));
      sessionStorage.setItem("auth_data", encryptedAuth);

      return authData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Login failed"
      );
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

export const updateProfileThunk = createAsyncThunk(
  "auth/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const result = await UpdateProfileData(userData);
      return result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);
// src/features/auth/authThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserById, loginUser, registerUser, UpdateProfileData, ChangePassword } from "../../api/authAPI";
import { encryptToken } from "../../utils/crypto";
import { formatErrorMessage, logError } from "../../utils/errorHandler";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const result = await loginUser(credentials);

      if (!result?.token) {
        throw new Error("Invalid response from server. Please try again.");
      }

      // Combine all auth info
      const authData = {
        accessToken: result.token,
        userInfo: result
      };

      // Encrypt and store in sessionStorage
      try {
        const encryptedAuth = encryptToken(JSON.stringify(authData));
        sessionStorage.setItem("auth_data", encryptedAuth);
      } catch (encryptError) {
        logError(encryptError, "Login - Encryption");
        throw new Error("Failed to save session. Please try again.");
      }

      return authData;
    } catch (error) {
      logError(error, "Login");
      return rejectWithValue(formatErrorMessage(error, "Login failed. Please check your credentials and try again."));
    }
  }
);


export const registerThunk = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const result = await registerUser(userData);
      return result;
    } catch (error) {
      logError(error, "Registration");
      return rejectWithValue(formatErrorMessage(error, "Registration failed. Please check your information and try again."));
    }
  }
);

// ✅ NEW: Fetch logged-in user's data
export const getCurrentUserThunk = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const userId = sessionStorage.getItem("user_id"); // we'll save this on login
      if (!userId) {
        return rejectWithValue("No user ID found in session");
      }

      const user = await getUserById(userId);
      return user;
    } catch (err) {
      logError(err, "Get Current User");
      return rejectWithValue(formatErrorMessage(err, "Failed to load user information. Please log in again."));
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
      logError(error, "Update Profile");
      return rejectWithValue(formatErrorMessage(error, "Failed to update profile. Please try again."));
    }
  }
);
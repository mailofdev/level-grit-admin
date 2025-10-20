/**
 * Authentication thunks for Redux Toolkit
 * Handles async operations for authentication, registration, and profile management
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUser,
  registerUser,
  getProfileData,
  updateProfileData,
  changePassword,
  logoutUser,
  getUserById,
} from '../../api/authAPI';
import { encryptToken, decryptToken } from '../../utils/crypto';

/**
 * Login user thunk
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @param {Object} thunkAPI - Redux thunk API
 * @returns {Promise<Object>} Authentication data
 */
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const result = await loginUser(credentials);

      // Combine all auth info
      const authData = {
        accessToken: result.token,
        userInfo: result,
        expiresAt: result.expiresAt || null,
      };

      // Encrypt and store in sessionStorage
      const encryptedAuth = encryptToken(JSON.stringify(authData));
      sessionStorage.setItem('auth_data', encryptedAuth);

      // Store user ID for future use
      if (result.id) {
        sessionStorage.setItem('user_id', result.id);
      }

      return authData;
    } catch (error) {
      return rejectWithValue(
        error.message || error.response?.data?.message || 'Login failed'
      );
    }
  }
);

/**
 * Register user thunk
 * @param {Object} userData - User registration data
 * @param {Object} thunkAPI - Redux thunk API
 * @returns {Promise<Object>} Registration response
 */
export const registerThunk = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const result = await registerUser(userData);
      return result;
    } catch (error) {
      return rejectWithValue(
        error.message || error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

/**
 * Get current user data thunk
 * @param {Object} thunkAPI - Redux thunk API
 * @returns {Promise<Object>} User data
 */
export const getCurrentUserThunk = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Try to get user ID from session storage first
      let userId = sessionStorage.getItem('user_id');
      
      // If no user ID in session, try to get from stored auth data
      if (!userId) {
        const encrypted = sessionStorage.getItem('auth_data');
        if (encrypted) {
          const decrypted = decryptToken(encrypted);
          const authData = JSON.parse(decrypted || '{}');
          userId = authData.userInfo?.id;
        }
      }

      if (!userId) {
        return rejectWithValue('No user ID found in session');
      }

      const userData = await getUserById(userId);
      return userData;
    } catch (error) {
      return rejectWithValue(
        error.message || error.response?.data?.message || 'Failed to fetch user'
      );
    }
  }
);

/**
 * Update user profile thunk
 * @param {Object} userData - Updated user data
 * @param {Object} thunkAPI - Redux thunk API
 * @returns {Promise<Object>} Updated user data
 */
export const updateProfileThunk = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const result = await updateProfileData(userData);
      return result;
    } catch (error) {
      return rejectWithValue(
        error.message || error.response?.data?.message || 'Failed to update profile'
      );
    }
  }
);

/**
 * Change password thunk
 * @param {Object} passwordData - Password change data
 * @param {string} passwordData.currentPassword - Current password
 * @param {string} passwordData.newPassword - New password
 * @param {Object} thunkAPI - Redux thunk API
 * @returns {Promise<Object>} Password change response
 */
export const changePasswordThunk = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const result = await changePassword(passwordData);
      return result;
    } catch (error) {
      return rejectWithValue(
        error.message || error.response?.data?.message || 'Failed to change password'
      );
    }
  }
);

/**
 * Logout user thunk
 * @param {Object} thunkAPI - Redux thunk API
 * @returns {Promise<Object>} Logout response
 */
export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Call server logout endpoint
      const result = await logoutUser();
      
      // Clear local storage
      sessionStorage.clear();
      localStorage.removeItem('app-theme'); // Preserve theme preference
      
      return result;
    } catch (error) {
      // Even if server logout fails, clear local data
      sessionStorage.clear();
      localStorage.removeItem('app-theme');
      
      return rejectWithValue(
        error.message || error.response?.data?.message || 'Logout failed'
      );
    }
  }
);

/**
 * Refresh token thunk (if your API supports it)
 * @param {Object} thunkAPI - Redux thunk API
 * @returns {Promise<Object>} New token data
 */
export const refreshTokenThunk = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue, getState }) => {
    try {
      // This would depend on your API implementation
      // const result = await refreshToken();
      // return result;
      
      // For now, just reject as not implemented
      return rejectWithValue('Token refresh not implemented');
    } catch (error) {
      return rejectWithValue(
        error.message || error.response?.data?.message || 'Failed to refresh token'
      );
    }
  }
);

/**
 * Verify email thunk
 * @param {string} token - Email verification token
 * @param {Object} thunkAPI - Redux thunk API
 * @returns {Promise<Object>} Verification response
 */
export const verifyEmailThunk = createAsyncThunk(
  'auth/verifyEmail',
  async (token, { rejectWithValue }) => {
    try {
      // This would depend on your API implementation
      // const result = await verifyEmail(token);
      // return result;
      
      // For now, just reject as not implemented
      return rejectWithValue('Email verification not implemented');
    } catch (error) {
      return rejectWithValue(
        error.message || error.response?.data?.message || 'Failed to verify email'
      );
    }
  }
);
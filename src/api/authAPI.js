/**
 * Authentication API
 * 
 * All API endpoints under /api/Auth/* and /api/auth/*
 * Domain-based organization for authentication and user profile operations.
 */

import axiosInstance from "./axiosInstance";

// ============================================
// Authentication
// ============================================

/**
 * Login User
 * API Path: api/auth/login
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} Login response with token and user info
 */
export const loginUser = async (credentials) => {
  const { data } = await axiosInstance.post("api/auth/login", credentials);
  return data;
};

/**
 * Register User
 * API Path: api/auth/register
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registration response
 */
export const registerUser = async (userData) => {
  const { data } = await axiosInstance.post("api/auth/register", userData);
  return data;
};

/**
 * Forgot Password
 * API Path: api/Auth/ForgotPassword
 * @param {string} email - User email
 * @returns {Promise<Object>} Response indicating if reset email was sent
 */
export const ForgotPassword = async (email) => {
  const { data } = await axiosInstance.post("api/Auth/ForgotPassword", { email });
  return data;
};

/**
 * Reset Password
 * API Path: api/Auth/ResetPassword
 * @param {Object} resetData - Reset password data
 * @param {string} resetData.email - User email
 * @param {string} resetData.otp - OTP code
 * @param {string} resetData.newPassword - New password
 * @returns {Promise<Object>} Reset password response
 */
export const ResetPassword = async (resetData) => {
  const { data } = await axiosInstance.post("api/Auth/ResetPassword", resetData);
  return data;
};

/**
 * Change Password
 * API Path: api/Auth/ChangePassword
 * @param {Object} passwordData - Password change data
 * @param {string} passwordData.currentPassword - Current password
 * @param {string} passwordData.newPassword - New password
 * @returns {Promise<Object>} Change password response
 */
export const ChangePassword = async (passwordData) => {
  const { data } = await axiosInstance.post("api/Auth/ChangePassword", passwordData);
  return data;
};

// ============================================
// Profile Management
// ============================================

/**
 * Get User Profile Data
 * API Path: api/Auth/Profile
 * @returns {Promise<Object>} User profile data
 */
export const GetProfileData = async () => {
  const { data } = await axiosInstance.get("api/Auth/Profile");
  return data;
};

/**
 * Update User Profile
 * API Path: api/Auth/UpdateProfile
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated profile data
 */
export const UpdateProfileData = async (userData) => {
  const { data } = await axiosInstance.post("api/Auth/UpdateProfile", userData);
  return data;
};

/**
 * Get User by ID
 * @param {string|number} id - User ID
 * @returns {Promise<Object>} User data
 */
export const getUserById = async (id) => {
  const { data } = await axiosInstance.get(`/users/${id}`);
  return data;
};

/**
 * Update User by ID
 * @param {string|number} id - User ID
 * @param {Object} updatedData - Updated user data
 * @returns {Promise<Object>} Updated user data
 */
export const updateUserById = async (id, updatedData) => {
  const { data } = await axiosInstance.patch(`/users/${id}`, updatedData);
  return data;
};

/**
 * Delete User by ID
 * @param {string|number} id - User ID
 * @returns {Promise<Object>} Deletion result
 */
export const deleteUserById = async (id) => {
  return axiosInstance.delete(`/users/${id}`);
};

/**
 * Authentication API service
 * Handles all authentication-related API calls with proper error handling
 */
import axiosInstance, { getErrorMessage } from './axiosInstance';

/**
 * User login API call
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} Login response data
 * @throws {Error} If login fails
 */
export const loginUser = async (credentials) => {
  try {
    const { data } = await axiosInstance.post('api/auth/login', credentials);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * User registration API call
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registration response data
 * @throws {Error} If registration fails
 */
export const registerUser = async (userData) => {
  try {
    const { data } = await axiosInstance.post('api/auth/register', userData);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Register a new client (trainer functionality)
 * @param {Object} userData - Client registration data
 * @returns {Promise<Object>} Registration response data
 * @throws {Error} If client registration fails
 */
export const registerClient = async (userData) => {
  try {
    const { data } = await axiosInstance.post('api/Trainer/Register-client', userData);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Get all clients for the current trainer
 * @returns {Promise<Array>} Array of client data
 * @throws {Error} If request fails
 */
export const getClientsForTrainer = async () => {
  try {
    const { data } = await axiosInstance.get('api/Trainer/GetClientsForTrainer');
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Get current user's profile data
 * @returns {Promise<Object>} User profile data
 * @throws {Error} If request fails
 */
export const getProfileData = async () => {
  try {
    const { data } = await axiosInstance.get('api/Auth/Profile');
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Update user profile data
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated profile data
 * @throws {Error} If update fails
 */
export const updateProfileData = async (userData) => {
  try {
    const { data } = await axiosInstance.post('api/Auth/UpdateProfile', userData);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Change user password
 * @param {Object} passwordData - Password change data
 * @param {string} passwordData.currentPassword - Current password
 * @param {string} passwordData.newPassword - New password
 * @returns {Promise<Object>} Password change response
 * @throws {Error} If password change fails
 */
export const changePassword = async (passwordData) => {
  try {
    const { data } = await axiosInstance.post('api/Auth/ChangePassword', passwordData);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise<Object>} Reset request response
 * @throws {Error} If request fails
 */
export const requestPasswordReset = async (email) => {
  try {
    const { data } = await axiosInstance.post('api/Auth/ForgotPassword', { email });
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Reset password with token
 * @param {Object} resetData - Password reset data
 * @param {string} resetData.token - Reset token
 * @param {string} resetData.newPassword - New password
 * @returns {Promise<Object>} Reset response
 * @throws {Error} If reset fails
 */
export const resetPassword = async (resetData) => {
  try {
    const { data } = await axiosInstance.post('api/Auth/ResetPassword', resetData);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Get user by ID
 * @param {string|number} id - User ID
 * @returns {Promise<Object>} User data
 * @throws {Error} If request fails
 */
export const getUserById = async (id) => {
  try {
    const { data } = await axiosInstance.get(`/users/${id}`);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Update user by ID
 * @param {string|number} id - User ID
 * @param {Object} updatedData - Updated user data
 * @returns {Promise<Object>} Updated user data
 * @throws {Error} If update fails
 */
export const updateUserById = async (id, updatedData) => {
  try {
    const { data } = await axiosInstance.patch(`/users/${id}`, updatedData);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Delete user by ID
 * @param {string|number} id - User ID
 * @returns {Promise<Object>} Deletion response
 * @throws {Error} If deletion fails
 */
export const deleteUserById = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`/users/${id}`);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Logout user (clear server-side session if needed)
 * @returns {Promise<Object>} Logout response
 * @throws {Error} If logout fails
 */
export const logoutUser = async () => {
  try {
    const { data } = await axiosInstance.post('api/Auth/Logout');
    return data;
  } catch (error) {
    // Don't throw error for logout - client-side cleanup is sufficient
    console.warn('Server logout failed:', getErrorMessage(error));
    return { success: true };
  }
};

// Legacy exports for backward compatibility
export const RegisterClient = registerClient;
export const GetClientsForTrainer = getClientsForTrainer;
export const GetProfileData = getProfileData;
export const UpdateProfileData = updateProfileData;

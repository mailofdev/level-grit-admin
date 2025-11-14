/**
 * Client API
 * 
 * All API endpoints under /api/Client/*
 * Domain-based organization for client-related operations.
 */

import axiosInstance from "./axiosInstance";

// ============================================
// Dashboard
// ============================================

/**
 * Get Client Dashboard Data
 * API Path: api/Client/GetDashboard
 * @returns {Promise<Object>} Client dashboard data
 */
export const getClientDashboard = async () => {
  const { data } = await axiosInstance.get("api/Client/GetDashboard");
  return data;
};

// ============================================
// Meal Tracking
// ============================================

/**
 * Upload Meal API
 * API Path: api/Client/UploadMeal
 * @param {Object} mealData - Meal data
 * @param {string|number} mealData.mealPlanId - Meal plan ID
 * @param {string} mealData.mealName - Name of the meal
 * @param {number} mealData.sequence - Meal sequence number
 * @param {string} mealData.message - Optional message
 * @param {string} mealData.imageBase64 - Base64 encoded meal image
 * @returns {Promise<Object>} Upload result
 */
export const uploadMeal = async (mealData) => {
  const { data } = await axiosInstance.post(`api/Client/UploadMeal`, mealData);
  return data;
};

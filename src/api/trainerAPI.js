/**
 * Trainer API
 * 
 * All API endpoints under /api/Trainer/*
 * Domain-based organization for trainer-related operations.
 */

import axiosInstance from "./axiosInstance";

// ============================================
// Dashboard & Profile
// ============================================

/**
 * Get Trainer Dashboard Data
 * API Path: api/Trainer/Dashboard
 * @returns {Promise<Object>} Trainer dashboard data
 */
export const getTrainerDashboard = async () => {
  const { data } = await axiosInstance.get("api/Trainer/Dashboard");
  return data;
};

/**
 * Delete Trainer Account
 * API Path: api/Trainer/Delete-trainer/{userId}
 * @param {string|number} userId - The user ID to delete
 * @returns {Promise<Object>} Deletion result
 */
export const deleteTrainer = async (userId) => {
  const { data } = await axiosInstance.delete(`api/Trainer/Delete-trainer/${userId}`);
  return data;
};

// ============================================
// Client Management
// ============================================

/**
 * Get Clients for Trainer
 * API Path: api/Trainer/GetClientsForTrainer
 * @returns {Promise<Array>} List of clients assigned to the trainer
 */
export const getClientsForTrainer = async () => {
  const { data } = await axiosInstance.get("api/Trainer/GetClientsForTrainer");
  return data;
};

/**
 * Register a new client
 * API Path: api/Trainer/Register-client
 * @param {Object} userData - Client registration data
 * @returns {Promise<Object>} Registered client data
 */
export const registerClient = async (userData) => {
  const { data } = await axiosInstance.post("api/Trainer/Register-client", userData);
  return data;
};

// ============================================
// Meal Plan Management
// ============================================

/**
 * Fetch meal plan for a specific client and date
 * API Path: api/Meals/GetMealPlan
 * @param {string} clientId - Client identifier
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Meal plan data
 */
export const getMealPlan = async (clientId, date) => {
  try {
    const { data } = await axiosInstance.get("api/Meals/GetMealPlan", {
      params: { clientId, date },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch meal plan preview for display
 * API Path: api/Meals/GetMealPlanPreview
 * @param {string} clientId - Client identifier
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Preview data with formatted meals and totals
 */
export const getMealPlanPreview = async (clientId, date) => {
  try {
    const { data } = await axiosInstance.get("api/Meals/GetMealPlanPreview", {
      params: { clientId, date },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create or update meal plan
 * API Path: api/Meals/CreateOrUpdateMealsPlan
 * @param {string} clientId - Client identifier
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {Array} meals - Array of meal objects
 * @returns {Promise<Object>} API response
 */
export const createOrUpdateMealPlan = async (clientId, date, meals) => {
  try {
    if (!clientId || !date || !Array.isArray(meals) || meals.length === 0) {
      throw new Error("Invalid parameters for meal plan creation");
    }

    const { data } = await axiosInstance.post(
      "api/Meals/CreateOrUpdateMealsPlan",
      {
        assignedDate: date,
        meals: meals.map((meal, idx) => ({
          id: meal.id || 0,
          mealName: meal.mealName?.trim() || "",
          protein: Number(meal.protein) || 0,
          fats: Number(meal.fats) || 0,
          carbs: Number(meal.carbs) || 0,
          calories: Number(meal.calories) || 0,
          instructions: meal.instructions?.trim() || "",
          sequence: idx + 1,
        })),
      },
      {
        params: { clientId, date },
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

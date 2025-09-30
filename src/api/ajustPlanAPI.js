// src/api/ajustPlanAPI.js
import axiosInstance from "./axiosInstance";

/**
 * Fetch meal plan for a specific client and date
 * @param {string} clientId - Client identifier
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise} Meal plan data
 */
export const getMealPlan = async (clientId, date) => {
  try {
    const { data } = await axiosInstance.get("api/Meals/GetMealPlan", {
      params: { clientId, date },
    });
    return data;
  } catch (error) {
    console.error("getMealPlan error:", error);
    throw error;
  }
};

/**
 * Fetch meal plan preview for display
 * @param {string} clientId - Client identifier
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise} Preview data with formatted meals and totals
 */
export const getMealPlanPreview = async (clientId, date) => {
  try {
    const { data } = await axiosInstance.get("api/Meals/GetMealPlanPreview", {
      params: { clientId, date },
    });
    return data;
  } catch (error) {
    console.error("getMealPlanPreview error:", error);
    throw error;
  }
};

/**
 * Create or update meal plan
 * @param {string} clientId - Client identifier
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {Array} meals - Array of meal objects
 * @returns {Promise} API response
 */
export const createOrUpdateMealPlan = async (clientId, date, meals) => {
  try {
    // Validate input
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
    console.error("createOrUpdateMealPlan error:", error);
    throw error;
  }
};
/**
 * Client Thunks
 * 
 * All async actions for client-related operations.
 * Consolidated from scattered client API calls.
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import { getClientDashboard, uploadMeal } from "../../api/clientAPI";
import { formatErrorMessage, logError } from "../../utils/errorHandler";

// ============================================
// Dashboard
// ============================================

/**
 * Fetch Client Dashboard Data
 */
export const getClientDashboardThunk = createAsyncThunk(
  "client/getDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getClientDashboard();
      return data;
    } catch (error) {
      logError(error, "Get Client Dashboard");
      return rejectWithValue(
        formatErrorMessage(error, "Failed to fetch client dashboard data")
      );
    }
  }
);

// ============================================
// Meal Tracking
// ============================================

/**
 * Upload a meal (image + info)
 * @param {Object} mealData - Meal data
 * @param {string|number} mealData.mealPlanId - Meal plan ID
 * @param {string} mealData.mealName - Name of the meal
 * @param {number} mealData.sequence - Meal sequence number
 * @param {string} mealData.message - Optional message
 * @param {string} mealData.imageBase64 - Base64 encoded meal image
 */
export const uploadMealThunk = createAsyncThunk(
  "client/uploadMeal",
  async (mealData, { rejectWithValue }) => {
    try {
      if (!mealData) {
        return rejectWithValue("Meal data is required");
      }
      const data = await uploadMeal(mealData);
      return data;
    } catch (error) {
      logError(error, "Upload Meal");
      return rejectWithValue(
        formatErrorMessage(error, "Failed to upload meal")
      );
    }
  }
);

/**
 * Client Thunks
 * 
 * All async actions for client-related operations.
 * Consolidated from scattered client API calls.
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import { getClientDashboard, uploadMeal } from "../../api/clientAPI";
import { getClientDashboardByTrainer } from "../../api/trainerAPI";
import { formatErrorMessage, logError } from "../../utils/errorHandler";

// ============================================
// Dashboard
// ============================================

/**
 * Fetch Client Dashboard Data
 * @param {Object|string|number} params - Parameters object or clientId string/number
 * @param {string|number} params.clientId - Optional client ID. If provided, uses trainer API endpoint.
 * @param {string|null} params.dateTime - Optional date in ISO format. If not provided, fetches today's data.
 * @param {string|number} clientId - Legacy: Optional client ID (for backward compatibility)
 * @param {string|null} dateTime - Legacy: Optional date (for backward compatibility)
 */
export const getClientDashboardThunk = createAsyncThunk(
  "client/getDashboard",
  async (params, { rejectWithValue }) => {
    try {
      // Handle both object params and legacy string/number clientId
      let clientId = null;
      let dateTime = null;
      
      if (typeof params === 'object' && params !== null) {
        clientId = params.clientId;
        dateTime = params.dateTime;
      } else {
        // Legacy: params is clientId
        clientId = params;
      }
      
      // If clientId is provided, use trainer API endpoint (for trainers viewing a client)
      // Otherwise, use client API endpoint (for clients viewing their own dashboard)
      const data = clientId 
        ? await getClientDashboardByTrainer(clientId, dateTime)
        : await getClientDashboard(dateTime);
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
 * @param {string|number} mealData.plannedMealId - Planned meal ID (required for client role)
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

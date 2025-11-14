/**
 * Trainer Thunks
 * 
 * All async actions for trainer-related operations.
 * Consolidated from scattered trainer API calls.
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTrainerDashboard,
  deleteTrainer,
  getClientsForTrainer,
  registerClient,
  getMealPlan,
  getMealPlanPreview,
  createOrUpdateMealPlan,
} from "../../api/trainerAPI";
import { formatErrorMessage, logError } from "../../utils/errorHandler";

// ============================================
// Dashboard
// ============================================

/**
 * Fetch Trainer Dashboard Data
 */
export const getTrainerDashboardThunk = createAsyncThunk(
  "trainer/getDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getTrainerDashboard();
      return data;
    } catch (error) {
      logError(error, "Get Trainer Dashboard");
      return rejectWithValue(
        formatErrorMessage(error, "Failed to fetch trainer dashboard data")
      );
    }
  }
);

// ============================================
// Account Management
// ============================================

/**
 * Delete Trainer Account
 * @param {string|number} userId - The user ID to delete
 */
export const deleteTrainerThunk = createAsyncThunk(
  "trainer/deleteTrainer",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) {
        return rejectWithValue("User ID is required");
      }
      const data = await deleteTrainer(userId);
      return data;
    } catch (error) {
      logError(error, "Delete Trainer");
      return rejectWithValue(
        formatErrorMessage(error, "Failed to delete trainer account")
      );
    }
  }
);

// ============================================
// Client Management
// ============================================

/**
 * Get Clients for Trainer
 */
export const getClientsForTrainerThunk = createAsyncThunk(
  "trainer/getClients",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getClientsForTrainer();
      return data;
    } catch (error) {
      logError(error, "Get Clients for Trainer");
      return rejectWithValue(
        formatErrorMessage(error, "Failed to fetch clients")
      );
    }
  }
);

/**
 * Register a new client
 * @param {Object} userData - Client registration data
 */
export const registerClientThunk = createAsyncThunk(
  "trainer/registerClient",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await registerClient(userData);
      return data;
    } catch (error) {
      logError(error, "Register Client");
      return rejectWithValue(
        formatErrorMessage(error, "Failed to register client")
      );
    }
  }
);

// ============================================
// Meal Plan Management
// ============================================

/**
 * Get Meal Plan
 * @param {Object} params - Parameters
 * @param {string} params.clientId - Client ID
 * @param {string} params.date - Date in YYYY-MM-DD format
 */
export const getMealPlanThunk = createAsyncThunk(
  "trainer/getMealPlan",
  async ({ clientId, date }, { rejectWithValue }) => {
    try {
      if (!clientId || !date) {
        return rejectWithValue("Client ID and date are required");
      }
      const data = await getMealPlan(clientId, date);
      return data;
    } catch (error) {
      logError(error, "Get Meal Plan");
      return rejectWithValue(
        formatErrorMessage(error, "Failed to fetch meal plan")
      );
    }
  }
);

/**
 * Get Meal Plan Preview
 * @param {Object} params - Parameters
 * @param {string} params.clientId - Client ID
 * @param {string} params.date - Date in YYYY-MM-DD format
 */
export const getMealPlanPreviewThunk = createAsyncThunk(
  "trainer/getMealPlanPreview",
  async ({ clientId, date }, { rejectWithValue }) => {
    try {
      if (!clientId || !date) {
        return rejectWithValue("Client ID and date are required");
      }
      const data = await getMealPlanPreview(clientId, date);
      return data;
    } catch (error) {
      logError(error, "Get Meal Plan Preview");
      return rejectWithValue(
        formatErrorMessage(error, "Failed to fetch meal plan preview")
      );
    }
  }
);

/**
 * Create or Update Meal Plan
 * @param {Object} params - Parameters
 * @param {string} params.clientId - Client ID
 * @param {string} params.date - Date in YYYY-MM-DD format
 * @param {Array} params.meals - Array of meal objects
 */
export const createOrUpdateMealPlanThunk = createAsyncThunk(
  "trainer/createOrUpdateMealPlan",
  async ({ clientId, date, meals }, { rejectWithValue }) => {
    try {
      if (!clientId || !date || !Array.isArray(meals) || meals.length === 0) {
        return rejectWithValue("Client ID, date, and meals are required");
      }
      const data = await createOrUpdateMealPlan(clientId, date, meals);
      return data;
    } catch (error) {
      logError(error, "Create/Update Meal Plan");
      return rejectWithValue(
        formatErrorMessage(error, "Failed to save meal plan")
      );
    }
  }
);

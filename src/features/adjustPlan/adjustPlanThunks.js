import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMealPlan,
  createOrUpdateMealPlan,
  getMealPlanPreview,
} from "../../api/trainerAPI";
import axiosInstance from "../../api/axiosInstance";
import { formatErrorMessage, logError, createPreservedError } from "../../utils/errorHandler";

// ✅ Fetch meal plan by clientId and date
export const getMealPlanThunk = createAsyncThunk(
  "mealPlan/fetchByClientId",
  async ({ clientId, date }, { rejectWithValue }) => {
    try {
      const result = await getMealPlan(clientId, date);
      return result;
    } catch (error) {
      logError(error, "Get Meal Plan");
      const errorMessage = formatErrorMessage(error, "Failed to fetch meal plan");
      return rejectWithValue(createPreservedError(error, errorMessage));
    }
  }
);

// ✅ Create or update meal plan
export const createOrUpdateMealPlanThunk = createAsyncThunk(
  "mealPlan/createOrUpdate",
  async ({ clientId, date, meals }, { rejectWithValue }) => {
    try {
      return await createOrUpdateMealPlan(clientId, date, meals);
    } catch (error) {
      logError(error, "Create/Update Meal Plan");
      const errorMessage = formatErrorMessage(error, "Failed to save meal plan");
      return rejectWithValue(createPreservedError(error, errorMessage));
    }
  }
);

// ✅ Delete meals from plan
export const deleteMealsThunk = createAsyncThunk(
  "mealPlan/deleteMeals",
  async ({ mealIds, clientId, date }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(
        "api/Meals/DeleteMealsFromPlan",
        {
          params: { clientId, date },
          data: mealIds, // Array of meal IDs in request body
        }
      );
      return data;
    } catch (error) {
      logError(error, "Delete Meals");
      const errorMessage = formatErrorMessage(error, "Failed to delete meals");
      return rejectWithValue(createPreservedError(error, errorMessage));
    }
  }
);

// ✅ Fetch meal plan preview - FIXED: Changed action type to avoid conflict
export const getMealPlanPreviewThunk = createAsyncThunk(
  "mealPlan/fetchPreview", // ⚠️ Changed from "fetchByClientId" to avoid duplicate
  async ({ clientId, date }, { rejectWithValue }) => {
    try {
      const result = await getMealPlanPreview(clientId, date);
      return result;
    } catch (error) {
      logError(error, "Get Meal Plan Preview");
      const errorMessage = formatErrorMessage(error, "Failed to fetch meal plan preview");
      return rejectWithValue(createPreservedError(error, errorMessage));
    }
  }
);
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMealPlan,
  createOrUpdateMealPlan,
  getMealPlanPreview,
} from "../../api/trainerAPI";
import axiosInstance from "../../api/axiosInstance";

// ✅ Fetch meal plan by clientId and date
export const getMealPlanThunk = createAsyncThunk(
  "mealPlan/fetchByClientId",
  async ({ clientId, date }, { rejectWithValue }) => {
    try {
      const result = await getMealPlan(clientId, date);
      return result;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch meal plan"
      );
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
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to save meal plan"
      );
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
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete meals"
      );
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
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch meal plan preview"
      );
    }
  }
);
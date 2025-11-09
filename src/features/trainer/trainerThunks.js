// src/features/trainer/trainerThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getTrainerDashboard, deleteTrainer, getDashboard } from "../../api/trainerAPI";

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
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch trainer dashboard data"
      );
    }
  }
);

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
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to delete trainer account"
      );
    }
  }
);


/**
 * Fetch client dashboard data
 */
export const getDashboardThunk = createAsyncThunk(
  "client/getDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getDashboard();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch client dashboard data"
      );
    }
  }
);
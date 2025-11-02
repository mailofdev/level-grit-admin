// src/features/trainer/trainerThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getTrainerDashboard } from "../../api/trainerAPI";

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


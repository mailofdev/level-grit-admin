// src/features/client/clientThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getTrainerDashboard, deleteTrainer } from "../../api/trainerAPI";
import { getClientDashboard } from "../../api/clientAPI";

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
 * Fetch Client Dashboard Data
 * @param {string|number} clientId - The client ID to fetch dashboard for
 */
export const getClientDashboardThunk = createAsyncThunk(
  "client/getDashboard",
  async (clientId, { rejectWithValue }) => {
    try {
      if (!clientId) {
        return rejectWithValue("Client ID is required");
      }
      const data = await getClientDashboard(clientId);
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


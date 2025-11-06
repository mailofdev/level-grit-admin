/**
 * Client Slice - Client Portal
 * 
 * Redux slice for managing client state.
 * Handles client dashboard data and client-specific state.
 */

import { createSlice } from "@reduxjs/toolkit";
import { getClientDashboardThunk } from "./clientThunks";

const initialState = {
  dashboardData: null,
  loading: false,
  error: null,
};

const ClientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearLoading: (state) => {
      state.loading = false;
    },
    resetClientState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // --- Pending ---
      .addCase(getClientDashboardThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // --- Fulfilled ---
      .addCase(getClientDashboardThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
        state.error = null;
      })

      // --- Rejected ---
      .addCase(getClientDashboardThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load client dashboard";
        state.dashboardData = null;
      });
  },
});

export const { clearError, clearLoading, resetClientState } =
  ClientSlice.actions;

export default ClientSlice.reducer;

// ✅ Selectors
export const selectClient = (state) => state.client;
export const selectDashboardData = (state) => state.client.dashboardData;
export const selectClientLoading = (state) => state.client.loading;
export const selectClientError = (state) => state.client.error;

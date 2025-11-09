import { createSlice } from "@reduxjs/toolkit";
import { getTrainerDashboardThunk, deleteTrainerThunk, getClientDashboardThunk } from "./clientThunks";

const initialState = {
  dashboardData: null,
  clientDashboardData: null,
  loading: false,
  clientDashboardLoading: false,
  error: null,
  clientDashboardError: null,
};

const ClientSlice = createSlice({
  name: "trainer",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearLoading: (state) => {
      state.loading = false;
    },
    resetTrainerState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // --- Pending ---
      .addCase(getTrainerDashboardThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // --- Fulfilled ---
      .addCase(getTrainerDashboardThunk.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload || {};

        // ✅ Normalize payload structure to ensure consistency
        const normalized = {
          totalClients:
            payload.totalClients ||
            payload.totalClientsCount ||
            payload.clientsCount ||
            0,
          onTrackClients:
            payload.onTrackClients ||
            payload.onTrackCount ||
            payload.onTrack ||
            0,
          needAttentionClients:
            payload.needAttentionClients ||
            payload.needAttentionCount ||
            payload.attentionCount ||
            0,
          overallProgressPercent:
            payload.overallProgressPercent ||
            payload.overallProgress ||
            0,
          goalsBreakdown: payload.goalsBreakdown || [],
          clientsNeedingAttention: payload.clientsNeedingAttention || [],
        };

        state.dashboardData = normalized;
        state.error = null;
      })

      // --- Rejected ---
      .addCase(getTrainerDashboardThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load trainer dashboard";
        state.dashboardData = null;
      })

      // --- DELETE TRAINER THUNK ---
      // Pending
      .addCase(deleteTrainerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // Fulfilled
      .addCase(deleteTrainerThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // Reset trainer state after successful deletion
        state.dashboardData = null;
      })

      // Rejected
      .addCase(deleteTrainerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete trainer account";
      })

      // --- GET CLIENT DASHBOARD THUNK ---
      // Pending
      .addCase(getClientDashboardThunk.pending, (state) => {
        state.clientDashboardLoading = true;
        state.clientDashboardError = null;
      })

      // Fulfilled
      .addCase(getClientDashboardThunk.fulfilled, (state, action) => {
        state.clientDashboardLoading = false;
        state.clientDashboardData = action.payload || null;
        state.clientDashboardError = null;
      })

      // Rejected
      .addCase(getClientDashboardThunk.rejected, (state, action) => {
        state.clientDashboardLoading = false;
        state.clientDashboardError = action.payload || "Failed to load client dashboard";
        state.clientDashboardData = null;
      });
  },
});

export const { clearError, clearLoading, resetTrainerState } =
  ClientSlice.actions;

export default ClientSlice.reducer;

// ✅ Selectors
// Note: These selectors use state.client because clientReducer is mapped to 'client' key in rootReducer
// The slice name "trainer" is a legacy naming that should be updated to "client" in the future
export const selectTrainer = (state) => state.client;
export const selectDashboardData = (state) => state.client.dashboardData;
export const selectTrainerLoading = (state) => state.client.loading;
export const selectTrainerError = (state) => state.client.error;
export const selectClientDashboardData = (state) => state.client.clientDashboardData;
export const selectClientDashboardLoading = (state) => state.client.clientDashboardLoading;
export const selectClientDashboardError = (state) => state.client.clientDashboardError;

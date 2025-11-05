import { createSlice } from "@reduxjs/toolkit";
import { getTrainerDashboardThunk, deleteTrainerThunk } from "./clientThunks";

const initialState = {
  dashboardData: null,
  loading: false,
  error: null,
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
      });
  },
});

export const { clearError, clearLoading, resetTrainerState } =
  ClientSlice.actions;

export default ClientSlice.reducer;

// ✅ Selectors
export const selectTrainer = (state) => state.trainer;
export const selectDashboardData = (state) => state.trainer.dashboardData;
export const selectTrainerLoading = (state) => state.trainer.loading;
export const selectTrainerError = (state) => state.trainer.error;

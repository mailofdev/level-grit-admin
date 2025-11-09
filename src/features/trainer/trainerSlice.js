import { createSlice } from "@reduxjs/toolkit";
import { getTrainerDashboardThunk, deleteTrainerThunk, getDashboardThunk } from "./trainerThunks";

const initialState = {
  dashboard: null,
  loading: false,
  error: null,
};

const trainerSlice = createSlice({
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

        state.dashboard = normalized;
        state.error = null;
      })

      // --- Rejected ---
      .addCase(getTrainerDashboardThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load trainer dashboard";
        state.dashboard = null;
      })

           // ============================================================
      // ✅ FETCH DASHBOARD
      // ============================================================
      .addCase(getDashboardThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardThunk.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload || {};

        // ✅ Normalize & structure dashboard response
        state.dashboard = {
          clientId: payload.clientId || payload.userId || payload.id || null,
          trainerId: payload.trainerId || null,
          clientName:
            payload.clientName ||
            payload.fullName ||
            payload.name ||
            "Client",
          currentStreakDays:
            payload.currentStreakDays ||
            payload.streakDays ||
            payload.currentStreak ||
            0,
          totalMacros: payload.totalMacros || {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
          },
          plannedMeals: payload.plannedMeals || [],
          meals: payload.meals || [],
        };

        state.error = null;
      })
      .addCase(getDashboardThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch client dashboard data";
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
        state.dashboard = null;
      })

      // Rejected
      .addCase(deleteTrainerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete trainer account";
      });
  },
});

export const { clearError, clearLoading, resetTrainerState } =
  trainerSlice.actions;

export default trainerSlice.reducer;

// ✅ Selectors
export const selectTrainer = (state) => state.trainer;
export const selectdashboard = (state) => state.trainer.dashboard;
export const selectTrainerLoading = (state) => state.trainer.loading;
export const selectTrainerError = (state) => state.trainer.error;

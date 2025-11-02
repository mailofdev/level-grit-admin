// src/features/trainer/trainerSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { getTrainerDashboardThunk } from "./trainerThunks";

const initialState = {
  dashboardData: null,
  stats: {
    totalClients: 0,
    onTrackClients: 0,
    needAttention: 0,
    muscleGain: 0,
    weightLoss: 0,
  },
  loading: false,
  error: null,
};

const trainerSlice = createSlice({
  name: "trainer",
  initialState,
  reducers: {
    // Clear error message
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear loading state
    clearLoading: (state) => {
      state.loading = false;
    },
    
    // Reset trainer state
    resetTrainerState: (state) => {
      return initialState;
    },
    
    // Update stats manually if needed
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ GET TRAINER DASHBOARD THUNK
      .addCase(getTrainerDashboardThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTrainerDashboardThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
        
        // Extract stats from API response
        // Supports multiple possible response structures from the API
        if (action.payload) {
          const payload = action.payload;
          
          // Check for different possible response structures
          state.stats = {
            totalClients: payload.totalClients || payload.totalClientsCount || payload.clientsCount || 0,
            onTrackClients: payload.onTrackClients || payload.onTrackCount || payload.onTrack || 0,
            needAttention: payload.needAttention || payload.attentionCount || payload.needAttentionCount || 0,
            muscleGain: payload.muscleGain || payload.muscleGainCount || payload.muscleGainClients || 0,
            weightLoss: payload.weightLoss || payload.weightLossCount || payload.weightLossClients || 0,
          };
          
          // If API returns stats object directly
          if (payload.stats) {
            state.stats = { ...state.stats, ...payload.stats };
          }
          
          // If API returns dashboard object with stats inside
          if (payload.dashboard && payload.dashboard.stats) {
            state.stats = { ...state.stats, ...payload.dashboard.stats };
          }
        }
        state.error = null;
      })
      .addCase(getTrainerDashboardThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load trainer dashboard";
        state.dashboardData = null;
      });
  },
});

export const { 
  clearError, 
  clearLoading, 
  resetTrainerState,
  updateStats 
} = trainerSlice.actions;

export default trainerSlice.reducer;

// ✅ Selectors for easy access to trainer state
export const selectTrainer = (state) => state.trainer;
export const selectDashboardData = (state) => state.trainer.dashboardData;
export const selectTrainerStats = (state) => state.trainer.stats;
export const selectTrainerLoading = (state) => state.trainer.loading;
export const selectTrainerError = (state) => state.trainer.error;


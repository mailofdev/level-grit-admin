/**
 * Client Thunks - Client Portal
 * 
 * Async thunks for client-related API calls.
 * Handles client dashboard data and client-specific operations.
 */

import { createAsyncThunk } from "@reduxjs/toolkit";

/**
 * Fetch Client Dashboard Data
 * This thunk can be extended to fetch client-specific dashboard data when needed
 */
export const getClientDashboardThunk = createAsyncThunk(
  "client/getDashboard",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Implement client dashboard API call when backend is ready
      // const { data } = await axiosInstance.get("api/Client/Dashboard");
      // return data;
      
      // For now, return empty data structure
      return {
        dashboardData: null,
        loading: false,
        error: null,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch client dashboard data"
      );
    }
  }
);

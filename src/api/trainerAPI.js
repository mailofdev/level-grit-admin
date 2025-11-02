// src/api/trainerAPI.js
import axiosInstance from "./axiosInstance";

/**
 * Get Trainer Dashboard Data
 * API Path: api/Trainer/Dashboard
 */
export const getTrainerDashboard = async () => {
  const { data } = await axiosInstance.get("api/Trainer/Dashboard");
  return data;
};


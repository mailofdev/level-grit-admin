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

/**
 * Delete Trainer Account
 * API Path: api/Trainer/Delete-trainer
 * @param {string|number} userId - The user ID to delete
 */
export const deleteTrainer = async (userId) => {
  const { data } = await axiosInstance.delete("api/Trainer/Delete-trainer", {
    data: { userId }, // Pass userId in request body
  });
  return data;
};


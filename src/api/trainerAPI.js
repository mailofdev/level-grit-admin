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
 * API Path: api/Trainer/Delete-trainer/{userId}
 * @param {string|number} userId - The user ID to delete
 */
export const deleteTrainer = async (userId) => {
  const { data } = await axiosInstance.delete(`api/Trainer/Delete-trainer/${userId}`);
  return data;
};

/**
 * Get Client Dashboard Data
 * API Path: api/Client/GetDashboard
 */
export const getDashboard = async () => {
  const { data } = await axiosInstance.get(`api/Client/GetDashboard`);
  return data;
};

/**
 * Upload Meal API
 * API Path: api/Client/UploadMeal
 * Body: { mealPlanId, mealName, sequence, message, imageBase64 }
 */
export const uploadMeal = async (mealData) => {
  const { data } = await axiosInstance.post(`api/Client/UploadMeal`, mealData);
  return data;
};

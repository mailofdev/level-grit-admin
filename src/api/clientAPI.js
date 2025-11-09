// src/api/clientAPI.js
import axiosInstance from "./axiosInstance";

/**
 * Get Client Dashboard Data
 * API Path: api/Client/GetDashboard
 * @param {string|number} clientId - The client ID to fetch dashboard for
 */
export const getClientDashboard = async (clientId) => {
  const { data } = await axiosInstance.get("api/Client/GetDashboard", {
    params: { clientId },
  });
  return data;
};


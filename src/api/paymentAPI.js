/**
 * Payment API
 * 
 * All API endpoints under /api/Payment/*
 * Domain-based organization for payment-related operations.
 */

import axiosInstance from "./axiosInstance";

/**
 * Get Payment Status
 * Checks if trainer has made payment for additional clients
 * API Path: api/Payment/GetPaymentStatus
 * @returns {Promise<Object>} Payment status information
 */
export const getPaymentStatus = async () => {
  try {
    const { data } = await axiosInstance.get("api/Payment/GetPaymentStatus");
    return data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch payment status"
    );
  }
};

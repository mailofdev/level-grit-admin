// src/api/paymentAPI.js
import axiosInstance from "./axiosInstance";

/**
 * Create Razorpay Order
 * Creates a payment order on the backend for Razorpay integration
 * @param {number} amount - Amount in rupees (will be converted to paise)
 * @param {string} currency - Currency code (default: INR)
 * @param {string} receipt - Receipt identifier
 * @returns {Promise<Object>} - Order details including order_id and key_id
 */
export const createRazorpayOrder = async (amount, currency = "INR", receipt = null) => {
  try {
    const { data } = await axiosInstance.post("api/Payment/CreateOrder", {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    });
    return data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Failed to create payment order"
    );
  }
};

/**
 * Verify Razorpay Payment
 * Verifies the payment signature on the backend
 * @param {Object} paymentData - Payment verification data
 * @param {string} paymentData.razorpay_order_id - Order ID from Razorpay
 * @param {string} paymentData.razorpay_payment_id - Payment ID from Razorpay
 * @param {string} paymentData.razorpay_signature - Signature from Razorpay
 * @returns {Promise<Object>} - Verification result
 */
export const verifyRazorpayPayment = async (paymentData) => {
  try {
    const { data } = await axiosInstance.post("api/Payment/VerifyPayment", paymentData);
    return data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Payment verification failed"
    );
  }
};

/**
 * Get Payment Status
 * Checks if trainer has made payment for additional clients
 * @returns {Promise<Object>} - Payment status information
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


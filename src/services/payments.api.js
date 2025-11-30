/**
 * Payment API Service
 * 
 * Handles all payment-related API calls for Razorpay integration
 * Endpoints:
 * - POST api/payments/create-order - Create Razorpay order
 * - POST api/payments/verify - Verify payment
 * - POST api/payments/refund - Process refund
 */

import axiosInstance from "../api/axiosInstance";

/**
 * Create Razorpay Order
 * API Path: api/payments/create-order
 * @param {Object} orderData - Order creation data
 * @param {number} orderData.clientId - Client ID for which payment is being made
 * @param {number} orderData.amount - Payment amount in rupees
 * @param {string} orderData.currency - Currency code (default: "INR")
 * @param {string} orderData.receipt - Receipt identifier
 * @returns {Promise<Object>} Order creation response with order_id
 */
export const createOrder = async (orderData) => {
  // IMPORTANT: Amount is sent in RUPEES (₹500)
  // Backend MUST convert to PAISE (50000) when creating Razorpay order
  // Razorpay requires amount in smallest currency unit (paise for INR)
  const amountInRupees = orderData.amount || 500;
  
  if (process.env.NODE_ENV === 'development' && amountInRupees !== 500) {
    console.warn(`Expected amount ₹500, but got ₹${amountInRupees}`);
  }
  
  const { data } = await axiosInstance.post("api/payments/create-order", {
    clientId: orderData.clientId,
    amount: amountInRupees, // Amount in RUPEES (backend must convert to paise: amount * 100)
    currency: orderData.currency || "INR",
    receipt: orderData.receipt || `receipt_${Date.now()}`,
  });
  
  // Log for debugging (development only)
  if (process.env.NODE_ENV === 'development') {
    console.log("Create order request:", {
      amountInRupees,
      expectedPaise: amountInRupees * 100,
      note: "Backend should convert to paise when creating Razorpay order"
    });
  }
  
  return data;
};

/**
 * Verify Payment
 * API Path: api/payments/verify
 * @param {Object} paymentData - Payment verification data
 * @param {string} paymentData.razorpayPaymentId - Razorpay payment ID
 * @param {string} paymentData.razorpayOrderId - Razorpay order ID
 * @param {string} paymentData.razorpaySignature - Razorpay signature for verification
 * @returns {Promise<Object>} Verification response
 */
export const verifyPayment = async (paymentData) => {
  const { data } = await axiosInstance.post("api/payments/verify", {
    razorpayPaymentId: paymentData.razorpayPaymentId,
    razorpayOrderId: paymentData.razorpayOrderId,
    razorpaySignature: paymentData.razorpaySignature,
  });
  return data;
};

/**
 * Process Refund
 * API Path: api/payments/refund
 * @param {Object} refundData - Refund data
 * @param {number} refundData.paymentId - Payment ID to refund
 * @param {number} refundData.amount - Refund amount (optional, defaults to full amount)
 * @param {string} refundData.reason - Reason for refund
 * @returns {Promise<Object>} Refund response
 */
export const refundPayment = async (refundData) => {
  const { data } = await axiosInstance.post("api/payments/refund", {
    paymentId: refundData.paymentId,
    amount: refundData.amount || null, // null means full refund
    reason: refundData.reason || "Refund requested",
  });
  return data;
};


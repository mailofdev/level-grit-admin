/**
 * Razorpay API Service
 * 
 * Handles communication with Firebase Cloud Functions for Razorpay operations
 * Falls back to direct backend API if Cloud Functions are not available
 */

import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';
import { createRazorpayOrder as backendCreateOrder, verifyRazorpayPayment as backendVerifyPayment } from './paymentAPI';

/**
 * Create Razorpay Order via Cloud Functions
 * 
 * @param {number} amount - Amount in rupees
 * @param {string} currency - Currency code (default: INR)
 * @param {Object} metadata - Additional metadata
 * @returns {Promise<Object>} Order data with Razorpay order ID
 */
export const createRazorpayOrder = async (amount, currency = 'INR', metadata = {}) => {
  try {
    // Try Cloud Functions first
    if (functions) {
      const createOrder = httpsCallable(functions, 'createRazorpayOrder');
      const result = await createOrder({
        amount,
        currency,
        receipt: metadata.receipt || `receipt_${Date.now()}`,
        metadata
      });
      
      if (result.data?.success && result.data?.order) {
        return result.data.order;
      }
    }

    // Fallback to backend API
    console.warn('Cloud Functions not available, falling back to backend API');
    return await backendCreateOrder(amount, currency, metadata.receipt);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    
    // If Cloud Functions error, try backend API
    if (error.code === 'functions/unavailable' || error.code === 'functions/not-found') {
      console.warn('Cloud Functions unavailable, trying backend API');
      return await backendCreateOrder(amount, currency, metadata.receipt);
    }
    
    throw new Error(
      error.message || 
      error.details || 
      'Failed to create payment order. Please try again.'
    );
  }
};

/**
 * Verify Razorpay Payment via Cloud Functions
 * 
 * @param {Object} paymentData - Payment verification data
 * @param {string} paymentData.razorpay_order_id - Order ID from Razorpay
 * @param {string} paymentData.razorpay_payment_id - Payment ID from Razorpay
 * @param {string} paymentData.razorpay_signature - Signature from Razorpay
 * @returns {Promise<Object>} Verification result
 */
export const verifyRazorpayPayment = async (paymentData) => {
  try {
    // Try Cloud Functions first
    if (functions) {
      const verifyPayment = httpsCallable(functions, 'verifyRazorpayPayment');
      const result = await verifyPayment({
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature
      });
      
      if (result.data?.success && result.data?.verified) {
        return result.data;
      }
    }

    // Fallback to backend API
    console.warn('Cloud Functions not available, falling back to backend API');
    return await backendVerifyPayment(paymentData);
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    
    // If Cloud Functions error, try backend API
    if (error.code === 'functions/unavailable' || error.code === 'functions/not-found') {
      console.warn('Cloud Functions unavailable, trying backend API');
      return await backendVerifyPayment(paymentData);
    }
    
    throw new Error(
      error.message || 
      error.details || 
      'Payment verification failed. Please contact support.'
    );
  }
};

/**
 * Get Payment Status via Cloud Functions
 * 
 * @returns {Promise<Object>} Payment status information
 */
export const getPaymentStatus = async () => {
  try {
    if (functions) {
      const getStatus = httpsCallable(functions, 'getPaymentStatus');
      const result = await getStatus();
      
      if (result.data?.success) {
        return result.data;
      }
    }

    // Fallback to backend API
    const { getPaymentStatus: backendGetStatus } = await import('./paymentAPI');
    return await backendGetStatus();
  } catch (error) {
    console.error('Error fetching payment status:', error);
    throw new Error(
      error.message || 
      error.details || 
      'Failed to fetch payment status'
    );
  }
};

/**
 * Get Razorpay Key ID from environment
 * 
 * @returns {string} Razorpay Key ID
 * @throws {Error} If key ID is not found
 */
export const getRazorpayKeyId = () => {
  // Check for REACT_APP_ prefix first (Create React App convention)
  // Also check window.env for runtime injection (if needed)
  const keyId = 
    process.env.REACT_APP_RAZORPAY_KEY_ID || 
    process.env.REACT_PUBLIC_RAZORPAY_KEY_ID ||
    process.env.RAZORPAY_KEY_ID ||
    (typeof window !== 'undefined' && window.env?.RAZORPAY_KEY_ID);
  
  if (!keyId) {
    const errorMsg = 
      'Razorpay Key ID not found in environment variables. ' +
      'Please create a .env.local file with REACT_APP_RAZORPAY_KEY_ID=rzp_test_... ' +
      'and restart the development server.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  
  return keyId;
};

/**
 * Check if using test mode
 * 
 * @returns {boolean} True if test mode
 */
export const isTestMode = () => {
  const keyId = getRazorpayKeyId();
  return keyId ? keyId.includes('rzp_test_') : true;
};


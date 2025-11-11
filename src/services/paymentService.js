/**
 * Payment Service
 * 
 * Handles all payment-related operations with Firebase Firestore
 * - Order creation
 * - Payment verification
 * - Payment record storage
 * - Payment status tracking
 */

import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  doc, 
  updateDoc,
  getDoc,
  serverTimestamp,
  Timestamp,
  limit
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { getDecryptedUser } from '../components/common/CommonFunctions';

// Collection names
const PAYMENTS_COLLECTION = 'payments';
const ORDERS_COLLECTION = 'orders';

/**
 * Payment Status Enum
 */
export const PaymentStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

/**
 * Create a Razorpay order
 * 
 * This should be called from Firebase Cloud Functions for security.
 * For now, we'll create a client-side order record that will be
 * validated on the backend.
 * 
 * @param {number} amount - Amount in rupees
 * @param {string} currency - Currency code (default: INR)
 * @param {Object} metadata - Additional metadata
 * @returns {Promise<Object>} Order data
 */
export const createOrder = async (amount, currency = 'INR', metadata = {}) => {
  try {
    const user = getDecryptedUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Create order record in Firestore
    const orderData = {
      userId: user.userId || user.id,
      userName: user.fullName || 'Unknown User',
      userEmail: user.email || '',
      amount: amount,
      amountInPaise: amount * 100,
      currency: currency,
      status: PaymentStatus.PENDING,
      metadata: {
        purpose: metadata.purpose || 'Additional Client Registration',
        ...metadata
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const orderRef = await addDoc(collection(db, ORDERS_COLLECTION), orderData);
    
    return {
      id: orderRef.id,
      ...orderData,
      // This order ID will be used to create Razorpay order on backend
      razorpayOrderId: null // Will be set by backend
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error(error.message || 'Failed to create order');
  }
};

/**
 * Save payment record to Firestore
 * 
 * @param {Object} paymentData - Payment information
 * @returns {Promise<Object>} Saved payment record
 */
export const savePaymentRecord = async (paymentData) => {
  try {
    const user = getDecryptedUser();
    
    const paymentRecord = {
      userId: paymentData.userId || user?.userId || user?.id || 'unknown',
      userName: paymentData.userName || user?.fullName || 'Unknown User',
      userEmail: paymentData.userEmail || user?.email || '',
      paymentId: paymentData.paymentId,
      orderId: paymentData.orderId,
      razorpayOrderId: paymentData.razorpayOrderId,
      amount: paymentData.amount,
      currency: paymentData.currency || 'INR',
      status: paymentData.status || PaymentStatus.SUCCESS,
      signature: paymentData.signature || null,
      clientId: paymentData.clientId || null,
      clientName: paymentData.clientName || null,
      metadata: paymentData.metadata || {},
      paymentDate: paymentData.paymentDate ? Timestamp.fromDate(new Date(paymentData.paymentDate)) : serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      verified: paymentData.verified || false
    };

    const paymentRef = await addDoc(collection(db, PAYMENTS_COLLECTION), paymentRecord);
    
    // Update order status if orderId exists
    if (paymentData.orderId) {
      await updateOrderStatus(paymentData.orderId, paymentRecord.status);
    }

    return {
      id: paymentRef.id,
      ...paymentRecord
    };
  } catch (error) {
    console.error('Error saving payment record:', error);
    throw new Error(error.message || 'Failed to save payment record');
  }
};

/**
 * Update order status
 * 
 * @param {string} orderId - Order document ID
 * @param {string} status - New status
 * @returns {Promise<void>}
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      status: status,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    // Don't throw - this is a non-critical operation
  }
};

/**
 * Get payments for a specific user
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of payment records
 */
export const getUserPayments = async (userId) => {
  try {
    const q = query(
      collection(db, PAYMENTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('paymentDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching user payments:', error);
    throw new Error(error.message || 'Failed to fetch payments');
  }
};

/**
 * Get all payments (admin view)
 * 
 * @returns {Promise<Array>} Array of all payment records
 */
export const getAllPayments = async () => {
  try {
    const q = query(
      collection(db, PAYMENTS_COLLECTION),
      orderBy('paymentDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching all payments:', error);
    throw new Error(error.message || 'Failed to fetch payments');
  }
};

/**
 * Get payment by ID
 * 
 * @param {string} paymentId - Payment document ID
 * @returns {Promise<Object|null>} Payment record or null
 */
export const getPaymentById = async (paymentId) => {
  try {
    const paymentRef = doc(db, PAYMENTS_COLLECTION, paymentId);
    const paymentSnap = await getDoc(paymentRef);
    
    if (paymentSnap.exists()) {
      return {
        id: paymentSnap.id,
        ...paymentSnap.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching payment:', error);
    throw new Error(error.message || 'Failed to fetch payment');
  }
};

/**
 * Verify payment status from Razorpay
 * This should be called from backend/Cloud Functions
 * 
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} orderId - Razorpay order ID
 * @param {string} signature - Payment signature
 * @returns {Promise<Object>} Verification result
 */
export const verifyPayment = async (paymentId, orderId, signature) => {
  try {
    // This should call a backend endpoint or Cloud Function
    // For now, we'll return a structure that can be used
    return {
      verified: false, // Will be set by backend verification
      paymentId,
      orderId,
      signature
    };
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw new Error(error.message || 'Payment verification failed');
  }
};

/**
 * Get payment statistics for a user
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Payment statistics
 */
export const getUserPaymentStats = async (userId) => {
  try {
    const payments = await getUserPayments(userId);
    const successfulPayments = payments.filter(p => p.status === PaymentStatus.SUCCESS);
    
    return {
      totalPayments: payments.length,
      successfulPayments: successfulPayments.length,
      totalAmount: successfulPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
      lastPaymentDate: payments[0]?.paymentDate || null
    };
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    throw new Error(error.message || 'Failed to fetch payment statistics');
  }
};


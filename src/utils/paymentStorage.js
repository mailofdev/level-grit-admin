/**
 * Payment Storage Utility
 * Manages payment records in localStorage for frontend-only payment tracking
 */

const PAYMENT_STORAGE_KEY = "level_grit_payments";
const TRAINER_PAYMENT_STATUS_KEY = "level_grit_trainer_payments";

/**
 * Get all payment records
 * @returns {Array} Array of payment records
 */
export const getAllPayments = () => {
  try {
    const payments = localStorage.getItem(PAYMENT_STORAGE_KEY);
    return payments ? JSON.parse(payments) : [];
  } catch (error) {
    console.error("Error reading payments from storage:", error);
    return [];
  }
};

/**
 * Save a payment record
 * @param {Object} paymentData - Payment information
 * @param {string} paymentData.trainerId - Trainer user ID
 * @param {string} paymentData.trainerName - Trainer name
 * @param {string} paymentData.trainerEmail - Trainer email
 * @param {string} paymentData.paymentId - Payment ID
 * @param {string} paymentData.orderId - Order ID
 * @param {number} paymentData.amount - Payment amount in rupees
 * @param {string} paymentData.clientId - Client ID for which payment was made (optional)
 * @param {string} paymentData.clientName - Client name for which payment was made (optional)
 * @param {Date} paymentData.paymentDate - Payment date
 * @returns {Object} Saved payment record
 */
export const savePayment = (paymentData) => {
  try {
    const payments = getAllPayments();
    const paymentRecord = {
      id: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...paymentData,
      paymentDate: paymentData.paymentDate || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    
    payments.push(paymentRecord);
    localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(payments));
    
    // Update trainer payment status
    updateTrainerPaymentStatus(paymentData.trainerId, paymentRecord);
    
    return paymentRecord;
  } catch (error) {
    console.error("Error saving payment:", error);
    throw error;
  }
};

/**
 * Get payments for a specific trainer
 * @param {string} trainerId - Trainer user ID
 * @returns {Array} Array of payment records for the trainer
 */
export const getTrainerPayments = (trainerId) => {
  try {
    const payments = getAllPayments();
    return payments.filter((payment) => payment.trainerId === trainerId);
  } catch (error) {
    console.error("Error getting trainer payments:", error);
    return [];
  }
};

/**
 * Get trainer payment status
 * @param {string} trainerId - Trainer user ID
 * @returns {Object} Payment status information
 */
export const getTrainerPaymentStatus = (trainerId) => {
  try {
    const status = localStorage.getItem(`${TRAINER_PAYMENT_STATUS_KEY}_${trainerId}`);
    return status ? JSON.parse(status) : { paidClients: 0, totalPayments: 0 };
  } catch (error) {
    console.error("Error getting trainer payment status:", error);
    return { paidClients: 0, totalPayments: 0 };
  }
};

/**
 * Update trainer payment status
 * @param {string} trainerId - Trainer user ID
 * @param {Object} paymentRecord - Payment record
 */
const updateTrainerPaymentStatus = (trainerId, paymentRecord) => {
  try {
    const status = getTrainerPaymentStatus(trainerId);
    status.paidClients = (status.paidClients || 0) + 1;
    status.totalPayments = (status.totalPayments || 0) + (paymentRecord.amount || 500);
    status.lastPaymentDate = paymentRecord.paymentDate;
    
    localStorage.setItem(
      `${TRAINER_PAYMENT_STATUS_KEY}_${trainerId}`,
      JSON.stringify(status)
    );
  } catch (error) {
    console.error("Error updating trainer payment status:", error);
  }
};

/**
 * Check if trainer can add a client without payment
 * @param {string} trainerId - Trainer user ID
 * @param {number} currentClientCount - Current number of clients
 * @returns {Object} Payment requirement info
 */
export const checkPaymentRequirement = (trainerId, currentClientCount) => {
  const status = getTrainerPaymentStatus(trainerId);
  const freeClientsAllowed = 1; // First client is free
  const paidClients = status.paidClients || 0;
  const totalAllowedClients = freeClientsAllowed + paidClients;
  
  // If current client count is less than allowed, no payment needed
  // This means trainer can still add clients within their paid limit
  if (currentClientCount < totalAllowedClients) {
    return {
      paymentRequired: false,
      canAddClient: true,
      reason: "Within free/paid client limit",
      currentClients: currentClientCount,
      allowedClients: totalAllowedClients,
    };
  }
  
  // Payment required for additional clients beyond the allowed limit
  // Each payment allows exactly one additional client
  return {
    paymentRequired: true,
    canAddClient: false,
    reason: "Payment required for additional clients",
    amount: 500,
    currentClients: currentClientCount,
    allowedClients: totalAllowedClients,
    message: `You have ${currentClientCount} client(s). To add more, please pay ₹500 per additional client.`,
  };
};

/**
 * Record that a client was added (after payment verification)
 * This is called after successful client registration
 * @param {string} trainerId - Trainer user ID
 * @param {string} clientId - Client ID
 * @param {string} clientName - Client name
 */
export const recordClientAddition = (trainerId, clientId, clientName) => {
  try {
    // Link the most recent payment to this client if available
    const payments = getTrainerPayments(trainerId);
    const recentPayment = payments
      .filter((p) => !p.clientId)
      .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))[0];
    
    if (recentPayment) {
      // Update payment record with client info
      const allPayments = getAllPayments();
      const paymentIndex = allPayments.findIndex((p) => p.id === recentPayment.id);
      if (paymentIndex !== -1) {
        allPayments[paymentIndex].clientId = clientId;
        allPayments[paymentIndex].clientName = clientName;
        localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(allPayments));
      }
    }
  } catch (error) {
    console.error("Error recording client addition:", error);
  }
};

/**
 * Get all payments grouped by trainer (for admin view)
 * @returns {Array} Array of trainer payment summaries
 */
export const getPaymentsByTrainer = () => {
  try {
    const payments = getAllPayments();
    const trainerMap = {};
    
    payments.forEach((payment) => {
      const trainerId = payment.trainerId;
      if (!trainerMap[trainerId]) {
        trainerMap[trainerId] = {
          trainerId,
          trainerName: payment.trainerName || "Unknown",
          trainerEmail: payment.trainerEmail || "",
          totalPayments: 0,
          totalAmount: 0,
          payments: [],
          lastPaymentDate: null,
        };
      }
      
      trainerMap[trainerId].totalPayments += 1;
      trainerMap[trainerId].totalAmount += payment.amount || 500;
      trainerMap[trainerId].payments.push(payment);
      
      const paymentDate = new Date(payment.paymentDate);
      if (
        !trainerMap[trainerId].lastPaymentDate ||
        paymentDate > new Date(trainerMap[trainerId].lastPaymentDate)
      ) {
        trainerMap[trainerId].lastPaymentDate = payment.paymentDate;
      }
    });
    
    return Object.values(trainerMap);
  } catch (error) {
    console.error("Error getting payments by trainer:", error);
    return [];
  }
};

/**
 * Clear all payment data (for testing/reset)
 */
export const clearAllPayments = () => {
  try {
    localStorage.removeItem(PAYMENT_STORAGE_KEY);
    // Clear all trainer payment statuses
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(TRAINER_PAYMENT_STATUS_KEY)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error("Error clearing payments:", error);
  }
};


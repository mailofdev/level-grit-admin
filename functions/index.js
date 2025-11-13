/**
 * Firebase Cloud Functions
 * 
 * To deploy these functions:
 * 1. Install Firebase CLI: npm install -g firebase-tools
 * 2. Login: firebase login
 * 3. Initialize: firebase init functions
 * 4. Install dependencies: cd functions && npm install
 * 5. Deploy: firebase deploy --only functions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin
// Only initialize if not already initialized (for local testing)
if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Get Payment Status
 * 
 * Uses onCall which automatically handles CORS
 * GET /getPaymentStatus
 */
exports.getPaymentStatus = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated'
      );
    }

    const userId = context.auth.uid;

    // Get user's payments
    const paymentsSnapshot = await admin.firestore()
      .collection('payments')
      .where('userId', '==', userId)
      .where('status', '==', 'success')
      .orderBy('paymentDate', 'desc')
      .get();

    const payments = paymentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    return {
      success: true,
      totalPayments: payments.length,
      totalAmount: totalAmount,
      lastPayment: payments[0] || null,
      payments: payments
    };
  } catch (error) {
    console.error('Error fetching payment status:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError(
      'internal',
      error.message || 'Failed to fetch payment status'
    );
  }
});

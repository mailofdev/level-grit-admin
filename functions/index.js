/**
 * Firebase Cloud Functions for Razorpay Payment Integration
 * 
 * To deploy these functions:
 * 1. Install Firebase CLI: npm install -g firebase-tools
 * 2. Login: firebase login
 * 3. Initialize: firebase init functions
 * 4. Install dependencies: cd functions && npm install
 * 5. Deploy: firebase deploy --only functions
 * 
 * Required environment variables (set via Firebase Console):
 * - razorpay.key_id (test or live)
 * - razorpay.key_secret (test or live)
 * - razorpay.mode (test or live)
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Firebase Admin
// Only initialize if not already initialized (for local testing)
if (!admin.apps.length) {
  admin.initializeApp();
}

// Initialize Razorpay instance
// This will be set based on environment variables
let razorpayInstance = null;

const getRazorpayInstance = () => {
  if (razorpayInstance) {
    return razorpayInstance;
  }

  const keyId = functions.config().razorpay?.key_id || process.env.RAZORPAY_KEY_ID;
  const keySecret = functions.config().razorpay?.key_secret || process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.');
  }

  razorpayInstance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });

  return razorpayInstance;
};

/**
 * Create Razorpay Order
 * 
 * POST /createRazorpayOrder
 * Body: { amount: number, currency: string, receipt: string, metadata: object }
 */
exports.createRazorpayOrder = functions.https.onCall(async (data, context) => {
  try {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated to create an order'
      );
    }

    const { amount, currency = 'INR', receipt, metadata = {} } = data;

    // Validate amount
    if (!amount || amount <= 0) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Amount must be greater than 0'
      );
    }

    // Convert to paise (Razorpay uses paise)
    const amountInPaise = Math.round(amount * 100);

    // Create order in Razorpay
    const razorpay = getRazorpayInstance();
    const orderOptions = {
      amount: amountInPaise,
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}_${context.auth.uid}`,
      notes: {
        userId: context.auth.uid,
        ...metadata
      }
    };

    const razorpayOrder = await razorpay.orders.create(orderOptions);

    // Save order to Firestore
    const orderData = {
      userId: context.auth.uid,
      razorpayOrderId: razorpayOrder.id,
      amount: amount,
      amountInPaise: amountInPaise,
      currency: currency,
      receipt: orderOptions.receipt,
      status: 'created',
      metadata: metadata,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const orderRef = await admin.firestore()
      .collection('orders')
      .add(orderData);

    return {
      success: true,
      order: {
        id: orderRef.id,
        razorpayOrderId: razorpayOrder.id,
        amount: amount,
        amountInPaise: amountInPaise,
        currency: currency,
        key: functions.config().razorpay?.key_id || process.env.RAZORPAY_KEY_ID,
        ...orderData
      }
    };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError(
      'internal',
      error.message || 'Failed to create order'
    );
  }
});

/**
 * Verify Razorpay Payment
 * 
 * POST /verifyRazorpayPayment
 * Body: { 
 *   razorpay_order_id: string,
 *   razorpay_payment_id: string,
 *   razorpay_signature: string
 * }
 */
exports.verifyRazorpayPayment = functions.https.onCall(async (data, context) => {
  try {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated to verify payment'
      );
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = data;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing required payment verification fields'
      );
    }

    // Verify signature
    const keySecret = functions.config().razorpay?.key_secret || process.env.RAZORPAY_KEY_SECRET;
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(text)
      .digest('hex');

    const isSignatureValid = generatedSignature === razorpay_signature;

    if (!isSignatureValid) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Invalid payment signature'
      );
    }

    // Fetch payment details from Razorpay
    const razorpay = getRazorpayInstance();
    let razorpayPayment;
    try {
      razorpayPayment = await razorpay.payments.fetch(razorpay_payment_id);
    } catch (error) {
      console.error('Error fetching payment from Razorpay:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to fetch payment details from Razorpay'
      );
    }

    // Verify payment status
    if (razorpayPayment.status !== 'captured' && razorpayPayment.status !== 'authorized') {
      throw new functions.https.HttpsError(
        'failed-precondition',
        `Payment not successful. Status: ${razorpayPayment.status}`
      );
    }

    // Find order in Firestore
    const ordersSnapshot = await admin.firestore()
      .collection('orders')
      .where('razorpayOrderId', '==', razorpay_order_id)
      .where('userId', '==', context.auth.uid)
      .limit(1)
      .get();

    if (ordersSnapshot.empty) {
      throw new functions.https.HttpsError(
        'not-found',
        'Order not found'
      );
    }

    const orderDoc = ordersSnapshot.docs[0];
    const orderData = orderDoc.data();

    // Check if payment already exists
    const paymentsSnapshot = await admin.firestore()
      .collection('payments')
      .where('razorpayPaymentId', '==', razorpay_payment_id)
      .limit(1)
      .get();

    if (!paymentsSnapshot.empty) {
      // Payment already recorded
      const existingPayment = paymentsSnapshot.docs[0].data();
      return {
        success: true,
        verified: true,
        payment: {
          id: paymentsSnapshot.docs[0].id,
          ...existingPayment
        },
        message: 'Payment already verified'
      };
    }

    // Create payment record
    const paymentData = {
      userId: context.auth.uid,
      orderId: orderDoc.id,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      amount: orderData.amount,
      amountInPaise: orderData.amountInPaise,
      currency: orderData.currency,
      status: razorpayPayment.status === 'captured' ? 'success' : 'authorized',
      signature: razorpay_signature,
      verified: true,
      razorpayPaymentData: {
        method: razorpayPayment.method,
        bank: razorpayPayment.bank,
        wallet: razorpayPayment.wallet,
        vpa: razorpayPayment.vpa,
        email: razorpayPayment.email,
        contact: razorpayPayment.contact
      },
      metadata: orderData.metadata || {},
      paymentDate: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const paymentRef = await admin.firestore()
      .collection('payments')
      .add(paymentData);

    // Update order status
    await orderDoc.ref.update({
      status: 'paid',
      paymentId: paymentRef.id,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      success: true,
      verified: true,
      payment: {
        id: paymentRef.id,
        ...paymentData
      }
    };
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError(
      'internal',
      error.message || 'Payment verification failed'
    );
  }
});

/**
 * Get Payment Status
 * 
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


import React, { useEffect, useState, useRef } from "react";
import { getDecryptedUser } from "../../components/common/CommonFunctions";
import { Toast } from "primereact/toast";
import { createRazorpayOrder, verifyRazorpayPayment, getRazorpayKeyId, isTestMode } from "../../api/razorpayAPI";
import { savePaymentRecord, PaymentStatus } from "../../services/paymentService";

/**
 * Razorpay Payment Component
 * 
 * Production-ready Razorpay payment integration with:
 * - Secure backend order creation
 * - Payment verification
 * - Firebase storage
 * - Comprehensive error handling
 * - Test/live mode support
 * 
 * @param {Object} props
 * @param {number} props.amount - Payment amount in rupees (default: 500)
 * @param {Function} props.onSuccess - Callback function when payment is successful
 * @param {Function} props.onError - Callback function when payment fails
 * @param {Function} props.onCancel - Callback function when payment is cancelled
 * @param {Object} props.userInfo - User information for prefill (optional)
 * @param {Object} props.metadata - Additional metadata for payment (optional)
 * @param {string} props.description - Payment description (optional)
 */
export default function RazorpayPayment({
  amount = 500,
  onSuccess,
  onError,
  onCancel,
  userInfo = null,
  metadata = {},
  description = "Payment for Additional Client Registration",
}) {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [orderCreating, setOrderCreating] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true);
    };
    script.onerror = () => {
      showError(
        "Failed to load Razorpay",
        "Payment gateway failed to load. Please refresh the page and try again."
      );
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Helper function to show error toast
  const showError = (summary, detail, life = 5000) => {
    toast.current?.show({
      severity: "error",
      summary,
      detail,
      life,
    });
  };

  // Helper function to show success toast
  const showSuccess = (summary, detail, life = 3000) => {
    toast.current?.show({
      severity: "success",
      summary,
      detail,
      life,
    });
  };

  // Helper function to show warning toast
  const showWarning = (summary, detail, life = 3000) => {
    toast.current?.show({
      severity: "warn",
      summary,
      detail,
      life,
    });
  };

  // Get user info for prefill
  const getUserInfo = () => {
    if (userInfo) return userInfo;
    const user = getDecryptedUser();
    return user || {};
  };

  // Validate Razorpay key
  const validateRazorpayKey = () => {
    const keyId = getRazorpayKeyId();
    if (!keyId) {
      showError(
        "Configuration Error",
        "Razorpay Key ID is not configured. Please check your environment variables."
      );
      return false;
    }

    // Warn if using test mode in production
    if (isTestMode() && process.env.NODE_ENV === 'production') {
      console.warn('Using Razorpay test keys in production mode');
    }

    return true;
  };

  // Handle payment initiation
  const handlePayment = async () => {
    // Validate Razorpay is loaded
    if (!razorpayLoaded) {
      showWarning(
        "Loading",
        "Payment gateway is loading. Please wait..."
      );
      return;
    }

    // Validate configuration
    if (!validateRazorpayKey()) {
      return;
    }

    // Validate amount
    if (!amount || amount <= 0) {
      showError(
        "Invalid Amount",
        "Payment amount must be greater than 0."
      );
      return;
    }

    setLoading(true);
    setOrderCreating(true);

    try {
      const user = getUserInfo();
      const razorpayKeyId = getRazorpayKeyId();

      // Create order on backend
      let orderData;
      try {
        orderData = await createRazorpayOrder(amount, 'INR', {
          purpose: description,
          userId: user?.userId || user?.id || 'unknown',
          userName: user?.fullName || 'Unknown User',
          ...metadata
        });
      } catch (orderError) {
        console.error('Order creation error:', orderError);
        throw new Error(
          orderError.message || 
          'Failed to create payment order. Please try again.'
        );
      }

      if (!orderData || !orderData.razorpayOrderId) {
        throw new Error('Invalid order data received from server');
      }

      setOrderCreating(false);

      // Razorpay payment options
      const options = {
        key: orderData.key || razorpayKeyId,
        amount: orderData.amountInPaise || amount * 100, // Amount in paise
        currency: orderData.currency || "INR",
        name: "Level Grit",
        description: description,
        order_id: orderData.razorpayOrderId,
        handler: async function (response) {
          await handlePaymentSuccess(response, orderData, user);
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.email || "",
          contact: user?.phoneNumber || "",
        },
        notes: {
          purpose: description,
          userId: user?.userId || user?.id || "",
          orderId: orderData.id,
          ...metadata
        },
        theme: {
          color: "#F37254",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            if (onCancel) {
              onCancel();
            }
          },
        },
      };

      // Validate Razorpay object
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not available');
      }

      const rzp = new window.Razorpay(options);

      // Handle payment failure
      rzp.on("payment.failed", function (response) {
        setLoading(false);
        handlePaymentFailure(response, orderData);
      });

      // Open Razorpay checkout
      rzp.open();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setOrderCreating(false);
      
      console.error('Payment initiation error:', error);
      
      const errorMsg = error?.message || 
        "Failed to initiate payment. Please try again.";
      
      showError("Payment Error", errorMsg);

      if (onError) {
        onError(error);
      }
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = async (response, orderData, user) => {
    setLoading(true);
    setVerifying(true);

    try {
      // Validate response
      if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
        throw new Error('Invalid payment response from Razorpay');
      }

      // Verify payment on backend
      let verificationResult;
      try {
        verificationResult = await verifyRazorpayPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        });
      } catch (verifyError) {
        console.error('Payment verification error:', verifyError);
        throw new Error(
          verifyError.message || 
          'Payment verification failed. Please contact support if amount was deducted.'
        );
      }

      // Check verification result
      if (!verificationResult || !verificationResult.verified) {
        throw new Error(
          verificationResult?.message || 
          'Payment verification failed. Please contact support.'
        );
      }

      // Save payment record to Firebase
      let paymentRecord;
      try {
        paymentRecord = await savePaymentRecord({
          userId: user?.userId || user?.id || 'unknown',
          userName: user?.fullName || 'Unknown User',
          userEmail: user?.email || '',
          paymentId: response.razorpay_payment_id,
          orderId: orderData.id,
          razorpayOrderId: response.razorpay_order_id,
          amount: amount,
          currency: 'INR',
          status: PaymentStatus.SUCCESS,
          signature: response.razorpay_signature,
          verified: true,
          metadata: {
            purpose: description,
            ...metadata
          },
          paymentDate: new Date().toISOString()
        });
      } catch (saveError) {
        console.error('Error saving payment record:', saveError);
        // Don't fail the payment if save fails - payment is already verified
        showWarning(
          "Payment Successful",
          "Payment completed but failed to save record. Please contact support."
        );
      }

      showSuccess(
        "Payment Successful",
        `Payment of ₹${amount} completed successfully!`
      );

      // Call success callback
      if (onSuccess) {
        onSuccess({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          razorpayOrderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
          paymentRecord: paymentRecord || verificationResult.payment,
          verified: true
        });
      }
    } catch (error) {
      console.error('Payment success handler error:', error);
      
      const errorMsg = error?.message || 
        "Payment processing failed. Please contact support if amount was deducted.";
      
      showError("Payment Processing Error", errorMsg);

      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
      setVerifying(false);
    }
  };

  // Handle payment failure
  const handlePaymentFailure = (response, orderData) => {
    const errorMsg = response.error?.description || 
      response.error?.reason || 
      "Payment failed. Please try again.";

    console.error('Payment failed:', response);

    showError("Payment Failed", errorMsg);

    // Optionally save failed payment record
    const user = getUserInfo();
    savePaymentRecord({
      userId: user?.userId || user?.id || 'unknown',
      userName: user?.fullName || 'Unknown User',
      userEmail: user?.email || '',
      paymentId: response.error?.metadata?.payment_id || null,
      orderId: orderData.id,
      razorpayOrderId: orderData.razorpayOrderId,
      amount: amount,
      currency: 'INR',
      status: PaymentStatus.FAILED,
      verified: false,
      metadata: {
        error: response.error,
        purpose: description,
        ...metadata
      },
      paymentDate: new Date().toISOString()
    }).catch(err => {
      console.error('Error saving failed payment record:', err);
    });

    if (onError) {
      onError(new Error(errorMsg));
    }
  };

  // Get button text based on state
  const getButtonText = () => {
    if (verifying) {
      return "Verifying Payment...";
    }
    if (orderCreating) {
      return "Creating Order...";
    }
    if (loading) {
      return "Processing...";
    }
    return `Pay ₹${amount}`;
  };

  // Show test mode indicator
  const testModeIndicator = isTestMode() ? (
    <small className="d-block text-muted mt-1" style={{ fontSize: '0.75rem' }}>
      <i className="fas fa-info-circle me-1"></i>
      Test Mode
    </small>
  ) : null;

  return (
    <>
      <Toast ref={toast} position="top-right" />
      <div>
        <button
          onClick={handlePayment}
          disabled={loading || !razorpayLoaded || orderCreating || verifying}
          className="btn btn-primary"
          style={{
            minHeight: "44px",
            fontSize: "1rem",
            fontWeight: "600",
            opacity: (loading || !razorpayLoaded || orderCreating || verifying) ? 0.7 : 1,
            cursor: (loading || !razorpayLoaded || orderCreating || verifying) ? 'not-allowed' : 'pointer'
          }}
        >
          {loading || orderCreating || verifying ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              {getButtonText()}
            </>
          ) : (
            <>
              <i className="fas fa-credit-card me-2"></i>
              {getButtonText()}
            </>
          )}
        </button>
        {testModeIndicator}
      </div>
    </>
  );
}

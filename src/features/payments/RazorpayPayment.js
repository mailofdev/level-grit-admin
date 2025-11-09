import React, { useEffect, useState, useRef } from "react";
import { getDecryptedUser } from "../../components/common/CommonFunctions";
import { Toast } from "primereact/toast";
import { savePayment } from "../../utils/paymentStorage";

/**
 * Razorpay Payment Component
 * Handles Razorpay payment integration for trainer client registration
 * 
 * @param {Object} props
 * @param {number} props.amount - Payment amount in rupees (default: 500)
 * @param {Function} props.onSuccess - Callback function when payment is successful
 * @param {Function} props.onError - Callback function when payment fails
 * @param {Function} props.onCancel - Callback function when payment is cancelled
 * @param {Object} props.userInfo - User information for prefill (optional)
 */
export default function RazorpayPayment({
  amount = 500,
  onSuccess,
  onError,
  onCancel,
  userInfo = null,
}) {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

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
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load Razorpay. Please refresh the page.",
        life: 5000,
      });
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Get user info for prefill
  const getUserInfo = () => {
    if (userInfo) return userInfo;
    const user = getDecryptedUser();
    return user || {};
  };

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      toast.current?.show({
        severity: "warn",
        summary: "Loading",
        detail: "Payment gateway is loading. Please wait...",
        life: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const user = getUserInfo();
      
      // Generate order ID for frontend-only integration
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Use Razorpay Key ID from environment or default test key
      // Note: For production, this should come from backend for security
      const razorpayKeyId = process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_1DP5mmOlF5G5ag";
      
      // Razorpay payment options (frontend-only)
      const options = {
        key: razorpayKeyId,
        amount: amount * 100, // Amount in paise
        currency: "INR",
        name: "Level Grit",
        description: "Payment for Additional Client Registration",
        order_id: orderId,
        handler: async function (response) {
          try {
            setLoading(true);
            
            // Save payment to localStorage
            const paymentRecord = savePayment({
              trainerId: user?.userId || user?.id || "unknown",
              trainerName: user?.fullName || "Unknown Trainer",
              trainerEmail: user?.email || "",
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              amount: amount,
              paymentDate: new Date().toISOString(),
            });

            toast.current?.show({
              severity: "success",
              summary: "Payment Successful",
              detail: `Payment of ₹${amount} completed successfully!`,
              life: 3000,
            });
            
            // Call success callback
            if (onSuccess) {
              onSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                paymentRecord,
              });
            }
          } catch (error) {
            const errorMsg =
              error?.message ||
              "Failed to save payment record";
            
            toast.current?.show({
              severity: "error",
              summary: "Payment Record Error",
              detail: errorMsg,
              life: 5000,
            });

            if (onError) {
              onError(error);
            }
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.email || "",
          contact: user?.phoneNumber || "",
        },
        notes: {
          purpose: "Additional Client Registration",
          trainerId: user?.userId || user?.id || "",
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

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setLoading(false);
        const errorMsg = response.error?.description || "Payment failed. Please try again.";
        
        toast.current?.show({
          severity: "error",
          summary: "Payment Failed",
          detail: errorMsg,
          life: 5000,
        });

        if (onError) {
          onError(new Error(errorMsg));
        }
      });
      
      rzp.open();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const errorMsg =
        error?.message ||
        "Failed to initiate payment. Please try again.";

      toast.current?.show({
        severity: "error",
        summary: "Payment Error",
        detail: errorMsg,
        life: 5000,
      });

      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <>
      <Toast ref={toast} position="top-right" />
      <button
        onClick={handlePayment}
        disabled={loading || !razorpayLoaded}
        className="btn btn-primary"
        style={{
          minHeight: "44px",
          fontSize: "1rem",
          fontWeight: "600",
        }}
      >
        {loading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
            ></span>
            Processing...
          </>
        ) : (
          <>
            <i className="fas fa-credit-card me-2"></i>
            Pay ₹{amount}
          </>
        )}
      </button>
    </>
  );
}

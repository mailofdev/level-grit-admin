import React, { useEffect, useState, useRef } from "react";
import { getDecryptedUser } from "../../components/common/CommonFunctions";
import { Toast } from "primereact/toast";
import { savePayment } from "../../utils/paymentStorage";

/**
 * Razorpay Payment Component
 * Handles Razorpay payment integration for trainer client registration
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

  // ✅ Load Razorpay script
  useEffect(() => {
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
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
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // ✅ Get user info
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

      // ✅ Get Razorpay Key ID
      const razorpayKeyId =
        process.env.REACT_APP_RAZORPAY_KEY_ID ||
        window.REACT_APP_RAZORPAY_KEY_ID ||
        "rzp_test_1DP5mmOlF5G5ag"; // fallback for testing

      console.log(
        "Razorpay Key ID loaded:",
        razorpayKeyId ? `${razorpayKeyId.substring(0, 10)}...` : "NOT FOUND"
      );

      if (!razorpayKeyId || typeof razorpayKeyId !== "string") {
        throw new Error(
          "Razorpay Key ID is not configured. Please set REACT_APP_RAZORPAY_KEY_ID in your environment variables."
        );
      }

      const trimmedKey = razorpayKeyId.trim();

      if (trimmedKey === "") {
        throw new Error(
          "Razorpay Key ID is empty. Please set REACT_APP_RAZORPAY_KEY_ID with a valid Razorpay test key."
        );
      }

      if (
        !trimmedKey.startsWith("rzp_test_") &&
        !trimmedKey.startsWith("rzp_live_")
      ) {
        console.warn(
          "⚠️ Razorpay Key ID format may be invalid. Expected rzp_test_* or rzp_live_*"
        );
      }

      const receiptId = `receipt_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const options = {
        key: trimmedKey,
        amount: amount * 100, // amount in paise
        currency: "INR",
        name: "Level Grit",
        description: "Payment for Additional Client Registration",
        handler: async function (response) {
          try {
            setLoading(true);

            const localOrderId = `order_${Date.now()}_${Math.random()
              .toString(36)
              .substr(2, 9)}`;

            const paymentRecord = savePayment({
              trainerId: user?.userId || user?.id || "unknown",
              trainerName: user?.fullName || "Unknown Trainer",
              trainerEmail: user?.email || "",
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id || localOrderId,
              amount,
              paymentDate: new Date().toISOString(),
              receiptId,
            });

            toast.current?.show({
              severity: "success",
              summary: "Payment Successful",
              detail: `Payment of ₹${amount} completed successfully!`,
              life: 3000,
            });

            if (onSuccess) {
              onSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id || localOrderId,
                paymentRecord,
              });
            }
          } catch (error) {
            const errorMsg = error?.message || "Failed to save payment record";

            toast.current?.show({
              severity: "error",
              summary: "Payment Record Error",
              detail: errorMsg,
              life: 5000,
            });

            if (onError) onError(error);
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
          receipt: receiptId,
        },
        theme: {
          color: "#F37254",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            if (onCancel) onCancel();
          },
        },
      };

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay SDK is not loaded. Please refresh the page and try again."
        );
      }

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        setLoading(false);
        const errorMsg =
          response.error?.description ||
          response.error?.reason ||
          "Payment failed. Please try again.";

        console.error("Razorpay payment failed:", response);

        toast.current?.show({
          severity: "error",
          summary: "Payment Failed",
          detail: errorMsg,
          life: 5000,
        });

        if (onError) onError(new Error(errorMsg));
      });

      rzp.open();
    } catch (error) {
      console.error("Razorpay initialization error:", error);

      let errorMsg =
        error?.message || "Failed to initiate payment. Please try again.";

      if (errorMsg.includes("Key ID") || errorMsg.includes("not configured")) {
        errorMsg +=
          " Make sure to set REACT_APP_RAZORPAY_KEY_ID in your .env file and restart the development server.";
      }

      toast.current?.show({
        severity: "error",
        summary: "Payment Error",
        detail: errorMsg,
        life: 6000,
      });

      if (onError) onError(error);
    } finally {
      setLoading(false);
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

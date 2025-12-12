import React, { useState, useRef } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { Toast } from "primereact/toast";
import { createOrder, verifyPayment } from "../../services/payments.api";
import { loadRazorpayScript } from "../../utils/razorpayLoader";

/**
 * Payment Popup Component
 * 
 * Shows a modal popup for client activation payment.
 * Handles the complete Razorpay payment flow:
 * 1. Create order via API
 * 2. Open Razorpay checkout
 * 3. Verify payment
 * 4. Call onSuccess callback
 * 
 * @param {Object} props
 * @param {boolean} props.show - Whether to show the modal
 * @param {Function} props.onHide - Callback to hide the modal
 * @param {Function} props.onSuccess - Callback when payment is successful
 * @param {number} props.clientId - Client ID for which payment is being made
 * @param {string} props.clientName - Client name (for display)
 * @param {number} props.amount - Payment amount in rupees (default: 500)
 */
const PaymentPopup = ({
  show,
  onHide,
  onSuccess,
  clientId,
  clientName = "",
  amount = 500,
}) => {
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const toast = useRef(null);

  const showToast = (severity, summary, detail) => {
    if (toast.current) {
      toast.current.show({ severity, summary, detail, life: 4000 });
    }
  };

  const handlePayment = async () => {
    if (!clientId) {
      showToast("error", "Error", "Client ID is required for payment.");
      return;
    }

    try {
      setLoading(true);
      setProcessing(true);

      if (process.env.NODE_ENV === 'development') {
        console.log("Starting payment process for clientId:", clientId);
      }

      // Load Razorpay script first
      if (process.env.NODE_ENV === 'development') {
        console.log("Loading Razorpay script...");
      }
      await loadRazorpayScript();

      if (!window.Razorpay) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Razorpay not available after loading script");
        }
        throw new Error("Failed to load Razorpay. Please check your internet connection.");
      }
      if (process.env.NODE_ENV === 'development') {
        console.log("Razorpay script loaded successfully");
      }

      // Create order via backend
      if (process.env.NODE_ENV === 'development') {
        console.log("Creating order...", { clientId, amount, currency: "INR" });
      }
      const orderResponse = await createOrder({
        clientId: clientId,
        amount: amount,
        currency: "INR",
        receipt: `receipt_${clientId}_${Date.now()}`,
      });

      if (process.env.NODE_ENV === 'development') {
        console.log("Order response received:", orderResponse);
      }

      // Handle both camelCase (orderId) and snake_case (order_id)
      const orderId = orderResponse?.orderId || orderResponse?.order_id;
      
      if (!orderId) {
        if (process.env.NODE_ENV === 'development') {
          console.error("No order ID in response:", orderResponse);
        }
        throw new Error("Failed to create order. Order ID not received from server.");
      }

      // Get Razorpay key - backend may provide key_id or keyId, otherwise use env var
      const razorpayKey = orderResponse?.key_id 
        || orderResponse?.keyId 
        || process.env.REACT_APP_RAZORPAY_KEY_ID;

      if (process.env.NODE_ENV === 'development') {
        console.log("Razorpay key check:", {
          hasKeyInResponse: !!(orderResponse?.key_id || orderResponse?.keyId),
          hasEnvKey: !!process.env.REACT_APP_RAZORPAY_KEY_ID,
          finalKey: razorpayKey ? "***" : "MISSING"
        });
      }

      if (!razorpayKey) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Razorpay key not found in response and no env var set");
        }
        throw new Error("Razorpay configuration missing. Please check environment variables or contact support.");
      }

      if (process.env.NODE_ENV === 'development') {
        console.log("Opening Razorpay checkout with orderId:", orderId);
      }

      // Calculate amount in paise for Razorpay
      // CRITICAL: Razorpay expects amount in smallest currency unit (paise for INR)
      // ₹500 = 50000 paise
      // 
      // IMPORTANT: The amount passed to Razorpay.open() MUST match the order amount exactly
      // Backend MUST create the Razorpay order with amount: 50000 (paise)
      // If backend creates order with 500 (paise), it will charge ₹5 instead of ₹500
      
      // Always use 50000 paise for ₹500 to ensure correct amount is charged
      // This ensures we charge the correct amount regardless of what backend returns
      const amountInPaise = Math.round(amount * 100); // ₹500 = 50000 paise
      
      // Validate amount
      if (amount === 500 && amountInPaise !== 50000) {
        const errorMsg = `❌ CRITICAL ERROR: Amount calculation failed! Expected 50000 paise for ₹500, but got ${amountInPaise} paise (₹${amountInPaise / 100}). Payment cannot proceed.`;
        if (process.env.NODE_ENV === 'development') {
          console.error(errorMsg);
        }
        throw new Error(`Payment amount error: Cannot calculate correct amount. Expected ₹500 but got ₹${amountInPaise / 100}. Please contact support.`);
      }
      
      // Warn if order response has different amount
      if (process.env.NODE_ENV === 'development' && orderResponse?.amount && orderResponse.amount !== amount && orderResponse.amount !== amountInPaise) {
        console.warn(`⚠️ Warning: Order response amount (${orderResponse.amount}) differs from expected (${amount} rupees / ${amountInPaise} paise). Using expected amount: ${amountInPaise} paise.`);
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log("Amount calculation:", {
          expectedAmount: `₹${amount} = ${amountInPaise} paise`,
          orderResponseAmount: orderResponse?.amount,
          finalAmountInPaise: amountInPaise,
          note: "Using expected amount to ensure correct charge"
        });
      }

      // CRITICAL: Amount must match the order amount exactly
      // If backend created order with wrong amount, payment will fail or charge wrong amount
      // Ensure backend creates order with: amount * 100 (rupees to paise conversion)
      
      // Prepare Razorpay options
      const options = {
        key: razorpayKey,
        amount: amountInPaise, // Amount in paise - MUST match order amount (₹500 = 50000 paise)
        currency: orderResponse?.currency || "INR",
        name: "Level Grit",
        description: `Payment for client activation: ${clientName || "Client"}`,
        order_id: orderId,
        handler: async function (response) {
          // Payment successful, verify payment
          try {
            setLoading(true);
            
            const verifyResponse = await verifyPayment({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyResponse?.success !== false) {
              showToast("success", "Payment Successful", "Client activation payment completed successfully!");
              onHide();
              if (onSuccess) {
                onSuccess({
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  ...verifyResponse,
                });
              }
            } else {
              throw new Error(verifyResponse?.message || "Payment verification failed");
            }
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error("Payment verification error:", error);
            }
            showToast(
              "error",
              "Verification Failed",
              error?.response?.data?.message || error?.message || "Payment verification failed. Please contact support."
            );
          } finally {
            setLoading(false);
            setProcessing(false);
          }
        },
        prefill: {
          // Optional: Prefill user details if available
        },
        theme: {
          color: "var(--color-primary)", // HealthifyMe primary color
        },
        modal: {
          ondismiss: function () {
            // User closed the Razorpay modal
            setLoading(false);
            setProcessing(false);
            showToast("info", "Payment Cancelled", "Payment was cancelled. You can retry later.");
          },
        },
      };

      // Open Razorpay checkout
      if (process.env.NODE_ENV === 'development') {
        console.log("Razorpay options:", { 
          ...options, 
          key: "***",
          amount: options.amount,
          currency: options.currency,
          order_id: options.order_id
        });
      }
      
      try {
        const razorpay = new window.Razorpay(options);
        
        razorpay.on("payment.failed", function (response) {
          if (process.env.NODE_ENV === 'development') {
            console.error("Payment failed:", response);
          }
          setLoading(false);
          setProcessing(false);
          
          // Handle specific error types
          let errorMessage = "Payment failed. Please try again.";
          
          if (response.error) {
            const error = response.error;
            if (process.env.NODE_ENV === 'development') {
              console.error("Razorpay error details:", error);
            }
            
            // Handle international transaction error
            if (error.reason === "international_transaction_not_allowed") {
              errorMessage = "International cards are not supported. Please use an Indian card or contact Razorpay support to enable international transactions in your account settings.";
            } else if (error.description) {
              errorMessage = error.description;
            } else if (error.message) {
              errorMessage = error.message;
            }
          }
          
          showToast(
            "error",
            "Payment Failed",
            errorMessage
          );
        });

        razorpay.on("payment.authorized", function (response) {
          if (process.env.NODE_ENV === 'development') {
            console.log("Payment authorized:", response);
          }
        });

        razorpay.on("payment.cancelled", function (response) {
          if (process.env.NODE_ENV === 'development') {
            console.log("Payment cancelled:", response);
          }
          setLoading(false);
          setProcessing(false);
          showToast(
            "info",
            "Payment Cancelled",
            "Payment was cancelled. You can try again later."
          );
        });

        if (process.env.NODE_ENV === 'development') {
          console.log("Attempting to open Razorpay checkout...");
        }
        razorpay.open();
        if (process.env.NODE_ENV === 'development') {
          console.log("Razorpay checkout opened successfully");
        }
      } catch (razorpayError) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Error opening Razorpay checkout:", razorpayError);
        }
        throw new Error(`Failed to open payment gateway: ${razorpayError.message}`);
      }
      
      setLoading(false);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Payment initiation error:", error);
        console.error("Error details:", {
          message: error?.message,
          response: error?.response?.data,
          status: error?.response?.status,
        });
      }
      showToast(
        "error",
        "Payment Error",
        error?.response?.data?.message || error?.message || "Failed to initiate payment. Please try again."
      );
      setLoading(false);
      setProcessing(false);
    }
  };

  const handleClose = () => {
    if (!processing) {
      onHide();
    }
  };

  return (
    <>
      <Toast ref={toast} position="top-right" />
      
      <Modal
        show={show}
        onHide={handleClose}
        centered
        backdrop={processing ? "static" : true}
        keyboard={!processing}
      >
        <Modal.Header closeButton={!processing}>
          <Modal.Title className="d-flex align-items-center gap-2">
            <i className="fas fa-credit-card text-primary"></i>
            Enable Client Services
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <div className="text-center mb-4">
            <div className="mb-3">
              <i
                className="fas fa-user-check"
                style={{
                  fontSize: "4rem",
                  color: "var(--color-primary)",
                  opacity: 0.8,
                }}
              ></i>
            </div>
            
            <h5 className="fw-bold mb-3">
              {clientName ? `Activate services for ${clientName}` : "Activate Client Services"}
            </h5>
            
            <p className="text-muted mb-4">
              To enable services for this client, please complete the payment of <strong className="text-dark">₹{amount}</strong>.
            </p>

            <div className="alert alert-info mb-0">
              <i className="fas fa-info-circle me-2"></i>
              <small>
                Payment will be processed securely through Razorpay. 
                {clientName && ` Client: ${clientName}`}
              </small>
            </div>
          </div>
        </Modal.Body>
        
        <Modal.Footer className="border-0 justify-content-center">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={processing || loading}
            className="px-4"
          >
            {processing ? "Processing..." : "Cancel"}
          </Button>
          
          <Button
            variant="primary"
            onClick={handlePayment}
            disabled={processing || loading}
            className="px-5 fw-semibold"
            style={{ minHeight: "44px" }}
          >
            {loading || processing ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  className="me-2"
                />
                Processing...
              </>
            ) : (
              <>
                <i className="fas fa-credit-card me-2"></i>
                Pay ₹{amount}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PaymentPopup;


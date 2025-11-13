import React from "react";

/**
 * Razorpay Payment Component (UI Only)
 * 
 * This component displays the payment UI but shows "Work in Progress" alert on click.
 * All Razorpay logic has been removed.
 * 
 * @param {Object} props
 * @param {number} props.amount - Payment amount in rupees (default: 500)
 * @param {Function} props.onSuccess - Callback function when payment is successful (not used)
 * @param {Function} props.onError - Callback function when payment fails (not used)
 * @param {Function} props.onCancel - Callback function when payment is cancelled (not used)
 * @param {Object} props.userInfo - User information for prefill (optional, not used)
 * @param {Object} props.metadata - Additional metadata for payment (optional, not used)
 * @param {string} props.description - Payment description (optional, not used)
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
  // Handle payment button click - show alert
  const handlePayment = () => {
    alert("Work in progress");
  };

  // Get button text
  const getButtonText = () => {
    return `Pay ₹${amount}`;
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        className="btn btn-primary"
        style={{
          minHeight: "44px",
          fontSize: "1rem",
          fontWeight: "600",
          cursor: "pointer"
        }}
      >
        <i className="fas fa-credit-card me-2"></i>
        {getButtonText()}
      </button>
    </div>
  );
}

import React from "react";

// Mock data for frontend testing (replace with real API data later)
const MOCK_ORDER_ID = "order_mock123";
const MOCK_KEY_ID = "rzp_test_your_key_id";

export default function RazorpayPayment() {

  const handlePayment = () => {
    // Payment options
    const options = {
      key: MOCK_KEY_ID, // Replace with key_id from backend
      amount: 500 * 100, // Amount in paise (₹500)
      currency: "INR",
      name: "Level Grit",
      description: "Fitness Plan Payment",
      order_id: MOCK_ORDER_ID, // Replace with real order_id from backend
      handler: function (response) {
        // Payment successful
        alert(`Payment Successful!\nPayment ID: ${response.razorpay_payment_id}`);
        // Later: send response.razorpay_payment_id to backend to verify signature
      },
      prefill: {
        name: "John Doe",
        email: "john@example.com",
        contact: "9999999999",
      },
      notes: {
        plan: "Premium Fitness Plan",
      },
      theme: {
        color: "#F37254",
      },
      modal: {
        ondismiss: function () {
          alert("Payment popup closed");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <button
        onClick={handlePayment}
        style={{
          padding: "12px 30px",
          fontSize: "16px",
          backgroundColor: "#F37254",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Pay ₹500
      </button>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { Card } from "react-bootstrap";

export default function Messages() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = e.target.message.value.trim();

    if (message) {
      console.log("Message Sent:", message);
      setAlert({ type: "success", text: "Message sent successfully!" });
    } else {
      setAlert({ type: "danger", text: "Message cannot be empty!" });
    }

    // Auto-hide alert after 2 seconds
    setTimeout(() => {
      setAlert(null);
      navigate(-1);
    }, 2000);
  };

  return (
    <div className="container py-4">
      {/* Header with Back + Page Name */}
      <div className="d-flex align-items-center mb-4">
        <button
          className="btn btn-outline-secondary btn-sm me-2"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="me-1" /> Back
        </button>
        <h4 className="mb-0">Messages</h4>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
          {alert.text}
        </div>
      )}

      {/* Form */}
  <Card className="shadow-sm border-0 rounded-4 p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="message" className="form-label fw-semibold">
              Write a message
            </label>
            <textarea
              id="message"
              name="message"
              className="form-control"
              rows="5"
              placeholder="Type your message here..."
            />
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Send
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

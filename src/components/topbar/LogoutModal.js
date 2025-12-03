import React from "react";
import { FaSignOutAlt } from "react-icons/fa";

const LogoutModal = ({ show, onCancel, onConfirm }) => {
  if (!show) return null;

  return (
    <div
      className="modal fade show"
      tabIndex="-1"
      style={{
        display: "block",
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(5px)",
        zIndex: 1055,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content border-0 shadow-lg"
            style={{
              borderRadius: "1rem",
              background: "var(--color-card-bg)",
            }}
          >
          {/* Header */}
          <div
            className="modal-header text-white border-0"
            style={{
              background: "linear-gradient(135deg, var(--color-primary) 0%, #008066 100%)",
              borderTopLeftRadius: "1rem",
              borderTopRightRadius: "1rem",
            }}
          >
            <h5 className="modal-title d-flex align-items-center gap-2">
              <FaSignOutAlt className="fs-4" />
              Confirm Logout
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onCancel}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body text-center py-4">
            <p className="fw-semibold fs-5 mb-2">
              Do you want to log out?
            </p>
            <p className="text-muted mb-0">
              You will need to log in again to access your dashboard.
            </p>
          </div>

          {/* Footer */}
          <div
            className="modal-footer border-0 justify-content-center"
            style={{ backgroundColor: "var(--color-card-bg)" }}
          >
            <button
              type="button"
              className="btn btn-outline-secondary fw-semibold px-4"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn fw-semibold px-4"
              style={{
                background: "var(--color-primary)",
                borderColor: "var(--color-primary)",
                color: "var(--color-button-text)",
                minHeight: "44px",
              }}
              onClick={onConfirm}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;

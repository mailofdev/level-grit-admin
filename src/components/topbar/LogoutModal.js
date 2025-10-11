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
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content border-0 shadow-lg"
          style={{
            borderRadius: "1rem",
            background: "#f7f8f8",
          }}
        >
          {/* Header */}
          <div
            className="modal-header text-white border-0"
            style={{
              background: "linear-gradient(135deg, #36d198, #07976a)",
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
            <p className="fw-semibold fs-5">
              Are you sure you want to logout?
            </p>
            <p className="text-muted">
              You will need to log in again to access your dashboard.
            </p>
          </div>

          {/* Footer */}
          <div
            className="modal-footer border-0 justify-content-center"
            style={{ backgroundColor: "#f1fcf8" }}
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
              className="btn btn-danger fw-semibold px-4"
              style={{
                background: "#ef4343",
                borderColor: "#ef4343",
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

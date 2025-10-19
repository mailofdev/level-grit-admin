import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";

const alertTypeMap = {
  success: "alert-success",
  danger: "alert-danger",
  warning: "alert-warning",
  info: "alert-info",
};

const AlertMessage = ({
  type = "info",
  messages = [],
  onClose,
  autoClose = true,
  duration = 5000,
  position = "top-right",
}) => {
  useEffect(() => {
    if (autoClose && messages && messages.length > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose, messages]);

  if (!messages || messages.length === 0) return null;

  const positionClasses = {
    "top-right": "top-0 end-0",
    "top-left": "top-0 start-0",
    "bottom-right": "bottom-0 end-0",
    "bottom-left": "bottom-0 start-0",
  };

  return (
    <div
      className={`position-fixed p-3 ${positionClasses[position]}`}
      style={{ zIndex: 1080 }}
    >
      <div
        className={`card content-wrapper alert ${alertTypeMap[type]} alert-dismissible fade show shadow smooth-transition`}
        role="alert"
      >
        <div className="d-flex flex-column flex-md-row align-items-md-center">
          <div className="flex-grow-1">
            {Array.isArray(messages) ? (
              <ul className="mb-0 ps-3">
                {messages.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            ) : (
              <span>{messages}</span>
            )}
          </div>
          {onClose && (
            <button
              type="button"
              className="btn-close ms-md-3 mt-2 mt-md-0"
              aria-label="Close"
              onClick={onClose}
            >
              <X size={26} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

AlertMessage.propTypes = {
  type: PropTypes.oneOf(["success", "danger", "warning", "info"]),
  messages: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  onClose: PropTypes.func,
  autoClose: PropTypes.bool,
  duration: PropTypes.number,
  position: PropTypes.oneOf([
    "top-right",
    "top-left",
    "bottom-right",
    "bottom-left",
  ]),
};

export default AlertMessage;

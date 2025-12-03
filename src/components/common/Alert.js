import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaExclamationTriangle, 
  FaInfoCircle,
  FaTimes 
} from "react-icons/fa";
import PropTypes from "prop-types";

/**
 * Alert Component
 * 
 * A reusable, styled alert component for displaying messages throughout the application.
 * Supports error (red), success (green), warning (yellow), and info (blue) types.
 * 
 * @param {string} type - Alert type: 'error', 'success', 'warning', 'info'
 * @param {string|ReactNode} message - Alert message to display
 * @param {string} title - Optional title for the alert
 * @param {boolean} dismissible - Whether the alert can be dismissed
 * @param {function} onClose - Callback when alert is closed
 * @param {boolean} autoClose - Whether to auto-close after duration
 * @param {number} duration - Auto-close duration in milliseconds
 * @param {string} position - Position for fixed alerts: 'top-right', 'top-left', 'bottom-right', 'bottom-left', 'inline'
 * @param {string} className - Additional CSS classes
 */
const Alert = ({
  type = "info",
  message = "",
  title = null,
  dismissible = true,
  onClose = null,
  autoClose = false,
  duration = 5000,
  position = "inline",
  className = "",
}) => {
  // Alert configuration based on type
  const alertConfig = {
    error: {
      icon: FaExclamationCircle,
      bgColor: "rgba(220, 53, 69, 0.1)",
      borderColor: "#dc3545",
      textColor: "#dc3545",
      iconColor: "#dc3545",
      iconBg: "rgba(220, 53, 69, 0.15)",
    },
    success: {
      icon: FaCheckCircle,
      bgColor: "rgba(0, 160, 128, 0.1)",
      borderColor: "var(--color-primary)",
      textColor: "var(--color-primary)",
      iconColor: "var(--color-primary)",
      iconBg: "rgba(0, 160, 128, 0.15)",
    },
    warning: {
      icon: FaExclamationTriangle,
      bgColor: "rgba(255, 193, 7, 0.1)",
      borderColor: "#ffc107",
      textColor: "#856404",
      iconColor: "#ffc107",
      iconBg: "rgba(255, 193, 7, 0.15)",
    },
    info: {
      icon: FaInfoCircle,
      bgColor: "rgba(0, 160, 128, 0.1)",
      borderColor: "var(--color-primary)",
      textColor: "var(--color-primary)",
      iconColor: "var(--color-primary)",
      iconBg: "rgba(0, 160, 128, 0.15)",
    },
  };

  const config = alertConfig[type] || alertConfig.info;
  const Icon = config.icon;

  // Auto-close effect
  React.useEffect(() => {
    if (autoClose && onClose && message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose, message]);

  // Don't render if no message
  if (!message) return null;

  // Position classes for fixed positioning
  const positionClasses = {
    "top-right": "position-fixed top-0 end-0 p-3",
    "top-left": "position-fixed top-0 start-0 p-3",
    "bottom-right": "position-fixed bottom-0 end-0 p-3",
    "bottom-left": "position-fixed bottom-0 start-0 p-3",
    "inline": "",
  };

  const alertContent = (
    <motion.div
      initial={{ opacity: 0, y: position !== "inline" ? -20 : 0, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`${positionClasses[position]} ${className}`}
      style={{
        zIndex: position !== "inline" ? 1080 : "auto",
        maxWidth: position !== "inline" ? "400px" : "100%",
      }}
    >
      <div
        className="d-flex align-items-start gap-3 p-3 rounded-3 shadow-sm"
        style={{
          backgroundColor: config.bgColor,
          borderLeft: `4px solid ${config.borderColor}`,
          border: `1px solid ${config.borderColor}40`,
          borderRadius: "0.75rem",
        }}
        role="alert"
      >
        {/* Icon */}
        <div
          className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-circle"
          style={{
            width: "40px",
            height: "40px",
            backgroundColor: config.iconBg,
            color: config.iconColor,
          }}
        >
          <Icon size={20} />
        </div>

        {/* Content */}
        <div className="flex-grow-1" style={{ color: config.textColor }}>
          {title && (
            <h6
              className="fw-bold mb-2"
              style={{
                color: config.textColor,
                fontSize: "0.95rem",
              }}
            >
              {title}
            </h6>
          )}
          <div
            style={{
              fontSize: "0.9rem",
              lineHeight: "1.5",
            }}
          >
            {typeof message === "string" ? (
              <p className="mb-0">{message}</p>
            ) : (
              message
            )}
          </div>
        </div>

        {/* Close Button */}
        {dismissible && onClose && (
          <button
            type="button"
            className="btn-close flex-shrink-0"
            aria-label="Close"
            onClick={onClose}
            style={{
              opacity: 0.7,
              filter: `brightness(0) saturate(100%) invert(${
                type === "error" ? "27%" : type === "success" ? "40%" : "50%"
              })`,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
          />
        )}
      </div>
    </motion.div>
  );

  // Wrap in AnimatePresence if dismissible
  if (dismissible && onClose) {
    return <AnimatePresence>{message && alertContent}</AnimatePresence>;
  }

  return alertContent;
};

Alert.propTypes = {
  type: PropTypes.oneOf(["error", "success", "warning", "info"]),
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  title: PropTypes.string,
  dismissible: PropTypes.bool,
  onClose: PropTypes.func,
  autoClose: PropTypes.bool,
  duration: PropTypes.number,
  position: PropTypes.oneOf([
    "top-right",
    "top-left",
    "bottom-right",
    "bottom-left",
    "inline",
  ]),
  className: PropTypes.string,
};

export default Alert;


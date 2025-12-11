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
  // Alert configuration based on type - Enhanced with modern styling
  const alertConfig = {
    error: {
      icon: FaExclamationCircle,
      bgColor: "linear-gradient(135deg, rgba(220, 53, 69, 0.08) 0%, rgba(220, 53, 69, 0.12) 100%)",
      borderColor: "#dc3545",
      textColor: "#dc3545",
      iconColor: "#ffffff",
      iconBg: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
      shadowColor: "rgba(220, 53, 69, 0.25)",
      titleColor: "#b02a37",
    },
    success: {
      icon: FaCheckCircle,
      bgColor: "linear-gradient(135deg, rgba(0, 160, 128, 0.08) 0%, rgba(0, 160, 128, 0.12) 100%)",
      borderColor: "var(--color-primary)",
      textColor: "#0a7c6b",
      iconColor: "#ffffff",
      iconBg: "linear-gradient(135deg, var(--color-primary) 0%, #008a6e 100%)",
      shadowColor: "rgba(0, 160, 128, 0.25)",
      titleColor: "#0a7c6b",
    },
    warning: {
      icon: FaExclamationTriangle,
      bgColor: "linear-gradient(135deg, rgba(255, 193, 7, 0.08) 0%, rgba(255, 193, 7, 0.12) 100%)",
      borderColor: "#ffc107",
      textColor: "#856404",
      iconColor: "#ffffff",
      iconBg: "linear-gradient(135deg, #ffc107 0%, #e0a800 100%)",
      shadowColor: "rgba(255, 193, 7, 0.25)",
      titleColor: "#856404",
    },
    info: {
      icon: FaInfoCircle,
      bgColor: "linear-gradient(135deg, rgba(0, 160, 128, 0.08) 0%, rgba(0, 160, 128, 0.12) 100%)",
      borderColor: "var(--color-primary)",
      textColor: "#0a7c6b",
      iconColor: "#ffffff",
      iconBg: "linear-gradient(135deg, var(--color-primary) 0%, #008a6e 100%)",
      shadowColor: "rgba(0, 160, 128, 0.25)",
      titleColor: "#0a7c6b",
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
      initial={{ opacity: 0, y: position !== "inline" ? -20 : 0, scale: 0.95, x: position !== "inline" ? (position.includes("right") ? 20 : -20) : 0 }}
      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95, x: position !== "inline" ? (position.includes("right") ? 20 : -20) : 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className={`${positionClasses[position]} ${className}`}
      style={{
        zIndex: position !== "inline" ? 1080 : "auto",
        maxWidth: position !== "inline" ? "420px" : "100%",
      }}
    >
      <div
        className="d-flex align-items-start gap-3 p-3 rounded-4"
        style={{
          background: config.bgColor,
          borderLeft: `4px solid ${config.borderColor}`,
          border: `1px solid ${config.borderColor}30`,
          borderRadius: "0.875rem",
          boxShadow: `0 4px 12px ${config.shadowColor}, 0 2px 4px rgba(0, 0, 0, 0.08)`,
          backdropFilter: "blur(10px)",
          transition: "all 0.3s ease",
        }}
        role="alert"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = `0 6px 16px ${config.shadowColor}, 0 4px 8px rgba(0, 0, 0, 0.12)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = `0 4px 12px ${config.shadowColor}, 0 2px 4px rgba(0, 0, 0, 0.08)`;
        }}
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, duration: 0.4, ease: "backOut" }}
          className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-circle"
          style={{
            width: "44px",
            height: "44px",
            background: config.iconBg,
            color: config.iconColor,
            boxShadow: `0 2px 8px ${config.shadowColor}`,
            flexShrink: 0,
          }}
        >
          <Icon size={22} />
        </motion.div>

        {/* Content */}
        <div className="flex-grow-1" style={{ color: config.textColor, minWidth: 0 }}>
          {title && (
            <motion.h6
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="fw-bold mb-2 d-flex align-items-center gap-2"
              style={{
                color: config.titleColor || config.textColor,
                fontSize: "0.95rem",
                letterSpacing: "0.01em",
              }}
            >
              {title}
            </motion.h6>
          )}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: "0.9rem",
              lineHeight: "1.6",
              fontWeight: "400",
            }}
          >
            {typeof message === "string" ? (
              <p className="mb-0" style={{ wordBreak: "break-word" }}>{message}</p>
            ) : (
              message
            )}
          </motion.div>
        </div>

        {/* Close Button */}
        {dismissible && onClose && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.6, scale: 1 }}
            whileHover={{ opacity: 1, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            className="btn-close flex-shrink-0"
            aria-label="Close"
            onClick={onClose}
            style={{
              opacity: 0.6,
              filter: `brightness(0) saturate(100%) invert(${
                type === "error" ? "27%" : type === "success" ? "40%" : "50%"
              })`,
              transition: "all 0.2s ease",
              width: "24px",
              height: "24px",
              marginTop: "2px",
            }}
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


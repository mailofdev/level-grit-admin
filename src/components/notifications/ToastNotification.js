// src/components/notifications/ToastNotification.js
import React, { useEffect } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { useNotifications } from "../../contexts/NotificationContext";
import { useNavigate } from "react-router-dom";

const ToastNotification = () => {
  const { notifications, markAsRead } = useNotifications();
  const navigate = useNavigate();
  const unreadNotifications = notifications.filter((n) => !n.read);

  const handleClose = (notificationId) => {
    markAsRead(notificationId);
  };

  const handleClick = (notification) => {
    markAsRead(notification.id);
    navigate(`/messages/${notification.clientId}`, {
      state: { client: { clientId: notification.clientId, fullName: notification.clientName } },
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);

      if (diffInSeconds < 60) return "Just now";
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (error) {
      return "Just now";
    }
  };

  // Show only the latest unread notification as toast
  const latestNotification = unreadNotifications[0];

  return (
    <ToastContainer
      position="top-end"
      className="p-3"
      style={{ zIndex: 1060 }}
    >
      <AnimatePresence>
        {latestNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Toast
              onClose={() => handleClose(latestNotification.id)}
              show={true}
              delay={5000}
              autohide
              className="border-0 shadow-lg"
              style={{
                minWidth: "320px",
                maxWidth: "400px",
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={() => handleClick(latestNotification)}
            >
              <Toast.Header
                className="text-white border-0"
                style={{
                  background: "linear-gradient(135deg, #007AFF 0%, #0056b3 100%)",
                  padding: "0.75rem 1rem",
                }}
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-2"
                  style={{
                    width: "32px",
                    height: "32px",
                    background: "rgba(255, 255, 255, 0.2)",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "0.85rem",
                  }}
                >
                  {latestNotification.clientName?.charAt(0)?.toUpperCase() || "C"}
                </div>
                <strong className="me-auto flex-grow-1">
                  {latestNotification.clientName || "Client"}
                </strong>
                <small className="text-white-50 me-2">
                  {formatTime(latestNotification.timestamp)}
                </small>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose(latestNotification.id);
                  }}
                />
              </Toast.Header>
              <Toast.Body
                className="p-3"
                style={{
                  background: "#ffffff",
                }}
              >
                <p className="mb-0" style={{ fontSize: "0.9rem" }}>
                  {latestNotification.messageText || latestNotification.fullMessage || "New message"}
                </p>
              </Toast.Body>
            </Toast>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContainer>
  );
};

export default ToastNotification;


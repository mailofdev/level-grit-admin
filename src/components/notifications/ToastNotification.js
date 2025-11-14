// src/components/notifications/ToastNotification.js
import React, { useEffect, useState, useRef } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { useNotifications } from "../../contexts/NotificationContext";
import { useNavigate } from "react-router-dom";

const ToastNotification = () => {
  const { notifications, markAsRead } = useNotifications();
  const navigate = useNavigate();
  const unreadNotifications = notifications.filter((n) => !n.read);
  const [shownNotifications, setShownNotifications] = useState(new Set());
  const timeoutRefs = useRef({});

  // Track which notifications to show (max 3 at a time)
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    // Find new unread notifications that haven't been shown yet
    const newNotifications = unreadNotifications.filter(
      (n) => !shownNotifications.has(n.id)
    );

    if (newNotifications.length > 0) {
      // Add new notifications to visible list (limit to 3)
      setVisibleNotifications((prev) => {
        const combined = [...newNotifications, ...prev];
        return combined.slice(0, 3);
      });

      // Mark as shown
      setShownNotifications((prev) => {
        const updated = new Set(prev);
        newNotifications.forEach((n) => updated.add(n.id));
        return updated;
      });

      // Auto-remove after 5 seconds
      newNotifications.forEach((notification) => {
        timeoutRefs.current[notification.id] = setTimeout(() => {
          setVisibleNotifications((prev) =>
            prev.filter((n) => n.id !== notification.id)
          );
          delete timeoutRefs.current[notification.id];
        }, 5000);
      });
    }
  }, [unreadNotifications, shownNotifications]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach((timeout) => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  const handleClose = (notificationId, e) => {
    if (e) e.stopPropagation();
    markAsRead(notificationId);
    setVisibleNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    if (timeoutRefs.current[notificationId]) {
      clearTimeout(timeoutRefs.current[notificationId]);
      delete timeoutRefs.current[notificationId];
    }
  };

  const handleClick = (notification) => {
    markAsRead(notification.id);
    setVisibleNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    if (timeoutRefs.current[notification.id]) {
      clearTimeout(timeoutRefs.current[notification.id]);
      delete timeoutRefs.current[notification.id];
    }
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

  return (
    <ToastContainer
      position="top-end"
      className="p-3"
      style={{ zIndex: 1060 }}
    >
      <AnimatePresence mode="popLayout">
        {visibleNotifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -50, scale: 0.9, x: 100 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95, x: 100 }}
            transition={{ 
              duration: 0.3,
              delay: index * 0.1 
            }}
            style={{
              marginBottom: index < visibleNotifications.length - 1 ? "0.5rem" : "0",
            }}
          >
            <Toast
              onClose={() => handleClose(notification.id)}
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
              onClick={() => handleClick(notification)}
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
                  {notification.clientName?.charAt(0)?.toUpperCase() || "C"}
                </div>
                <strong className="me-auto flex-grow-1">
                  {notification.clientName || "Client"}
                </strong>
                <small className="text-white-50 me-2">
                  {formatTime(notification.timestamp)}
                </small>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={(e) => handleClose(notification.id, e)}
                />
              </Toast.Header>
              <Toast.Body
                className="p-3"
                style={{
                  background: "#ffffff",
                }}
              >
                <p className="mb-0" style={{ fontSize: "0.9rem" }}>
                  {notification.messageText || notification.fullMessage || "New message"}
                </p>
              </Toast.Body>
            </Toast>
          </motion.div>
        ))}
      </AnimatePresence>
    </ToastContainer>
  );
};

export default ToastNotification;


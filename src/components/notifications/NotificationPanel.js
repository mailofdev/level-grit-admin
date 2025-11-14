// src/components/notifications/NotificationPanel.js
import React, { useState } from "react";
import { Card, Button, Badge, Spinner, Alert } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaCheckDouble, FaTrash, FaVolumeUp, FaVolumeMute, FaSync } from "react-icons/fa";
import { useNotifications } from "../../contexts/NotificationContext";
import { formatDistanceToNow, parseISO } from "date-fns";

const NotificationPanel = ({ onClose, onNotificationClick }) => {
  const {
    notifications,
    unreadCount,
    soundEnabled,
    setSoundEnabled,
    markAsRead,
    markAllAsRead,
    clearAll,
    isLoading,
    error,
    refreshNotifications,
  } = useNotifications();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";
    
    try {
      let date;
      if (timestamp.toDate) {
        date = timestamp.toDate();
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else if (typeof timestamp === "string") {
        date = parseISO(timestamp);
      } else {
        date = new Date(timestamp);
      }

      if (isNaN(date.getTime())) return "Just now";

      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);

      if (diffInSeconds < 60) return "Just now";
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      
      try {
        return formatDistanceToNow(date, { addSuffix: true });
      } catch (error) {
        return date.toLocaleDateString();
      }
    } catch (error) {
      return "Just now";
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshNotifications();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all notifications? This will only clear them from view, not delete them permanently.")) {
      clearAll();
    }
  };

  return (
    <Card
      className="border-0 shadow-lg"
      style={{
        maxHeight: "500px",
        borderRadius: "16px",
        overflow: "hidden",
        background: "#ffffff",
      }}
    >
      {/* Header */}
      <Card.Header
        className="d-flex justify-content-between align-items-center border-bottom bg-primary text-white"
        style={{
          background: "linear-gradient(135deg, #007AFF 0%, #0056b3 100%)",
          padding: "1rem",
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <h6 className="mb-0 fw-bold">Notifications</h6>
          {unreadCount > 0 && (
            <Badge bg="light" text="dark" pill>
              {unreadCount}
            </Badge>
          )}
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="link"
            className="text-white p-1 border-0"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            title="Refresh notifications"
            style={{ minWidth: "32px", minHeight: "32px" }}
          >
            <FaSync size={14} className={isRefreshing ? "spinning" : ""} />
          </Button>
          <Button
            variant="link"
            className="text-white p-1 border-0"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Mute sound" : "Enable sound"}
            style={{ minWidth: "32px", minHeight: "32px" }}
          >
            {soundEnabled ? <FaVolumeUp size={14} /> : <FaVolumeMute size={14} />}
          </Button>
          <Button
            variant="link"
            className="text-white p-1 border-0"
            onClick={onClose}
            title="Close"
            style={{ minWidth: "32px", minHeight: "32px" }}
          >
            <FaTimes size={16} />
          </Button>
        </div>
      </Card.Header>

      {/* Error Alert */}
      {error && (
        <Alert variant="warning" className="m-2 mb-0" dismissible onClose={() => {}}>
          <small>{error}</small>
        </Alert>
      )}

      {/* Actions */}
      {notifications.length > 0 && (
        <div className="d-flex justify-content-between align-items-center p-2 border-bottom bg-light">
          <Button
            variant="link"
            size="sm"
            className="text-primary"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0 || isLoading}
          >
            <FaCheckDouble className="me-1" />
            Mark all read
          </Button>
          <Button
            variant="link"
            size="sm"
            className="text-danger"
            onClick={handleClearAll}
            disabled={isLoading}
          >
            <FaTrash className="me-1" />
            Clear all
          </Button>
        </div>
      )}

      {/* Notifications List */}
      <div
        className="overflow-auto"
        style={{
          maxHeight: "400px",
        }}
      >
        {isLoading && notifications.length === 0 ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" className="mb-3" />
            <p className="text-muted mb-0">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔔</div>
            <p className="mb-0">No notifications</p>
            <small>You're all caught up!</small>
          </div>
        ) : (
          <AnimatePresence>
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <div
                  className={`p-3 border-bottom cursor-pointer ${
                    !notification.read ? "bg-light bg-opacity-50" : ""
                  }`}
                  style={{
                    cursor: "pointer",
                    transition: "background 0.2s ease",
                  }}
                  onClick={() => handleNotificationClick(notification)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(0, 122, 255, 0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = notification.read
                      ? "transparent"
                      : "rgba(0, 0, 0, 0.02)";
                  }}
                >
                  <div className="d-flex align-items-start gap-2">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: "40px",
                        height: "40px",
                        background: "linear-gradient(135deg, #007AFF 0%, #0056b3 100%)",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                      }}
                    >
                      {notification.clientName?.charAt(0)?.toUpperCase() || "C"}
                    </div>
                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h6 className="mb-0 fw-semibold" style={{ fontSize: "0.9rem" }}>
                          {notification.clientName || "Client"}
                        </h6>
                        {!notification.read && (
                          <div
                            className="rounded-circle flex-shrink-0"
                            style={{
                              width: "8px",
                              height: "8px",
                              background: "#007AFF",
                              marginTop: "6px",
                            }}
                          />
                        )}
                      </div>
                      <p
                        className="mb-1 text-muted"
                        style={{
                          fontSize: "0.85rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {notification.messageText || notification.fullMessage || "New message"}
                      </p>
                      <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                        {formatTime(notification.timestamp)}
                      </small>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </Card>
  );
};

export default NotificationPanel;


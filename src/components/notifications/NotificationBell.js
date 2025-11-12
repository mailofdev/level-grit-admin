// src/components/notifications/NotificationBell.js
import React, { useState, useRef, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { Badge, OverlayTrigger, Popover } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../../contexts/NotificationContext";
import NotificationPanel from "./NotificationPanel";
import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
  const { unreadCount, notifications } = useNotifications();
  const [showPanel, setShowPanel] = useState(false);
  const bellRef = useRef(null);
  const navigate = useNavigate();

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setShowPanel(false);
      }
    };

    if (showPanel) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showPanel]);

  const handleBellClick = () => {
    setShowPanel(!showPanel);
  };

  return (
    <div ref={bellRef} className="position-relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleBellClick}
        className="btn btn-link text-white position-relative p-2 border-0"
        style={{
          minWidth: "44px",
          minHeight: "44px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
        }}
        aria-label="Notifications"
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="position-absolute top-0 end-0"
            style={{
              transform: "translate(25%, -25%)",
            }}
          >
            <Badge
              bg="danger"
              pill
              className="d-flex align-items-center justify-content-center"
              style={{
                minWidth: "20px",
                height: "20px",
                fontSize: "0.7rem",
                fontWeight: "bold",
                boxShadow: "0 2px 8px rgba(220, 53, 69, 0.5)",
              }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          </motion.div>
        )}
      </motion.button>

      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="position-absolute end-0 mt-2"
            style={{
              zIndex: 1050,
              minWidth: "350px",
              maxWidth: "90vw",
            }}
          >
            <NotificationPanel
              onClose={() => setShowPanel(false)}
              onNotificationClick={(notification) => {
                setShowPanel(false);
                navigate(`/messages/${notification.clientId}`, {
                  state: { client: { clientId: notification.clientId, fullName: notification.clientName } },
                });
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;


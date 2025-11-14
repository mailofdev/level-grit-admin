// src/components/notifications/NotificationBell.js
import React, { useState, useRef, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { Badge } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../../contexts/NotificationContext";
import NotificationPanel from "./NotificationPanel";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

const NotificationBell = () => {
  const { unreadCount, notifications, isLoading, error } = useNotifications();
  const [showPanel, setShowPanel] = useState(false);
  const bellRef = useRef(null);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  // Debug logging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[NotificationBell] State:', { unreadCount, notificationsCount: notifications.length, isLoading, error });
    }
  }, [unreadCount, notifications.length, isLoading, error]);

  // Close panel when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        bellRef.current &&
        !bellRef.current.contains(event.target) &&
        panelRef.current &&
        !panelRef.current.contains(event.target)
      ) {
        setShowPanel(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape" && showPanel) {
        setShowPanel(false);
      }
    };

    if (showPanel) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when panel is open
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "";
      };
    }
  }, [showPanel]);

  const handleBellClick = (e) => {
    e.stopPropagation();
    setShowPanel(!showPanel);
  };

  // Calculate panel position
  const [panelPosition, setPanelPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if (showPanel && bellRef.current) {
      const bellRect = bellRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;
      
      setPanelPosition({
        top: bellRect.bottom + scrollY + 8,
        right: window.innerWidth - bellRect.right - scrollX,
      });
    }
  }, [showPanel]);

  return (
    <>
      <div ref={bellRef} className="position-relative" style={{ flexShrink: 0 }}>
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          }}
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
          aria-expanded={showPanel}
          disabled={isLoading}
          title={error ? `Error: ${error}` : isLoading ? "Loading notifications..." : unreadCount > 0 ? `${unreadCount} unread notifications` : "No new notifications"}
        >
          <FaBell size={20} style={{ opacity: isLoading ? 0.5 : 1 }} />
          {error && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="position-absolute top-0 end-0"
              style={{
                transform: "translate(25%, -25%)",
                pointerEvents: "none",
              }}
            >
              <Badge
                bg="warning"
                pill
                className="d-flex align-items-center justify-content-center"
                style={{
                  minWidth: "12px",
                  height: "12px",
                  fontSize: "0.6rem",
                }}
                title={error}
              />
            </motion.div>
          )}
          {!error && unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="position-absolute top-0 end-0"
              style={{
                transform: "translate(25%, -25%)",
                pointerEvents: "none",
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
      </div>

      {/* Render panel via portal to avoid layout issues */}
      {createPortal(
        <AnimatePresence>
          {showPanel && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowPanel(false)}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 1049,
                  background: "rgba(0, 0, 0, 0.1)",
                }}
              />
              {/* Panel */}
              <motion.div
                ref={panelRef}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: "fixed",
                  top: `${panelPosition.top}px`,
                  right: `${panelPosition.right}px`,
                  zIndex: 1050,
                  minWidth: "350px",
                  maxWidth: "min(90vw, 400px)",
                }}
              >
                <NotificationPanel
                  onClose={() => setShowPanel(false)}
                  onNotificationClick={(notification) => {
                    setShowPanel(false);
                    navigate(`/messages/${notification.clientId}`, {
                      state: { 
                        client: { 
                          clientId: notification.clientId, 
                          fullName: notification.clientName 
                        } 
                      },
                    });
                  }}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default NotificationBell;


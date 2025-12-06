import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaChevronDown } from "react-icons/fa";

/**
 * Custom Split Button Component
 * Matches the style of calendar and messages buttons
 * Single button with dropdown arrow inside, opens upward
 */
export default function CustomSplitButton({
  label,
  icon,
  items = [],
  onMainClick,
  className = "",
  style = {},
  width = "40px",
  height = "36px",
  title = "",
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showMenu]);

  const handleButtonClick = (e) => {
    // Always toggle dropdown menu on click
    e.preventDefault();
    e.stopPropagation();
    
    if (buttonRef.current) {
      // Calculate position for dropdown
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
    
    setShowMenu(!showMenu);
  };

  const handleMenuItemClick = (item) => {
    if (item.command) {
      item.command();
    }
    setShowMenu(false);
  };

  return (
    <div
      className={`d-flex align-items-stretch ${className}`}
      style={{ position: "relative", ...style }}
    >
      {/* Single Button with Arrow Inside */}
      <button
        ref={buttonRef}
        className="btn btn-sm d-flex align-items-center justify-content-center"
        onClick={handleButtonClick}
        title={title || label}
        style={{
          height: height,
          width: width,
          minWidth: width,
          maxWidth: width,
          minHeight: height,
          maxHeight: height,
          padding: "0",
          backgroundColor: "#22C55E",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          fontSize: "0.875rem",
          fontWeight: 500,
          transition: "all 0.2s ease",
          flexShrink: 0,
          position: "relative",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#16A34A";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#22C55E";
        }}
      >
        <div className="d-flex align-items-center justify-content-center w-100 h-100" style={{ gap: label ? "4px" : "2px" }}>
          {icon && <span>{icon}</span>}
          {label && <span style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}>{label}</span>}
          {items.length > 0 && (
            <FaChevronDown
              style={{
                fontSize: "0.65rem",
                transition: "transform 0.2s ease",
                transform: showMenu ? "rotate(180deg)" : "rotate(0deg)",
                marginLeft: label ? "2px" : "0",
              }}
            />
          )}
        </div>
      </button>

      {/* Dropdown Menu - Opens Below Button - Rendered via Portal */}
      {showMenu && items.length > 0 && createPortal(
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            top: `${menuPosition.top}px`,
            right: `${menuPosition.right}px`,
            backgroundColor: "#fff",
            border: "1px solid #E0E0E0",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            zIndex: 9999,
            minWidth: "150px",
            overflow: "hidden",
          }}
        >
          {items.map((item, index) => (
            <button
              key={index}
              className="btn btn-sm w-100 text-start d-flex align-items-center"
              onClick={() => handleMenuItemClick(item)}
              style={{
                padding: "10px 16px",
                border: "none",
                borderRadius: 0,
                backgroundColor: "transparent",
                color: "#000000",
                fontSize: "0.875rem",
                borderBottom: index < items.length - 1 ? "1px solid #E0E0E0" : "none",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F5F5F5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {item.icon && <span className="me-2">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}


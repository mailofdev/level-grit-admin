import getRoleIcon from "../common/CommonFunctions";
import React, { useState, memo, useMemo, useEffect, useRef } from "react";

const UserMenu = memo(({ user, onProfile, onLogout, autoOpen = false, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Function to get initials from full name
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Get role color based on role
  const getRoleColor = (role) => {
    const colors = {
      admin: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      manager: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      user: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      default: "linear-gradient(135deg, #4e73df 0%, #6f84fa 100%)",
    };
    return colors[role?.toLowerCase()] || colors.default;
  };

  const roleColor = useMemo(() => getRoleColor(user?.role), [user?.role]);
  const initials = useMemo(() => getInitials(user?.fullName), [user?.fullName]);

  // Handle auto-open when there are no routes
  useEffect(() => {
    if (autoOpen && buttonRef.current && dropdownRef.current) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setIsOpen(true);
        // Use Bootstrap's dropdown API to show the dropdown
        const bootstrap = window.bootstrap;
        if (bootstrap && bootstrap.Dropdown) {
          try {
            const dropdownInstance = bootstrap.Dropdown.getOrCreateInstance(buttonRef.current);
            dropdownInstance.show();
          } catch (e) {
            // Fallback: manually show dropdown using classes
            dropdownRef.current.classList.add('show');
            buttonRef.current.setAttribute('aria-expanded', 'true');
          }
        } else {
          // Fallback: manually show dropdown using classes
          dropdownRef.current.classList.add('show');
          buttonRef.current.setAttribute('aria-expanded', 'true');
        }
      }, 150);
      return () => clearTimeout(timer);
    } else if (!autoOpen && isOpen) {
      // Close dropdown when autoOpen becomes false
      setIsOpen(false);
      if (buttonRef.current && dropdownRef.current) {
        const bootstrap = window.bootstrap;
        if (bootstrap && bootstrap.Dropdown) {
          try {
            const dropdownInstance = bootstrap.Dropdown.getInstance(buttonRef.current);
            if (dropdownInstance) {
              dropdownInstance.hide();
            }
          } catch (e) {
            // Fallback: manually hide dropdown
            dropdownRef.current.classList.remove('show');
            buttonRef.current.setAttribute('aria-expanded', 'false');
          }
        } else {
          // Fallback: manually hide dropdown
          dropdownRef.current.classList.remove('show');
          buttonRef.current.setAttribute('aria-expanded', 'false');
        }
      }
      if (onClose) onClose();
    }
  }, [autoOpen, onClose]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        if (onClose) onClose();
        // Hide Bootstrap dropdown
        const bootstrap = window.bootstrap;
        if (bootstrap && bootstrap.Dropdown && buttonRef.current) {
          const dropdownInstance = bootstrap.Dropdown.getInstance(buttonRef.current);
          if (dropdownInstance) {
            dropdownInstance.hide();
          }
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  return (
    <ul className="navbar-nav mb-2 mb-lg-0 ms-lg-3">
      <li className="nav-item dropdown">
        <button
          ref={buttonRef}
          className="nav-link dropdown-toggle d-flex align-items-center bg-transparent border-0 px-3 py-2 rounded-pill position-relative"
          id="userDropdown"
          data-bs-toggle="dropdown"
          aria-expanded={isOpen}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (autoOpen) {
              // If auto-opened, allow manual toggle
              setIsOpen(!isOpen);
              if (onClose && isOpen) onClose();
            } else {
              // Normal toggle behavior
              setIsOpen(!isOpen);
            }
          }}
          onMouseEnter={() => {
            if (!autoOpen) {
              setIsOpen(true);
            }
          }}
          onMouseLeave={() => {
            if (!autoOpen) {
              setIsOpen(false);
            }
          }}
          style={{
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            background: isOpen
              ? "rgba(78, 115, 223, 0.08)"
              : "transparent",
          }}
        >
          {/* Avatar with role emoji in center */}
          <div
            className="user-avatar d-flex align-items-center justify-content-center rounded-circle position-relative"
            style={{
              width: "42px",
              height: "42px",
              background: roleColor,
              color: "#fff",
              fontWeight: "700",
              fontSize: "1.3rem",
              boxShadow: isOpen
                ? "0 8px 16px rgba(78, 115, 223, 0.3), 0 0 0 3px rgba(78, 115, 223, 0.1)"
                : "0 4px 12px rgba(0, 0, 0, 0.12)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: isOpen ? "scale(1.05)" : "scale(1)",
            }}
          >
            {getRoleIcon(user?.role, "emoji")}
          </div>

          {/* Role text with smooth transition */}
          <span
            className="fw-semibold text-capitalize ms-2"
            style={{
              fontSize: "0.9rem",
              color: isOpen ? "#4e73df" : "#2c3e50",
              transition: "color 0.3s ease",
            }}
          >
            {initials || "User"}
          </span>
        </button>

        {/* Enhanced Dropdown Menu */}
        <ul
          ref={dropdownRef}
          className={`dropdown-menu dropdown-menu-end shadow-lg mt-3 border-0 animate__animated animate__fadeIn animate__faster ${isOpen ? 'show' : ''}`}
          aria-labelledby="userDropdown"
          style={{
            minWidth: "260px",
            borderRadius: "1rem",
            background: "#ffffff",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)",
            overflow: "hidden",
          }}
        >
          {/* Gradient header background */}
          <div
            style={{
              background: roleColor,
              height: "80px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative circles */}
            <div
              style={{
                position: "absolute",
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)",
                top: "-40px",
                right: "-40px",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.08)",
                bottom: "-20px",
                left: "-20px",
              }}
            ></div>
          </div>

          {/* Profile Header with overlap */}
          <li className="text-center px-4" style={{ }}>
            <div className="fw-bold text-dark mb-1" style={{ fontSize: "1.05rem" }}>
              {user?.fullName || "Unknown User"}
            </div>
            <div
              className="text-muted mb-2 d-flex align-items-center justify-content-center"
              style={{ fontSize: "0.85rem" }}
            >
              <i className="bi bi-envelope me-1" style={{ fontSize: "0.8rem" }}></i>
              {user?.email || "No email"}
            </div>
            <span
              className="badge rounded-pill px-3 py-1 mb-3"
              style={{
                background: "rgba(78, 115, 223, 0.1)",
                color: "#4e73df",
                fontSize: "0.75rem",
                fontWeight: "600",
                letterSpacing: "0.5px",
              }}
            >
              {getRoleIcon(user?.role, "emoji")} {user?.role?.toUpperCase() || "USER"}
            </span>
          </li>

          <li>
            <hr className="dropdown-divider mx-3 my-2" style={{ opacity: 0.1 }} />
          </li>

          {/* Menu Items */}
          <li className="px-2 pb-2">
            <button
              className="dropdown-item d-flex align-items-center py-2 px-3 rounded-3 position-relative overflow-hidden"
              type="button"
              onClick={onProfile}
              style={{
                fontSize: "0.9rem",
                transition: "all 0.3s ease",
                border: "none",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(78, 115, 223, 0.08)";
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center rounded-circle me-3"
                style={{
                  width: "36px",
                  height: "36px",
                  background: "rgba(78, 115, 223, 0.1)",
                  color: "#4e73df",
                  transition: "all 0.3s ease",
                }}
              >
                <i className="bi bi-person" style={{ fontSize: "1.1rem" }}></i>
              </div>
              <span className="fw-semibold">My Profile</span>
            </button>
          </li>

          <li className="px-2 pb-2">
            <button
              className="dropdown-item d-flex align-items-center py-2 px-3 rounded-3 position-relative overflow-hidden"
              type="button"
              onClick={onLogout}
              style={{
                fontSize: "0.9rem",
                transition: "all 0.3s ease",
                border: "none",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(220, 53, 69, 0.08)";
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center rounded-circle me-3"
                style={{
                  width: "36px",
                  height: "36px",
                  background: "rgba(220, 53, 69, 0.1)",
                  color: "#dc3545",
                  transition: "all 0.3s ease",
                }}
              >
                <i className="bi bi-box-arrow-right" style={{ fontSize: "1.1rem" }}></i>
              </div>
              <span className="fw-semibold text-danger">Logout</span>
            </button>
          </li>
        </ul>
      </li>
    </ul>
  );
});

UserMenu.displayName = 'UserMenu';

export default UserMenu;
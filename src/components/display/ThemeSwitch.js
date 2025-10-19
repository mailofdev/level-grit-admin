import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeSwitch = ({ enableThemeAlert }) => {
  const { theme, toggleTheme } = useTheme();
  const [showModal, setShowModal] = useState(false);

  const handleToggleClick = () => {
    if (enableThemeAlert) {
      setShowModal(true);
    } else {
      toggleTheme();
    }
  };

  const handleConfirmYes = () => {
    toggleTheme();
    setShowModal(false);
  };

  const handleConfirmNo = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="theme-switch-container">
        {/* Switch */}
        <div className="theme-switch position-relative d-inline-block" style={{ width: "60px", height: "30px" }}>
          <input
            type="checkbox"
            id="darkModeToggle"
            className="position-absolute opacity-0"
            style={{ width: "0", height: "0" }}
            checked={theme === "dark"}
            onChange={handleToggleClick}
          />
          <label 
            htmlFor="darkModeToggle" 
            className="switch-label position-absolute w-100 h-100 rounded-pill theme-transition"
            style={{ 
              cursor: "pointer",
              backgroundColor: "var(--color-border)",
              top: "0",
              left: "0"
            }}
          >
            <span 
              className="icon sun position-absolute"
              style={{ 
                top: "45%", 
                left: "8px", 
                transform: "translateY(-50%)", 
                fontSize: "14px", 
                zIndex: "1", 
                color: "var(--color-text)" 
              }}
            >
              <FaSun />
            </span>
            <span 
              className="icon moon position-absolute"
              style={{ 
                top: "45%", 
                right: "8px", 
                transform: "translateY(-50%)", 
                fontSize: "14px", 
                zIndex: "1", 
                color: "var(--color-text)" 
              }}
            >
              <FaMoon />
            </span>
            <span 
              className="ball position-absolute rounded-circle theme-transition"
              style={{ 
                backgroundColor: "var(--color-primary)",
                height: "24px",
                width: "24px",
                top: "3px",
                left: "3px",
                zIndex: "2",
                transform: theme === "dark" ? "translateX(30px)" : "translateX(0)"
              }}
            ></span>
          </label>
        </div>

        {/* Modal */}
        {showModal && (
          <>
            <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: "1050" }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content theme-transition">
                  <div className="modal-header">
                    <h5 className="modal-title">Confirm Theme Change</h5>
                    <button type="button" className="btn-close" onClick={handleConfirmNo}></button>
                  </div>
                  <div className="modal-body">
                    <p>Do you want to change the theme?</p>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={handleConfirmNo}>
                      Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleConfirmYes}>
                      Yes, Change
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Backdrop */}
            <div className="modal-backdrop fade show" style={{ zIndex: "1040" }}></div>
          </>
        )}
      </div>
    </>
  );
};

export default ThemeSwitch;

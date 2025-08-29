import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeSwitch = ({enableThemeAlert}) => {
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
      <div className="">
        <style>
          {`
            .theme-switch {
              position: relative;
              display: inline-block;
              width: 60px;
              height: 30px;
            }

            .theme-switch input {
              opacity: 0;
              width: 0;
              height: 0;
            }

            .switch-label {
              position: absolute;
              cursor: pointer;
              background-color: var(--color-border);
              border-radius: 30px;
              width: 100%;
              height: 100%;
              transition: background-color 0.3s ease-in-out;
            }

            .switch-label .ball {
              position: absolute;
              background-color: var(--color-primary);
              height: 24px;
              width: 24px;
              border-radius: 50%;
              top: 3px;
              left: 3px;
              transition: transform 0.3s ease-in-out;
              z-index: 2;
            }

            .switch-label .icon {
              position: absolute;
              top: 45%;
              transform: translateY(-50%);
              font-size: 14px;
              z-index: 1;
              color: var(--color-text);
            }

            .switch-label .sun {
              left: 8px;
            }

            .switch-label .moon {
              right: 8px;
            }

            .theme-switch input:checked + .switch-label {
              background-color: var(--color-border);
            }

            .theme-switch input:checked + .switch-label .ball {
              transform: translateX(30px);
              background-color: var(--color-primary);
            }

            .modal-backdrop {
              z-index: 1040;
            }

            .modal {
              z-index: 1050;
              display: block;
              background: rgba(0, 0, 0, 0.3);
            }
          `}
        </style>

        {/* Switch */}
        <div className="theme-switch">
          <input
            type="checkbox"
            id="darkModeToggle"
            checked={theme === "dark"}
            onChange={handleToggleClick}
          />
          <label htmlFor="darkModeToggle" className="switch-label">
            <span className="icon sun"><FaSun /></span>
            <span className="icon moon"><FaMoon /></span>
            <span className="ball"></span>
          </label>
        </div>

        {/* Modal */}
        {showModal && (
          <>
            <div className="modal fade show" tabIndex="-1" style={{ display: "block" }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
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
            <div className="modal-backdrop fade show"></div>
          </>
        )}
      </div>
    </>
  );
};

export default ThemeSwitch;

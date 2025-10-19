import React from "react";
import PropTypes from "prop-types";

const Loader = ({
  size = "120px",
  color = "#FF5733",  // Bold gym color (orange-red)
  fullScreen = false,
  text = "Loading...",
}) => {
  const loaderStyles = `
    .custom-loader-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease-in-out;
    }
    .custom-loader-container.fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(4px);
      z-index: 9999;
    }
    .custom-spinner {
      position: relative;
      width: ${size};
      height: ${size};
    }
    .custom-spinner:before,
    .custom-spinner:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 5px solid transparent;
    }
    .custom-spinner:before {
      border-top-color: ${color};
      animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    }
    .custom-spinner:after {
      border-right-color: ${color}aa;
      animation: spinReverse 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    }
    .custom-loader-text {
      margin-top: 15px;
      font-size: 22px;
      font-weight: bold;
      color: ${color};
      text-transform: uppercase;
      letter-spacing: 2px;
      animation: pulse 0.7s infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes spinReverse {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(-360deg); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.1); }
    }
  `;

  return (
    <>
      <style>{loaderStyles}</style>
      <div className={`card content-wrapper text-center p-4 ${fullScreen ? "position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" : ""}`}>
        <div className="custom-spinner"></div>
        {text && <p className="custom-loader-text mt-3">{text}</p>}
      </div>
    </>
  );
};

Loader.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string,
  fullScreen: PropTypes.bool,
  text: PropTypes.string,
};

export default Loader;

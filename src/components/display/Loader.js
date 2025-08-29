import React from "react";
import PropTypes from "prop-types";

const Loader = ({
  size = "100px",
  color = "#222222",
  fullScreen = false,
  text = "Loading...",
}) => {
  const loaderStyles = `
    .loader-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease-in-out;
    }
    .loader-container.fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(3px);
      z-index: 9999;
    }
    .spinner {
      position: relative;
      width: ${size};
      height: ${size};
    }
    .spinner:before,
    .spinner:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 4px solid transparent;
    }
    .spinner:before {
      border-top-color: ${color};
      animation: spin 2s linear infinite;
    }
    .spinner:after {
      border-bottom-color: ${color}aa;
      animation: spinReverse 2s linear infinite;
    }
    .loader-text {
      margin-top: 12px;
      font-size: 20px;
      font-weight: 600;
      color: ${color};
      letter-spacing: 1px;
      animation: pulse 0.5s infinite;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    @keyframes spinReverse {
      to {
        transform: rotate(-360deg);
      }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
  `;

  return (
    <>
      <style>{loaderStyles}</style>
      <div className={`loader-container ${fullScreen ? "fullscreen" : ""}`}>
        <div className="spinner"></div>
        {text && <p className="loader-text">{text}</p>}
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

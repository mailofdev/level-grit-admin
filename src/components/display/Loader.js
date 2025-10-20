import React, { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * Loader component for displaying loading states
 * Optimized with memoization and improved accessibility
 * @param {Object} props - Component props
 * @param {string} props.size - Size of the loader (default: "120px")
 * @param {string} props.color - Color of the loader (default: primary color)
 * @param {boolean} props.fullScreen - Whether to show full screen loader
 * @param {string} props.text - Loading text to display
 * @param {string} props.type - Type of loader animation (default: "spinner")
 * @returns {JSX.Element} Loader component
 */
const Loader = memo(({
  size = '120px',
  color = 'var(--color-primary, #28a745)',
  fullScreen = false,
  text = 'Loading...',
  type = 'spinner',
}) => {
  // Generate unique ID for this loader instance
  const loaderId = React.useMemo(() => `loader-${Math.random().toString(36).substr(2, 9)}`, []);

  const loaderStyles = `
    .${loaderId}-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease-in-out;
    }
    .${loaderId}-container.fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(4px);
      z-index: 9999;
    }
    .${loaderId}-spinner {
      position: relative;
      width: ${size};
      height: ${size};
    }
    .${loaderId}-spinner:before,
    .${loaderId}-spinner:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 5px solid transparent;
    }
    .${loaderId}-spinner:before {
      border-top-color: ${color};
      animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    }
    .${loaderId}-spinner:after {
      border-right-color: ${color}aa;
      animation: spinReverse 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    }
    .${loaderId}-dots {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
    }
    .${loaderId}-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: ${color};
      animation: bounce 1.4s ease-in-out infinite both;
    }
    .${loaderId}-dot:nth-child(1) { animation-delay: -0.32s; }
    .${loaderId}-dot:nth-child(2) { animation-delay: -0.16s; }
    .${loaderId}-dot:nth-child(3) { animation-delay: 0s; }
    .${loaderId}-text {
      margin-top: 15px;
      font-size: 18px;
      font-weight: 500;
      color: ${color};
      text-align: center;
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
    @keyframes bounce {
      0%, 80%, 100% { 
        transform: scale(0);
      } 40% { 
        transform: scale(1);
      }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.05); }
    }
  `;

  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return (
          <div className={`${loaderId}-dots`}>
            <div className={`${loaderId}-dot`}></div>
            <div className={`${loaderId}-dot`}></div>
            <div className={`${loaderId}-dot`}></div>
          </div>
        );
      case 'spinner':
      default:
        return <div className={`${loaderId}-spinner`}></div>;
    }
  };

  return (
    <>
      <style>{loaderStyles}</style>
      <div 
        className={`${loaderId}-container ${fullScreen ? 'fullscreen' : ''}`}
        role="status"
        aria-live="polite"
        aria-label={text}
      >
        {renderLoader()}
        {text && (
          <p className={`${loaderId}-text`}>
            {text}
          </p>
        )}
      </div>
    </>
  );
});

Loader.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string,
  fullScreen: PropTypes.bool,
  text: PropTypes.string,
  type: PropTypes.oneOf(['spinner', 'dots']),
};

Loader.displayName = 'Loader';

export default Loader;

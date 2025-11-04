import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

/**
 * Enhanced Loader Component with smooth animations
 * Optimized for performance and better UX
 */
const Loader = React.memo(({
  size = "120px",
  color = "#007AFF",
  fullScreen = false,
  text = "Loading...",
}) => {
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const textVariants = {
    animate: {
      opacity: [1, 0.7, 1],
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const containerStyle = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  } : {};

  return (
    <motion.div
      className="d-flex flex-column align-items-center justify-content-center"
      style={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        style={{
          width: size,
          height: size,
          border: `5px solid ${color}20`,
          borderTopColor: color,
          borderRadius: '50%',
          position: 'relative'
        }}
        variants={spinnerVariants}
        animate="animate"
      />
      {text && (
        <motion.p
          className="mt-3 fw-semibold"
          style={{ color, fontSize: '1rem', marginTop: '1rem' }}
          variants={textVariants}
          animate="animate"
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );
});

Loader.displayName = 'Loader';

Loader.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string,
  fullScreen: PropTypes.bool,
  text: PropTypes.string,
};

export default Loader;

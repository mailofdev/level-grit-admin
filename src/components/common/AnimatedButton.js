import { motion } from 'framer-motion';
import React from 'react';

/**
 * Animated Button with delightful interactions
 * Enhanced for both web and mobile
 */
const AnimatedButton = ({ 
  children, 
  className = '', 
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  ...props 
}) => {
  const buttonClasses = `btn btn-${variant} ${className} ${fullWidth ? 'w-100' : ''}`;
  
  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      y: -2,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 },
    loading: { scale: 0.98 }
  };

  return (
    <motion.button
      className={buttonClasses}
      variants={buttonVariants}
      initial="rest"
      whileHover={!disabled && !loading ? "hover" : "rest"}
      whileTap={!disabled && !loading ? "tap" : "loading"}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        minHeight: '44px',
        position: 'relative',
        overflow: 'hidden'
      }}
      {...props}
    >
      {loading && (
        <motion.span
          className="spinner-border spinner-border-sm me-2"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      )}
      {children}
    </motion.button>
  );
};

export default AnimatedButton;


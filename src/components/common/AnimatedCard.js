import { motion } from 'framer-motion';
import React from 'react';

/**
 * Animated Card Component with smooth transitions
 * Works beautifully on both web and mobile
 */
const AnimatedCard = ({ 
  children, 
  className = '', 
  hover = true,
  delay = 0,
  onClick,
  ...props 
}) => {
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: delay,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    hover: hover ? {
      y: -4,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    } : {}
  };

  return (
    <motion.div
      className={`card border-0 shadow-sm hover-shadow theme-transition ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={hover ? "hover" : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;


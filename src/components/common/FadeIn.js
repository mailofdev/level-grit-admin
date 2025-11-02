import { motion } from 'framer-motion';
import React from 'react';

/**
 * Fade In Animation Wrapper
 * Provides smooth entrance animations
 */
const FadeIn = ({ 
  children, 
  delay = 0, 
  duration = 0.5,
  direction = 'up',
  className = ''
}) => {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: -20 },
    right: { x: 20 }
  };

  const variants = {
    hidden: { 
      opacity: 0,
      ...directions[direction]
    },
    visible: { 
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;


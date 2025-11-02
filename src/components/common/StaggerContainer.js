import { motion } from 'framer-motion';
import React from 'react';

/**
 * Stagger Container for list animations
 * Creates beautiful staggered entrance effects
 */
const StaggerContainer = ({ 
  children, 
  className = '',
  staggerDelay = 0.1 
}) => {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StaggerItem = ({ children, className = '' }) => {
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  );
};

StaggerContainer.Item = StaggerItem;

export default StaggerContainer;


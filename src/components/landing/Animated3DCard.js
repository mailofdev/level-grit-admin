import React from 'react';
import { motion } from 'framer-motion';

/**
 * 3D Animated Card Component with Framer Motion
 * Provides smooth entrance and hover animations
 */
const Animated3DCard = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 50, rotateY: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.05, 
        rotateY: 5,
        z: 50,
        transition: { duration: 0.3 }
      }}
      style={{ perspective: '1000px' }}
    >
      {children}
    </motion.div>
  );
};

export default Animated3DCard;


import { motion } from 'framer-motion';
import React from 'react';

/**
 * Loading Skeleton Component
 * Beautiful shimmer effect for loading states
 */
const LoadingSkeleton = ({ 
  width = '100%', 
  height = '1rem', 
  className = '',
  rounded = true 
}) => {
  const shimmer = {
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite'
  };

  return (
    <motion.div
      className={`${rounded ? 'rounded' : ''} ${className}`}
      style={{
        width,
        height,
        ...shimmer
      }}
      animate={{
        backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  );
};

export const CardSkeleton = () => (
  <div className="card border-0 shadow-sm p-3 p-md-4">
    <LoadingSkeleton width="60%" height="1.5rem" className="mb-3" />
    <LoadingSkeleton width="100%" height="1rem" className="mb-2" />
    <LoadingSkeleton width="80%" height="1rem" />
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="table-responsive">
    <table className="table">
      <thead>
        <tr>
          <th><LoadingSkeleton height="1rem" /></th>
          <th><LoadingSkeleton height="1rem" /></th>
          <th><LoadingSkeleton height="1rem" /></th>
        </tr>
      </thead>
      <tbody>
        {[...Array(rows)].map((_, i) => (
          <tr key={i}>
            <td><LoadingSkeleton height="1rem" /></td>
            <td><LoadingSkeleton height="1rem" /></td>
            <td><LoadingSkeleton height="1rem" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default LoadingSkeleton;


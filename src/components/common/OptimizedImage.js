import React, { useState, useRef, useEffect, memo } from 'react';
import { motion } from 'framer-motion';

/**
 * Optimized Image Component with lazy loading and blur placeholder
 * Improves performance and user experience
 */
const OptimizedImage = ({ 
  src, 
  alt = '', 
  className = '', 
  width,
  height,
  objectFit = 'cover',
  placeholder,
  style,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const currentRef = imgRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={imgRef}
      className={`position-relative overflow-hidden ${className}`}
      style={{ width, height, backgroundColor: '#f0f0f0' }}
    >
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <motion.div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%' }}
          animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        >
          <div className="spinner-border spinner-border-sm text-muted" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </motion.div>
      )}

      {/* Actual Image */}
      {isInView && (
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(false);
          }}
          style={{
            objectFit,
            width: '100%',
            height: '100%',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
            ...style
          }}
          {...props}
        />
      )}

      {/* Error State */}
      {hasError && (
        <div className="position-absolute top-50 start-50 translate-middle text-center text-muted">
          <i className="bi bi-image fs-1"></i>
          <p className="small mt-2">Image failed to load</p>
        </div>
      )}
    </div>
  );
};

export default memo(OptimizedImage);


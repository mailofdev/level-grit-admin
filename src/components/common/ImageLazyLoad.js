import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Lazy loading image component with intersection observer
 * Improves page load performance
 */
const ImageLazyLoad = ({ 
  src, 
  alt = '', 
  className = '',
  placeholder,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={imgRef}
      className={`position-relative overflow-hidden ${className}`}
      style={{ minHeight: '100px', backgroundColor: '#f0f0f0' }}
    >
      {/* Placeholder shimmer */}
      {!isLoaded && !hasError && (
        <motion.div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%'
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
      )}

      {/* Actual Image */}
      {isInView && (
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.4s ease'
          }}
          {...props}
        />
      )}

      {/* Error State */}
      {hasError && (
        <div className="position-absolute top-50 start-50 translate-middle text-center text-muted">
          <i className="bi bi-image fs-1"></i>
        </div>
      )}
    </div>
  );
};

export default React.memo(ImageLazyLoad);


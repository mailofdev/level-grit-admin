import React from 'react';
import PropTypes from 'prop-types';
import './Logo.css';

/**
 * Global Logo Component - SVG-based Level Grit logo
 * Responsive and customizable logo component for use throughout the application
 * 
 * @param {Object} props
 * @param {string} props.variant - Logo variant: 'navbar' (compact), 'landing' (medium), 'hero' (large), or 'custom'
 * @param {number|string} props.width - Custom width (overrides variant)
 * @param {number|string} props.height - Custom height (overrides variant)
 * @param {string} props.textColor - Color of the text (default: "#006400")
 * @param {string} props.bgColor - Background color (default: "transparent")
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 * @param {boolean} props.showBackground - Whether to show background rectangle (default: false)
 * @param {boolean} props.animated - Enable hover animation (default: true)
 */
const Logo = ({ 
  variant = 'navbar',
  width,
  height,
  textColor = "#006400",
  bgColor = "transparent",
  className = "",
  style = {},
  showBackground = false,
  animated = true
}) => {
  // Variant-based sizing (responsive)
  const getVariantStyles = () => {
    const variants = {
      navbar: {
        width: { base: '140px', sm: '160px', md: '180px' },
        height: { base: '35px', sm: '40px', md: '45px' },
        fontSize: { base: '24', sm: '28', md: '32' }
      },
      landing: {
        width: { base: '160px', sm: '200px', md: '240px' },
        height: { base: '40px', sm: '50px', md: '60px' },
        fontSize: { base: '28', sm: '36', md: '42' }
      },
      hero: {
        width: { base: '200px', sm: '280px', md: '360px' },
        height: { base: '50px', sm: '70px', md: '90px' },
        fontSize: { base: '36', sm: '48', md: '60' }
      },
      custom: {
        width: width || '180px',
        height: height || '45px',
        fontSize: '32'
      }
    };

    return variants[variant] || variants.navbar;
  };

  const variantStyles = getVariantStyles();
  const isCustom = variant === 'custom';
  
  // Calculate responsive values
  const logoWidth = isCustom ? (width || '180px') : variantStyles.width;
  const logoHeight = isCustom ? (height || '45px') : variantStyles.height;
  const fontSize = isCustom ? '32' : variantStyles.fontSize;

  // Build responsive classes
  const responsiveClasses = !isCustom ? 'logo-responsive' : '';
  const animationClass = animated ? 'logo-animated' : '';
  const combinedClassName = `logo-component ${responsiveClasses} ${animationClass} ${className}`.trim();

  // Responsive style object
  const responsiveStyle = {
    ...style,
    ...(isCustom && {
      width: logoWidth,
      height: logoHeight
    })
  };

  return (
    <div 
      className={combinedClassName}
      style={responsiveStyle}
      data-variant={variant}
    >
      <svg 
        viewBox="0 0 400 120" 
        xmlns="http://www.w3.org/2000/svg"
        className="logo-svg"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Level Grit Logo"
        role="img"
      >
        {showBackground && (
          <rect 
            width="400" 
            height="120" 
            fill={bgColor}
            rx="8"
            className="logo-bg"
          />
        )}
        <text 
          x="200" 
          y="75" 
          fontFamily="Anton SC, 'Arial Black', sans-serif" 
          fontSize={isCustom ? fontSize : undefined}
          fontWeight="900" 
          fill={textColor} 
          textAnchor="middle"
          letterSpacing="3"
          className="logo-text"
        >
          LevelGrit
        </text>
      </svg>
    </div>
  );
};

Logo.propTypes = {
  variant: PropTypes.oneOf(['navbar', 'landing', 'hero', 'custom']),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  textColor: PropTypes.string,
  bgColor: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  showBackground: PropTypes.bool,
  animated: PropTypes.bool,
};

export default Logo;


import React, { useState } from "react";
import PropTypes from "prop-types";

const fallbackImage = "https://placehold.co/200x200";

const DisplayImage = React.memo(({ src, alt, width = "100%", height = "auto", style = {} }) => {
  const [imgSrc, setImgSrc] = useState(src);
  // const [loading, setLoading] = useState(true);

  const handleLoad = () => {
    // setLoading(false);
  };

  const handleError = () => {
    setImgSrc(fallbackImage);
    // setLoading(false); // Set loading to false when error occurs
  };

  return (
    <div style={{ textAlign: "center" }}>
      {/* {loading && (
        <div style={{ padding: "10px" }}>
          <span className="spinner-border text-primary" role="status" />
        </div>
      )} */}
      <img
        src={imgSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        style={{
          width,
          height,
          objectFit: "cover",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          // display: loading ? "none" : "block",
          ...style, // merge any overrides from parent
        }}
      />
      {/* {!loading && (
        <p style={{ color: "#555", marginTop: "5px" }}>{alt}</p>
      )} */}
    </div>
  );
});

DisplayImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  style: PropTypes.object,
};

export default DisplayImage;
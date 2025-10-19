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
    <div className="card content-wrapper text-center p-3">
      {/* {loading && (
        <div className="p-3">
          <span className="spinner-border text-primary" role="status" />
        </div>
      )} */}
      <img
        src={imgSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        className="img-fluid rounded shadow-sm hover-scale"
        style={{
          width,
          height,
          objectFit: "cover",
          ...style, // merge any overrides from parent
        }}
      />
      {/* {!loading && (
        <p className="text-muted mt-2">{alt}</p>
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
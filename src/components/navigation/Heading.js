import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function Heading({ path, pageName, sticky = true, rightContent }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (path) navigate(path);
    else navigate(-1);
  };

  return (
    <div
      className={`d-flex align-items-center justify-content-between px-3 py-2 bg-white border-bottom ${
        sticky ? "position-sticky top-0 shadow-sm" : ""
      }`}
      style={{ zIndex: 1050 }}
    >
      {/* Left: Back button */}
      <button
        className="btn btn-light btn-sm rounded-circle shadow-sm"
        onClick={handleBack}
        style={{ width: "38px", height: "38px", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <FaArrowLeft />
      </button>

      {/* Center: Title */}
      <h5 className="mb-0 fw-bold text-truncate text-center flex-grow-1">
        {pageName}
      </h5>

      {/* Right: Optional content (icon/button) */}
      <div style={{ width: "38px", textAlign: "right" }}>
        {rightContent || null}
      </div>
    </div>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function Heading({ path, pageName, sticky }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (path) {
      navigate(path);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`d-flex align-items-center p-3 bg-white border-bottom ${sticky ? "position-sticky top-0 shadow-sm" : ""}`}>
      <button className="btn btn-outline-secondary btn-sm me-3" onClick={handleBack}>
        <FaArrowLeft />
      </button>
      <h5 className="mb-0 flex-grow-1 text-center">{pageName}</h5>
      <div style={{ width: "38px" }}>{/* Empty space to balance layout */}</div>
    </div>
  );
}

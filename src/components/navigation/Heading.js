import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { Tooltip, OverlayTrigger } from "react-bootstrap";

export default function Heading({ path, pageName, sticky = true, rightContent = [] }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (path) navigate(path);
    else navigate(-1);
  };

  return (
    <div className="d-flex align-items-center p-3 my-2 rounded bg-light-blue shadow-sm position-relative">
      
      {/* Left: Back button */}
      <div className="d-flex align-items-center">
        <button
          className="btn btn-light btn-sm rounded-circle shadow-sm"
          onClick={handleBack}
          style={{
            width: "38px",
            height: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaArrowLeft />
        </button>
      </div>

      {/* Center: Title */}
      <div className="position-absolute start-50 translate-middle-x text-center">
        <h5 className="mb-0 fw-bold text-truncate">{pageName}</h5>
      </div>

      {/* Right: Dynamic buttons with tooltip */}
      <div className="ms-auto d-flex align-items-center gap-2">
        {rightContent.map((btn, idx) => (
          <OverlayTrigger
            key={idx}
            placement="bottom"
            overlay={<Tooltip id={`tooltip-${idx}`}>{btn.label}</Tooltip>}
          >
            <span>
              <button
                className={`btn btn-sm ${btn.variant || "btn-primary"}`}
                onClick={btn.onClick}
                disabled={btn.disabled}
                style={{
                  // width: "38px",
                  // height: "38px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                 {btn.label && <span className="me-1">{btn.label}</span>}
                {btn.icon}
              </button>
            </span>
          </OverlayTrigger>
        ))}
      </div>
    </div>
  );
}

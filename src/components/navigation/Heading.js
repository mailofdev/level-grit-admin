import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Tooltip, OverlayTrigger } from "react-bootstrap";

export default function Heading({
  pageName,
  onBack,
  showBackButton = true,
  sticky = true,
  rightContent = [],
}) {
  const handleDefaultBack = () => window.history.back();

  return (
    <div
      className={`d-flex align-items-center p-3 my-2 rounded bg-light-blue shadow-sm position-relative ${
        sticky ? "sticky-top" : ""
      }`}
    >
      {/* Left: Back Button */}
      {showBackButton && (
        <div className="d-flex align-items-center">
          <button
            className="btn btn-light btn-sm rounded-circle shadow-sm"
            onClick={onBack || handleDefaultBack}
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
      )}

      {/* Center: Title */}
      <div className="position-absolute start-50 translate-middle-x text-center">
        <h5 className="mb-0 fw-bold text-truncate">{pageName}</h5>
      </div>

      {/* Right: Dynamic Buttons or JSX */}
      <div className="ms-auto d-flex align-items-center gap-2">
        {Array.isArray(rightContent)
          ? rightContent.map((btn, idx) => (
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
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {btn.icon && <span className="me-1">{btn.icon}</span>}
                    {btn.label}
                  </button>
                </span>
              </OverlayTrigger>
            ))
          : rightContent}
      </div>
    </div>
  );
}

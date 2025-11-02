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
      className={`d-flex align-items-center p-2 p-md-3 my-2 rounded shadow-sm ${
        sticky ? "sticky-top" : ""
      }`}
      style={{
        zIndex: 1030,
        position: sticky ? "sticky" : "relative",
        top: 0,
        background: "linear-gradient(135deg, rgba(232, 245, 233, 0.95), rgba(200, 230, 201, 0.95))",
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        minHeight: '56px'
      }} 
    >
      {/* Left: Back Button */}
      {showBackButton && (
        <div className="d-flex align-items-center">
          <button
            className="btn btn-light rounded-circle shadow-sm border-0"
            onClick={onBack || handleDefaultBack}
            aria-label="Go back"
            style={{
              width: "44px",
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "44px",
              minHeight: "44px",
            }}
          >
            <FaArrowLeft />
          </button>
        </div>
      )}

      {/* Center: Title */}
      <div className="position-absolute start-50 translate-middle-x text-center w-50 px-2">
        <h5 className="mb-0 fw-bold text-truncate fs-6 fs-md-5">{pageName}</h5>
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
                    className={`btn ${btn.size || 'btn-sm'} ${btn.variant || "btn-primary"} rounded-pill fw-semibold`}
                    onClick={btn.onClick}
                    disabled={btn.disabled}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: '44px',
                      gap: '0.5rem'
                    }}
                  >
                    {btn.icon && <span>{btn.icon}</span>}
                    {btn.label && <span className="d-none d-sm-inline">{btn.label}</span>}
                  </button>
                </span>
              </OverlayTrigger>
            ))
          : rightContent}
      </div>
    </div>
  );
}

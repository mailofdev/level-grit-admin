import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import "./Heading.css";

export default function Heading({
  pageName,
  onBack,
  showBackButton = true,
  sticky = true,
  rightContent = [],
}) {
  const handleDefaultBack = () => window.history.back();

  return (
    <>
      <div
        className={`heading-container ${sticky ? 'heading-fixed' : ''}`}
        style={{
          position: sticky ? "fixed" : "relative",
          top: sticky ? 0 : "auto",
          left: 0,
          right: 0,
          zIndex: 1030,
        }}
      >
        <div className="heading-content">
          {/* Left: Back Button */}
          {showBackButton && (
            <div className="heading-back-button">
              <button
                className="btn btn-back"
                onClick={onBack || handleDefaultBack}
                aria-label="Go back"
              >
                <FaArrowLeft />
              </button>
            </div>
          )}

          {/* Center: Title */}
          <div className="heading-title">
            <h5 className="heading-title-text">{pageName}</h5>
          </div>

          {/* Right: Dynamic Buttons or JSX */}
          <div className="heading-right-content">
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
      </div>
      {sticky && <div className="heading-spacer" />}
    </>
  );
}

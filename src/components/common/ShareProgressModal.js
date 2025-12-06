import React, { useState, useRef, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaInstagram, FaFire } from "react-icons/fa";
import { Toast } from "primereact/toast";
import { createPortal } from "react-dom";

const ShareProgressModal = ({ show, onHide, clientData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const shareCardRef = useRef(null);
  const hiddenShareCardRef = useRef(null);
  const captureContainerRef = useRef(null);
  const toast = useRef(null);

  // Fixed gradient theme
  const gradientBackground =
    "linear-gradient(135deg, var(--color-primary) 0%, #008066 50%, #00C099 100%)";

  // Share Card Component - reusable
  const ShareCard = ({ cardRef, className = "" }) => (
    <div
      ref={cardRef}
      className={`w-100 ${className}`}
      style={{
        maxWidth: "350px",
        // aspectRatio: "9/16",
        background: gradientBackground,
        borderRadius: "20px",
        padding: "28px 20px",
        color: "white",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <div style={{ fontSize: "32px", marginBottom: "5px" }}>💪</div>
          <h3
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: "800",
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            {clientData?.name || "Client"}
          </h3>
          <p style={{ margin: "6px 0 0 0", fontSize: "13px", opacity: 0.9 }}>
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            borderRadius: "18px",
            padding: "20px",
            marginBottom: "10px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "14px",
              marginBottom: "14px",
            }}
          >
            <FaFire style={{ fontSize: "26px" }} />
            <div>
              <div style={{ fontSize: "20px", fontWeight: "900", lineHeight: 1 }}>
                {clientData?.streak || 0} Day Streak
              </div>
            </div>
          </div>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.3)",
              borderRadius: "8px",
              height: "5px",
              overflow: "hidden",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                background: "white",
                height: "100%",
                width: `${
                  ((clientData?.streakCurrent || 0) /
                    (clientData?.streakGoal || 20)) *
                  100
                }%`,
                borderRadius: "8px",
                boxShadow: "0 0 10px rgba(255,255,255,0.5)",
              }}
            />
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: "10px",
              opacity: 0.9,
              fontWeight: "600",
            }}
          >
            🎯 Goal: {clientData?.streakGoal || 20} days
          </div>
        </div>
      </div>

      <div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          {(clientData?.macros || []).slice(0, 2).map((macro) => {
            const percentage = Math.round(
              ((macro.value || 0) / (macro.target || 1)) * 100
            );
            return (
              <div
                key={macro.label}
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "14px",
                  padding: "14px",
                  textAlign: "center",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <div className="mb-2 d-flex justify-content-center">
                  <div
                    className="position-relative"
                    style={{
                      width: "46px",
                      height: "46px",
                    }}
                  >
                    <svg
                      width="auto"
                      height="auto"
                      style={{
                        transform: "rotate(-90deg)",
                      }}
                    >
                      <circle
                        cx="23"
                        cy="23"
                        r="18"
                        fill="none"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="4"
                      />
                      <circle
                        cx="23"
                        cy="23"
                        r="18"
                        fill="none"
                        stroke="white"
                        strokeWidth="4"
                        strokeDasharray={`${
                          (percentage / 100) * (2 * Math.PI * 18)
                        } ${2 * Math.PI * 18}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div
                      style={{
                        position: "absolute",
                        top: "40%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "10px",
                        fontWeight: "bold",
                        color: "white",
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                        pointerEvents: "none",
                      }}
                    >
                      {percentage}%
                    </div>
                  </div>
                </div>
                <div
                  className="text-capitalize fw-semibold"
                  style={{ fontSize: "12px", marginBottom: "2px" }}
                >
                  {macro.label}
                </div>
                <div style={{ fontSize: "10px", opacity: 0.8 }}>
                  {macro.value || 0}/{macro.target || 0}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            borderRadius: "14px",
            padding: "16px",
            textAlign: "center",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <div style={{ fontSize: "14px", marginBottom: "6px" }}>🍽️</div>
          <div
            style={{ fontSize: "26px", fontWeight: "900", marginBottom: "2px" }}
          >
            {clientData?.completedMeals || 0}/{clientData?.totalMeals || 0}
          </div>
          <div style={{ fontSize: "12px", opacity: 0.9, fontWeight: "600" }}>
            Meals Completed Today
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "14px",
            fontSize: "11px",
            opacity: 0.7,
            fontWeight: "600",
          }}
        >
          #FitnessJourney #HealthyLiving
        </div>
      </div>
    </div>
  );

  // Create capture container on mount
  useEffect(() => {
    if (!captureContainerRef.current) {
      const container = document.createElement("div");
      container.id = "share-card-capture-container";
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 350px;
        height: auto;
        visibility: visible;
        opacity: 1;
        pointer-events: none;
        z-index: 999999;
        transform: translateX(-100%);
        overflow: hidden;
      `;
      document.body.appendChild(container);
      captureContainerRef.current = container;
    }

    return () => {
      // Cleanup on unmount
      if (
        captureContainerRef.current &&
        document.body.contains(captureContainerRef.current)
      ) {
        document.body.removeChild(captureContainerRef.current);
        captureContainerRef.current = null;
      }
    };
  }, []);

  // Generate progress image
  const generateProgressImage = async () => {
    if (!clientData || !shareCardRef.current) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Share card data not available.",
        life: 3000,
      });
      return null;
    }

    setIsGenerating(true);

    try {
      const sourceElement = shareCardRef.current;
      if (!sourceElement) {
        throw new Error("Share card element not found");
      }

      // Wait for fonts to load
      await document.fonts.ready;
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Get dimensions
      const rect = sourceElement.getBoundingClientRect();
      const width = rect.width || 350;
      const height = rect.height || Math.round(width * (16 / 9));

      // Import html2canvas first
      const html2canvasModule = await import("html2canvas");
      const html2canvasFn = html2canvasModule.default || html2canvasModule;

      if (typeof html2canvasFn !== "function") {
        throw new Error("html2canvas is not available");
      }

      // Prioritize hidden card (more reliable for html2canvas)
      let elementToCapture = hiddenShareCardRef.current || sourceElement;

      if (!elementToCapture) {
        throw new Error("Element to capture not found");
      }

      // If using hidden card, make it visible temporarily
      const isUsingHiddenCard =
        hiddenShareCardRef.current &&
        elementToCapture === hiddenShareCardRef.current;
      if (isUsingHiddenCard) {
        const hiddenCard = hiddenShareCardRef.current;
        const parent = hiddenCard.parentElement;

        // Move to visible position
        parent.style.position = "fixed";
        parent.style.top = "0";
        parent.style.left = "0";
        parent.style.opacity = "1";
        parent.style.visibility = "visible";
        parent.style.zIndex = "999998";
        parent.style.width = "350px";
        parent.style.height = "auto";

        // Ensure card itself is properly styled
        hiddenCard.style.position = "relative";
        hiddenCard.style.opacity = "1";
        hiddenCard.style.visibility = "visible";

        // Wait for rendering
        await new Promise((resolve) => setTimeout(resolve, 500));
      } else {
        // Use visible card - ensure it's in viewport
        sourceElement.scrollIntoView({ behavior: "instant", block: "center" });
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      // Get final dimensions
      const captureWidth = elementToCapture.offsetWidth || width;
      const captureHeight = elementToCapture.offsetHeight || height;

      // Capture the element
      const canvas = await html2canvasFn(elementToCapture, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true,
        allowTaint: true,
        imageTimeout: 20000,
        width: captureWidth,
        height: captureHeight,
      });

      // Restore hidden card to hidden state
      if (isUsingHiddenCard) {
        const parent = hiddenShareCardRef.current.parentElement;
        parent.style.position = "absolute";
        parent.style.top = "-9999px";
        parent.style.left = "-9999px";
        parent.style.opacity = "0";
        parent.style.visibility = "hidden";
      }

      // Convert to blob
      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create blob from canvas"));
            }
          },
          "image/png",
          1.0
        );
      });

      setIsGenerating(false);
      return blob;
    } catch (error) {
      console.error("Error generating image:", error);
      setIsGenerating(false);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to generate image. Please try again.",
        life: 3000,
      });
      return null;
    }
  };

  // Handle Instagram share
  const handleInstagramShare = async () => {
    const imageBlob = await generateProgressImage();
    if (!imageBlob) return;

    try {
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isAndroid = /Android/i.test(navigator.userAgent);

      // Download the image for all platforms
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "fitness-progress-story.png";
      link.style.display = "none";
      link.setAttribute("download", "fitness-progress-story.png");
      document.body.appendChild(link);

      // Trigger download
      link.click();

      // Clean up after download
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
      }, 300);

      // Open Instagram after a short delay (silently handle errors)
      setTimeout(() => {
        try {
          if (isMobile) {
            // Try to open Instagram app on mobile
            if (isIOS || isAndroid) {
              // Use try-catch to silently handle deep link errors
              try {
                // Create hidden iframe for deep link (prevents console errors)
                const iframe = document.createElement("iframe");
                iframe.style.display = "none";
                iframe.style.width = "0";
                iframe.style.height = "0";
                iframe.src = "instagram://story-camera";
                document.body.appendChild(iframe);

                // Remove iframe after attempt
                setTimeout(() => {
                  if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                  }
                }, 1000);
              } catch (e) {
                // Silently ignore deep link errors
              }

              // Always open Instagram website as fallback
              setTimeout(() => {
                window.open("https://www.instagram.com/", "_blank");
              }, 1500);
            } else {
              window.open("https://www.instagram.com/", "_blank");
            }
          } else {
            // Desktop/web - open Instagram website
            window.open("https://www.instagram.com/", "_blank");
          }
        } catch (error) {
          // Silently handle any errors and just open website
          window.open("https://www.instagram.com/", "_blank");
        }
      }, 800);

      // Show success message
      toast.current?.show({
        severity: "success",
        summary: "📸 Image Downloaded!",
        detail: isMobile
          ? "Image saved! Instagram is opening. Create a Story and select the image from your gallery."
          : "Image downloaded! Instagram is opening in a new tab. Open Instagram app on your phone, create a Story, and select the downloaded image.",
        life: 6000,
      });

      // Close modal after delay
      setTimeout(() => {
        onHide();
      }, 1500);
    } catch (error) {
      console.error("Error sharing image:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to share image. Please try again.",
        life: 4000,
      });
    }
  };

  return (
    <>
      <Toast ref={toast} />

      {/* Hidden ShareCard for html2canvas capture - rendered outside modal */}
      {show &&
        clientData &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: "-9999px",
              left: "-9999px",
              width: "350px",
              height: "auto",
              opacity: 0,
              visibility: "hidden",
              pointerEvents: "none",
              zIndex: -1,
            }}
          >
            <ShareCard cardRef={hiddenShareCardRef} />
          </div>,
          document.body
        )}

      <Modal
        show={show}
        onHide={onHide}
        centered
        fullscreen="sm-down"
        size="lg"
      >
        <Modal.Header
          closeButton
          style={{
            borderBottomColor: "var(--color-border)",
            backgroundColor: "var(--color-card-bg)",
          }}
        >
          <Modal.Title className="d-flex align-items-center gap-2">
            <div
              className="rounded-3 p-2"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-primary) 0%, #008066 100%)",
              }}
            >
              <span style={{ fontSize: "1.25rem" }}>📊</span>
            </div>
            <div>
              <div
                className="fw-bold"
                style={{ fontSize: "1.1rem", color: "var(--color-text-dark)" }}
              >
                Share Your Progress
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="p-3 p-md-4"
          style={{ backgroundColor: "var(--color-card-bg)" }}
        >
          <div className="row g-3 g-md-4">
            {/* Share Card Preview */}
            <div className="col-12 col-lg-6 order-2 order-lg-1">
              <div
                className="rounded-4 p-3 p-md-4 d-flex justify-content-center"
                style={{
                  border: "2px dashed var(--color-border)",
                  backgroundColor: "var(--color-card-bg-alt)",
                }}
              >
                <ShareCard cardRef={shareCardRef} />
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6 order-1 order-lg-2 mb-2">
            <div className="d-flex flex-column gap-3 h-100">
              <Button
                onClick={handleInstagramShare}
                disabled={isGenerating}
                className="w-100 rounded-pill"
                style={{
                  minHeight: "56px",
                  background:
                    "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                  border: "none",
                  color: "white",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                }}
              >
                {isGenerating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FaInstagram className="me-2" />
                    Share on Instagram Story
                  </>
                )}
              </Button>
            </div>
          </div>
          <div
            className="alert alert-info mb-0 d-flex align-items-start gap-2"
            style={{
              fontSize: "13px",
              lineHeight: "1.5",
              backgroundColor: "var(--color-info-bg)",
              borderColor: "var(--color-info-border)",
              color: "var(--color-info-text)",
            }}
          >
            <span style={{ fontSize: "18px" }}>💡</span>
            <div>
              <strong>Tip:</strong> The image will be downloaded and Instagram
              will open automatically. Create a Story and select the downloaded
              image from your gallery to share!
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ShareProgressModal;

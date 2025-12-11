import React, { useState, useEffect, useRef } from "react";
import { FaDownload, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Modal, Button } from "react-bootstrap";

/**
 * PWA Install Button Component
 * 
 * Shows install button for PWA on:
 * - Android Chrome: Uses beforeinstallprompt event
 * - iOS Safari: Shows instructions modal for manual install
 * 
 * Automatically detects platform and shows appropriate UI
 */
export default function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const promptReceivedRef = useRef(false);

  useEffect(() => {
    // Detect iOS (including iPad on iOS 13+)
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(iOS);

    // Check if app is already installed (standalone mode)
    const standalone = window.matchMedia("(display-mode: standalone)").matches ||
                       (window.navigator.standalone === true) ||
                       document.referrer.includes("android-app://") ||
                       window.matchMedia("(display-mode: fullscreen)").matches;
    setIsStandalone(standalone);

    if (standalone) {
      setShowInstallButton(false);
      return;
    }

    // Android Chrome: Listen for beforeinstallprompt event
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      promptReceivedRef.current = true;
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // iOS: Show install button immediately if not standalone
    // iOS doesn't support beforeinstallprompt, so we show instructions
    if (iOS && !standalone) {
      // Check if user has dismissed the install prompt before (localStorage)
      const dismissedKey = 'pwa-install-dismissed';
      const dismissed = localStorage.getItem(dismissedKey);
      const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
      const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      
      // Show button if not dismissed or dismissed more than a week ago
      if (!dismissed || dismissedTime < oneWeekAgo) {
        setShowInstallButton(true);
      }
    }

    // Android fallback: Check if PWA is installable even if beforeinstallprompt hasn't fired
    // This helps in cases where the event is delayed or doesn't fire
    if (!iOS && !standalone) {
      // Check if service worker is registered and manifest exists
      const checkInstallability = async () => {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          const manifestLink = document.querySelector('link[rel="manifest"]');
          
          // If service worker is registered and manifest exists, app is likely installable
          if (registration && manifestLink) {
            // Wait a bit for beforeinstallprompt, then show button if it hasn't fired
            setTimeout(() => {
              if (!promptReceivedRef.current) {
                // Check if user has dismissed before
                const dismissedKey = 'pwa-install-dismissed';
                const dismissed = localStorage.getItem(dismissedKey);
                const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
                const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
                
                // Show button if not dismissed or dismissed more than a week ago
                if (!dismissed || dismissedTime < oneWeekAgo) {
                  setShowInstallButton(true);
                }
              }
            }, 2000); // Reduced to 2 seconds for faster display
          } else {
            // Even without service worker, show button for manual install instructions
            setTimeout(() => {
              setShowInstallButton(true);
            }, 3000);
          }
        } catch (error) {
          // Silently fail, but still show button after delay
          setTimeout(() => {
            setShowInstallButton(true);
          }, 3000);
        }
      };
      
      checkInstallability();
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      // Show iOS instructions modal
      setShowIOSModal(true);
      return;
    }

    // Android: Use deferred prompt if available
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === "accepted") {
          setShowInstallButton(false);
          // Clear dismissal flag since user installed
          localStorage.removeItem('pwa-install-dismissed');
        } else {
          // User dismissed - remember for a week
          localStorage.setItem('pwa-install-dismissed', Date.now().toString());
        }
        
        setDeferredPrompt(null);
      } catch (error) {
        console.error("Error showing install prompt:", error);
        // Fall through to show instructions
        setShowIOSModal(true);
      }
    } else {
      // No deferred prompt available - show instructions for manual install
      setShowIOSModal(true);
    }
  };

  const handleDismiss = () => {
    setShowIOSModal(false);
    // Remember dismissal for a week
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    setShowInstallButton(false);
  };

  // Don't show if already installed
  if (isStandalone) {
    return null;
  }

  // Show button if:
  // - iOS and not standalone (always show for iOS)
  // - Android and beforeinstallprompt event was received
  if (!showInstallButton) {
    return null;
  }

  return (
    <>
      {/* Install Button - Floating */}
      <motion.button
        className="position-fixed btn btn-primary shadow-lg rounded-pill d-flex align-items-center gap-2 px-3 px-md-4 py-2 py-md-3"
        style={{
          bottom: "calc(80px + env(safe-area-inset-bottom, 0px))", // Above mobile bottom nav
          right: "max(1rem, env(safe-area-inset-right, 1rem))", // Respect safe area on iOS
          zIndex: 1040,
          minHeight: "48px",
          backgroundColor: "var(--color-primary)",
          border: "none",
          color: "#ffffff",
          fontSize: "0.9rem",
          boxShadow: "0 4px 12px rgba(10, 77, 60, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)",
        }}
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        onClick={handleInstallClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaDownload size={18} />
        <span className="fw-semibold d-none d-sm-inline">Install App</span>
        <span className="fw-semibold d-inline d-sm-none">Install</span>
      </motion.button>

      {/* iOS/Android Install Instructions Modal */}
      <Modal
        show={showIOSModal}
        onHide={handleDismiss}
        centered
        size="sm"
        contentClassName="border-0 shadow-lg"
      >
        <Modal.Header 
          closeButton
          className="border-0 pb-2"
          style={{
            background: "linear-gradient(135deg, var(--color-primary) 0%, #008066 100%)",
            color: "white",
          }}
        >
          <Modal.Title className="d-flex align-items-center gap-2">
            <FaDownload />
            Install App
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4" style={{ backgroundColor: "var(--color-card-bg)" }}>
          <div className="text-center">
            <p className="fw-semibold mb-3 text-theme-dark">
              {isIOS ? "Add to Home Screen" : "Install App"}
            </p>
            <div className="text-start">
              {isIOS ? (
                <div>
                  <ol className="mb-3" style={{ paddingLeft: "1.25rem", lineHeight: "1.8" }}>
                    <li className="mb-2 text-theme-dark">
                      Tap the <strong>Share</strong> button <span style={{ fontSize: "1.2rem" }}>📤</span> at the bottom of Safari (or top right in some versions)
                    </li>
                    <li className="mb-2 text-theme-dark">
                      Scroll down in the share menu and tap <strong>"Add to Home Screen"</strong> <span style={{ fontSize: "1.2rem" }}>➕</span>
                    </li>
                    <li className="text-theme-dark">
                      Tap <strong>"Add"</strong> in the top right corner to confirm
                    </li>
                  </ol>
                  <div className="alert alert-info small mb-0" style={{ backgroundColor: "rgba(0, 160, 128, 0.1)", border: "1px solid rgba(0, 160, 128, 0.3)" }}>
                    <strong>Tip:</strong> Make sure you're using Safari browser. Chrome on iOS doesn't support this feature.
                  </div>
                </div>
              ) : (
                <div>
                  <ol className="mb-3" style={{ paddingLeft: "1.25rem", lineHeight: "1.8" }}>
                    <li className="mb-2 text-theme-dark">
                      Tap the <strong>Menu</strong> button <span style={{ fontSize: "1.2rem" }}>⋮</span> (three dots) in the top right of Chrome
                    </li>
                    <li className="mb-2 text-theme-dark">
                      Look for <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong> in the menu
                    </li>
                    <li className="text-theme-dark">
                      Tap it and follow the prompts to install
                    </li>
                  </ol>
                  <div className="alert alert-info small mb-0" style={{ backgroundColor: "rgba(0, 160, 128, 0.1)", border: "1px solid rgba(0, 160, 128, 0.3)" }}>
                    <strong>Note:</strong> If you don't see the install option, make sure you're using Chrome or Edge browser on Android.
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center" style={{ backgroundColor: "var(--color-card-bg)" }}>
          <Button
            variant="primary"
            className="rounded-pill px-4"
            onClick={handleDismiss}
            style={{ minHeight: "44px" }}
          >
            Got it!
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}


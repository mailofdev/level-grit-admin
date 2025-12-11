# PWA Implementation Guide - Complete Prompt

Use this prompt to implement the same PWA functionalities in a new project. This guide includes all features, code snippets, and configuration needed.

## Overview
Implement a complete Progressive Web App (PWA) solution with offline support, installability, session management, and mobile optimizations.

---

## Implementation Steps

### 1. Web App Manifest (`public/manifest.json`)

Create a manifest.json file in your public directory with the following configuration:

```json
{
  "id": "/",
  "short_name": "Your App Name",
  "name": "Your App Name",
  "description": "Your app description",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#000000",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/180.png",
      "sizes": "180x180",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/dashboard-wide.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide",
      "label": "Dashboard View"
    },
    {
      "src": "/screenshots/dashboard-mobile.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Mobile View"
    }
  ]
}
```

**Requirements:**
- Create app icons: 192x192px, 512x512px, 180x180px (for iOS)
- Update theme_color and background_color to match your brand
- Update app name and description
- Optional: Add screenshots for app store listings

---

### 2. Service Worker (`public/service-worker.js`)

Create a service worker file in your public directory:

```javascript
/**
 * Service Worker for PWA
 * 
 * Enhanced offline support and caching strategies.
 * Optimized for intermittent connectivity.
 */

const CACHE_NAME = 'your-app-pwa-cache-v2';
const RUNTIME_CACHE = 'your-app-runtime-cache-v2';

// Core assets to cache on install
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/192.png',
  '/512.png',
  '/180.png',
  '/robots.txt'
];

// ✅ Install event - pre-cache core assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching core assets');
        return cache.addAll(urlsToCache).catch((err) => {
          console.warn('[Service Worker] Cache addAll failed:', err);
        });
      })
      .then(() => {
        console.log('[Service Worker] Installed successfully');
        return self.skipWaiting(); // Activate immediately
      })
  );
});

// ✅ Activate event - remove old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('[Service Worker] Activated');
      return self.clients.claim(); // Take control of all pages
    })
  );
});

// ✅ Fetch event - Network first with cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Skip service worker and chrome-extension requests
  if (
    request.url.includes('/service-worker.js') ||
    request.url.includes('chrome-extension://') ||
    request.url.includes('firefox-extension://')
  ) {
    return;
  }

  // Skip Firebase/Firestore requests (they handle their own caching)
  // Remove this if you don't use Firebase
  if (request.url.includes('firebase') || request.url.includes('firestore')) {
    return;
  }

  event.respondWith(
    // Try network first
    fetch(request)
      .then((networkResponse) => {
        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            // Only cache same-origin responses
            if (networkResponse.type === 'basic' || networkResponse.type === 'cors') {
              cache.put(request, responseToCache).catch((err) => {
                console.warn('[Service Worker] Cache put failed:', err);
              });
            }
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Network failed, try cache
        console.log('[Service Worker] Network failed, trying cache for:', request.url);
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // For navigation requests, return index.html for SPA routing
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          
          // Return a basic offline response for other requests
          return new Response('Offline - Content not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain',
            }),
          });
        });
      })
  );
});

// ✅ Background sync (if supported)
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-messages') {
    event.waitUntil(
      // Sync messages when connection is restored
      syncMessages()
    );
  }
});

// Helper function for background sync
async function syncMessages() {
  try {
    // This would sync pending messages when connection is restored
    console.log('[Service Worker] Syncing messages...');
    // Implementation would go here based on your needs
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error);
  }
}

// ✅ Message event - handle messages from main thread
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});
```

**Customization:**
- Update `CACHE_NAME` and `RUNTIME_CACHE` with your app name
- Modify `urlsToCache` to include your core assets
- Remove Firebase exclusion if not using Firebase
- Customize background sync implementation based on your needs

---

### 3. Service Worker Registration (`src/index.js`)

Add service worker registration to your main entry point:

```javascript
// Service Worker Registration (PWA)
/**
 * Registers Service Worker for Progressive Web App functionality
 * 
 * Features:
 * - Offline support
 * - Caching strategies
 * - Background sync
 * 
 * Note: Service Worker only works in production builds and HTTPS
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js', {
        updateViaCache: 'none' // Always check for updates
      })
      .then((registration) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Service Worker registered:', registration.scope);
        }
        
        // Listen for service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available - user can refresh to update
                if (process.env.NODE_ENV === 'development') {
                  console.log('🔄 New service worker available');
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        // Service Worker registration failed - app will still work without PWA features
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ Service Worker registration failed:', error);
        }
      });
  
    // Periodic update check (production only)
    // Checks for service worker updates every 24 hours
    if (process.env.NODE_ENV === 'production') {
      setInterval(() => {
        navigator.serviceWorker.getRegistration().then((registration) => {
          if (registration) {
            registration.update();
          }
        });
      }, 24 * 60 * 60 * 1000); // 24 hours
    }
  });
}
```

---

### 4. HTML Meta Tags (`public/index.html`)

Add PWA-related meta tags to your HTML head:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/192.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Your app description" />
    
    <!-- PWA Meta Tags -->
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Your App Name" />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/180.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    
    <title>Your App Name</title>
  </head>
  <body>
    <!-- Your app content -->
  </body>
</html>
```

**Update:**
- `theme-color` to match your brand
- `apple-mobile-web-app-title` to your app name
- Description and title

---

### 5. PWA Session Management Hook (`src/hooks/usePWASession.js`)

Create a custom hook for PWA session management:

```javascript
/**
 * PWA Session Management Hook
 * 
 * Handles PWA-specific session persistence and restoration.
 * Maintains user session across app minimize/resume cycles.
 */

import { useEffect } from 'react';

// Update these keys based on your auth storage implementation
const AUTH_STORAGE_KEY = 'auth_data';
const SESSION_TIMESTAMP_KEY = 'auth_timestamp';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

/**
 * Restores session from localStorage to sessionStorage on app resume
 */
export const restoreSession = () => {
  try {
    // Check if we have a session in localStorage
    const persistedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    const timestamp = localStorage.getItem(SESSION_TIMESTAMP_KEY);
    
    if (!persistedAuth || !timestamp) {
      return false;
    }

    // Check if session is still valid (not expired)
    const sessionAge = Date.now() - parseInt(timestamp, 10);
    if (sessionAge > SESSION_DURATION) {
      // Session expired, clear it
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(SESSION_TIMESTAMP_KEY);
      return false;
    }

    // Restore to sessionStorage for active use
    sessionStorage.setItem(AUTH_STORAGE_KEY, persistedAuth);
    return true;
  } catch (error) {
    console.error('Error restoring session:', error);
    return false;
  }
};

/**
 * Persists session from sessionStorage to localStorage
 */
export const persistSession = () => {
  try {
    const authData = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (authData) {
      localStorage.setItem(AUTH_STORAGE_KEY, authData);
      localStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error persisting session:', error);
    return false;
  }
};

/**
 * Clears both sessionStorage and localStorage auth data
 */
export const clearSession = () => {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(SESSION_TIMESTAMP_KEY);
};

/**
 * Hook to manage PWA session lifecycle
 */
export const usePWASession = () => {

  // Restore session on mount
  useEffect(() => {
    // If no active session, try to restore from localStorage
    if (!sessionStorage.getItem(AUTH_STORAGE_KEY)) {
      const restored = restoreSession();
      if (restored) {
        // Session restored, verify user is still valid
        // Add your user validation logic here
        const user = sessionStorage.getItem(AUTH_STORAGE_KEY);
        if (!user) {
          // Invalid session, clear it
          clearSession();
        }
      }
    } else {
      // Active session exists, persist it
      persistSession();
    }
  }, []);

  // Persist session periodically and on visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // App became visible/resumed, restore session if needed
        if (!sessionStorage.getItem(AUTH_STORAGE_KEY)) {
          const restored = restoreSession();
          if (restored) {
            // Verify restored session is valid
            const user = sessionStorage.getItem(AUTH_STORAGE_KEY);
            if (!user) {
              // Invalid session, clear it
              clearSession();
            } else {
              // Valid session restored, trigger a re-render by dispatching storage event
              window.dispatchEvent(new Event('storage'));
            }
          }
        } else {
          // Active session exists, update persistence timestamp
          persistSession();
        }
      } else {
        // App hidden/minimized, persist current session
        persistSession();
      }
    };

    const handleBeforeUnload = () => {
      // Persist session before page unload
      persistSession();
    };

    // Handle page focus (when app is brought to foreground)
    const handleFocus = () => {
      if (!sessionStorage.getItem(AUTH_STORAGE_KEY)) {
        restoreSession();
      } else {
        persistSession();
      }
    };

    // Handle page blur (when app goes to background)
    const handleBlur = () => {
      persistSession();
    };

    // Persist session every 5 minutes
    const persistInterval = setInterval(() => {
      if (sessionStorage.getItem(AUTH_STORAGE_KEY)) {
        persistSession();
      }
    }, 5 * 60 * 1000);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      clearInterval(persistInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return { restoreSession, persistSession, clearSession };
};
```

**Integration:**
- Update `AUTH_STORAGE_KEY` to match your auth storage key
- Integrate with your auth validation logic
- Import and use in your main App component

---

### 6. PWA Install Button Component (`src/components/common/PWAInstallButton.js`)

Create a component for PWA installation prompts:

```javascript
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
                       document.referrer.includes("android-app://");
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
      setShowInstallButton(true);
    }

    // Android fallback: Check if PWA is installable even if beforeinstallprompt hasn't fired
    if (!iOS && !standalone) {
      const checkInstallability = async () => {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          const manifestLink = document.querySelector('link[rel="manifest"]');
          
          if (registration && manifestLink) {
            setTimeout(() => {
              if (!promptReceivedRef.current) {
                setShowInstallButton(true);
              }
            }, 3000);
          }
        } catch (error) {
          // Silently fail
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
        }
        
        setDeferredPrompt(null);
      } catch (error) {
        console.error("Error showing install prompt:", error);
        setShowIOSModal(true);
      }
    } else {
      // No deferred prompt available - show instructions for manual install
      setShowIOSModal(true);
    }
  };

  // Don't show if already installed
  if (isStandalone) {
    return null;
  }

  if (!showInstallButton) {
    return null;
  }

  return (
    <>
      {/* Install Button - Floating */}
      <motion.button
        className="position-fixed btn btn-primary shadow-lg rounded-pill d-flex align-items-center gap-2 px-3 px-md-4 py-2 py-md-3"
        style={{
          bottom: "calc(80px + env(safe-area-inset-bottom))",
          right: "1rem",
          zIndex: 1040,
          minHeight: "48px",
          backgroundColor: "var(--color-primary)",
          border: "none",
          color: "#ffffff",
          fontSize: "0.9rem",
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

      {/* iOS Install Instructions Modal */}
      <Modal
        show={showIOSModal}
        onHide={() => setShowIOSModal(false)}
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
        <Modal.Body className="py-4">
          <div className="text-center">
            <p className="fw-semibold mb-3">
              {isIOS ? "Add to Home Screen" : "Install App"}
            </p>
            <div className="text-start">
              {isIOS ? (
                <ol className="mb-0" style={{ paddingLeft: "1.25rem", lineHeight: "1.8" }}>
                  <li className="mb-2">
                    Tap the <strong>Share</strong> button 📤 at the bottom of your screen
                  </li>
                  <li className="mb-2">
                    Scroll down and tap <strong>"Add to Home Screen"</strong> ➕
                  </li>
                  <li>
                    Tap <strong>"Add"</strong> to confirm
                  </li>
                </ol>
              ) : (
                <ol className="mb-0" style={{ paddingLeft: "1.25rem", lineHeight: "1.8" }}>
                  <li className="mb-2">
                    Tap the <strong>Menu</strong> button ⋮ (three dots) in your browser
                  </li>
                  <li className="mb-2">
                    Look for <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong> option
                  </li>
                  <li>
                    Tap it and follow the prompts to install
                  </li>
                </ol>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <Button
            variant="primary"
            className="rounded-pill px-4"
            onClick={() => setShowIOSModal(false)}
            style={{ minHeight: "44px" }}
          >
            Got it!
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
```

**Dependencies:**
- `react-icons` for icons
- `framer-motion` for animations
- `react-bootstrap` for Modal/Button (or use your preferred UI library)

**Customization:**
- Update styles to match your design system
- Adjust button position if you have a bottom navigation
- Modify instructions text as needed

---

### 7. CSS PWA Optimizations

Add to your global CSS file:

```css
/* PWA-specific: Prevent overscroll bounce */
body {
  overscroll-behavior-y: none;
  overscroll-behavior-x: none;
}

/* Safe area insets for PWA */
@supports (padding: max(0px)) {
  .navbar {
    padding-top: max(0.5rem, env(safe-area-inset-top));
  }
  
  .mobile-bottom-nav {
    padding-bottom: max(8px, env(safe-area-inset-bottom));
  }
  
  main {
    padding-left: max(0px, env(safe-area-inset-left));
    padding-right: max(0px, env(safe-area-inset-right));
  }
}
```

---

### 8. Integration in App Component

Integrate the PWA session hook in your main App component:

```javascript
import { usePWASession } from "./hooks/usePWASession";

function App() {
  // Initialize PWA session management
  const { restoreSession: restorePWASession } = usePWASession();

  useEffect(() => {
    // Restore session on mount
    restorePWASession();
    
    // Restore on visibility change (app resume)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        restorePWASession();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [restorePWASession]);

  return (
    // Your app JSX
  );
}
```

---

### 9. Add Install Button to Your Pages

Import and use the PWA install button where needed (e.g., landing page):

```javascript
import PWAInstallButton from "./components/common/PWAInstallButton";

function LandingPage() {
  return (
    <div>
      {/* Your page content */}
      <PWAInstallButton />
    </div>
  );
}
```

---

## Required Assets

Create these icon files in your `public` directory:
- `192.png` (192x192px) - Android icon
- `512.png` (512x512px) - Android icon
- `180.png` (180x180px) - iOS icon
- `favicon.ico` - Browser favicon

Optional screenshots for app stores:
- `screenshots/dashboard-wide.png` (1280x720px)
- `screenshots/dashboard-mobile.png` (390x844px)

---

## Required Dependencies

Install these if not already present:

```bash
npm install react-icons framer-motion
# If using Bootstrap
npm install react-bootstrap bootstrap
```

---

## Testing Checklist

- [ ] Service worker registers successfully
- [ ] App works offline (after first visit)
- [ ] Install prompt appears on Android Chrome
- [ ] iOS install instructions display correctly
- [ ] App installs and launches in standalone mode
- [ ] Session persists across app minimize/resume
- [ ] Safe area insets work on notched devices
- [ ] Icons display correctly when installed
- [ ] Theme color matches when installed

---

## Production Deployment Notes

1. **HTTPS Required**: Service workers only work over HTTPS (or localhost)
2. **Build Process**: Ensure service-worker.js is copied to build directory
3. **Cache Version**: Update cache version when deploying major changes
4. **Testing**: Test install flow on both Android and iOS devices
5. **Analytics**: Consider tracking install events for analytics

---

## Customization Points

1. **Cache Strategy**: Modify fetch handler in service worker (network-first, cache-first, etc.)
2. **Session Duration**: Change `SESSION_DURATION` in usePWASession.js
3. **Icons**: Replace with your app icons
4. **Theme Colors**: Update in manifest.json and meta tags
5. **Install Button**: Customize styles and position
6. **Background Sync**: Implement based on your sync needs

---

## Troubleshooting

**Service worker not registering:**
- Check if running on HTTPS or localhost
- Check browser console for errors
- Verify service-worker.js is accessible at root

**Install prompt not showing:**
- Verify manifest.json is valid
- Check that service worker is registered
- Ensure all required icons exist
- Test on actual device (not just emulator)

**Session not persisting:**
- Check localStorage/sessionStorage keys match
- Verify usePWASession hook is called
- Check browser storage permissions

---

## Additional Resources

- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev PWA Checklist](https://web.dev/pwa-checklist/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

This prompt provides all the code and configuration needed to implement the complete PWA solution in any React project.




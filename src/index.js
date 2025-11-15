/**
 * Application Entry Point
 * 
 * This is the main entry file that initializes the React application.
 * Handles:
 * - React DOM rendering
 * - Redux store provider
 * - Theme context provider
 * - Service Worker registration for PWA functionality
 * - Performance monitoring
 */

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
// PrimeReact CSS imports (commented out if not needed):
// import "primereact/resources/primereact.min.css";
// import "primeicons/primeicons.css";
// import "primeflex/primeflex.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ThemeProvider } from "./contexts/ThemeContext";

// ============================================
// React Root Element
// ============================================
const root = ReactDOM.createRoot(document.getElementById("root"));

// ============================================
// Service Worker Registration (PWA)
// ============================================
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

// ============================================
// Application Rendering
// ============================================
/**
 * Renders the React application with all providers
 * 
 * Provider Hierarchy:
 * 1. Redux Provider - Global state management
 * 2. Theme Provider - Theme switching (light/dark)
 * 3. App Component - Main application component
 * 
 * StrictMode: Enabled for development to catch potential issues
 */
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

// ============================================
// Performance Monitoring
// ============================================
/**
 * Web Vitals reporting for performance monitoring
 * 
 * Metrics tracked:
 * - Largest Contentful Paint (LCP)
 * - First Input Delay (FID)
 * - Cumulative Layout Shift (CLS)
 * 
 * To send metrics to analytics service:
 * reportWebVitals((metric) => {
 *   // Send to analytics endpoint
 * });
 */
reportWebVitals();

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; 
// import "primereact/resources/primereact.min.css";               
// import "primeicons/primeicons.css";                             
// import "primeflex/primeflex.css";                               
import { Provider } from "react-redux";
import store from "./redux/store";
import { ThemeProvider } from "./contexts/ThemeContext";
const root = ReactDOM.createRoot(document.getElementById("root"));

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js', {
        updateViaCache: 'none' // Always check for updates
      })
      .then((registration) => {
        // Prevent refresh loops - don't auto-reload on update
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              // Service worker update handling
            });
          }
        });
      })
      .catch((error) => {
        // Service Worker registration failed silently
      });
    
    // Check for updates less frequently (every 24 hours)
    // Only in production to avoid refresh loops in development
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


root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

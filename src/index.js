import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ErrorBoundary } from 'react-error-boundary';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store, { persistor } from './redux/store';
import ErrorFallback from './components/common/ErrorFallback';

// Import CSS files
import 'bootstrap/dist/css/bootstrap.min.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';

/**
 * Global error handler for unhandled errors
 * @param {Error} error - The unhandled error
 * @param {ErrorInfo} errorInfo - Additional error information
 */
const handleGlobalError = (error, errorInfo) => {
  console.error('Global Error:', error, errorInfo);
  
  // In production, you might want to send this to an error reporting service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to error reporting service like Sentry
    // Sentry.captureException(error, { extra: errorInfo });
  }
};

/**
 * Performance monitoring function
 * @param {Object} metric - Web vitals metric
 */
const sendToAnalytics = (metric) => {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vitals:', metric);
  }
  
  // In production, send to analytics service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Google Analytics or other analytics service
    // gtag('event', metric.name, {
    //   value: Math.round(metric.value),
    //   event_category: 'Web Vitals',
    //   event_label: metric.id,
    //   non_interaction: true,
    // });
  }
};

// Get the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Make sure you have a div with id="root" in your HTML.');
}

// Create React root
const root = ReactDOM.createRoot(rootElement);

// Render the application with error boundaries and providers
root.render(
  <React.StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleGlobalError}
    >
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);

// Start measuring performance
reportWebVitals(sendToAnalytics);

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  // In production, you might want to send this to an error reporting service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to error reporting service
    // Sentry.captureException(event.reason);
  }
});

// Handle uncaught errors
window.addEventListener('error', (event) => {
  console.error('Uncaught error:', event.error);
  
  // In production, you might want to send this to an error reporting service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to error reporting service
    // Sentry.captureException(event.error);
  }
});

import React from 'react';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      // You can add error logging service here
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 p-4" style={{ background: 'var(--health-gradient)' }}>
          <motion.div
            className="card border-0 shadow-lg p-4 p-md-5 text-center"
            style={{ maxWidth: '600px', width: '100%' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-4">
              <div className="display-1 text-danger mb-3">⚠️</div>
              <h2 className="fw-bold mb-3">Oops! Something went wrong</h2>
              <p className="text-muted mb-4">
                We're sorry for the inconvenience. The error has been logged and we'll look into it.
              </p>
            </div>
            
            <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
              <button
                className="btn btn-primary rounded-pill px-4 py-2"
                onClick={this.handleReload}
                style={{ minHeight: '44px' }}
              >
                🔄 Reload Page
              </button>
              <button
                className="btn btn-outline-primary rounded-pill px-4 py-2"
                onClick={this.handleGoHome}
                style={{ minHeight: '44px' }}
              >
                🏠 Go Home
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-start">
                <summary className="text-muted small cursor-pointer">Error Details</summary>
                <pre className="mt-2 p-3 bg-light rounded small" style={{ maxHeight: '200px', overflow: 'auto' }}>
                  {this.state.error.toString()}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


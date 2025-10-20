import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * ErrorFallback component for handling application errors
 * Provides a user-friendly error display with recovery options
 * @param {Object} props - Component props
 * @param {Error} props.error - The error object
 * @param {Function} props.resetErrorBoundary - Function to reset the error boundary
 * @returns {JSX.Element} Error fallback component
 */
function ErrorFallback({ error, resetErrorBoundary }) {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0">
              <div className="card-body text-center p-5">
                {/* Error Icon */}
                <div className="mb-4">
                  <AlertTriangle size={64} className="text-danger" />
                </div>

                {/* Error Title */}
                <h2 className="card-title text-danger mb-3">
                  Oops! Something went wrong
                </h2>

                {/* Error Message */}
                <p className="card-text text-muted mb-4">
                  We're sorry, but something unexpected happened. Our team has been
                  notified and is working to fix this issue.
                </p>

                {/* Error Details (only in development) */}
                {process.env.NODE_ENV === 'development' && error && (
                  <div className="alert alert-warning text-start mb-4">
                    <strong>Development Error Details:</strong>
                    <pre className="mt-2 mb-0 small">
                      {error.message}
                      {error.stack && (
                        <>
                          {'\n\nStack Trace:'}
                          {'\n'}
                          {error.stack}
                        </>
                      )}
                    </pre>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={resetErrorBoundary}
                  >
                    <RefreshCw size={20} className="me-2" />
                    Try Again
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleGoHome}
                  >
                    <Home size={20} className="me-2" />
                    Go Home
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={handleRefresh}
                  >
                    <RefreshCw size={20} className="me-2" />
                    Refresh Page
                  </button>
                </div>

                {/* Help Text */}
                <div className="mt-4">
                  <small className="text-muted">
                    If this problem persists, please contact our support team.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ErrorFallback.propTypes = {
  error: PropTypes.instanceOf(Error),
  resetErrorBoundary: PropTypes.func.isRequired,
};

ErrorFallback.defaultProps = {
  error: null,
};

export default ErrorFallback;

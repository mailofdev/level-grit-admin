import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordThunk, resetPasswordThunk } from "./authThunks";
import { clearError } from "./authSlice";
import Loader from "../../components/display/Loader";
import Heading from "../../components/navigation/Heading";
import { Eye, EyeClosed } from "lucide-react";
import Alert from "../../components/common/Alert";

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  // Step management
  const [step, setStep] = useState(1); // 1: Email, 2: OTP + Password
  const [email, setEmail] = useState("");
  const [storedEmail, setStoredEmail] = useState(""); // Store email for step 2
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Clear error when component mounts or inputs change
  useEffect(() => {
    dispatch(clearError());
    setErrorMessage("");
  }, [dispatch]);

  // Update error message when Redux error changes
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  // Handle success alert auto-close and step transition
  useEffect(() => {
    if (showSuccessAlert) {
      const timer = setTimeout(() => {
        setShowSuccessAlert(false);
        setStep(2); // Move to step 2 after 3 seconds
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessAlert]);

  const validateEmail = () => {
    if (!email) {
      setErrorMessage("Please enter your email address.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const validatePasswordForm = () => {
    if (!otpCode) {
      setErrorMessage("Please enter the OTP code.");
      return false;
    }
    if (otpCode.length < 4) {
      setErrorMessage("OTP code must be at least 4 characters.");
      return false;
    }
    if (!newPassword) {
      setErrorMessage("Please enter a new password.");
      return false;
    }
    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return false;
    }
    return true;
  };

  // Step 1: Handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateEmail()) return;

    try {
      const result = await dispatch(forgotPasswordThunk(email)).unwrap();
      
      // Store email for step 2
      setStoredEmail(email);
      
      // Show success message
      setSuccessMessage(
        result?.message || 
        "Password reset OTP has been sent to your email address. Please check your inbox."
      );
      setShowSuccessAlert(true);
      
      // Clear email input
      setEmail("");
    } catch (error) {
      setErrorMessage(error || "Failed to send reset OTP. Please try again.");
    }
  };

  // Step 2: Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validatePasswordForm()) return;

    try {
      const resetData = {
        email: storedEmail,
        otpCode: otpCode,
        newPassword: newPassword
      };

      const result = await dispatch(resetPasswordThunk(resetData)).unwrap();
      
      // Show success message
      setSuccessMessage(
        result?.message || 
        "Password has been reset successfully! You can now login with your new password."
      );
      
      // Clear form
      setOtpCode("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login?type=client");
      }, 2000);
    } catch (error) {
      setErrorMessage(error || "Failed to reset password. Please check your OTP and try again.");
    }
  };

  const handleBack = () => {
    if (step === 2) {
      // Go back to step 1
      setStep(1);
      setOtpCode("");
      setNewPassword("");
      setConfirmPassword("");
      setErrorMessage("");
      setSuccessMessage("");
    } else {
      navigate("/login?type=client");
    }
  };

  return (
    <div 
      className="d-flex justify-content-center align-items-center auth-page-enter"
      style={{ 
        minHeight: '100vh',
        padding: '2rem 1rem',
        backgroundColor: 'var(--color-bg)'
      }}
    >
      {loading && (
        <Loader
          fullScreen={true}
          text={step === 1 ? "Sending OTP..." : "Resetting password..."}
          color="var(--color-primary)"
        />
      )}

      {/* Enhanced Reset Password Card */}
      <div
        className="card border-0 shadow-lg w-100"
        style={{ 
          maxWidth: "450px",
          background: 'var(--color-card-bg)',
          borderRadius: '1.25rem',
          overflow: 'hidden'
        }}
      >
        {/* Header Section */}
        <div style={{ 
          background: 'var(--color-card-bg)',
          padding: '1.5rem 1.5rem 1rem 1.5rem',
          borderBottom: '1px solid var(--color-border)'
        }}>
          <Heading 
            pageName={step === 1 ? "Reset Password" : "Enter OTP & New Password"} 
            onBack={handleBack} 
            showBackButton={true}
            sticky={false}
          />
        </div>

        {/* Form Section */}
        <div style={{ padding: '1.5rem' }}>
          {/* Success Alert (shown for 3 seconds after email sent) */}
          {showSuccessAlert && successMessage && (
            <Alert
              type="success"
              title="Success!"
              message={
                <div>
                  <div className="mb-2">{successMessage}</div>
                  <div className="small">
                    <i className="fas fa-envelope me-1"></i>
                    Please check your email: <strong>{storedEmail}</strong>
                  </div>
                </div>
              }
              dismissible={true}
              onClose={() => setShowSuccessAlert(false)}
              position="inline"
              className="mb-3"
            />
          )}

          {/* Success Message (for password reset) */}
          {!showSuccessAlert && successMessage && step === 2 && (
            <Alert
              type="success"
              message={successMessage}
              dismissible={true}
              onClose={() => setSuccessMessage("")}
              position="inline"
              className="mb-3"
            />
          )}

          {/* Error Message */}
          {errorMessage && (
            <Alert
              type="error"
              message={errorMessage}
              dismissible={true}
              onClose={() => setErrorMessage("")}
              position="inline"
              className="mb-3"
            />
          )}

          {/* Step 1: Email Form */}
          {step === 1 && (
            <>
              {/* Info Message */}
              {!showSuccessAlert && (
                <Alert
                  type="info"
                  message="Enter your email address and we'll send you an OTP to reset your password."
                  dismissible={false}
                  position="inline"
                  className="mb-3"
                />
              )}

              <form onSubmit={handleEmailSubmit} className="needs-validation">
                {/* Email Field */}
                <div className="mb-4">
                  <label 
                    className="form-label fw-semibold mb-2" 
                    style={{ 
                      color: 'var(--color-text)',
                      fontSize: '0.9rem'
                    }}
                  >
                    <i className="fas fa-envelope text-primary me-2"></i>Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control smooth-transition"
                    placeholder="Enter your registered email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    inputMode="email"
                    disabled={loading || showSuccessAlert}
                    style={{ 
                      minHeight: '48px',
                      fontSize: '0.95rem',
                      padding: '0.75rem 1rem'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 smooth-transition"
                  disabled={loading || showSuccessAlert}
                  style={{ 
                    minHeight: '50px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    borderRadius: '0.5rem'
                  }}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane me-2"></i>
                      Send OTP
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* Step 2: OTP + Password Form */}
          {step === 2 && (
            <>
              {/* Info Message */}
              <Alert
                type="info"
                message={`Enter the OTP sent to ${storedEmail} and your new password.`}
                dismissible={false}
                position="inline"
                className="mb-3"
              />

              <form onSubmit={handlePasswordReset} className="needs-validation">
                {/* OTP Field */}
                <div className="mb-3">
                  <label 
                    className="form-label fw-semibold mb-2" 
                    style={{ 
                      color: 'var(--color-text)',
                      fontSize: '0.9rem'
                    }}
                  >
                    <i className="fas fa-key text-primary me-2"></i>OTP Code
                  </label>
                  <input
                    type="text"
                    className="form-control smooth-transition text-center"
                    placeholder="Enter OTP code"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    required
                    maxLength={10}
                    disabled={loading}
                    style={{ 
                      minHeight: '48px',
                      fontSize: '1.1rem',
                      padding: '0.75rem 1rem',
                      letterSpacing: '0.2rem',
                      fontWeight: '600'
                    }}
                  />
                </div>

                {/* New Password Field */}
                <div className="mb-3">
                  <label 
                    className="form-label fw-semibold mb-2"
                    style={{ 
                      color: 'var(--color-text)',
                      fontSize: '0.9rem'
                    }}
                  >
                    <i className="fas fa-lock text-primary me-2"></i>New Password
                  </label>
                  <div className="position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="form-control w-100 pe-5 smooth-transition"
                      style={{ 
                        paddingRight: "3rem",
                        minHeight: '48px',
                        fontSize: '0.95rem',
                        padding: '0.75rem 1rem'
                      }}
                      autoComplete="new-password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="position-absolute top-50 translate-middle-y border-0 bg-transparent"
                      style={{ 
                        right: "1rem",
                        color: 'var(--color-muted)',
                        padding: '0.5rem',
                        minWidth: '44px', 
                        minHeight: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-muted)'}
                    >
                      {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="mb-4">
                  <label 
                    className="form-label fw-semibold mb-2"
                    style={{ 
                      color: 'var(--color-text)',
                      fontSize: '0.9rem'
                    }}
                  >
                    <i className="fas fa-lock text-primary me-2"></i>Confirm Password
                  </label>
                  <div className="position-relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="form-control w-100 pe-5 smooth-transition"
                      style={{ 
                        paddingRight: "3rem",
                        minHeight: '48px',
                        fontSize: '0.95rem',
                        padding: '0.75rem 1rem'
                      }}
                      autoComplete="new-password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="position-absolute top-50 translate-middle-y border-0 bg-transparent"
                      style={{ 
                        right: "1rem",
                        color: 'var(--color-muted)',
                        padding: '0.5rem',
                        minWidth: '44px', 
                        minHeight: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-muted)'}
                    >
                      {showConfirmPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 smooth-transition"
                  disabled={loading}
                  style={{ 
                    minHeight: '50px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    borderRadius: '0.5rem'
                  }}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Reset Password
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* Links */}
          <div className="text-center mt-4">
            {step === 1 && (
              <p className="mb-0" style={{ fontSize: '0.9rem' }}>
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-decoration-none fw-semibold smooth-transition"
                  style={{ color: "var(--color-primary)" }}
                >
                  Sign In
                </Link>
              </p>
            )}
            {step === 2 && (
              <p className="mb-0" style={{ fontSize: '0.9rem' }}>
                Didn't receive OTP?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtpCode("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setErrorMessage("");
                    setSuccessMessage("");
                    setShowSuccessAlert(false);
                  }}
                  className="btn btn-link p-0 text-decoration-none fw-semibold smooth-transition"
                  style={{ 
                    color: "var(--color-primary)",
                    fontSize: '0.9rem'
                  }}
                >
                  Resend OTP
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;

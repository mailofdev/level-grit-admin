import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginThunk } from "./authThunks";
import { logout } from "./authSlice";
import Loader from "../../components/display/Loader";
import { Eye, EyeClosed } from "lucide-react";
import Heading from "../../components/navigation/Heading";
import { ROLES, normalizeRole } from "../../utils/roles";
import Alert from "../../components/common/Alert";
const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const loginType = searchParams.get("type") || "trainer"; // Default to trainer if no type specified

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password) {
      setErrorMessage("Please fill in both fields.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  // Helper function to get dashboard route based on role
  const getDashboardRoute = (role) => {
    // Normalize role to handle both string and number formats
    const normalizedRole = normalizeRole(role);
    
    if (normalizedRole === ROLES.CLIENT) {
      return "/client-dashboard";
    } else if (normalizedRole === ROLES.TRAINER) {
      return "/trainer-dashboard";
    } else if (normalizedRole === ROLES.ADMINISTRATOR) {
      return "/admin-dashboard";
    }
    
    // Default fallback
    return "/trainer-dashboard";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await dispatch(loginThunk({ email, password })).unwrap();
      // Get role from the login response
      const userRole = result?.userInfo?.role || result?.role;
      const normalizedRole = normalizeRole(userRole);
      
      // Validate role against login entry point
      if (loginType === "client") {
        // Client login entry point - only allow Client role
        if (normalizedRole === ROLES.TRAINER || normalizedRole === ROLES.ADMINISTRATOR) {
          // Clear auth_data that was saved during login
          dispatch(logout());
          setErrorMessage(
            "This login is intended only for clients. Trainers and should use the Trainer Login button instead."
          );
          setIsLoading(false);
          return;
        }

        // Check if client is active (for client login only)
        const IsSubscriptionPaid = result?.userInfo?.IsSubscriptionPaid ?? result?.IsSubscriptionPaid ?? true;
        if (IsSubscriptionPaid === false) {
          // Clear auth_data that was saved during login
          dispatch(logout());
          setErrorMessage(
            "Your subscription is inactive. Please contact your trainer to activate your account."
          );
          setIsLoading(false);
          return;
        }
      } else if (loginType === "trainer") {
        // Trainer login entry point - allow Trainer and Administrator roles
        if (normalizedRole === ROLES.CLIENT) {
          // Clear auth_data that was saved during login
          dispatch(logout());
          setErrorMessage(
            "This login is intended for trainers. Clients should use the Client Login button instead."
          );
          setIsLoading(false);
          return;
        }
      }
      
      // Role validation passed - navigate to the appropriate dashboard
      const dashboardRoute = getDashboardRoute(userRole);
      setIsLoading(false);
      // Navigate to the appropriate dashboard
      navigate(dashboardRoute, { replace: true });
    } catch (error) {
      setErrorMessage(error || "Invalid credentials. Please try again.");
      setIsLoading(false);
    }
  };

    const handleBack = () => {
navigate('/')
  };

  // Color scheme based on login type - using HealthifyMe theme
  const isClient = loginType === "client";
  const primaryColor = "var(--color-primary)";
  const gradientBg = "var(--color-bg)";
  const borderColor = "var(--color-input-border)";
  const inputBg = "var(--color-input-bg)";

  return (
    <div className="d-flex justify-content-center align-items-center auth-page-enter bg-theme min-vh-100 p-3 px-2">
      {isLoading && (
        <Loader
          fullScreen={true}
          text="Logging in..."
          color="var(--color-primary)"
        />
      )}

      {/* Enhanced Login Card */}
      <div
        className="card border-0 shadow-lg w-100 bg-card"
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
          padding: '1rem 1rem 0.75rem 1rem',
          borderBottom: `3px solid var(--color-primary)`,
          borderTopLeftRadius: '1.25rem',
          borderTopRightRadius: '1.25rem'
        }}>
          <Heading 
            pageName="Sign in" 
            onBack={handleBack} 
            showBackButton={true}
            sticky={false}
          />
        </div>

        {/* Form Section */}
        <div style={{ padding: '1rem' }}>
    
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

          <form onSubmit={handleSubmit} className="needs-validation">
            {/* Email Field */}
            <div className="mb-3">
              <label 
                className="form-label fw-semibold mb-2" 
                style={{ 
                  color: 'var(--color-text)',
                  fontSize: '0.9rem'
                }}
              >
                <i className="fas fa-envelope me-2" style={{ color: "var(--color-primary)" }}></i>Email Address <span style={{ color: "var(--color-primary)" }}>*</span>
              </label>
              <input
                type="email"
                className="form-control smooth-transition"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                inputMode="email"
                aria-required="true"
                maxLength={100}
                style={{ 
                  minHeight: '48px',
                  fontSize: '0.95rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: inputBg,
                  borderWidth: '2px',
                  borderColor: borderColor
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--color-input-focus)"}
                onBlur={(e) => e.target.style.borderColor = borderColor}
              />
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label 
                className="form-label fw-semibold mb-2"
                style={{ 
                  color: 'var(--color-text)',
                  fontSize: '0.9rem'
                }}
              >
                <i className="fas fa-lock me-2" style={{ color: "var(--color-primary)" }}></i>Password <span style={{ color: "var(--color-primary)" }}>*</span>
              </label>

              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-control w-100 pe-5 smooth-transition"
                  aria-required="true"
                  minLength={6}
                  maxLength={100}
                  style={{ 
                    paddingRight: "3rem",
                    minHeight: '48px',
                    fontSize: '0.95rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: inputBg,
                    borderWidth: '2px',
                    borderColor: borderColor
                  }}
                  autoComplete="current-password"
                  onFocus={(e) => e.target.style.borderColor = primaryColor}
                  onBlur={(e) => e.target.style.borderColor = borderColor}
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
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-primary)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-muted)'}
                >
                  {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn w-100 smooth-transition"
              disabled={isLoading}
                style={{ 
                  minHeight: '50px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  borderRadius: '0.5rem',
                  backgroundColor: "var(--color-button-bg)",
                  color: "var(--color-button-text)",
                  border: 'none',
                  boxShadow: "var(--shadow)"
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.target.style.backgroundColor = "var(--color-button-hover)";
                    e.target.style.boxShadow = "var(--shadow-lg)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.target.style.backgroundColor = "var(--color-button-bg)";
                    e.target.style.boxShadow = "var(--shadow)";
                  }
                }}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Signing In...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="text-center mt-4">
            {loginType === "trainer" && (
            <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
              Don't have an account?{" "}
              <Link
                to="/register?type=trainer"
                className="text-decoration-none fw-semibold smooth-transition"
                style={{ color: "var(--color-primary)" }}
              >
                Create Account
              </Link>
            </p>
            )}
            <p className="mb-0">
              <Link
                to="/reset-password"
                className="text-decoration-none fw-semibold smooth-transition"
                style={{ 
                  color: "var(--color-link)",
                  fontSize: '0.875rem'
                }}
              >
                <i className="fas fa-key me-2"></i>
                Forgot your password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginThunk } from "./authThunks";
import logo from "../../assets/images/logo3.jpeg";
import Loader from "../../components/display/Loader";
import { Eye, EyeClosed } from "lucide-react";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await dispatch(loginThunk({ email, password })).unwrap();
      navigate("/trainer-dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(error || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container d-flex justify-content-center align-items-center position-relative auth-page-enter">
      {isLoading && (
        <Loader
          fullScreen={true}
          text="Logging in..."
          color="var(--color-primary)"
        />
      )}

      {/* Enhanced Login Card */}
      <div
        className="card content-wrapper card-health p-5"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        <div className="text-center mb-4">
          <div className="position-relative d-inline-block">
            <img
              src={logo}
              alt="Health App Logo"
              className="rounded-circle border border-3 shadow-sm hover-scale"
              style={{
                height: "100px",
                width: "100px",
                borderColor: "var(--color-primary)",
                objectFit: "cover",
              }}
            />
            <div className="position-absolute top-0 start-0 w-100 h-100 rounded-circle border border-2 border-success opacity-25 animate-pulse"></div>
          </div>
          {/* <h3 className="fw-bold text-primary mt-3 mb-1">Welcome Back</h3>
          <p className="text-muted small">Sign in to your health journey</p> */}
        </div>

        {errorMessage && (
          <div className="alert alert-danger text-center py-3 mb-4 smooth-transition">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="needs-validation">
          {/* Email Field */}
          <div className="mb-2">
            <label className="form-label fw-semibold">
              <i className="fas fa-envelope text-primary me-2"></i>Email Address
            </label>
            <input
              type="email"
              className="form-control .form-control smooth-transition"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-2">
            <label className="form-label fw-semibold">
              <i className="fas fa-lock text-primary me-2"></i>Password
            </label>

            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control w-100 pe-5"
                style={{ paddingRight: "40px" }} // ensure text doesn't overlap icon
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="position-absolute top-50 translate-middle-y border-0 bg-transparent"
                style={{ right: "10px" }} // 👈 ensures button stays inside right end
              >
                {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn w-100 mt-3 smooth-transition"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
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
          <p className="text-muted mb-2">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-decoration-none fw-bold smooth-transition"
              style={{ color: "var(--color-primary)" }}
            >
              Create Account
            </Link>
          </p>
          <p className="mb-0">
            <Link
              to="/reset-password"
              className="text-decoration-none fw-semibold smooth-transition"
              style={{ color: "var(--color-link)" }}
            >
              <i className="fas fa-key me-1"></i>
              Forgot your password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

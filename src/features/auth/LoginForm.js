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
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(error || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 position-relative theme-transition">
      {isLoading && <Loader fullScreen={true} text="Logging in..." color="var(--color-primary)" />}

      {/* Login Card */}
      <div className="card border-0 shadow-lg p-4 theme-transition" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="text-center mb-4">
          <img
            src={logo}
            alt="Gym Logo"
            className="rounded-circle border border-2"
            style={{
              height: "90px",
              width: "90px",
              borderColor: "var(--color-border)",
            }}
          />
        </div>

        {errorMessage && (
          <div className="alert alert-danger text-center py-2 mb-3">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div className="mb-3 position-relative">
            <label className="form-label">Password</label>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control pe-5"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="position-absolute top-50 end-0 translate-middle-y me-3"
                style={{ cursor: "pointer", color: "var(--color-muted)" }}
              >
                {showPassword ? (
                  <EyeClosed size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-2 hover-scale">
            Login
          </button>
        </form>

        {/* Links */}
        <div className="text-center mt-3 small">
          <p className="text-muted">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-decoration-none fw-bold theme-transition"
              style={{ color: "var(--color-primary)" }}
            >
              Register
            </Link>
          </p>
          <p className="mb-0">
            <Link
              to="/reset-password"
              className="text-decoration-none fw-bold theme-transition"
              style={{ color: "var(--color-link)" }}
            >
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

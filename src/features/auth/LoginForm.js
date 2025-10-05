import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginThunk } from "./authThunks";
import logo from "../../assets/images/logo3.jpeg";
import Loader from "../../components/display/Loader";
import "../../styles/themes/liquidGlass.css";
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
    <div className="d-flex justify-content-center align-items-center vh-100 liquid-bg position-relative">
      {isLoading && <Loader fullScreen={true} text="Logging in..." color="#00ffb0" />}

      {/* Glass Login Card */}
      <div
        className="glass-card p-5 shadow-lg"
        style={{
          maxWidth: "400px",
          width: "100%",
          borderRadius: "25px",
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.25), rgba(255,255,255,0.05))",
          boxShadow:
            "0 0 40px rgba(0,255,200,0.25), inset 0 0 20px rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.3)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="text-center mb-4">
          <img
            src={logo}
            alt="Gym Logo"
            style={{
              height: "90px",
              width: "90px",
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.4)",
              boxShadow: "0 0 25px rgba(0,255,150,0.6)",
            }}
          />
        </div>

        {errorMessage && (
          <div
            className="alert alert-info text-danger bg-light text-center py-2"
            style={{
              fontSize: "0.9rem",
              borderRadius: "10px",
              backgroundColor: "rgba(255, 0, 0, 0.1)",
              color: "#ff5252",
              border: "1px solid rgba(255,0,0,0.3)",
            }}
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-3">
            <label className="form-label text-white">Email</label>
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
            <label className="form-label text-white">Password</label>
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
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "12px",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                {showPassword ? (
                  <EyeClosed size={20} color="#333" />
                ) : (
                  <Eye size={20} color="#333" />
                )}
              </span>
            </div>
          </div>

          <button type="submit" className="liquid-btn w-100 mt-2">
            Login
          </button>
        </form>

        {/* Links */}
        <div className="text-center mt-3" style={{ fontSize: "0.9rem" }}>
          <p style={{ color: "rgba(255,255,255,0.85)" }}>
            Don’t have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#00ffd5",
                fontWeight: "800",
                textDecoration: "none",
                // textShadow: "0 0 8px rgba(0,255,200,0.8)",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.color = "#00b894")}
              onMouseOut={(e) => (e.target.style.color = "#00ffd5")}
            >
              Register
            </Link>
          </p>
          <p>
            <Link
              to="/reset-password"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontWeight: "800",
                // textShadow: "0 0 8px rgba(0,200,255,0.6)",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.color = "#fff")}
              onMouseOut={(e) => (e.target.style.color = "#fff")}
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

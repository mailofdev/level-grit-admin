import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../api/authAPI";
import { loginThunk } from "./authThunks";
import logo from "../../assets/images/logo3.jpeg";
import Loader from "../../components/display/Loader";
import "../../styles/themes/liquidGlass.css";
import { Eye, EyeClosed } from "lucide-react";
import { Toast } from "primereact/toast";

const RegisterForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    gender: "",
    email: "",
    password: "",
    role: 1, 
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { fullName, phoneNumber, gender, email, password, role } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!fullName || !phoneNumber || !gender || !email || !password) {
      toast.current.show({
        severity: "warn",
        summary: "Incomplete Form",
        detail: "Please fill in all fields.",
        life: 2500,
      });
      return false;
    }

    if (fullName.length < 3) {
      toast.current.show({
        severity: "warn",
        summary: "Invalid Name",
        detail: "Full name must be at least 3 characters long.",
        life: 2500,
      });
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast.current.show({
        severity: "warn",
        summary: "Invalid Phone Number",
        detail: "Please enter a valid 10-digit phone number.",
        life: 2500,
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.current.show({
        severity: "warn",
        summary: "Invalid Email",
        detail: "Please enter a valid email address.",
        life: 2500,
      });
      return false;
    }

    if (password.length < 6) {
      toast.current.show({
        severity: "warn",
        summary: "Weak Password",
        detail: "Password must be at least 6 characters long.",
        life: 2500,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await registerUser(formData);

      toast.current.show({
        severity: "success",
        summary: "Registration Successful!",
        detail: "Welcome aboard 🎉",
        life: 2500,
      });

      // Wait for toast to display before auto-login
      setTimeout(async () => {
        try {
          await dispatch(
            loginThunk({ email: formData.email, password: formData.password })
          ).unwrap();
          navigate("/dashboard", { replace: true });
        } catch (loginError) {
          toast.current.show({
            severity: "error",
            summary: "Login Failed",
            detail: loginError?.message || "Could not log in automatically.",
            life: 3000,
          });
          navigate("/login");
        } finally {
          setIsLoading(false);
        }
      }, 1500);
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed. Please try again.";
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 register-liquid-bg position-relative">
      <Toast ref={toast} />
      {isLoading && <Loader fullScreen={true} text="Registering..." color="#00ffb0" />}

      {/* Glass Register Card */}
      <div
        className="glass-card p-5 shadow-lg"
        style={{
          maxWidth: "420px",
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
            alt="Logo"
            style={{
              height: "90px",
              width: "90px",
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.4)",
              boxShadow: "0 0 25px rgba(0,255,150,0.6)",
            }}
          />
        </div>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-3">
            <label className="form-label text-white">Full Name</label>
            <input
              type="text"
              name="fullName"
              className="form-control"
              placeholder="Enter your full name"
              value={fullName}
              onChange={handleChange}
            />
          </div>

          {/* Phone Number */}
          <div className="mb-3">
            <label className="form-label text-white">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              className="form-control"
              placeholder="Enter 10-digit number"
              value={phoneNumber}
              onChange={handleChange}
              maxLength="10"
            />
          </div>

          {/* Gender */}
          <div className="mb-3">
            <label className="form-label text-white">Gender</label>
            <select
              name="gender"
              className="form-select"
              value={gender}
              onChange={handleChange}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label text-white">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="mb-3 position-relative">
            <label className="form-label text-white">Password</label>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control pe-5"
                placeholder="Enter your password"
                value={password}
                onChange={handleChange}
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
            Register
          </button>
        </form>

        {/* Links */}
        <div className="text-center mt-3" style={{ fontSize: "0.9rem" }}>
          <p style={{ color: "rgba(255,255,255,0.85)" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#00ffd5",
                fontWeight: "800",
                textDecoration: "none",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.color = "#00b894")}
              onMouseOut={(e) => (e.target.style.color = "#00ffd5")}
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;

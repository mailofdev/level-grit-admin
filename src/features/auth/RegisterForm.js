import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../api/authAPI";
import { loginThunk } from "./authThunks";
import logo from "../../assets/images/logo3.jpeg";
import Loader from "../../components/display/Loader";
// Removed liquid glass import - using new health theme
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
          navigate("/trainer-dashboard", { replace: true });
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
    <div className="page-container d-flex justify-content-center align-items-center position-relative auth-page-enter">
      <Toast ref={toast} />
      {isLoading && (
        <Loader
          fullScreen={true}
          text="Creating your account..."
          color="var(--color-primary)"
        />
      )}

      {/* Enhanced Register Card */}
      <div
        className="card content-wrapper card-health p-5"
        style={{ maxWidth: "500px", width: "100%" }}
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
          {/* <h3 className="fw-bold text-primary mt-3 mb-1">Join Our Community</h3>
          <p className="text-muted small">Start your health transformation journey</p> */}
        </div>

        <form onSubmit={handleSubmit} className="needs-validation">
          <div className="row g-2">
            {/* Full Name */}
            <div className="col-12">
              <label className="form-label fw-semibold">
                <i className="fas fa-user me-2"></i>Full Name
              </label>
              <input
                type="text"
                name="fullName"
                className="form-control form-control smooth-transition"
                placeholder="Enter your full name"
                value={fullName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="col-12">
              <label className="form-label fw-semibold">
                <i className="fas fa-phone muted-label me-2"></i>Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                className="form-control .form-control smooth-transition"
                placeholder="Enter 10-digit phone number"
                value={phoneNumber}
                onChange={handleChange}
                maxLength="10"
                required
              />
            </div>

            {/* Gender */}
            <div className="col-12">
              <label className="form-label fw-semibold">
                <i className="fas fa-venus-mars muted-label me-2"></i>Gender
              </label>
              <select
                name="gender"
                className="form-select form-select smooth-transition"
                value={gender}
                onChange={handleChange}
                required
              >
                <option value="">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Email */}
            <div className="col-12">
              <label className="form-label fw-semibold">
                <i className="fas fa-envelope muted-label me-2"></i>Email
                Address
              </label>
              <input
                type="email"
                name="email"
                className="form-control .form-control smooth-transition"
                placeholder="Enter your email address"
                value={email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            {/* <div className="col-12">
              <label className="form-label fw-semibold">
                <i className="fas fa-lock muted-label me-2"></i>Password
              </label>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-control .form-control pe-5 smooth-transition"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-3 p-0 text-muted"
                  style={{ border: "none", background: "none" }}
                >
                  {showPassword ? (
                    <EyeClosed size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div> */}
            <div className="mb-2">
              <label className="form-label fw-semibold">
                <i className="fas fa-lock text-primary me-2"></i>Password
              </label>

              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-control  pe-5 smooth-transition"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={handleChange}
                  required
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
          </div>

          <button
            type="submit"
            className="btn btn-primary btn w-100 mt-4 smooth-transition"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Creating Account...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus me-2"></i>
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Links */}
        <div className="text-center mt-4">
          <p className="text-muted mb-0">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-decoration-none fw-bold smooth-transition"
              style={{ color: "var(--color-primary)" }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;

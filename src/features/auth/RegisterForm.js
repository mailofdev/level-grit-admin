import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../api/authAPI";
import { loginThunk } from "./authThunks";
import Loader from "../../components/display/Loader";
// Removed liquid glass import - using new health theme
import { Eye, EyeClosed } from "lucide-react";
import { Toast } from "primereact/toast";
import Heading from "../../components/navigation/Heading";
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

  // Helper function to get dashboard route based on role
  const getDashboardRoute = (role) => {
    switch (role) {
      case "Trainer":
        return "/trainer-dashboard";
      case "Administrator":
        return "/admin-dashboard";
        case "Client":
        return "/client-dashboard";
      default:
        return "/trainer-dashboard"; // Default fallback
    }
  };

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
          const result = await dispatch(
            loginThunk({ email: formData.email, password: formData.password })
          ).unwrap();
          // Get role from the login response
          const userRole = result?.userInfo?.role || result?.role;
          // Navigate to the appropriate dashboard based on role
          const dashboardRoute = getDashboardRoute(userRole);
          navigate(dashboardRoute, { replace: true });
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
    <div 
      className="d-flex justify-content-center align-items-center auth-page-enter"
      style={{ 
        minHeight: '95vh', 
        backgroundColor: 'var(--color-bg)'
      }}
    >
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
        className="px-2 card border-0 shadow-lg w-100"
        style={{ 
          maxWidth: "500px",
          background: 'var(--color-card-bg)',
          borderRadius: '1.25rem',
          overflow: 'hidden',
          maxHeight: "calc(100vh - 2rem)",
          overflowY: "auto"
        }}
      >
        {/* Header Section */}
        <div style={{ 
          background: 'var(--color-card-bg)',
          padding: '0.5rem 0.5rem 0.5rem 0.5rem',
          borderBottom: '1px solid var(--color-border)'
        }}>
          <Heading 
            pageName="Create Account" 
            onBack={() => navigate('/')}
            showBackButton={true}
            sticky={false}
          />
        </div>

        {/* Form Section */}
        <div style={{ padding: '0.5rem' }}>
          <form onSubmit={handleSubmit} className="needs-validation">
            <div className="row g-1">
              {/* Full Name */}
              <div className="col-12">
                <label 
                  className="form-label fw-semibold mb-2"
                  style={{ 
                    color: 'var(--color-text)',
                    fontSize: '0.9rem'
                  }}
                >
                  <i className="fas fa-user text-primary me-2"></i>Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control smooth-transition"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={handleChange}
                  required
                  style={{ 
                    minHeight: '38px',
                    fontSize: '0.95rem',
                    padding: '0.75rem 1rem'
                  }}
                />
              </div>

              {/* Phone Number */}
              <div className="col-12">
                <label 
                  className="form-label fw-semibold mb-2"
                  style={{ 
                    color: 'var(--color-text)',
                    fontSize: '0.9rem'
                  }}
                >
                  <i className="fas fa-phone text-primary me-2"></i>Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  className="form-control smooth-transition"
                  placeholder="Enter 10-digit phone number"
                  value={phoneNumber}
                  onChange={handleChange}
                  maxLength="10"
                  required
                  style={{ 
                    minHeight: '48px',
                    fontSize: '0.95rem',
                    padding: '0.75rem 1rem'
                  }}
                />
              </div>

              {/* Gender */}
              <div className="col-12">
                <label 
                  className="form-label fw-semibold mb-2"
                  style={{ 
                    color: 'var(--color-text)',
                    fontSize: '0.9rem'
                  }}
                >
                  <i className="fas fa-venus-mars text-primary me-2"></i>Gender
                </label>
                <select
                  name="gender"
                  className="form-select smooth-transition"
                  value={gender}
                  onChange={handleChange}
                  required
                  style={{ 
                    minHeight: '48px',
                    fontSize: '0.95rem',
                    padding: '0.75rem 1rem'
                  }}
                >
                  <option value="">Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Email */}
              <div className="col-12">
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
                  name="email"
                  className="form-control smooth-transition"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={handleChange}
                  required
                  style={{ 
                    minHeight: '48px',
                    fontSize: '0.95rem',
                    padding: '0.75rem 1rem'
                  }}
                />
              </div>

              {/* Password */}
              <div className="col-12">
                <label 
                  className="form-label fw-semibold mb-2"
                  style={{ 
                    color: 'var(--color-text)',
                    fontSize: '0.9rem'
                  }}
                >
                  <i className="fas fa-lock text-primary me-2"></i>Password
                </label>
                <div className="position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-control pe-5 smooth-transition"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={handleChange}
                    required
                    style={{ 
                      paddingRight: "3rem",
                      minHeight: '48px',
                      fontSize: '0.95rem',
                      padding: '0.75rem 1rem'
                    }}
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
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mt-4 smooth-transition"
              disabled={isLoading}
              style={{ 
                minHeight: '50px',
                fontSize: '1rem',
                fontWeight: '600',
                borderRadius: '0.5rem'
              }}
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
            <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-decoration-none fw-semibold smooth-transition"
                style={{ color: "var(--color-primary)" }}
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;

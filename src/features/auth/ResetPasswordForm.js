// auth/components/ResetPasswordForm.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo2.png";
const ResetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Placeholder: Show success after fake delay
    setLoading(true);
    setTimeout(() => {
      setSuccessMessage("✅ Reset link sent successfully!");
      setLoading(false);
      setEmail("");
    }, 1000);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#FDF4DC", borderRadius: "10px" }}
    >
      <div
        className="card p-4 shadow-sm"
        style={{ maxWidth: "400px", width: "100%" }}
      >
                <div className="text-center">
                  <img
                    src={logo}
                    alt="Level Grit Logo"
                 style={{ height: "150px", width: "150px" }}
                  />
                </div>
        <h4 className="mb-3 text-center">Reset Password</h4>

        {errorMessage && (
          <div className="alert alert-danger py-2">{errorMessage}</div>
        )}

        {successMessage && (
          <div className="alert alert-success py-2">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-warning w-100 mb-3"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-2">
          <p className="mb-1">
            Remember your password?{" "}
            <Link to="/login" className="text-decoration-none">
              Login here
            </Link>
          </p>
          {/* <p className="mb-0">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-decoration-none">
              Register here
            </Link>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;

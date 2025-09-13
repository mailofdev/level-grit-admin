// auth/components/RegisterForm.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DynamicForm from "../../components/forms/DynamicForm";
// import {registerUser} from "../../api/authAPI";
import logo from "../../assets/images/logo.png";
import { registerUser } from "../../api/authAPI";
const RegisterForm = () => {
  const navigate = useNavigate();

  const schema = [
    { type: "input", name: "fullName", label: "Full Name", required: true, },
    { type: "email", name: "email", label: "Email", required: true },
    { type: "password", name: "password", label: "Password", required: true, minLength: 6 },
    { type: "input", name: "phoneNumber", label: "Phone Number", required: true },
    { type: "select", name: "gender", label: "Gender", required: true, options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" }
    ]}
  ];

  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    const formData = { ...data, role: 1 };
    console.log("Form submitted:", formData);
    setErrorMessage("");
    setLoading(true);
    try {
      // Example API call
      await registerUser(formData);
      alert("✅ Registration successful!");
      navigate("/login");
    } catch (error) {
      setErrorMessage(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({});
    setErrorMessage("");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#FDF4DC", borderRadius: "10px" }}>
      <div className="card p-4 shadow-sm" style={{ maxWidth: "500px", width: "100%" }}>
           <div className="text-center">
          <img
            src={logo}
            alt="Level Grit Logo"
            style={{ height: "100px", width: "100px" }}
          />
        </div>
        <h6 className="mb-3 text-center text-danger fw-bold">7 days free trial</h6>

        {errorMessage && (
          <div className="alert alert-danger py-2">{errorMessage}</div>
        )}

        <DynamicForm
          schema={schema}
          formData={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          actionButtonName={loading ? "Registering..." : "Register"}
          singleButtonInCenter={true}
          twoRowForm={false}
        />

        <div className="text-center mt-3 d-flex justify-content-between">
          <p className="mb-1">
            Already have an account?{" "}
            <Link to="/login" className="text-decoration-none">Login</Link>
          </p>
          <p className="mb-0">
            <Link to="/reset-password" className="text-decoration-none">Forgot password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;

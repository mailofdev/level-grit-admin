// auth/components/RegisterForm.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DynamicForm from "../../components/forms/DynamicForm";

const RegisterForm = () => {
  const navigate = useNavigate();

  const schema = [
    { type: "input", name: "firstName", label: "First Name", required: true, minLength: 3 },
    { type: "input", name: "lastName", label: "Last Name", required: true, minLength: 3 },
    { type: "email", name: "email", label: "Email", required: true },
    { type: "password", name: "password", label: "Password", required: true, minLength: 6 },
    { type: "input", name: "phoneNumber", label: "Phone Number", required: true },
    { type: "select", name: "gender", label: "Gender", required: true, options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" }
    ]},
    { type: "select", name: "role", label: "Role", required: true, options: [
      { value: "user", label: "User" },
      { value: "admin", label: "Admin" }
    ]}
  ];

  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setErrorMessage("");
    setLoading(true);
    try {
      // Example API call
      // await registerAPI(data);
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
        <h4 className="mb-3 text-center">Register</h4>

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
          twoRowForm={true}
        />

        <div className="text-center mt-3">
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

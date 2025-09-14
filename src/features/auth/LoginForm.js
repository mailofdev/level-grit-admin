// src/features/auth/components/LoginForm.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginThunk } from "./authThunks";
import { encryptToken } from "../../utils/crypto";
import DynamicForm from "../../components/forms/DynamicForm";
import routes from "../../components/navigation/Routes";
import DisplayImage from "../../components/display/DisplayImage";
import logo from "../../assets/images/logo2.png";
const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const schema = [
    { type: "email", name: "email", label: "Email", required: true },
    { type: "password", name: "password", label: "Password", required: true },
  ];

  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

const handleSubmit = async (data) => {
  setErrorMessage("");
  try {
    const result = await dispatch(loginThunk(formData));
    const encryptedUserData = encryptToken(result?.payload?.userInfo ? JSON.stringify(result.payload.userInfo) : "");
    sessionStorage.setItem("user", JSON.stringify(encryptedUserData));
    navigate("/dashboard", { replace: true });
  } catch (error) {
    const message = error?.message || String(error) || "Login failed. Please try again.";
    setErrorMessage(message);
  }
};



  const handleCancel = () => {
    setFormData({});
    setErrorMessage("");
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
        <h4 className="mb-3 text-center">Login</h4>
        {errorMessage && (
          <div className="alert alert-danger py-2">{errorMessage}</div>
        )}

        <DynamicForm
          schema={schema}
          formData={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          singleButtonInCenter={true}
          twoRowForm={false}
        />

        <div className="text-center mt-3">
          <p className="mb-1">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-decoration-none">
              Register
            </Link>
          </p> 
          <p className="mb-0">
            <Link to="/reset-password" className="text-decoration-none">
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

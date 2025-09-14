import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DynamicForm from "../../components/forms/DynamicForm";
import logo from "../../assets/images/logo.png";
import Heading from "../../components/navigation/Heading";
import { registerUser } from "../../api/authAPI";

const RegisterClientForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedClient } = location.state || {};

  const schema = [
  //   {
  //   type: "disabledInput",
  //   name: "trainerName",
  //   label: "Trainer Name",
  //   value: selectedClient?.name || ""
  // },
    {
      type: "input",
      name: "fullName",
      label: "Full Name",
      required: true,
    },
    { type: "email", name: "email", label: "Email", required: true },
    {
      type: "password",
      name: "password",
      label: "Password",
      required: true,
      minLength: 6,
    },
    {
      type: "input",
      name: "phoneNumber",
      label: "Phone Number",
      required: true,
    },
    {
      type: "select",
      name: "gender",
      label: "Gender",
      required: true,
      options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
      ],
    },
  ];


const [formData, setFormData] = useState(() => ({
  // trainerName: selectedClient?.name || ""
}));

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    const formData = { ...data, role: 0 };
    setErrorMessage("");
    setLoading(true);
    try {
      // Example API call
      await registerUser(formData);
      alert("✅ Registration successful!");
      navigate(-1);
    } catch (error) {
      setErrorMessage(
        error.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({});
    setErrorMessage("");
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ borderRadius: "10px" }}
    >
      <div
        className="card p-4 shadow-sm"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <Heading pageName="Register Client" sticky={true} />
        <br />
        {errorMessage && (
          <div className="alert alert-danger py-2">{errorMessage}</div>
        )}
        <DynamicForm
          schema={schema}
          formData={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          actionButtonName={loading ? "Registering client..." : "Register client"}
          singleButtonInCenter={true}
          twoRowForm={false}
        />
      </div>
    </div>
  );
};

export default RegisterClientForm;

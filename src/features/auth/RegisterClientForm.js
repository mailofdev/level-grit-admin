import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";   // ✅ PrimeReact Toast
import DynamicForm from "../../components/forms/DynamicForm";
import Heading from "../../components/navigation/Heading";
import { RegisterClient } from "../../api/authAPI";
import Loader from "../../components/display/Loader";

const RegisterClientForm = () => {
  const navigate = useNavigate();
  const toast = useRef(null);  // ✅ Toast ref

  const schema = [
    { type: "input", name: "fullName", label: "Full Name", required: true },
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
    { type: "date", name: "dateOfBirth", label: "Date of Birth" },
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

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    const clientData = { ...data, role: 0 };
    setLoading(true);

    try {
      await RegisterClient(clientData);

      // ✅ Success Toast
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Registration successful!",
        life: 3000,
      });

      setFormData({}); // reset form after success

      setTimeout(() => navigate(-1), 2500); // redirect after toast
    } catch (error) {
      // ❌ Error Toast
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail:
          error?.response?.data?.message ||
          "Registration failed. Please try again.",
        life: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({});
  };

  return (
    <div className="container-fluid px-2 px-md-4">
      {loading && (
        <Loader
          fullScreen={true}
          text="Registering client..."
          color="#28a745"
        />
      )}

      {/* ✅ PrimeReact Toast */}
      <Toast ref={toast} position="top-right" />

         <div className="m-2 p-2 bg-white rounded shadow-sm">
        <Heading pageName="Register Client" sticky={true} />
        <br />
<div style={{ marginTop: "20px" }}></div>

          <DynamicForm
            schema={schema}
            formData={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            actionButtonName={
              loading ? "Registering client..." : "Register client"
            }
            singleButtonInCenter={true}
            twoRowForm={false}
          />
      </div>
    </div>
  );
};

export default RegisterClientForm;

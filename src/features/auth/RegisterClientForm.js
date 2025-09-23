import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import DynamicForm from "../../components/forms/DynamicForm";
import Heading from "../../components/navigation/Heading";
import { RegisterClient } from "../../api/authAPI";
import Loader from "../../components/display/Loader";

const RegisterClientForm = () => {
  const navigate = useNavigate();
  const toast = useRef(null);

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
    { type: "number", name: "height", label: "Height" },
    { type: "number", name: "weight", label: "Weight" },
    { type: "number", name: "targetWeight", label: "Target Weight" },
    {
      type: "select",
      name: "goal",
      label: "Goal",
      required: true,
      options: [
        { value: 0, label: "Weight Gain" },
        { value: 1, label: "Weight Loss" },
      ],
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

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    const clientData = { ...data, role: 0 };
    setLoading(true);

    try {
      await RegisterClient(clientData);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Registration successful!",
        life: 3000,
      });
      setFormData({});
      setTimeout(() => navigate(-1), 1000);
    } catch (error) {
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

  const handleCancel = () => setFormData({});

  return (
    <div className="container px-2 px-md-4">
      {loading && (
        <Loader
          fullScreen={true}
          text="Registering client..."
          color="#28a745"
        />
      )}
      <Toast ref={toast} position="top-right" />
      <div className="bg-white rounded shadow-sm">
        <Heading pageName="Register Client" sticky={true} />
        <div className="p-3">
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
    </div>
  );
};

export default RegisterClientForm;

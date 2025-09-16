import React, { useState } from "react";
import { 
  // useLocation,
   useNavigate } from "react-router-dom";
import DynamicForm from "../../components/forms/DynamicForm";
import Heading from "../../components/navigation/Heading";
import { registerUser } from "../../api/authAPI";
import Loader from "../../components/display/Loader";
const RegisterClientForm = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  // const { selectedClient } = location.state || {};

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
  const [alertData, setAlertData] = useState({
    show: false,
    type: "",
    message: "",
  });

  const handleSubmit = async (data) => {
    const formData = { ...data, role: 0 };
    setLoading(true);
    try {
      await registerUser(formData);
      setLoading(false);
      showAlert("success", "✅ Registration successful!");
    } catch (error) {
      showAlert("danger", error.message || "❌ Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({});
    setAlertData({ show: false, type: "", message: "" });
  };

  const showAlert = (type, message) => {
    setAlertData({ show: true, type, message });
    setTimeout(() => {
      setAlertData({ show: false, type: "", message: "" });
      if (type === "success") {
        navigate(-1);
      }
    }, 3000);
  };

  return (
    <>
 <div className="container-fluid px-2 px-md-4">
    {loading && <Loader fullScreen={true} text="Logging in..." color="#FF5733" />} 
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
          actionButtonName={loading ? "Registering client..." : "Register client"}
          singleButtonInCenter={true}
          twoRowForm={false}
        />
      </div>

      {alertData.show && (
        <div className={`alert alert-${alertData.type} top-0 end-0 m-3`} role="alert">
          {alertData.message}
        </div>
      )}
</div>
    </>
  );
};

export default RegisterClientForm;

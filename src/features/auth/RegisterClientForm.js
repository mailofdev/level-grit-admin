import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DynamicForm from "../../components/forms/DynamicForm";
import Heading from "../../components/navigation/Heading";
import { registerUser } from "../../api/authAPI";

const RegisterClientForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedClient } = location.state || {};

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
  const [modalData, setModalData] = useState({
    show: false,
    type: "",
    message: "",
  });

  const handleSubmit = async (data) => {
    const formData = { ...data, role: 0 };
    setLoading(true);
    try {
      await registerUser(formData);
      setModalData({
        show: true,
        type: "success",
        message: "✅ Registration successful!",
      });
    } catch (error) {
      setModalData({
        show: true,
        type: "danger",
        message: error.message || "❌ Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({});
    setModalData({ show: false, type: "", message: "" });
  };

  const closeModal = () => {
    setModalData({ show: false, type: "", message: "" });
    if (modalData.type === "success") {
      navigate(-1);
    }
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

      {/* Bootstrap Modal */}
      {modalData.show && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className={`modal-header bg-${modalData.type} text-white`}>
                <h5 className="modal-title">
                  {modalData.type === "success"
                    ? "Success"
                    : "Error"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>{modalData.message}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className={`btn btn-${modalData.type}`}
                  onClick={closeModal}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterClientForm;

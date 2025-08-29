import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import DynamicForm from "../../components/forms/DynamicForm";

const InvitationDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("add"); // add, edit, view

  const schema = [
    {
      type: "input",
      name: "title",
      label: "Title",
      required: true,
      minLength: 3,
      maxLength: 30,
    },
    {
      type: "input",
      name: "description",
      label: "Description",
      minLength: 5,
      maxLength: 100,
    },
    {
      type: "textarea",
      name: "textarea",
      label: "Textarea",
      required: true,
      minLength: 10,
      maxLength: 200,
    },
    {
      type: "select",
      name: "select",
      label: "Select",
      required: true,
      options: [
        { value: "", label: "Select..." },
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3" },
      ],
    },
    {
      type: "checkbox",
      name: "checkbox",
      label: "Checkbox",
      required: true,
    },
    {
      type: "radio",
      name: "radio",
      label: "Radio",
      required: true,
      options: [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3" },
      ],
    },
    {
      type: "date",
      name: "date",
      label: "Date",
      required: true,
    },
    {
      type: "password",
      name: "password",
      label: "Password",
      required: true,
      minLength: 6,
      maxLength: 20,
    },
    {
      type: "email",
      name: "email",
      label: "Email",
      required: true,
      pattern: "^\\S+@\\S+\\.\\S+$",
    },
  ];

  useEffect(() => {
    // Determine mode from URL params or location state
    if (id === "new") {
      setMode("add");
    } else if (id) {
      setMode(location.state?.mode || "view");
      // Load invitation data if editing/viewing
      if (location.state?.formData) {
        setFormData(location.state.formData);
      }
    }
  }, [id, location.state]);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      // Implement your API call here
      console.log("Submitting data:", data, "Mode:", mode);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to invitations list
      navigate("/invitations");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/invitations");
  };

  const getPageTitle = () => {
    switch (mode) {
      case "add":
        return "Add New Invitation";
      case "edit":
        return "Edit Invitation";
      case "view":
        return "View Invitation";
      default:
        return "Invitation Details";
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">{getPageTitle()}</h2>
        {/* <button 
          className="btn btn-outline-secondary" 
          onClick={handleCancel}
        >
          Back to Invitations
        </button> */}
      </div>
      
      <div className="card shadow-sm">
        <div className="card-body">
          <DynamicForm
            schema={schema}
            mode={mode}
            isEditing={mode === "edit"}
            formData={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default InvitationDetails; 
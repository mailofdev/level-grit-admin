import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import DynamicForm from "../../components/forms/DynamicForm";
import { useDispatch, useSelector } from "react-redux";
import { addUser, editUser } from "../../features/users/userSlice";

const UserDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.users);

  const [formData, setFormData] = useState({});
  const [mode, setMode] = useState("add");

  const baseSchema = [
    { type: "input", name: "firstName", label: "First Name", minLength: 3 },
    { type: "input", name: "lastName", label: "Last Name", minLength: 3 },
    { type: "email", name: "email", label: "Email" },
    { type: "password", name: "password", label: "Password", minLength: 6 },
    { type: "input", name: "phoneNumber", label: "Phone Number" },
    {
      type: "select",
      name: "gender",
      label: "Gender",
      options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" }
      ]
    },
    {
      type: "select",
      name: "role",
      label: "Role",
      options: [
        { value: "user", label: "User" },
        { value: "admin", label: "Admin" }
      ]
    }
  ];

  useEffect(() => {
    if (id === "new") {
      setMode("add");
      setFormData({});
    } else if (id) {
      setMode(location.state?.mode || "view");
      if (location.state?.formData) {
        setFormData(location.state.formData);
      } else {
        console.warn("No formData passed via state for edit/view mode.");
        setFormData({});
      }
    }
  }, [id, location.state]);

  const handleSubmit = async (data) => {
    try {
      if (mode === "add") {
        await dispatch(addUser(data)).unwrap();
      } else if (mode === "edit") {
        await dispatch(editUser({ id: data._id, data })).unwrap();
      }
      navigate("/users");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleCancel = () => {
    navigate("/users");
  };

  const getPageTitle = () => {
    switch (mode) {
      case "add":
        return "Add New User";
      case "edit":
        return `Edit ${formData.firstName || "User"}`;
      case "view":
        return `View ${formData.firstName || "User"}`;
      default:
        return "User";
    }
  };

  // Filter schema based on mode
  const filteredSchema = baseSchema.filter((field) => {
    if (mode === "edit") {
      return field.name !== "password" && field.name !== "role";
    }
    if (mode === "view") {
      return field.name !== "password";
    }
    return true;
  });

  return (
    <div className="container py-4">
      <div className="fw-bold mb-4">{getPageTitle()}</div>
      <div className="card shadow-sm">
        <div className="card-body">
          <DynamicForm
            schema={filteredSchema}
            mode={mode}
            isEditing={mode === "edit" || mode === "add"}
            formData={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDetails;

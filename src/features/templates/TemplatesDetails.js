import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import DynamicForm from "../../components/forms/DynamicForm";
import { useDispatch, useSelector } from "react-redux";
import {
  addTemplate,
  editTemplate,
} from "../../features/templates/templateSlice";
import AlertMessage from "../../components/common/AlertMessage"; // <-- import alert component

const TemplateDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.templates);

  const [formData, setFormData] = useState({});
  const [mode, setMode] = useState("add");
  const [alertData, setAlertData] = useState(null); // <-- state for alerts

  // Template form schema
  const baseSchema = [
    { type: "input", name: "name", label: "Template Name", minLength: 3 },
    {
      type: "select",
      name: "category",
      label: "Category",
      options: [
        { value: "wedding", label: "Wedding" },
        { value: "birthday", label: "Birthday" },
        { value: "corporate", label: "Corporate" },
        { value: "other", label: "Other" },
      ],
    },
    { type: "tags", name: "tags", label: "Tags" },
    { type: "file", name: "thumbnailUrl", label: "Thumbnail Image" },
    { type: "multiFile", name: "assetUrls", label: "Template Assets" },
    {
      type: "select",
      name: "status",
      label: "Status",
      options: [
        { value: "active", label: "Active" },
        { value: "draft", label: "Draft" },
      ],
    },
    {
      type: "array",
      name: "placeholders",
      label: "Placeholders",
      fields: [
        { type: "input", name: "key", label: "Key" },
        { type: "input", name: "label", label: "Label" },
      ],
    },
    { type: "json", name: "designData", label: "Design Data" },
    { type: "number", name: "price", label: "Price", min: 0 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (id === "new") {
        setMode("add");
        setFormData({});
        return;
      }

      if (location.state?.formData) {
        setFormData(location.state.formData);
      } else {
        try {
          const res = await fetch(`/api/templates/${id}`);
          if (!res.ok) throw new Error("Failed to fetch template");
          const data = await res.json();

          setFormData({
            ...data,
            tags: Array.isArray(data.tags) ? data.tags : [],
            placeholders: Array.isArray(data.placeholders)
              ? data.placeholders
              : [],
            designData: data.designData || {},
            assetUrls: Array.isArray(data.assetUrls) ? data.assetUrls : [],
            thumbnailUrl: data.thumbnailUrl || "",
          });
        } catch (err) {
          console.error("Error loading template:", err);
          setFormData({});
        }
      }
    };

    fetchData();
  }, [id, location.state]);

  
  const handleSubmit = async (data) => {
  try {
    // 🔧 Clean and normalize data before dispatch
    const cleanedData = {
      ...data,
      price: data.price ? Number(data.price) : 0,
      tags: Array.isArray(data.tags) ? data.tags : [],
      placeholders: Array.isArray(data.placeholders) ? data.placeholders : [],
      assetUrls: (data.assetUrls || [])
        .filter((item) => typeof item === "string" && item.trim() !== ""),
      thumbnailUrl:
        typeof data.thumbnailUrl === "string" ? data.thumbnailUrl : null,
    };

    if (mode === "add") {
      await dispatch(addTemplate(cleanedData)).unwrap();
      setAlertData({
        type: "success",
        messages: "Template added successfully!",
      });
      setTimeout(() => navigate("/templates"), 1500);
    } else if (mode === "edit") {
      await dispatch(editTemplate({ id: data._id, data: cleanedData })).unwrap();
      setAlertData({
        type: "success",
        messages: "Template updated successfully!",
      });
      navigate("/templates");
    }
  } catch (error) {
    let messages = error?.message || "Something went wrong while saving template.";
    setAlertData({
      type: "danger",
      messages,
    });
    console.error("Error submitting form:", error);
  }
};


  const handleCancel = () => {
    navigate("/templates");
  };

  const getPageTitle = () => {
    switch (mode) {
      case "add":
        return "Add New Template";
      case "edit":
        return `Edit ${formData.name || "Template"}`;
      case "view":
        return `View ${formData.name || "Template"}`;
      default:
        return "Template";
    }
  };

  return (
    <div className="container py-4">
      {/* 🔔 Show Alert if present */}
      {alertData && (
        <AlertMessage
          type={alertData.type}
          messages={alertData.messages}
          onClose={() => setAlertData(null)}
        />
      )}

      <div className="fw-bold mb-4">{getPageTitle()}</div>
      <div className="card shadow-sm">
        <div className="card-body">
          <DynamicForm
            schema={baseSchema}
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

export default TemplateDetails;

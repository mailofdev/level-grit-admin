// src/api/authAPI.js
import axiosInstance from "./axiosInstance";

// Get all templates
export const getTemplateList = async () => {
  const { data } = await axiosInstance.get("/templates");
  return data;
};

// Get single template by ID
export const getTemplateById = async (id) => {
  const { data } = await axiosInstance.get(`/templates/${id}`);
  return data;
};

// Create new template
export const createTemplate = async (data) => {
  const { data: resData } = await axiosInstance.post("/templates", data);
  return resData;
};

// Update template
export const updateTemplateById = async (id, data) => {
  const { data: resData } = await axiosInstance.patch(`/templates/${id}`, data);
  return resData;
};

// Delete template
export const deleteTemplateById = async (id) => {
  const { data: resData } = await axiosInstance.delete(`/templates/${id}`);
  return resData;
};

// Upload thumbnail image
export const uploadTemplateThumbnail = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data: resData } = await axiosInstance.post("/templates/upload-thumbnail", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return resData;
};

// Upload multiple assets
export const uploadTemplateAssets = async (files) => {
  const formData = new FormData();
  files.forEach(file => formData.append("files", file));

  const { data: resData } = await axiosInstance.post("/templates/upload-assets", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return resData;
};

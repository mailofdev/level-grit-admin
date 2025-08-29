// src/api/authAPI.js
import axiosInstance from "./axiosInstance";

export const loginUser = async (credentials) => {
  const { data } = await axiosInstance.post("/auth/login", credentials);
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await axiosInstance.post("/auth/signup", userData);
  return data;
};

export const getUserList = async () => {
  const { data } = await axiosInstance.get("/users", {
  });
  return data;
};

export const deleteUserById = async (id) => {
  return axiosInstance.delete(`/users/${id}`);
};

// 🔹 New for Update
export const updateUserById = async (id, updatedData) => {
  const { data } = await axiosInstance.patch(`/users/${id}`, updatedData);
  return data;
};

// 🔹 New for Get One
export const getUserById = async (id) => {
  const { data } = await axiosInstance.get(`/users/${id}`, {
  });
  return data;
};

// src/api/authAPI.js
import axiosInstance from "./axiosInstance";

export const loginUser = async (credentials) => {
  const { data } = await axiosInstance.post("api/auth/login", credentials);
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await axiosInstance.post("api/auth/register", userData);
  return data;
};
export const RegisterClient = async (userData) => {
  const { data } = await axiosInstance.post("api/Trainer/Register-client", userData);
  return data;
};

export const GetClientsForTrainer = async () => {
  const { data } = await axiosInstance.get("api/Trainer/GetClientsForTrainer"); 
  return data;
};

export const GetProfileData = async () => {
  const { data } = await axiosInstance.get("api/Auth/Profile");
  return data;
};

export const UpdateProfileData = async (userData) => {
  const { data } = await axiosInstance.post("api/Auth/UpdateProfile", userData);
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

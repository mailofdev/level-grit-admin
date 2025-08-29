// src/api/axiosInstance.js
import axios from "axios";
import { decryptToken } from "../utils/crypto";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use((config) => {
  const encrypted = sessionStorage.getItem("access_token");
  if (encrypted) {
    const token = decryptToken(encrypted);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      sessionStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;

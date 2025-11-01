// src/api/axiosInstance.js
import axios from "axios";
import { decryptToken } from "../utils/crypto";

const axiosInstance = axios.create({
   baseURL: "https://localhost:7240",
  // If your backend runs on HTTPS (with valid local certs):
  // baseURL: "https://192.168.31.231:7240",

  // Most common case (HTTP, same local network)
  // baseURL: "https://192.168.31.231:7240",
 // 👈 include correct port here
  timeout: 10000,
});

axiosInstance.interceptors.request.use((config) => {
  const encrypted = sessionStorage.getItem("auth_data");
  if (encrypted) {
    const decrypted = decryptToken(encrypted);
    const authData = JSON.parse(decrypted || "{}");
    if (authData?.accessToken) {
      config.headers.Authorization = `Bearer ${authData.accessToken}`;
    }
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

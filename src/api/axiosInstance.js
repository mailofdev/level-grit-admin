// src/api/axiosInstance.js
import axios from "axios";
import { decryptToken } from "../utils/crypto";
import { formatErrorMessage, logError } from "../utils/errorHandler";

const axiosInstance = axios.create({
   baseURL: "https://localhost:7240",
  // If your backend runs on HTTPS (with valid local certs):
  // baseURL: "https://192.168.31.231:7240",

  // Most common case (HTTP, same local network)
  // baseURL: "https://192.168.31.231:7240",
 // 👈 include correct port here
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const encrypted = sessionStorage.getItem("auth_data");
    if (encrypted) {
      try {
        const decrypted = decryptToken(encrypted);
        const authData = JSON.parse(decrypted || "{}");
        if (authData?.accessToken) {
          config.headers.Authorization = `Bearer ${authData.accessToken}`;
        }
      } catch (error) {
        logError(error, "Axios Request Interceptor");
        // Clear invalid auth data
        sessionStorage.removeItem("auth_data");
      }
    }
    return config;
  },
  (error) => {
    logError(error, "Axios Request Error");
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    // Log error for debugging
    logError(err, "Axios Response Error");

    // Handle 401 Unauthorized - redirect to login
    if (err.response?.status === 401) {
      sessionStorage.clear();
      // Use setTimeout to avoid navigation during render
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
      return Promise.reject(err);
    }

    // Format error message for better user experience
    const formattedError = new Error(formatErrorMessage(err));
    formattedError.response = err.response;
    formattedError.request = err.request;
    formattedError.config = err.config;
    
    return Promise.reject(formattedError);
  }
);

export default axiosInstance;

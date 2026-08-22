import axios from "axios";

export const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally (except for sandbox/proxy API testing)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const isModelInferenceOrProxy = url.includes("/proxy/") || url.includes("/deploy") || url.includes("/models/predict");
    
    if (error.response?.status === 401 && !isModelInferenceOrProxy) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;

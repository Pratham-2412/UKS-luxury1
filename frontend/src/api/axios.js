import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor: attach token ────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("uksToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 ────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("uksToken");
      localStorage.removeItem("uksUser");
      
      // Don't redirect if we're already on the login page or attempting to login
      const isLoginPath = window.location.pathname === "/admin/login";
      const isLoginRequest = error.config.url.includes("/auth/login");

      if (!isLoginPath && !isLoginRequest && window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
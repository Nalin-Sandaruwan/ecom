import axios from "axios";

const isProd = process.env.NODE_ENV === "production";
const defaultAPIUrl = isProd
  ? "http://127.0.0.1:5000/api/v1"
  : "http://localhost:5000/api/v1";

// Create a globally configured Axios instance
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || defaultAPIUrl,
  withCredentials: true, // Crucial for sending setting HTTP-Only cookies automatically
});

// Response interceptor to handle global errors like 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error) => {
    // Catch 401 and redirect to login automatically
    if (error.response?.status === 401) {
      // Bypass redirect for profile checks and login attempts
      const isAuthRequest =
        error.config?.url?.includes("/") || error.config?.url?.includes("/");

      if (isAuthRequest) {
        return Promise.reject(error); // Silently fail the session check
      }
      console.warn("Unauthorized access detected, redirecting to login...");

      // Ensure we are in the browser context before attempting to redirect
      if (typeof window !== "undefined") {
        const loginUrl = "/login";
        // Avoid infinite redirect loops if we are already on the login page
        if (window.location.pathname !== loginUrl) {
          window.location.href = loginUrl;
        }
      }
    }

    return Promise.reject(error);
  },
);

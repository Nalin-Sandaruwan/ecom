import { apiClient } from "./apiClient";

export interface SignupPayload {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  [key: string]: any;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export const signup = async (data: SignupPayload) => {
  const response = await apiClient.post("/auth/signup", data);
  return response.data;
};

export const login = async (data: LoginPayload) => {
  const response = await apiClient.post("/auth/login", data);
  return response.data;
};

export const getMe = async () => {
  const response = await apiClient.get("/auth/me");
  return response.data;
};

export const logout = async () => {
  const response = await apiClient.post("/auth/logout");
  return response.data;
};

export const updateMe = async (data: { name?: string; phone?: string }) => {
  const response = await apiClient.patch("/users/me", data);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await apiClient.post("/auth/forgot-password", { email });
  return response.data;
};

export const verifyOTP = async (data: { email: string; otp: string }) => {
  const response = await apiClient.post("/auth/verify-otp", data);
  return response.data;
};

export const resetPassword = async (data: { email: string; otp: string; password?: string }) => {
  const response = await apiClient.post("/auth/reset-password", data);
  return response.data;
};

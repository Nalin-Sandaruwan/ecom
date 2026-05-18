import { apiClient } from "./apiClient";

export interface UserDetail {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUsersResponse {
  status: string;
  results: number;
  data: {
    users: UserDetail[];
  };
}

export const getAdminUsers = async (): Promise<AdminUsersResponse> => {
  const response = await apiClient.get("/admin/users");
  return response.data;
};

export const getAdminUser = async (id: string): Promise<{ data: { user: UserDetail } }> => {
  const response = await apiClient.get(`/admin/users/${id}`);
  return response.data;
};

export const updateAdminUser = async (id: string, data: Partial<UserDetail>) => {
  const response = await apiClient.patch(`/admin/users/${id}`, data);
  return response.data;
};

export const deleteAdminUser = async (id: string) => {
  const response = await apiClient.delete(`/admin/users/${id}`);
  return response.data;
};

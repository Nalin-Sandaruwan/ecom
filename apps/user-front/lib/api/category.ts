import { apiClient } from "./apiClient";

export interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const getAllCategories = async () => {
  const response = await apiClient.get("/categories");
  return response.data;
};

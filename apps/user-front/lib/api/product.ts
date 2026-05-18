import { apiClient } from "./apiClient";

export const createProduct = async (formData: FormData) => {
  const response = await apiClient.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getProducts = async () => {
  const response = await apiClient.get("/products");
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await apiClient.get(`/products/${id}`);
  return response.data;
};

export const getFarmerProducts = async () => {
  const response = await apiClient.get("/products/farmer");
  return response.data;
};

export const updateProduct = async (id: string, formData: FormData) => {
  const response = await apiClient.patch(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await apiClient.delete(`/products/${id}`);
  return response.data;
};

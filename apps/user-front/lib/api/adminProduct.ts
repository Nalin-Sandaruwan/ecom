import { apiClient } from "./apiClient";

export interface AdminProduct {
  _id: string;
  productName: string;
  productDescription: string;
  price: number;
  quantity: number;
  imageURIs: string[];
  certificateURIs?: string[];
  productType: string;
  farmerId: {
    _id: string;
    name: string;
    email: string;
  };
  categoryId: {
    _id: string;
    name: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProductsResponse {
  status: string;
  results: number;
  data: {
    products: AdminProduct[];
  };
}

export const getAdminProducts = async (): Promise<AdminProductsResponse> => {
  const response = await apiClient.get("/products/admin/all");
  return response.data;
};

export const deleteAdminProduct = async (id: string) => {
  const response = await apiClient.delete(`/admin/products/${id}`);
  return response.data;
};

export const approveAdminProduct = async (id: string) => {
  const response = await apiClient.patch(`/products/approve/${id}`);
  return response.data;
};

import { apiClient } from "./apiClient";

export interface AdminOrderItem {
  product: {
    _id: string;
    productName: string;
    price: number;
    imageURIs: string[];
  };
  quantity: number;
  price: number;
}

export interface AdminOrder {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  items: AdminOrderItem[];
  totalPrice: number;
  deliveryAddress: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrdersResponse {
  status: string;
  results: number;
  data: {
    orders: AdminOrder[];
  };
}

export const getAdminOrders = async (): Promise<AdminOrdersResponse> => {
  const response = await apiClient.get("/admin/orders");
  return response.data;
};

export const updateAdminOrderStatus = async (id: string, status: string) => {
  const response = await apiClient.patch(`/admin/orders/${id}/status`, { status });
  return response.data;
};

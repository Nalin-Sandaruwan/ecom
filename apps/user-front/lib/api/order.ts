import { apiClient } from "./apiClient";

export interface OrderItem {
  product: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  totalPrice: number;
  deliveryAddress: string;
  status: string;
  paymentStatus: string;
  trackingNumber?: string;
  paymentSlipURI?: string;
}

export const createOrder = async (orderData: {
  items: { product: string; quantity: number }[];
  deliveryAddress: string;
  contactPhone: string;
}) => {
  const response = await apiClient.post("/orders", orderData);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await apiClient.get("/orders/mine");
  return response.data;
};

export const getOrderDetails = async (orderId: string) => {
  const response = await apiClient.get(`/orders/${orderId}`);
  return response.data;
};

export const getAllOrders = async () => {
  const response = await apiClient.get("/orders");
  return response.data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const response = await apiClient.patch(`/orders/${orderId}/status`, { status });
  return response.data;
};

export const updateOrderDetails = async (orderId: string, updateData: { trackingNumber?: string; paymentStatus?: string }) => {
  const response = await apiClient.patch(`/orders/${orderId}`, updateData);
  return response.data;
};

export const uploadPaymentSlip = async (orderId: string, file: File) => {
  const formData = new FormData();
  formData.append("paymentSlip", file);
  const response = await apiClient.patch(`/orders/${orderId}/payment-slip`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

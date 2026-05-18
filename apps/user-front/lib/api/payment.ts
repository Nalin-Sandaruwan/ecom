import { apiClient } from "./apiClient";

export const createCheckoutSession = async (orderId: string) => {
  const response = await apiClient.post(`/payments/create-checkout-session/${orderId}`);
  return response.data;
};

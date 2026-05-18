import { apiClient } from "./apiClient";

export interface CartItem {
  product: {
    _id: string;
    productName: string;
    price: number;
    imageURIs: string[];
    productType?: string;
  };
  quantity: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
}

export const getCart = async () => {
  const response = await apiClient.get("/cart");
  return response.data;
};

export const addToCart = async (productId: string, quantity: number = 1) => {
  const response = await apiClient.post("/cart", { productId, quantity });
  return response.data;
};

export const updateCartItem = async (productId: string, quantity: number) => {
  const response = await apiClient.patch("/cart/update", { productId, quantity });
  return response.data;
};

export const removeFromCart = async (productId: string) => {
  const response = await apiClient.delete(`/cart/remove/${productId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await apiClient.delete("/cart");
  return response.data;
};

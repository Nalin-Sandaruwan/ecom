import { apiClient } from "./apiClient";

export interface Review {
  _id: string;
  review: string;
  rating: number;
  productId: string;
  userId: {
    _id: string;
    name: string;
  };
  orderId: string;
  createdAt: string;
  updatedAt: string;
}

export const createReview = async (reviewData: {
  productId: string;
  orderId: string;
  rating: number;
  review: string;
}) => {
  const response = await apiClient.post("/reviews", reviewData);
  return response.data;
};

export const getProductReviews = async (productId: string) => {
  const response = await apiClient.get(`/reviews/product/${productId}`);
  return response.data;
};

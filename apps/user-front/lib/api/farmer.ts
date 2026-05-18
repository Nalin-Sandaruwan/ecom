import { apiClient } from "./apiClient";

export interface FarmerProfilePayload {
  farmName: string;
  description: string;
  address: string;
  [key: string]: any;
}

export const createFarmerProfile = async (data: FarmerProfilePayload) => {
  const response = await apiClient.post("/farmer-profiles", data);
  return response.data;
};

export const getFarmerProfile = async () => {
  const response = await apiClient.get("/farmer-profiles/me");
  return response.data;
};

export const getFarmerProfileById = async (id: string) => {
  const response = await apiClient.get(`/farmer-profiles/${id}`);
  return response.data;
};

export const getFarmerStats = async () => {
  const response = await apiClient.get("/farmer/stats");
  return response.data;
};

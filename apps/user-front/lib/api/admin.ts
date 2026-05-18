import { apiClient } from "./apiClient";

export interface AdminStats {
  metrics: {
    totalRevenue: number;
    globalUsers: number;
    newOrders: number;
    systemLoad: number;
  };
}

export const getAdminStats = async (): Promise<AdminStats> => {
  const response = await apiClient.get("/admin/stats");
  return response.data;
};

import { useQuery } from "@tanstack/react-query";
import { getAdminStats } from "../api/admin";

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: getAdminStats,
    refetchInterval: 60000, // Refetch every minute for real-time feel
  });
};

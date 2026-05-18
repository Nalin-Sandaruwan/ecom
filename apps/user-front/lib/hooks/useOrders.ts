import { useQuery } from "@tanstack/react-query";
import { getMyOrders } from "../api/order";

export const useOrders = (enabled = true) => {
  return useQuery({
    queryKey: ["orders", "mine"],
    queryFn: async () => {
      const response = await getMyOrders();
      return response.data.orders;
    },
    enabled,
  });
};

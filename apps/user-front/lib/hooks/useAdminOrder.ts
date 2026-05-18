import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminOrders, updateAdminOrderStatus } from "../api/adminOrder";
import { toast } from "sonner";

export const useAdminOrders = () => {
  return useQuery({
    queryKey: ["admin", "orders"],
    queryFn: getAdminOrders,
  });
};

export const useUpdateAdminOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      updateAdminOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      toast.success("Order status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update order status");
    },
  });
};

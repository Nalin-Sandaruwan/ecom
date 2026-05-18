import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllOrders, updateOrderStatus } from "../api/order";
import { toast } from "sonner";

export const useFarmerOrders = () => {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ["farmer-orders"],
    queryFn: async () => {
      const response = await getAllOrders();
      return response.data.orders;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      toast.success("Order status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["farmer-orders"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update status";
      toast.error(message);
    },
  });

  return {
    orders: ordersQuery.data || [],
    isLoading: ordersQuery.isLoading,
    error: ordersQuery.error,
    updateStatus: updateStatusMutation.mutate,
    isUpdating: updateStatusMutation.isPending,
  };
};

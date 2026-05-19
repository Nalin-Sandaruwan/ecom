import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyOrders, uploadPaymentSlip } from "../api/order";
import { toast } from "sonner";

export const useOrders = (enabled = true) => {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ["orders", "mine"],
    queryFn: async () => {
      const response = await getMyOrders();
      return response.data.orders;
    },
    enabled,
  });

  const uploadSlipMutation = useMutation({
    mutationFn: ({ orderId, file }: { orderId: string; file: File }) =>
      uploadPaymentSlip(orderId, file),
    onSuccess: () => {
      toast.success("Payment receipt uploaded successfully!");
      queryClient.invalidateQueries({ queryKey: ["orders", "mine"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to upload payment receipt";
      toast.error(message);
    },
  });

  return {
    ...ordersQuery,
    orders: ordersQuery.data,
    uploadSlip: uploadSlipMutation.mutate,
    isUploadingSlip: uploadSlipMutation.isPending,
  };
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminProducts, deleteAdminProduct, approveAdminProduct } from "../api/adminProduct";
import { toast } from "sonner";

export const useAdminProducts = () => {
  return useQuery({
    queryKey: ["admin", "products"],
    queryFn: getAdminProducts,
  });
};

export const useDeleteAdminProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdminProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      toast.success("Product successfully removed from playform");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove product");
    },
  });
};

export const useApproveAdminProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => approveAdminProduct(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      const isActive = data?.data?.product?.isActive;
      if (isActive) {
        toast.success("Product approved successfully!");
      } else {
        toast.success("Product approval revoked successfully");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to approve product");
    },
  });
};

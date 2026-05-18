import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getAdminUsers, 
  getAdminUser, 
  updateAdminUser, 
  deleteAdminUser, 
  UserDetail 
} from "../api/adminUser";
import { toast } from "sonner";

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: getAdminUsers,
  });
};

export const useAdminUserDetail = (id: string | null) => {
  return useQuery({
    queryKey: ["admin", "users", id],
    queryFn: () => getAdminUser(id!),
    enabled: !!id,
  });
};

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserDetail> }) => 
      updateAdminUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User account updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update user");
    },
  });
};

export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdminUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User account removed permanently");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
    },
  });
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFarmerProfile,
  getFarmerProfile,
  getFarmerProfileById,
  getFarmerStats,
  FarmerProfilePayload,
} from "../api/farmer";
import { toast } from "sonner";

export const useCreateFarmerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FarmerProfilePayload) => createFarmerProfile(data),
    onSuccess: () => {
      toast.success("Farmer profile created successfully!");
      queryClient.invalidateQueries({ queryKey: ["farmer-profiles"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to create farmer profile.";
      toast.error(message);
    },
  });
};

//farmer's profile make by
export const useFarmerProfilesMe = () => {
  return useQuery({
    queryKey: ["farmer-profiles"],
    queryFn: getFarmerProfile,
  });
};

export const useFarmerProfile = (id: string) => {
  return useQuery({
    queryKey: ["farmer-profile", id],
    queryFn: () => getFarmerProfileById(id),
    enabled: !!id,
  });
};

export const useFarmerStats = () => {
  return useQuery({
    queryKey: ["farmer-stats"],
    queryFn: getFarmerStats,
    refetchOnWindowFocus: false,
  });
};

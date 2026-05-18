import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview, getProductReviews } from "../api/review";
import { toast } from "sonner";

export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const response = await getProductReviews(productId);
      return response.data.reviews;
    },
    enabled: !!productId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.productId] });
      toast.success("Artisanal experience shared. Review published.", {
        description: "Your feedback maintains our platform standards.",
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to publish review.";
      toast.error("Submission Halted", {
        description: message,
      });
    },
  });
};

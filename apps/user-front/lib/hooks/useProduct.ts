"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct, deleteProduct, getFarmerProducts, getProductById, getProducts, updateProduct } from "../api/product";
import { toast } from "sonner";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createProduct(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product listed successfully!", {
        description: "Your product is now live on the marketplace.",
      });
    },
    onError: (error: any) => {
      console.error("Product creation failed:", error);
      toast.error("Failed to list product", {
        description: error.response?.data?.message || "There was an error creating your product listing.",
      });
    },
  });
};

export const useFarmerProducts = () => {
  return useQuery({
    queryKey: ["farmer-products"],
    queryFn: getFarmerProducts,
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => updateProduct(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farmer-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully!");
    },
    onError: (error: any) => {
      toast.error("Failed to update product", {
        description: error.response?.data?.message || "There was an error updating your product.",
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farmer-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully!");
    },
    onError: (error: any) => {
      toast.error("Failed to delete product", {
        description: error.response?.data?.message || "There was an error deleting your product.",
      });
    },
  });
};

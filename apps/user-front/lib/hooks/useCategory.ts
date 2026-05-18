"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "../api/category";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getAllCategories();
      // Defensive check: handle both wrapped and unwrapped response formats
      const data = response?.data || response;
      return Array.isArray(data?.categories) ? data.categories : [];
    },
  });
};

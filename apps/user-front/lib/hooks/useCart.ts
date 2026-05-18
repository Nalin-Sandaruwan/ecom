"use client";

import { useEffect, useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  CartItem,
} from "../api/cart";
import { useMe } from "./useAuth";

const CART_STORAGE_KEY = "chille_bazzar_cart";

export const useCart = () => {
  const queryClient = useQueryClient();
  const { data: userData } = useMe();
  const isAuthenticated = !!userData?.user;

  // Guest Cart State
  const [guestItems, setGuestItems] = useState<CartItem[]>([]);

  // Load guest cart from localStorage on mount
  useEffect(() => {
    if (!isAuthenticated) {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        try {
          setGuestItems(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse guest cart", e);
        }
      }
    }
  }, [isAuthenticated]);

  // Sync internal state with localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(guestItems));
    }
  }, [guestItems, isAuthenticated]);

  // TanStack Query for Authenticated Cart
  const { data: cartData, isLoading: isCartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: isAuthenticated,
  });

  // Mutations
  const addMutation = useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => addToCart(productId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => updateCartItem(productId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => removeFromCart(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const clearMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  // Unified Cart Items
  const items = useMemo(() => {
    if (isAuthenticated) {
      return cartData?.data?.cart?.items || [];
    }
    return guestItems;
  }, [isAuthenticated, cartData, guestItems]);

  const totalItemsCount = useMemo(() => {
    return items.reduce(
      (acc: number, item: CartItem) => acc + item.quantity,
      0,
    );
  }, [items]);

  // Unified Actions
  const addItem = async (product: any, quantity: number = 1) => {
    if (isAuthenticated) {
      try {
        await addMutation.mutateAsync({ productId: product._id, quantity });
        toast.success(`${product.productName} added to cart`);
      } catch (error) {
        toast.error("Failed to add item to cart");
      }
    } else {
      // Guest logic
      setGuestItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.product?._id === product._id,
        );
        if (existingIndex > -1) {
          const newItems = [...prev];
          newItems[existingIndex].quantity += quantity;
          return newItems;
        }
        return [...prev, { product, quantity }];
      });
      toast.success(`${product.productName} added to cart (Guest Mode)`);
    }
  };

  const removeItem = async (productId: string) => {
    if (isAuthenticated) {
      try {
        await removeMutation.mutateAsync(productId);
        toast.success("Item removed from cart");
      } catch (error) {
        toast.error("Failed to remove item");
      }
    } else {
      setGuestItems((prev) =>
        prev.filter((item) => item.product?._id !== productId),
      );
      toast.info("Item removed from cart");
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (isAuthenticated) {
      try {
        await updateMutation.mutateAsync({ productId, quantity });
      } catch (error) {
        toast.error("Failed to update quantity");
      }
    } else {
      setGuestItems((prev) =>
        prev.map((item) =>
          item.product?._id === productId ? { ...item, quantity } : item,
        ),
      );
    }
  };

  // Merge guest cart on login (simplified: call mutation for each item)
  useEffect(() => {
    const mergeCarts = async () => {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (isAuthenticated && saved) {
        const guestCart = JSON.parse(saved);
        if (guestCart.length > 0) {
          toast.loading("Syncing your guest cart...", { id: "sync-cart" });
          for (const item of guestCart) {
            try {
              await addToCart(item.product._id, item.quantity);
            } catch (e) {
              console.error("Failed to sync item", item);
            }
          }
          localStorage.removeItem(CART_STORAGE_KEY);
          queryClient.invalidateQueries({ queryKey: ["cart"] });
          toast.success("Guest cart synced to your account", {
            id: "sync-cart",
          });
        }
      }
    };
    mergeCarts();
  }, [isAuthenticated, queryClient]);

  return {
    items,
    totalItemsCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart: isAuthenticated ? clearMutation.mutate : () => setGuestItems([]),
    isLoading:
      isCartLoading || addMutation.isPending || updateMutation.isPending,
  };
};

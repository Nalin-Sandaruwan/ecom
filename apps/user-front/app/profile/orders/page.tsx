"use client";

import React, { useEffect } from "react";
import { useMe } from "@/lib/hooks/useAuth";
import { useOrders } from "@/lib/hooks/useOrders";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

// Modular Components
import { OrderHeader } from "./components/OrderHeader";
import { EmptyOrders } from "./components/EmptyOrders";
import { OrderCard } from "./components/OrderCard";
import { OrdersFooter } from "./components/OrdersFooter";

export default function OrdersPage() {
  const { data: userData, isLoading: isAuthLoading } = useMe();
  const router = useRouter();

  // Only enable orders query if user is a 'user'
  const isUser = userData?.user?.role === "user";
  const { data: orders, isLoading: isOrdersLoading } = useOrders(isUser);

  // Role Guard
  useEffect(() => {
    if (!isAuthLoading && !userData?.user) {
      router.push("/login?redirect=/profile/orders");
    } else if (!isAuthLoading && userData?.user?.role !== "user") {
      router.push("/farmer-dashboard/dashboard");
    }
  }, [userData, isAuthLoading, router]);

  // Loading State
  if (isAuthLoading || (isOrdersLoading && isUser)) {
    return (
      <div className="space-y-8 h-full flex flex-col p-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48 rounded-xl" />
          <Skeleton className="h-4 w-64 rounded-lg" />
        </div>
        <div className="space-y-6 mt-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-[2.5rem]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 h-full flex flex-col">
      <OrderHeader orderCount={orders?.length || 0} />

      {!orders || orders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}

      <OrdersFooter />
    </div>
  );
}

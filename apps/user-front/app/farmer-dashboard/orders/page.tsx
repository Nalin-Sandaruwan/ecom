"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Search,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderSummaryStat } from "./components/OrderSummaryStat";
import { OrderCard } from "./components/OrderCard";
import { EmptyOrderState } from "./components/EmptyOrderState";
import { useFarmerOrders } from "@/lib/hooks/useFarmerOrders";
import { Skeleton } from "@/components/ui/skeleton";

export const ORDER_STATUSES = [
  { id: "all", label: "All Orders", icon: ShoppingBag },
  { id: "pending", label: "Pending", icon: Clock, color: "text-amber-500 bg-amber-500/10" },
  { id: "prepearing", label: "Preparing", icon: Clock, color: "text-blue-500 bg-blue-500/10" },
  { id: "delivering", label: "Delivering", icon: Truck, color: "text-blue-500 bg-blue-500/10" },
  { id: "completed", label: "Delivered", icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10" },
  { id: "cancelled", label: "Cancelled", icon: XCircle, color: "text-rose-500 bg-rose-500/10" },
];

export default function FarmerOrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { orders, isLoading } = useFarmerOrders();

  const filteredOrders = orders.filter((order: any) => {
    const matchesTab = activeTab === "all" || order.status === activeTab;
    const matchesSearch =
      order.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order._id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Calculate real stats
  const pendingCount = orders.filter((o: any) => o.status === "pending").length;
  const preparingCount = orders.filter((o: any) => o.status === "prepearing").length;
  const completedCount = orders.filter((o: any) => o.status === "completed").length;
  const totalRevenue = orders.reduce((acc: number, o: any) => acc + o.totalPrice, 0);

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            <ShoppingBag className="w-3 h-3" />
            Commerce Hub
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Coordinate your harvests and track elite deliveries.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl h-12 border-border/40 font-bold flex items-center gap-2 hover:bg-muted/10 transition-all">
            <Download className="w-4 h-4" />
            Export Manifest
          </Button>
        </div>
      </div>

      {/* Stats Quick Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "New Orders", value: pendingCount.toString(), icon: Clock, color: "text-amber-500" },
          { label: "Preparing", value: preparingCount.toString(), icon: Truck, color: "text-blue-500" },
          { label: "Completed", value: completedCount.toString(), icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Revenue", value: `LKR ${(totalRevenue / 1000).toFixed(1)}k`, icon: CheckCircle2, color: "text-primary" },
        ].map((stat, i) => (
          <OrderSummaryStat key={i} {...stat} />
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-muted/20 border border-border/40 rounded-[2rem] w-full xl:w-auto overflow-x-auto">
          {ORDER_STATUSES.map((status) => {
            const Icon = status.icon;
            const isActive = activeTab === status.id;
            return (
              <button
                key={status.id}
                onClick={() => setActiveTab(status.id)}
                className={`flex-shrink-0 h-11 px-6 rounded-[1.4rem] font-medium text-sm flex items-center gap-2 transition-all ${isActive
                  ? "bg-background text-primary shadow-sm border border-border/40"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                {status.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full xl:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID or Customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-12 rounded-2xl bg-muted/10 border-border/40 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-[2.5rem]" />
            ))
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order: any) => (
              <OrderCard
                key={order._id}
                order={{
                  id: order._id,
                  customer: order.userId?.name || "Anonymous",
                  items: order.items.map((item: any) => ({
                    name: item.product?.productName || "Product",
                    image: item.product?.imageURIs?.[0] || "",
                    price: item.price,
                    quantity: item.quantity
                  })),
                  total: order.totalPrice,
                  status: order.status,
                  paymentStatus: order.paymentStatus,
                  date: order.createdAt,
                  address: order.deliveryAddress
                }}
                statuses={ORDER_STATUSES}
                fullOrder={order}
              />
            ))
          ) : (
            <EmptyOrderState
              searchQuery={searchQuery}
              activeTab={activeTab}
              onClearFilters={() => { setActiveTab("all"); setSearchQuery(""); }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

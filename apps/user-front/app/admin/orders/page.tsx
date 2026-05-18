"use client";

import React, { useState, useMemo } from "react";
import { 
  ShoppingBag, 
  Search, 
  RefreshCcw, 
  Activity,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  AlertCircle,
  Package,
  Calendar,
  User,
  CreditCard
} from "lucide-react";
import { AdminPageHeader } from "../components/AdminPageHeader";
import { AdminMetricCard } from "../components/AdminMetricCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAdminOrders } from "@/lib/hooks/useAdminOrder";
import { OrderInspectionDrawer } from "./components/OrderInspectionDrawer";
import { AdminOrder } from "@/lib/api/adminOrder";

const statusConfig = {
  PENDING: { color: "bg-amber-500/10 text-amber-600 border-amber-500/20", icon: Clock },
  PROCESSING: { color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Activity },
  SHIPPED: { color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20", icon: Truck },
  DELIVERED: { color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: CheckCircle2 },
  CANCELLED: { color: "bg-red-500/10 text-red-600 border-red-500/20", icon: XCircle },
};

export default function AdminOrdersPage() {
  const { data: orderResponse, isLoading, isError, refetch } = useAdminOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const orders = orderResponse?.data?.orders || [];

  const filteredOrders = useMemo(() => 
    orders.filter((o: AdminOrder) => 
      o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.userId.email.toLowerCase().includes(searchTerm.toLowerCase())
    ), [orders, searchTerm]);

  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter(o => o.status === "PENDING").length,
    revenue: orders.reduce((acc, o) => acc + o.totalPrice, 0),
    active: orders.filter(o => ["PROCESSING", "SHIPPED"].includes(o.status)).length
  }), [orders]);

  const handleInspect = (order: AdminOrder) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-10 pb-10">
      <AdminPageHeader 
        title="Order Intelligence" 
        description="Monitor platform transactions, audit shipment velocity, and oversee customer fulfillment." 
        primaryAction={{
          label: "Financial Audit",
          icon: Activity,
          onClick: () => window.location.href = "/admin"
        }}
      />

      {/* Platform Order Pulse */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-[2rem] bg-muted/20" />)
        ) : (
          <>
            <AdminMetricCard label="Total Transactions" value={stats.total.toString()} icon={ShoppingBag} trend="Global" isPositive={true} />
            <AdminMetricCard label="Platform Revenue" value={`LKR ${(stats.revenue / 1000).toFixed(1)}K`} icon={Activity} trend="Live" isPositive={true} />
            <AdminMetricCard label="Fulfillment Pulse" value={stats.active.toString()} icon={Truck} trend="Active" isPositive={true} />
            <AdminMetricCard label="Pending Action" value={stats.pending.toString()} icon={Clock} trend="Priority" isPositive={false} />
          </>
        )}
      </div>

      {/* Tracking Tools */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/20 border border-border/20 rounded-[2rem] p-4 px-6">
        <div className="flex items-center gap-3 w-full sm:w-96 bg-background/50 border border-border/40 rounded-xl px-4 py-2 group focus-within:border-primary/50 transition-all shadow-sm">
          <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID, Customer, or Email..." 
            className="bg-transparent border-none text-sm font-semibold focus:ring-0 placeholder:text-muted-foreground/60 w-full"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
           <Button 
            onClick={() => refetch()} 
            variant="outline" 
            className="h-10 rounded-xl border-border/40 font-bold flex items-center gap-2 hover:bg-primary/5 transition-all text-xs"
           >
              <RefreshCcw className="w-4 h-4" /> Sync Stream
           </Button>
           <div className="h-6 w-[1px] bg-border/40 hidden sm:block" />
           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">
             Monitoring {filteredOrders.length} Shipments
           </p>
        </div>
      </div>

      {/* Order Tracking Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {isLoading ? (
          [1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-28 rounded-[2.5rem] bg-muted/10" />)
        ) : isError ? (
          <div className="col-span-full py-20 text-center space-y-4 rounded-[3rem] border border-dashed border-border/40">
            <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto opacity-20" />
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground text-center">Connection timeout in order registry</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="col-span-full py-20 text-center space-y-4 rounded-[3rem] border border-dashed border-border/40">
            <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto opacity-20" />
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">No matching transactions found</p>
          </div>
        ) : (
          filteredOrders.map((order: AdminOrder) => (
            <div 
              key={order._id} 
              onClick={() => handleInspect(order)}
              className="group cursor-pointer flex flex-col sm:flex-row items-center justify-between p-6 rounded-[2.5rem] bg-muted/20 border border-border/20 hover:bg-muted/30 hover:border-primary/20 transition-all gap-6 shadow-sm"
            >
              <div className="flex items-center gap-5 w-full">
                <div className="w-16 h-16 rounded-[1.5rem] bg-background border border-border/10 flex flex-col items-center justify-center text-primary shadow-inner group-hover:scale-105 transition-all duration-500">
                  <p className="text-[8px] font-black uppercase text-muted-foreground/60 leading-none">Order</p>
                  <p className="text-lg font-black tracking-tighter leading-none mt-1">{order._id.slice(-4).toUpperCase()}</p>
                </div>
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-foreground truncate">{order.userId.name}</h3>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/5 border border-primary/10">
                      <p className="text-[10px] font-black text-primary">LKR {order.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(order.createdAt)}</span>
                      <div className="w-1 h-1 rounded-full bg-border/40" />
                      <User className="w-3 h-3 ml-1" />
                      <span className="truncate">{order.items.length} Products</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <div className={cn(
                  "px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border whitespace-nowrap",
                  statusConfig[order.status as keyof typeof statusConfig]?.color
                )}>
                  {order.status}
                </div>
                <Button variant="ghost" className="w-10 h-10 rounded-xl p-0 hover:bg-primary/10 hover:text-primary transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

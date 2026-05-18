"use client";

import React from "react";
import { 
  ShoppingBag, 
  User, 
  MapPin, 
  Calendar, 
  DollarSign, 
  UserCircle,
  Package,
  Clock,
  Activity,
  CheckCircle2,
  XCircle,
  Truck,
  ArrowRight,
  ShieldCheck,
  Smartphone
} from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUpdateAdminOrderStatus } from "@/lib/hooks/useAdminOrder";
import { AdminOrder } from "@/lib/api/adminOrder";
import { cn } from "@/lib/utils";

interface OrderInspectionDrawerProps {
  order: AdminOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusConfig = {
  PENDING: { color: "bg-amber-500/10 text-amber-600 border-amber-500/20", icon: Clock },
  PROCESSING: { color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Activity },
  SHIPPED: { color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20", icon: Truck },
  DELIVERED: { color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: CheckCircle2 },
  CANCELLED: { color: "bg-red-500/10 text-red-600 border-red-500/20", icon: XCircle },
};

export const OrderInspectionDrawer = ({ order, open, onOpenChange }: OrderInspectionDrawerProps) => {
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateAdminOrderStatus();

  if (!order) return null;

  const handleStatusChange = (newStatus: string) => {
    updateStatus({ id: order._id, status: newStatus });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Clock;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl bg-background/80 backdrop-blur-2xl border-l border-border/40 p-0 overflow-y-auto">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary via-secondary to-primary/50" />
        
        <SheetHeader className="p-8 pb-6 bg-muted/20 border-b border-border/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                <ShoppingBag className="w-7 h-7 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-2xl font-black tracking-tight">Order #{order._id.slice(-8).toUpperCase()}</SheetTitle>
                <SheetDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Universal Transaction ID: {order._id}
                </SheetDescription>
              </div>
            </div>
            <Badge className={cn("rounded-lg px-3 py-1 text-[10px] font-black tracking-widest uppercase border", statusConfig[order.status as keyof typeof statusConfig]?.color)}>
              {order.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-background/50 border border-border/20">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Entry Date</p>
                <p className="text-xs font-bold">{formatDate(order.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-background/50 border border-border/20">
              <DollarSign className="w-4 h-4 text-primary" />
              <div>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Total Value</p>
                <p className="text-xs font-black text-primary">LKR {order.totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="p-8 space-y-10">
          {/* Customer Intelligence */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Customer Attribution</h4>
            <div className="p-6 rounded-[2.5rem] bg-gradient-to-br from-background to-muted/20 border border-border/20 shadow-inner space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
                  <UserCircle className="w-6 h-6 text-secondary" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-black">{order.userId.name}</p>
                  <p className="text-[11px] text-muted-foreground font-medium">{order.userId.email}</p>
                </div>
              </div>
              
              <div className="space-y-3 pt-2 border-t border-border/10">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Shipping Destination</p>
                    <p className="text-xs font-medium leading-relaxed">{order.deliveryAddress}</p>
                  </div>
                </div>
                {order.userId.phone && (
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-4 h-4 text-muted-foreground" />
                    <p className="text-xs font-medium">{order.userId.phone}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Manifest */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Product Manifest</h4>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="group flex items-center justify-between p-4 rounded-2xl bg-muted/10 border border-border/10 hover:bg-muted/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl border border-border/10 bg-background overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
                      {item.product?.imageURIs?.[0] ? (
                        <img src={item.product.imageURIs[0]} alt={item.product.productName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted/50">
                          <Package className="w-5 h-5 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-black truncate max-w-[180px]">{item.product?.productName || "Unknown Product"}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                        {item.quantity} units @ LKR {item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-foreground">LKR {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Control Center */}
          <div className="space-y-4 pt-4 pb-12">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1 flex items-center gap-2">
              <ShieldCheck className="w-3 h-3" /> Administrative Status Override
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(statusConfig).map((status) => {
                const config = statusConfig[status as keyof typeof statusConfig];
                const isActive = order.status === status;
                return (
                  <Button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={isUpdating || isActive}
                    variant="outline"
                    className={cn(
                      "h-12 rounded-xl text-[9px] font-black tracking-widest uppercase gap-2 transition-all border-border/40",
                      isActive ? "bg-primary/5 border-primary/40 text-primary cursor-default opacity-100" : "hover:bg-primary/5 hover:border-primary/20",
                      isUpdating && "opacity-50"
                    )}
                  >
                    <config.icon className="w-3 h-3" />
                    {status}
                  </Button>
                );
              })}
            </div>
            <p className="text-[9px] text-muted-foreground text-center font-bold px-4 leading-relaxed opacity-60">
              * Overriding status will trigger platform-wide notifications and inventory status updates where applicable.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};


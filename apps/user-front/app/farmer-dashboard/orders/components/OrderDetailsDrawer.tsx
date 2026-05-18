"use client";

import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerTrigger
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  User,
  MapPin,
  Truck,
  CheckCircle2,
  Mail,
  Phone,
  Package,
  ArrowRight,
  Settings2
} from "lucide-react";
import { useFarmerOrders } from "@/lib/hooks/useFarmerOrders";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateOrderPDF } from "@/lib/utils/orderUtils";

interface OrderItem {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface OrderDetailsDrawerProps {
  children: React.ReactNode;
  order: {
    id: string;
    customer: string;
    items: OrderItem[];
    total: number;
    status: string;
    date: string;
    address: string;
  };
  statusInfo: any;
  fullOrder: any;
}

export const OrderDetailsDrawer: React.FC<OrderDetailsDrawerProps> = ({
  children,
  order,
  statusInfo,
  fullOrder
}) => {
  const { updateStatus, isUpdating } = useFarmerOrders();

  const handleStatusUpdate = (newStatus: string) => {
    updateStatus({ orderId: order.id, status: newStatus });
  };

  const getNextStatus = () => {
    if (order.status === "pending") return "prepearing";
    if (order.status === "prepearing") return "delivering";
    if (order.status === "delivering") return "completed";
    return null;
  };

  const nextStatus = getNextStatus();

  const getButtonText = () => {
    if (order.status === "pending") return "Start Preparing";
    if (order.status === "prepearing") return "Ship Order";
    if (order.status === "delivering") return "Mark Delivered";
    return "Order Completed";
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh] bg-background">
        <div className="mx-auto w-full max-w-[800px] overflow-y-auto overflow-x-hidden">
          <DrawerHeader className="px-8 pt-8 text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/40">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                  <ShoppingBag className="w-3 h-3" />
                  Global Manifest
                </div>
                <DrawerTitle className="text-3xl font-black tracking-tighter text-heading flex items-center gap-3">
                  Order #{order.id.slice(-6).toUpperCase()}
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border border-current/10 text-[10px] font-black uppercase tracking-widest ${statusInfo?.color}`}>
                    <div className="w-1 h-1 rounded-full bg-current" />
                    {order.status}
                  </div>
                </DrawerTitle>
                <DrawerDescription className="text-muted-foreground font-medium">
                  Full transparency for order placed on {new Date(order.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </DrawerDescription>
              </div>

              <div className="flex flex-col items-end">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Total Revenue</p>
                <p className="text-3xl font-black text-primary">LKR {order.total.toFixed(2)}</p>
              </div>
            </div>
          </DrawerHeader>

          <div className="px-8 py-8 space-y-10">
            {/* Customer & Logistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Customer Detail */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <User className="w-3 h-3 text-primary" /> Customer Intelligence
                </h4>
                <div className="bg-muted/10 border border-border/40 rounded-3xl p-6 space-y-4">
                  <div>
                    <p className="text-lg font-bold text-heading leading-none">{order.customer}</p>
                    <p className="text-xs text-muted-foreground mt-1">Verified ChilleBazzar Buyer</p>
                  </div>
                  <div className="flex wrap gap-2">
                    <Button variant="outline" className="h-10 rounded-xl border-border/40 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-all">
                      <Mail className="w-3 h-3" /> Email
                    </Button>
                    <Button variant="outline" className="h-10 rounded-xl border-border/40 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-all">
                      <Phone className="w-3 h-3" /> Call
                    </Button>
                  </div>
                </div>
              </div>

              {/* Logistics/Delivery */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Truck className="w-3 h-3 text-primary" /> Fulfillment Logistics
                </h4>
                <div className="bg-muted/10 border border-border/40 rounded-3xl p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary mt-1" />
                    <div>
                      <p className="text-sm font-bold text-heading">Shipping Address</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                        {order.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Harvest Breakdown (Product List) */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <ShoppingBag className="w-3 h-3 text-primary" /> Harvest Breakdown
                </h4>
                <span className="text-[10px] font-black text-muted-foreground">{order.items.length} Unique Items</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {order.items.map((item, i) => (
                  <div key={i} className="group flex items-center justify-between p-4 rounded-3xl bg-muted/5 border border-border/20 hover:bg-muted/10 transition-all hover:border-primary/20">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border border-border/40 bg-background flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <Package className="w-8 h-8 opacity-20" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-heading leading-none">{item.name}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mt-2">SKU: CHL-00{i + 1}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-primary">LKR {item.price.toFixed(2)}</p>
                      <p className="text-[10px] font-bold text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DrawerFooter className="px-8 pb-10 pt-4 flex flex-col gap-6 border-t border-border/40">
            {/* Manual Status Override */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                <Settings2 className="w-3 h-3" /> Manual Status Override
              </div>
              <Select
                disabled={isUpdating}
                value={order.status}
                onValueChange={handleStatusUpdate}
              >
                <SelectTrigger className="w-full h-12 rounded-xl bg-muted/10 border-border/40 font-bold">
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/40 shadow-2xl">
                  <SelectItem value="pending" className="font-bold">Pending</SelectItem>
                  <SelectItem value="prepearing" className="font-bold">Preparing</SelectItem>
                  <SelectItem value="delivering" className="font-bold">Delivering</SelectItem>
                  <SelectItem value="completed" className="font-bold">Completed</SelectItem>
                  <SelectItem value="cancelled" className="font-bold">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-row gap-4 w-full">
              <Button
                onClick={() => nextStatus && handleStatusUpdate(nextStatus)}
                disabled={isUpdating || order.status === "completed" || !nextStatus}
                className="flex-1 h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-tighter shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {isUpdating ? "Processing..." : getButtonText()}
                <Truck className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => generateOrderPDF(
                  {
                    _id: order.id,
                    items: order.items.map(item => ({
                      product: { productName: item.name } as any,
                      quantity: item.quantity,
                      price: item.price
                    })),
                    totalPrice: order.total,
                    status: order.status,
                    paymentStatus: fullOrder?.paymentStatus || "pending",
                    deliveryAddress: order.address,
                    createdAt: order.date
                  },
                  true,
                  {
                    name: fullOrder?.userId?.name || order.customer,
                    email: fullOrder?.userId?.email || "N/A",
                    phone: fullOrder?.userId?.phone || "N/A"
                  }
                )}
                variant="outline"
                className="h-14 px-8 rounded-2xl border-border/40 font-black uppercase tracking-tighter hover:bg-muted/10"
              >
                Print Label
              </Button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

import React from "react";
import { Package, Calendar, ShoppingBag, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { UserOrderDetailsDrawer } from "./UserOrderDetailsDrawer";
import { TrackOrderDrawer } from "./TrackOrderDrawer";

interface OrderCardProps {
  order: any;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <div
      className="group p-8 bg-muted/5 border border-border/40 hover:border-primary/20 rounded-[3rem] transition-all hover:shadow-2xl hover:shadow-primary/5 hover:bg-background"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-start gap-8 flex-1">
          <div className="w-20 h-20 rounded-3xl bg-background border border-border/40 flex items-center justify-center text-primary overflow-hidden shadow-sm group-hover:shadow-md transition-all">
            {order.items?.[0]?.product?.imageURIs?.[0] ? (
              <img
                src={order.items[0].product.imageURIs[0]}
                alt="Product"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <Package className="w-10 h-10 opacity-10" />
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="text-sm font-medium">Order #{order._id.slice(-6).toUpperCase()}</span>
              <div className="flex items-center gap-4 text-xs text-muted-foreground border-l border-border/40 pl-6">
                <div className="flex items-center gap-2">
                  <span className="font-bold uppercase tracking-widest text-[10px] opacity-40">Payment:</span>
                  <OrderStatusBadge status={order.paymentStatus} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold uppercase tracking-widest text-[10px] opacity-40">Status:</span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground/60" />
                <span className="text-xs font-bold text-muted-foreground">
                  {new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(order.createdAt))}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-muted-foreground/60" />
                <span className="text-xs font-bold text-muted-foreground">{order.items.length} {order.items.length === 1 ? 'Pack' : 'Packs'} Ordered</span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-primary tracking-tighter">LKR {order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row md:flex-col lg:flex-row items-center gap-3">
          <TrackOrderDrawer order={order}>
            <Button variant="outline" className="flex-1 rounded-xl h-10 px-5 border-border/40 hover:bg-primary/5 hover:text-primary hover:border-primary/20 font-medium text-sm transition-all">
              Track Entry
            </Button>
          </TrackOrderDrawer>
          <UserOrderDetailsDrawer order={order}>
            <Button className="flex-1 rounded-xl h-10 px-5 gap-2 font-medium text-sm shadow-xl shadow-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
              View Details
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </UserOrderDetailsDrawer>
        </div>
      </div>
    </div>
  );
};

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  User,
  Calendar,
  MoreHorizontal,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderDetailsDrawer } from "./OrderDetailsDrawer";

interface OrderItem {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface OrderCardProps {
  order: {
    id: string;
    customer: string;
    items: OrderItem[];
    total: number;
    status: string;
    paymentStatus: string;
    date: string;
    address: string;
  };
  statuses: any[];
  fullOrder: any;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, statuses, fullOrder }) => {
  const statusInfo = statuses.find(s => s.id === order.status);

  return (
    <OrderDetailsDrawer order={order} statusInfo={statusInfo} fullOrder={fullOrder}>
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="group cursor-pointer bg-background border border-border/40 rounded-[2.5rem] p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-8 transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5"
      >
        {/* ID & Customer Info */}
        <div className="flex items-center gap-6 min-w-[240px]">
          <div className="w-14 h-14 rounded-2xl bg-muted/30 flex items-center justify-center font-black text-xs text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors border border-border/20">
            {order.id.slice(-4).toUpperCase()}
          </div>
          <div className="space-y-1">
            <h3 className="font-black text-heading tracking-tighter">Order #{order.id.slice(-6).toUpperCase()}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="w-3 h-3" />
              <span className="font-bold">{order.customer}</span>
            </div>
          </div>
        </div>

        {/* Order Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-center flex-grow max-w-2xl px-4">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Revenue</p>
            <p className="text-sm font-black text-primary">LKR {order.total.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Status</p>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full w-fit border border-current/10 ${statusInfo?.color}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-current" />
              <span className="text-[10px] font-black uppercase tracking-widest">{order.status}</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Payment</p>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full w-fit border border-current/10 ${order.paymentStatus === 'paid' ? 'text-emerald-500 bg-emerald-500/10' : 'text-amber-500 bg-amber-500/10'
              }`}>
              <div className="w-1.5 h-1.5 rounded-full bg-current" />
              <span className="text-[10px] font-black uppercase tracking-widest">{order.paymentStatus}</span>
            </div>
          </div>

          {/* <div className="space-y-1 hidden md:block">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Placed Date</p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Calendar className="w-3 h-3 text-muted-foreground" />
              {new Date(order.date).toLocaleDateString()}
            </div>
          </div> */}
        </div>

        {/* Action Button */}

      </motion.div>
    </OrderDetailsDrawer>
  );
};

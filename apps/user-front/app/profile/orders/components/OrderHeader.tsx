import React from "react";
import { ShoppingBag, Package } from "lucide-react";

interface OrderHeaderProps {
  orderCount: number;
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({ orderCount }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
          <ShoppingBag className="w-3 h-3" />
          Archive Manifest
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track, manage, and review your artisanal purchases.
        </p>
      </div>
      {orderCount > 0 && (
        <div className="hidden sm:flex flex-col items-end">
          <div className="px-4 py-2 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            <span className="text-xs font-black text-primary uppercase tracking-widest">{orderCount} Orders</span>
          </div>
        </div>
      )}
    </div>
  );
};

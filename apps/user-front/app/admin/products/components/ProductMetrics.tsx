"use client";

import React from "react";
import { DollarSign, Database, Layers } from "lucide-react";
import { AdminProduct } from "@/lib/api/adminProduct";

interface MetricItemProps {
  icon: any;
  label: string;
  value: string;
}

export const MetricItem = ({ icon: Icon, label, value }: MetricItemProps) => (
  <div className="p-6 rounded-[2rem] bg-muted/10 border border-border/10 space-y-2 group hover:bg-muted/20 transition-colors">
    <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
      <Icon className="w-4 h-4 text-primary/60" />
      {label}
    </div>
    <p className="text-xl font-bold text-foreground tracking-tight">{value}</p>
  </div>
);

export const ProductMetrics = ({ product }: { product: AdminProduct }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetricItem icon={DollarSign} label="Unit Price" value={`LKR ${product.price.toFixed(2)}`} />
        <MetricItem icon={Database} label="In Stock" value={`${product.quantity} Units`} />
      </div>

      <div className="p-5 rounded-[2rem] bg-primary/5 border border-primary/10 flex items-center justify-between group hover:bg-primary/10 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Layers className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Category</p>
            <p className="text-sm font-bold text-primary uppercase tracking-tight">{product.categoryId.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

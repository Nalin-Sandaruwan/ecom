"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface OrderSummaryStatProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

export const OrderSummaryStat: React.FC<OrderSummaryStatProps> = ({
  label,
  value,
  icon: Icon,
  color
}) => {
  return (
    <div className="bg-muted/10 border border-border/40 p-4 rounded-3xl flex items-center gap-4 transition-all hover:bg-muted/15">
      <div className={`p-2 rounded-xl bg-background border border-border/40 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">{label}</p>
        <p className="text-lg font-black text-heading leading-none mt-0.5">{value}</p>
      </div>
    </div>
  );
};

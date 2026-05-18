"use client";

import React from "react";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminMetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend: string;
  isPositive: boolean;
  color?: string;
}

export const AdminMetricCard: React.FC<AdminMetricCardProps> = ({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  isPositive,
  color = "primary"
}) => {
  return (
    <div className="group flex items-center justify-between p-6 rounded-[2rem] bg-muted/20 border border-border/20 transition-all duration-300 hover:bg-muted/30 hover:border-primary/30">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-background flex items-center justify-center shadow-sm border border-border/10 group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex flex-col">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-foreground tracking-tight mt-0.5">{value}</p>
        </div>
      </div>

      <div className={cn(
        "flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all",
        isPositive 
          ? "bg-green-500/10 text-green-600 border-green-500/20 group-hover:bg-green-500/20" 
          : "bg-red-500/10 text-red-600 border-red-500/20 group-hover:bg-red-500/20"
      )}>
        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {trend}
      </div>
    </div>
  );
};

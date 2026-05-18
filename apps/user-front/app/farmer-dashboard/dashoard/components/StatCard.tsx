"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon, ArrowUpRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  color: "primary" | "amber-500" | "green-500" | "blue-500";
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color 
}) => {
  // Mapping color strings to Tailwind classes safely
  const colorMap = {
    primary: "text-primary bg-primary/10 border-primary/20",
    "amber-500": "text-amber-500 bg-amber-500/10 border-amber-500/20",
    "green-500": "text-primary bg-primary/10 border-primary/20",
    "blue-500": "text-blue-500 bg-blue-500/10 border-blue-500/20",
  };

  const bgGradientMap = {
    primary: "bg-primary/10 group-hover:bg-primary/20",
    "amber-500": "bg-amber-500/10 group-hover:bg-amber-500/20",
    "green-500": "bg-primary/10 group-hover:bg-primary/20",
    "blue-500": "bg-blue-500/10 group-hover:bg-blue-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-muted/30 border border-border/40 rounded-[2rem] p-6 backdrop-blur-sm relative overflow-hidden group hover:bg-muted/40 transition-all duration-500"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full -mr-16 -mt-16 transition-all ${bgGradientMap[color]}`} />
      
      <div className="flex justify-between items-start relative z-10">
        <div className={`p-3 rounded-2xl border ${colorMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-0.5 rounded-full text-[10px] font-bold">
          <ArrowUpRight className="w-3 h-3" />
          {trend}
        </div>
      </div>
      
      <div className="mt-4 relative z-10">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <h3 className="text-3xl font-bold mt-1 tracking-tight text-heading">{value}</h3>
      </div>
    </motion.div>
  );
};

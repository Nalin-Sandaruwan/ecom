"use client";

import React from "react";
import { Mail } from "lucide-react";
import { AdminProduct } from "@/lib/api/adminProduct";

export const FarmerAttribution = ({ product }: { product: AdminProduct }) => {
  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Farmer Attribution</h4>
      <div className="p-6 rounded-[2.5rem] bg-gradient-to-br from-background to-muted/20 border border-border/20 shadow-inner group">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-500">
            {product.farmerId.name.charAt(0)}
          </div>
          <div className="space-y-1">
            <p className="text-base font-bold flex items-center gap-2 text-foreground">
              {product.farmerId.name}
            </p>
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-2 leading-none">
              <Mail className="w-3.5 h-3.5 text-primary/60" /> {product.farmerId.email}
            </p>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground font-medium text-center italic opacity-60">
        Listed on {new Date(product.createdAt).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
      </p>
    </div>
  );
};

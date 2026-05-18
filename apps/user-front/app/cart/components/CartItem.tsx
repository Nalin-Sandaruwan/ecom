"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus } from "lucide-react";
import { CartItem as CartItemType } from "@/lib/api/cart";

interface CartItemProps {
  item: CartItemType;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
}

export default function CartItem({ item, removeItem, updateQuantity }: CartItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="group bg-muted/5 border border-border/40 rounded-[2.5rem] p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-muted/10 transition-all duration-500"
    >
      {/* Image */}
      <div className="w-full sm:w-32 aspect-square rounded-3xl overflow-hidden bg-muted/20 flex-shrink-0 relative">
        <img
          src={item.product.imageURIs?.[0] || "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400&auto=format&fit=crop&q=60"}
          alt={item.product.productName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
      </div>

      {/* Content */}
      <div className="flex-grow w-full space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-1">
              {item.product.productType || "Artisanal"}
            </span>
            <h3 className="text-xl font-bold tracking-tight">
              {item.product.productName}
            </h3>
          </div>
          <button
            onClick={() => removeItem(item.product._id)}
            className="p-3 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 rounded-2xl transition-all"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {/* Quantity UI */}
          <div className="flex items-center gap-1 bg-background/50 backdrop-blur-md border border-border/40 p-1.5 rounded-2xl">
            <button
              onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-muted transition-colors text-muted-foreground"
            >
              <Minus className="w-3 h-3" />
            </button>
            <input
              type="text"
              value={item.quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val >= 1) {
                  updateQuantity(item.product._id, val);
                } else if (e.target.value === "") {
                  // Allow empty string for typing, but don't update till number entered
                  // Or update to 1 by default? Let's stay flexible
                }
              }}
              className="w-12 bg-transparent text-center text-sm font-bold tabular-nums focus:outline-none focus:ring-0 appearance-none"
            />
            <button
              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-muted transition-colors text-muted-foreground"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="text-right">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mb-0.5">Price</p>
            <p className="text-xl font-bold text-primary">
              LKR {(item.product.price * item.quantity).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

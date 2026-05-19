"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Truck, ShieldCheck, Box, Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";

interface ProductCheckoutProps {
  product: {
    _id: string;
    productName: string;
    price: number;
    quantity: number;
    imageURIs: string[];
    productType?: string;
  };
}

export default function ProductCheckout({ product }: ProductCheckoutProps) {
  const { addItem, isLoading } = useCart();
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const isLowStock = product.quantity !== undefined && product.quantity <= 10;
  const isOutOfStock = product.quantity !== undefined && product.quantity <= 0;

  const handleQuantityChange = (delta: number) => {
    const newVal = selectedQuantity + delta;
    if (newVal >= 1 && newVal <= product.quantity) {
      setSelectedQuantity(newVal);
    }
  };

  const handleAddToCart = () => {
    addItem(product, selectedQuantity);
  };

  return (
    <div className="space-y-10 lg:sticky lg:top-32">
      {/* Pricing Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/5 group-hover:from-primary/15 transition-colors duration-500 rounded-[2.5rem]" />
        <div className="relative p-8 rounded-[2.5rem] border border-border/40 backdrop-blur-sm">
          <div className="flex items-baseline gap-4">
            <span className="text-5xl font-bold tracking-tight text-primary drop-shadow-sm">
              LKR {product.price.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
              Handcrafted in Sri Lanka
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-border/20">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${isOutOfStock ? "bg-red-500" : "bg-emerald-500"}`} />
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isOutOfStock ? "text-red-600" : "text-emerald-600"}`}>
                {isOutOfStock ? "Harvest Exhausted" : "Available for dispatch"}
              </span>
            </div>

            {product.quantity !== undefined && (
              <div className="flex items-center gap-2 bg-background/50 px-3 py-1 rounded-xl border border-border/40">
                <Box className={`w-3 h-3 ${isLowStock ? "text-amber-600" : "text-primary/60"}`} />
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isLowStock ? "text-amber-700" : "text-muted-foreground"}`}>
                  {product.quantity} units remaining
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <hr className="border-border/40" />

      {/* Action Area */}
      <div className="space-y-6">
        {/* Quantity Selector */}
        {!isOutOfStock && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-3"
          >
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
              Select Quantity
            </label>
            <div className="flex items-center gap-4 bg-muted/20 border border-border/40 w-fit p-1.5 rounded-2xl backdrop-blur-md">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={selectedQuantity <= 1 || isLoading}
                className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-background/80 hover:text-primary transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
              >
                <Minus className="w-4 h-4 group-active:scale-90 transition-transform" />
              </button>

              <div className="w-12 text-center font-bold text-lg tabular-nums select-none">
                {selectedQuantity}
              </div>

              <button
                onClick={() => handleQuantityChange(1)}
                disabled={selectedQuantity >= product.quantity || isLoading}
                className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-background/80 hover:text-primary transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
              >
                <Plus className="w-4 h-4 group-active:scale-90 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isLoading}
            className={`flex-1 h-16 rounded-2xl transition-all duration-300 font-semibold text-base  flex items-center justify-center gap-3 group ${isOutOfStock
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98] shadow-primary/30"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <ShoppingCart className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            {isLoading ? "Enriching Bag..." : (isOutOfStock ? "Sold Out" : "Add to Cart")}
          </button>
        </motion.div>
      </div>

      {/* Trust Features Strip */}
      <div className="grid grid-cols-2 gap-6 pt-6 opacity-80 backdrop-blur-md rounded-2xl p-4 border border-border/20 bg-muted/5">
        <div className="flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-xl bg-background border border-border/40 flex items-center justify-center shadow-sm group-hover:border-primary/30 transition-colors">
            <Truck className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Global Dispatch</span>
            <span className="text-[8px] font-bold text-primary uppercase">4-5 days delivery</span>
          </div>
        </div>
        <div className="flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-xl bg-background border border-border/40 flex items-center justify-center shadow-sm group-hover:border-primary/30 transition-colors">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Elite Security</span>
            <span className="text-[8px] font-bold text-muted-foreground uppercase">Escrow protection</span>
          </div>
        </div>
      </div>
    </div>
  );
}


{/* Trust Features Strip */ }
<div className="grid grid-cols-2 gap-6 pt-6 opacity-80 backdrop-blur-md rounded-2xl p-4 border border-border/20 bg-muted/5">
  <div className="flex items-center gap-4 group">
    <div className="w-10 h-10 rounded-xl bg-background border border-border/40 flex items-center justify-center shadow-sm group-hover:border-primary/30 transition-colors">
      <Truck className="w-5 h-5 text-primary" />
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Global Dispatch</span>
      <span className="text-[8px] font-bold text-muted-foreground uppercase">Insured transit</span>
    </div>
  </div>
  <div className="flex items-center gap-4 group">
    <div className="w-10 h-10 rounded-xl bg-background border border-border/40 flex items-center justify-center shadow-sm group-hover:border-primary/30 transition-colors">
      <ShieldCheck className="w-5 h-5 text-primary" />
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Elite Security</span>
      <span className="text-[8px] font-bold text-muted-foreground uppercase">Escrow protection</span>
    </div>
  </div>
</div>

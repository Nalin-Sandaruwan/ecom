"use client";

import React, { useMemo } from "react";
import Navbar from "@/components/Navbar";
import { AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/hooks/useCart";

// Modular Components
import EmptyCart from "./components/EmptyCart";
import CartItem from "./components/CartItem";
import CartSummary from "./components/CartSummary";

export default function CartPage() {
  const { items, totalItemsCount, removeItem, updateQuantity, isLoading } = useCart();

  const subtotal = useMemo(() => {
    return items.reduce((acc: number, item: any) => {
      return acc + (item.product.price * item.quantity);
    }, 0);
  }, [items]);

  const shipping = 1800;
  const tax = 0;
  const total = subtotal + shipping + tax;

  if (items.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-32 container mx-auto px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 text-primary font-bold uppercase tracking-[0.3em] text-[10px] mb-3">
                <ShoppingBag className="w-4 h-4" />
                Your Bag
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Shopping Cart</h1>
            </div>
            <p className="text-muted-foreground font-medium">
              You have <span className="text-foreground font-bold">{totalItemsCount} items</span> in your cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Items List */}
            <div className="lg:col-span-8 space-y-6">
              <AnimatePresence mode="popLayout">
                {items.map((item: any) => (
                  <CartItem
                    key={item.product._id}
                    item={item}
                    removeItem={removeItem}
                    updateQuantity={updateQuantity}
                  />
                ))}
              </AnimatePresence>

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors py-4 group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Continue Shopping
              </Link>
            </div>

            {/* Summary Section */}
            <CartSummary
              items={items}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

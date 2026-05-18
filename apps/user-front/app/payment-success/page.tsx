"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { CheckCircle2, Package, ArrowRight, ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/hooks/useCart";
import { useRouter } from "next/navigation";
import OrdersPage from "@/app/profile/orders/page";

export default function PaymentSuccessPage() {
  const { clearCart } = useCart();
  const router = useRouter();
  const [showOrders, setShowOrders] = useState(false);
  const [countdown, setCountdown] = useState(10);

  // Clear the cart on successful payment
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  // Automatic redirect timer
  useEffect(() => {
    if (showOrders) return;

    if (countdown <= 0) {
      router.push("/");
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, router, showOrders]);

  if (showOrders) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-grow pt-32 pb-10 container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => setShowOrders(false)}
              className="mb-8 hover:bg-muted rounded-xl gap-2 text-muted-foreground"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Success Message
            </Button>
            <div className="bg-muted/5 border border-border/40 rounded-[2.5rem] p-8 backdrop-blur-md">
              <OrdersPage />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 container mx-auto px-6 flex flex-col items-center justify-center text-center">
        <div className="max-w-2xl mx-auto space-y-12">
          {/* Success Animation */}
          <div className="relative">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
              className="w-32 h-32 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 relative z-10"
            >
              <CheckCircle2 className="w-16 h-16 text-emerald-500" />
            </motion.div>
            
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                Thank you for <br className="hidden md:block" /> your artisanal choice!
              </h1>
              <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
                Your order has been successfully placed and is now being prepared. 
                Redirecting to home in <span className="font-bold text-primary">{countdown}s</span>...
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
            >
              <Button 
                size="lg" 
                onClick={() => setShowOrders(true)}
                className="w-full sm:w-auto rounded-2xl px-8 h-14 font-bold text-sm tracking-widest uppercase gap-2"
              >
                <Package className="w-4 h-4" />
                View Orders
              </Button>
              
              <Link href="/shop" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-2xl px-8 h-14 font-bold text-sm tracking-widest uppercase border-border/40 hover:bg-muted transition-all gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Return to Shop
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Glassmorphic Card for Order Info Placeholder */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="p-8 bg-muted/5 border border-border/40 rounded-[2.5rem] backdrop-blur-md"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Order Status</p>
                <p className="text-sm font-bold text-primary">Preparing</p>
              </div>
              <div className="text-center border-l border-border/20 md:border-l-0">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Payment</p>
                <p className="text-sm font-bold text-emerald-500">Confirmed</p>
              </div>
              <div className="text-center border-t border-border/20 md:border-t-0 md:border-l border-border/20 pt-4 md:pt-0">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Shipping</p>
                <p className="text-sm font-bold">Standard</p>
              </div>
              <div className="text-center border-t border-border/20 md:border-t-0 md:border-l border-border/20 pt-4 md:pt-0">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Est. Delivery</p>
                <p className="text-sm font-bold">3-5 Days</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

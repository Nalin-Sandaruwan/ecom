"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, ShoppingCart, HelpCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PaymentCancelledPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 container mx-auto px-6 flex flex-col items-center justify-center text-center">
        <div className="max-w-2xl mx-auto space-y-12">
          {/* Cancelled Icon */}
          <div className="relative">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-32 h-32 bg-destructive/10 rounded-full flex items-center justify-center mx-auto border border-destructive/20 relative z-10"
            >
              <XCircle className="w-16 h-16 text-destructive" />
            </motion.div>
            
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-destructive/5 rounded-full blur-3xl" />
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Payment Cancelled
              </h1>
              <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
                Your payment process was interrupted or cancelled. Don't worry, your cart items are still safe and waiting for you.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
            >
              <Link href="/cart" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-2xl px-8 h-14 font-bold text-sm tracking-widest uppercase gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Return to Cart
                </Button>
              </Link>
              
              <Link href="/contact" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-2xl px-8 h-14 font-bold text-sm tracking-widest uppercase border-border/40 hover:bg-muted transition-all gap-2">
                  <HelpCircle className="w-4 h-4" />
                  Get Help
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

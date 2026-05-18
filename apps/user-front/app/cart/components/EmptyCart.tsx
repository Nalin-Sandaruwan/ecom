"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EmptyCart() {
  return (
    <main className="flex-grow pt-32 pb-20 container mx-auto px-6 flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mb-8 border border-border/40"
      >
        <ShoppingBag className="w-10 h-10 text-muted-foreground/40" />
      </motion.div>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Your cart is empty</h1>
      <p className="text-muted-foreground max-w-md mb-10 leading-relaxed">
        Looks like you haven't added any artisanal treasures to your collection yet. 
        Start exploring our curated selection of premium products.
      </p>
      <Link href="/shop">
        <Button size="lg" className="rounded-2xl px-8 h-14 font-bold text-sm tracking-widest uppercase">
          Start Shopping
        </Button>
      </Link>
    </main>
  );
}

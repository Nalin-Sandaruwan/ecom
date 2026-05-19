"use client";

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Sparkles, ShieldCheck, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20">

      {/* Dynamic Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/wooden_art_hero.png"
          alt="Premium Minimalist Wooden Art"
          className="w-full h-full object-cover opacity-20 dark:opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[10%] w-64 h-64 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-secondary/10 blur-[120px] rounded-full delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 text-center sm:text-left">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

          <div className="flex-1 space-y-10 max-w-3xl">
            {/* Announcement Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-primary/5 border border-primary/20 backdrop-blur-md shadow-xl"
            >
              <div className="bg-primary/20 p-1.5 rounded-lg">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                Minimalist Woodcraft 2026 Collection
              </span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.9] text-heading uppercase"
              >
                Wooden <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-heading via-primary to-primary/40">
                  Gallery
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-lg md:text-xl text-primary/70 max-w-xl leading-relaxed font-semibold pl-2"
              >
                Experience the peak of minimalist wood crafting. Redefining high-end wooden masterpieces for the modern sanctuary. Handcrafted in Sri Lanka.
              </motion.p>
            </div>

            {/* CTA Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-6"
            >
              <Link href="/shop" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto rounded-2xl h-16 px-10 bg-primary text-primary-foreground text-lg font-bold uppercase tracking-tighter hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30 group">
                  Explore Shop
                  <ShoppingBag className="ml-3 w-5 h-5 group-hover:rotate-12 transition-transform" />
                </Button>
              </Link>
              <Link href="/about" className="group flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-primary/60 hover:text-primary transition-all">
                Our Story
                <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary/10 transition-all">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-10 flex flex-wrap gap-8 justify-center sm:justify-start"
            >
              <div className="flex items-center gap-2 text-primary/60">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">Locally Handcrafted</span>
              </div>
              <div className="flex items-center gap-2 text-primary/60">
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">Islandwide & Global Shipping</span>
              </div>
            </motion.div>
          </div>

          {/* Right Section / High-end Visual Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="hidden lg:block relative group"
          >
            <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-[4rem] group-hover:bg-primary/30 transition-all duration-700" />
            <div className="relative w-[500px] h-[600px] bg-primary/5 border border-primary/10 rounded-[4rem] backdrop-blur-2xl overflow-hidden p-3 shadow-2xl">
              <img
                src="/wooden_art_hero.png"
                alt="Elite Wooden Art"
                className="w-full h-full object-cover rounded-[3rem] group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-x-8 bottom-12 p-8 bg-background/80 backdrop-blur-xl border border-primary/10 rounded-[2.5rem] space-y-2">
                <h3 className="text-2xl font-bold uppercase tracking-tight text-heading">The Silhouette</h3>
                <div className="flex justify-between items-end">
                  <p className="text-primary/60 text-[10px] font-black uppercase tracking-widest">Crafted in Sri Lanka</p>
                  <Link href="/shop" className="text-primary font-black uppercase text-xs hover:underline underline-offset-4 tracking-widest">View Details</Link>
                </div>
              </div>
            </div>

            {/* Floating Mini-Badge */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 bg-background/95 border border-primary/20 backdrop-blur-lg p-6 rounded-[2.5rem] shadow-2xl space-y-2 z-10"
            >
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => <Sparkles key={i} className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />)}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Premium Quality</p>
              <p className="text-primary/80 font-black text-xs tracking-tighter">100% Gaurantee</p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

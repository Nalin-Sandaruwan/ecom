"use client";

import { motion } from "framer-motion";
import { Sparkles, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShopHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function ShopHeader({ searchTerm, setSearchTerm }: ShopHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest"
        >
          <Sparkles className="w-3 h-3" /> Curated Collections
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tracking-tight text-heading"
        >
          Premium Selection
        </motion.h1>
        <p className="text-muted-foreground text-sm max-w-lg leading-relaxed font-medium">
          Sourced directly from our network of elite Sri Lankan wood craftsmen. Experience the peak of minimalist wood carving and premium aesthetic quality.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Find your favorite..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-muted/30 border border-border/40 rounded-2xl pl-11 pr-6 py-4 w-full sm:w-80 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all outline-none"
          />
        </div>
        <Button variant="outline" className="rounded-2xl h-[54px] border-border/40 gap-2 px-6 hover:bg-muted/50 font-bold">
          <Filter className="w-4 h-4" /> Filters
        </Button>
      </div>
    </div>
  );
}

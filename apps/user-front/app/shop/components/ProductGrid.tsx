"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: any[];
  isLoading: boolean;
}

export default function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-square rounded-[2rem] bg-muted/20" />
            <Skeleton className="h-4 w-2/3 rounded-lg bg-muted/20" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-1/3 rounded-lg bg-muted/20" />
              <Skeleton className="h-4 w-1/4 rounded-lg bg-muted/20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-32 text-center"
      >
        <div className="w-24 h-24 bg-muted/20 rounded-[2rem] flex items-center justify-center mb-6">
          <Search className="w-10 h-10 text-muted-foreground/30" />
        </div>
        <h3 className="text-2xl font-extrabold text-heading">No results found</h3>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-2 font-medium">
          We couldn't find any artisanal products matching your selection. Try a different category or search term.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-20">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </AnimatePresence>
      </div>

      <div className="flex justify-center">
        <Button variant="outline" className="rounded-2xl px-12 h-14 border-primary/20 hover:bg-primary/5 font-extrabold tracking-tight transition-all text-lg group text-primary">
          Explore More <ChevronDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}

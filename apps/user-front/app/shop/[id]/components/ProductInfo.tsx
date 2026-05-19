"use client";

import { motion } from "framer-motion";
import { Star, Verified } from "lucide-react";

interface ProductInfoProps {
  productName: string;
  categoryName?: string;
  description: string;
  farmer?: {
    name: string;
    email: string;
  };
}

export default function ProductInfo({
  productName,
  categoryName,
  description,
  farmer,
}: ProductInfoProps) {
  return (
    <div className="space-y-8">
      {/* Product Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            {categoryName || "Premium Collection"}
          </span>
          <div className="h-px flex-grow bg-gradient-to-r from-primary/20 to-transparent" />
        </div>

        <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tighter text-heading leading-[1.1] text-balance">
          {productName}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-2">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 shadow-sm">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-bold text-amber-700">4.9</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
              Verified Artisan Excellence
            </span>
          </div>

          {farmer && (
            <div className="flex items-center gap-3 bg-muted/5 px-4 py-2 rounded-2xl border border-border/20 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Verified className="w-4 h-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Cultivated By</span>
                <span className="text-xs font-bold text-heading">{farmer.name}</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/30 to-transparent rounded-full" />
        <p className="text-base sm:text-md text-muted-foreground leading-relaxed font-normal pl-2 ">
          "{description}"
        </p>
      </motion.div>


    </div>
  );
}

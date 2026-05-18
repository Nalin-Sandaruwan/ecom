"use client";

import { motion } from "framer-motion";
import { Heart, Share2, Sparkles } from "lucide-react";
import { useState } from "react";

interface ProductVisualsProps {
  productName: string;
  imageURIs: string[];
  productType?: string;
}

export default function ProductVisuals({ productName, imageURIs, productType }: ProductVisualsProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const displayImages = imageURIs.length > 0 ? imageURIs : ["https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=1200&auto=format&fit=crop&q=80"];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="lg:col-span-5 xl:col-span-6 space-y-8"
    >
      {/* Main Product Frame */}
      <div className="relative aspect-square w-full rounded-[3rem] bg-muted/30 border border-border/40 overflow-hidden group shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent" />
        <img
          src={displayImages[activeImageIndex]}
          alt={productName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />

        {/* Impact Badge */}
        <div className="absolute top-8 left-8 bg-background/90 backdrop-blur-xl border border-primary/20 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-2xl z-10">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            {productType || "Artisanal"}
          </span>
        </div>

        {/* Interaction Buttons Overlay */}
        <div className="absolute top-8 right-8 flex flex-col gap-4 z-10">
          <button className="w-12 h-12 rounded-2xl bg-background/90 backdrop-blur-xl border border-border/40 flex items-center justify-center text-muted-foreground hover:text-primary hover:scale-110 active:scale-95 transition-all shadow-xl">
            <Heart className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 rounded-2xl bg-background/90 backdrop-blur-xl border border-border/40 flex items-center justify-center text-muted-foreground hover:text-primary hover:scale-110 active:scale-95 transition-all shadow-xl">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Perspective Thumbnails */}
      <div className="grid grid-cols-4 gap-6">
        {displayImages.map((uri, i) => (
          <div
            key={i}
            onClick={() => setActiveImageIndex(i)}
            className={`aspect-square rounded-2xl border cursor-pointer overflow-hidden group transition-all ${
              activeImageIndex === i ? "border-primary ring-2 ring-primary/20 shadow-lg" : "border-border/40 bg-muted/20 hover:border-primary/40"
            }`}
          >
            <img src={uri} alt={`${productName} thumbnail ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
          </div>
        ))}
        {/* Fillers if less than 4 images */}
        {displayImages.length < 4 && Array.from({ length: 4 - displayImages.length }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square rounded-2xl bg-muted/5 border border-border/20 border-dashed opacity-40" />
        ))}
      </div>
    </motion.div>
  );
}

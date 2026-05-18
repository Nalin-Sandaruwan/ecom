"use client";

import React from "react";
import Image from "next/image";
import { Edit2, Trash2, Eye, Package, DollarSign, Layers, ShieldCheck, Tag, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface ProductTableRowProps {
  product: any;
  onView: (product: any) => void;
  onEdit: (product: any) => void;
  onDelete: (product: any) => void;
}

export function ProductTableRow({ product, onView, onEdit, onDelete }: ProductTableRowProps) {
  const mainImage = product.imageURIs?.[0] || "/placeholder-product.png";
  const isOutOfStock = product.quantity <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.005, backgroundColor: "rgba(var(--primary-rgb), 0.02)" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative flex items-center gap-6 p-5 bg-background border border-border/40 rounded-[1.8rem] transition-all duration-500 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 cursor-default"
    >
      {/* 1. Asset Thumbnail */}
      <div 
        className="relative h-20 w-24 rounded-2xl overflow-hidden border border-border/40 flex-shrink-0 cursor-pointer"
        onClick={() => onView(product)}
      >
        <Image
          src={mainImage}
          alt={product.productName}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {isOutOfStock && (
            <div className="absolute inset-0 bg-destructive/20 backdrop-blur-[1px] flex items-center justify-center">
                <span className="text-[8px] font-black uppercase text-white tracking-widest bg-destructive px-1.5 py-0.5 rounded-md">Sold</span>
            </div>
        )}
      </div>

      {/* 2. Product Identity */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 truncate">
                {product.categoryId?.name || "Artisanal Selection"}
            </span>
            <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600">Elite</span>
            </div>
        </div>
        <h3 className="text-lg font-bold tracking-tight text-heading group-hover:text-primary transition-colors truncate">
            {product.productName}
        </h3>
        <p className="text-[10px] text-muted-foreground font-medium italic line-clamp-1 opacity-60">
            "{product.productDescription}"
        </p>
      </div>

      {/* 3. Market Specs */}
      <div className="hidden lg:flex flex-col gap-1 w-32">
        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Type</span>
        <div className="flex items-center gap-1.5 font-bold text-xs capitalize">
            <Tag className="w-3 h-3 text-primary/40" />
            {product.productType}
        </div>
      </div>

      {/* 4. Inventory Data */}
      <div className="hidden md:flex flex-col gap-1 w-32">
        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Stock Availability</span>
        <div className="flex items-center gap-1.5 font-bold text-xs">
            <Layers className="w-3 h-3 text-primary/40" />
            {product.quantity} Kg Batch
        </div>
      </div>

      {/* 5. Financial Value */}
      <div className="flex flex-col gap-1 w-28 text-right">
        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Value / Unit</span>
        <div className="flex items-center justify-end gap-1 text-primary font-black">
            <DollarSign className="w-3.5 h-3.5" />
            <span className="text-lg tracking-tighter">{product.price.toFixed(2)}</span>
        </div>
      </div>

      {/* 6. Curated Actions */}
      <div className="flex items-center gap-2 pl-4 border-l border-border/40">
        <button 
          onClick={() => onEdit(product)}
          className="h-10 px-4 rounded-xl bg-muted/30 border border-border/40 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-heading hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-all group/btn"
        >
          <Edit2 className="w-3.5 h-3.5 group-hover/btn:-rotate-12 transition-transform" />
          Update
        </button>
        <button 
          onClick={() => onDelete(product)}
          className="w-10 h-10 rounded-xl bg-background border border-border/40 flex items-center justify-center text-muted-foreground hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-all hover:scale-105 active:scale-95"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onView(product)}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}

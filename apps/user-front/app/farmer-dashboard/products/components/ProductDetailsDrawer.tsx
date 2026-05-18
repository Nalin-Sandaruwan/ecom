"use client";

import React from "react";
import Image from "next/image";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  DollarSign, 
  Layers, 
  Info, 
  Calendar, 
  X,
  Tag
} from "lucide-react";
import { motion } from "framer-motion";

interface ProductDetailsDrawerProps {
  product: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailsDrawer({ product, open, onOpenChange }: ProductDetailsDrawerProps) {
  if (!product) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-background/80 backdrop-blur-2xl border-border/40 max-h-[90vh]">
        <div className="mx-auto w-full max-w-4xl overflow-y-auto custom-scrollbar p-6 pb-12">
          <div className="flex justify-end mb-2">
            <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted/20">
                    <X className="w-5 h-5" />
                </Button>
            </DrawerClose>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-border/40 shadow-2xl">
                <Image
                  src={product.imageURIs?.[0] || "/placeholder-product.png"}
                  alt={product.productName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex gap-4">
                {product.imageURIs?.slice(1).map((uri: string, idx: number) => (
                  <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-border/40">
                    <Image src={uri} alt={`${product.productName} ${idx + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div>
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-widest">
                  {product.categoryId?.name || "Product"}
                </Badge>
                <h2 className="text-4xl font-bold text-heading tracking-tight mb-2">
                  {product.productName}
                </h2>
                <div className="flex items-center gap-2 text-primary">
                    <DollarSign className="w-6 h-6" />
                    <span className="text-3xl font-black">{product.price.toFixed(2)}</span>
                    <span className="text-muted-foreground text-sm font-medium ml-1">per Kg/Unit</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-3xl bg-muted/10 border border-border/20">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Layers className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Storage</span>
                    </div>
                    <p className="text-lg font-bold">{product.quantity} Kg Available</p>
                </div>
                <div className="p-4 rounded-3xl bg-muted/10 border border-border/20">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Tag className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Type</span>
                    </div>
                    <p className="text-lg font-bold capitalize">{product.productType}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Info className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Description</span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {product.productDescription}
                </p>
              </div>

              <div className="pt-6 border-t border-border/40">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Last Updated</p>
                        <p className="text-sm font-bold">{new Date(product.updatedAt).toLocaleDateString()}</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

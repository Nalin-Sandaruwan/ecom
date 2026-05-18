"use client";

import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart } from "lucide-react";
import Link from "next/link";

import { useCart } from "@/lib/hooks/useCart";

interface ProductCardProps {
  product: {
    _id: string;
    productName: string;
    price: number;
    imageURIs: string[];
    productType?: string;
    categoryId?: { name: string };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, isLoading } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group bg-muted/10 border border-border/40 rounded-[2.5rem] p-4 hover:bg-muted/20 hover:border-primary/20 transition-all duration-500 relative"
    >
      <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-5">
        <Link href={`/shop/${product._id}`} className="block w-full h-full">
          <img
            src={product.imageURIs[0] || "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&auto=format&fit=crop&q=60"}
            alt={product.productName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>

        {/* Dynamic Tag */}
        <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md border border-border/40 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest text-primary shadow-xl pointer-events-none">
          {product.productType || "Artisanal"}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-background/80 backdrop-blur-md border border-border/40 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-background transition-all z-10 disabled:opacity-50"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>

        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[85%] bg-primary text-primary-foreground h-12 rounded-2xl font-bold text-xs opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl shadow-primary/20 flex items-center justify-center gap-2 z-10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          {isLoading ? "Adding..." : "Add to Cart"}
        </button>
      </div>

      <Link href={`/shop/${product._id}`} className="block px-2 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
            {product.categoryId?.name || "Global Store"}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span className="text-sm font-bold">4.9</span>
          </div>
        </div>

        <h3 className="text-lg font-bold tracking-tight text-primary line-clamp-1">
          {product.productName}
        </h3>

        <div className="flex items-center justify-between pt-2 border-t border-border/20">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground line-through font-medium">
              LKR {(product.price * 1.2).toFixed(2)}
            </span>
            <span className="text-xl font-bold text-primary">LKR {product.price.toFixed(2)}</span>
          </div>
          <div className="text-[11px] text-muted-foreground font-medium">Limited Stock</div>
        </div>
      </Link>
    </motion.div>
  );
}

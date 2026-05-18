"use client";

import { Tag, Sparkles, Leaf, Utensils, Star, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Category {
  _id: string;
  name: string;
}

interface ShopSidebarProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const iconMap: Record<string, any> = {
  "Organic Vegetables": Leaf,
  "Premium Fruits": Utensils,
  "Farm Dairy": Tag,
  "Artisanal Pantry": Star,
  "Default": ShoppingBag
};

export default function ShopSidebar({
  categories,
  selectedCategory,
  setSelectedCategory
}: ShopSidebarProps) {
  return (
    <aside className="lg:w-64 space-y-10 shrink-0">
      <div className="space-y-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground ml-4">
          Artisan Categories
        </p>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm",
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4" />
              All Selections
            </div>
          </button>

          {categories?.map((cat) => {
            const Icon = iconMap[cat.name] || iconMap["Default"];
            return (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={cn(
                  "flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm",
                  selectedCategory === cat._id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  {cat.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-[2.5rem] p-8 text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto">
          <Tag className="w-6 h-6 text-primary" />
        </div>
        <h4 className="text-xl font-bold tracking-tight text-primary">Artisan Pass</h4>
        <p className="text-muted-foreground text-[11px] leading-relaxed uppercase font-bold tracking-widest">
          Use code CHILLE15 for 15% off your first harvest.
        </p>
        <Button className="w-full rounded-xl h-10 bg-primary font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform">
          Claim Offer
        </Button>
      </div>
    </aside>
  );
}

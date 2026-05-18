"use client";

import { motion } from "framer-motion";
import { Sparkles, Leaf, Zap, Crown } from "lucide-react";

interface ShopFiltersProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
}

const productTypes = [
  { id: "all", name: "All Selections", icon: Sparkles, color: "text-primary" },
  { id: "Artisanal", name: "Artisanal", icon: Crown, color: "text-amber-500" },
  { id: "Organic", name: "Organic", icon: Leaf, color: "text-emerald-500" },
  { id: "Premium", name: "Premium", icon: Zap, color: "text-blue-500" },
];

export default function ShopFilters({
  selectedType,
  setSelectedType,
}: ShopFiltersProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-10 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-4 min-w-max pb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mr-4">
          Market Filter
        </p>
        
        {productTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 border group ${
              selectedType === type.id
                ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20 scale-105"
                : "bg-background/40 backdrop-blur-md border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-muted/50"
            }`}
          >
            <type.icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
              selectedType === type.id ? "text-primary-foreground" : type.color
            }`} />
            {type.name}
          </button>
        ))}
      </div>
    </div>
  );
}

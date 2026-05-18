"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyOrderStateProps {
  searchQuery: string;
  activeTab: string;
  onClearFilters: () => void;
}

export const EmptyOrderState: React.FC<EmptyOrderStateProps> = ({ 
  searchQuery, 
  activeTab, 
  onClearFilters 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="py-32 flex flex-col items-center justify-center text-center space-y-4 bg-muted/5 border border-dashed border-border/60 rounded-[3rem]"
    >
      <div className="w-20 h-20 rounded-[2.5rem] bg-muted/20 flex items-center justify-center">
        <ShoppingBag className="w-10 h-10 text-muted-foreground opacity-30" />
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-heading">No results found</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          We couldn't find any orders matching "{searchQuery}" in the {activeTab} collection.
        </p>
      </div>
      <Button onClick={onClearFilters} variant="link" className="text-primary font-bold">
        Clear all filters
      </Button>
    </motion.div>
  );
};

"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FarmInsightsProps {
  trendProduct: string;
  recommendation: string;
}

export const FarmInsights: React.FC<FarmInsightsProps> = ({ 
  trendProduct, 
  recommendation 
}) => {
  return (
    <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border border-primary/20 rounded-[2.5rem] p-8 flex flex-col justify-between h-full">
      <div>
        <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
          <TrendingUp className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-2xl font-extrabold mb-4 text-primary">Farm Insights</h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          Your <span className="text-foreground font-bold italic">"{trendProduct}"</span> are trending! {recommendation}
        </p>
      </div>
      <Button variant="outline" className="w-full rounded-2xl h-12 border-primary/20 hover:bg-primary/5 font-bold transition-all mt-auto">
        See Deep Analytics
      </Button>
    </div>
  );
};

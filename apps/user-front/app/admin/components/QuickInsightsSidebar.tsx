"use client";

import React from "react";
import { TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const QuickInsightsSidebar = () => {
  return (
    <div className="space-y-8">
      {/* Growth Velocity Card */}
      <div className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-8 space-y-6 transition-all duration-300 hover:bg-primary/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wide">Growth Velocity</h3>
        </div>
        <p className="text-muted-foreground text-[12px] leading-relaxed">
          System expansion is currently outpacing projected targets by{" "}
          <span className="text-primary font-bold">12.4%</span>. Node stability remains high across all regions.
        </p>
        <div className="pt-2">
          <Button className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold uppercase tracking-wide text-[11px] group shadow-lg shadow-primary/10">
            Generate Report
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Security Status Card */}
      <div className="bg-muted/30 border border-border/20 rounded-[2.5rem] p-8 transition-all hover:bg-muted/40">
        <h4 className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground opacity-60 mb-6 text-center">
          Security Status
        </h4>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative w-32 h-32 rounded-full border-8 border-primary/20 flex items-center justify-center">
            <div className="absolute inset-0 border-8 border-primary border-t-transparent rounded-full animate-spin [animation-duration:3s]" />
            <span className="text-2xl font-bold text-primary">99%</span>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Defense Grid Optimal
          </p>
        </div>
      </div>
    </div>
  );
};

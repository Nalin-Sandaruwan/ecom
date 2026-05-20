import React from "react";
import { Clock, ShoppingBag } from "lucide-react";

export const OrdersFooter: React.FC = () => {
  return (
    <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-6 pt-12 pb-6">
      <div className="group flex items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] bg-muted/20 border border-border/40 hover:bg-background hover:border-primary/20 transition-all cursor-default">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
          <Clock className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-widest text-primary mb-1">Standard Policy</p>
          <p className="text-xs font-medium text-muted-foreground leading-snug">Easy returns within 30 days manifest.</p>
        </div>
      </div>
      <div className="group flex items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] bg-muted/20 border border-border/40 hover:bg-background hover:border-secondary/20 transition-all cursor-default">
        <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
          <ShoppingBag className="w-5 h-5 text-secondary" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-widest text-secondary mb-1">Elite Loyalty</p>
          <p className="text-xs font-medium text-muted-foreground leading-snug">Earn credits with every artisanal harvest.</p>
        </div>
      </div>
    </div>
  );
};

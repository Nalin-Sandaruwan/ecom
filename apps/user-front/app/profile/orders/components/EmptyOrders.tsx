import React from "react";
import Link from "next/link";
import { PackageSearch, History, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const EmptyOrders: React.FC = () => {
  return (
    <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border/40 rounded-[3rem] bg-muted/5 mt-4 transition-all hover:bg-muted/10">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-[2rem] bg-background flex items-center justify-center border border-border/40 shadow-xl">
          <PackageSearch className="w-12 h-12 text-primary/40" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary border border-primary flex items-center justify-center shadow-lg text-primary-foreground">
           <History className="w-5 h-5" />
        </div>
      </div>
      
      <h2 className="text-3xl font-black text-heading tracking-tight mb-2">Manifest Empty</h2>
      <p className="text-muted-foreground text-sm max-w-sm mb-10 leading-relaxed font-medium">
        It looks like you haven&apos;t placed any orders yet. Start shopping to bring your favorite items home!
      </p>

      <Link href="/shop">
        <Button className="rounded-2xl h-14 px-10 gap-2 bg-foreground text-background font-black uppercase tracking-tighter shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]">
          Start Harvesting
          <ArrowRight className="w-5 h-5" />
        </Button>
      </Link>
    </div>
  );
};

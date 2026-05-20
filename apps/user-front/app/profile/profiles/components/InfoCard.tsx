import React from "react";
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string | undefined;
}

export const InfoCard = ({ icon: Icon, label, value }: InfoCardProps) => (
  <div className="flex items-center gap-4 p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] bg-muted/20 border border-border/20 transition-all hover:bg-muted/30 hover:border-primary/20 group shadow-sm min-w-0">
    <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center shadow-sm border border-border/10 flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div className="flex flex-col min-w-0 flex-1">
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1.5">{label}</p>
      <p className="text-sm font-bold text-foreground leading-none truncate">{value || "Not set"}</p>
    </div>
  </div>
);

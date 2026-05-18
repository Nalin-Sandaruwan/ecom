"use client";

import React from "react";

interface RecentActivityItemProps {
  id: string | number;
  title: string;
  details: string;
  amount: string;
  status: string;
  time: string;
}

export const RecentActivityItem: React.FC<RecentActivityItemProps> = ({
  id,
  title,
  details,
  amount,
  status,
  time
}) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-3xl bg-background/50 border border-border/20 group hover:border-primary/30 transition-all cursor-default">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center font-bold text-lg text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          #
        </div>
        <div>
          <h4 className="font-bold text-sm">{title}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{details} • {time}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-sm text-foreground">{amount}</p>
        <p className="text-[10px] text-primary font-bold uppercase tracking-wider">{status}</p>
      </div>
    </div>
  );
};

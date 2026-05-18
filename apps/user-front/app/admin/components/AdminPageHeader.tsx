"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface AdminPageHeaderProps {
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    icon: LucideIcon;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    icon: LucideIcon;
    onClick?: () => void;
  };
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({ 
  title, 
  description, 
  primaryAction,
  secondaryAction 
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-heading">{title}</h1>
        <p className="text-muted-foreground text-sm font-medium">{description}</p>
      </div>
      
      <div className="flex items-center gap-3">
        {secondaryAction && (
          <Button 
            variant="outline" 
            onClick={secondaryAction.onClick}
            className="rounded-2xl h-12 border-border/40 font-bold flex items-center gap-2 hover:bg-primary/5 transition-all"
          >
            <secondaryAction.icon className="w-4 h-4" />
            {secondaryAction.label}
          </Button>
        )}
        
        {primaryAction && (
          <Button 
            onClick={primaryAction.onClick}
            className="rounded-2xl h-12 bg-primary text-primary-foreground font-bold uppercase tracking-wide text-[11px] px-6 shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            <primaryAction.icon className="w-4 h-4 mr-2" />
            {primaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
};

"use client";

import React from "react";
import { Loader2, XCircle, CheckCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AdminProduct } from "@/lib/api/adminProduct";

interface AdministrativeOversightProps {
  product: AdminProduct;
  isApproving: boolean;
  isDeleting: boolean;
  onApprove: () => void;
  onDelete: () => void;
}

export const AdministrativeOversight = ({
  product,
  isApproving,
  isDeleting,
  onApprove,
  onDelete
}: AdministrativeOversightProps) => {
  return (
    <div className="space-y-4 pt-4 pb-12">
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Administrative Oversight</h4>

      <Button
        onClick={onApprove}
        disabled={isApproving}
        className={cn(
          "w-full h-16 rounded-[1.5rem] font-bold uppercase tracking-widest text-[11px] gap-3 shadow-xl transition-all active:scale-[0.98] group",
          product.isActive
            ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20"
            : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20"
        )}
      >
        {isApproving ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : product.isActive ? (
          <XCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
        ) : (
          <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
        )}
        {product.isActive ? "Revoke Approval" : "Approve for Market"}
      </Button>

      <Button
        onClick={onDelete}
        disabled={isDeleting || isApproving}
        variant="destructive"
        className="w-full h-16 rounded-[1.5rem] font-bold uppercase tracking-widest text-[11px] gap-3 shadow-md shadow-destructive/10 transition-all active:scale-[0.98] border border-destructive/20"
      >
        <Trash2 className="w-5 h-5" /> Permanently Remove
      </Button>
    </div>
  );
};

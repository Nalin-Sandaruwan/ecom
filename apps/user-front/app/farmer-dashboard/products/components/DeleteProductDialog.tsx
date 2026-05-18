"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, Trash2 } from "lucide-react";
import { useDeleteProduct } from "@/lib/hooks/useProduct";

interface DeleteProductDialogProps {
  product: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteProductDialog({ product, open, onOpenChange }: DeleteProductDialogProps) {
  const { mutate: deleteProduct, isPending } = useDeleteProduct();

  const handleDelete = () => {
    if (!product?._id) return;
    deleteProduct(product._id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-background/60 backdrop-blur-2xl border-border/40 rounded-[2rem] p-8 shadow-2xl">
        <DialogHeader className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-2xl font-bold">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-sm font-medium">
              Are you sure you want to delete <span className="text-heading font-bold">"{product?.productName}"</span>?
              This action cannot be undone and will remove the product from the marketplace.
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-12 rounded-xl font-bold uppercase tracking-wider hover:bg-muted/10"
          >
            Go Back
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1 h-12 rounded-xl font-bold uppercase tracking-wider shadow-xl shadow-destructive/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { Star, Sparkles } from "lucide-react";

interface ReviewDialogProps {
  children: React.ReactNode;
  productId: string;
  orderId: string;
  productName: string;
}

export const ReviewDialog: React.FC<ReviewDialogProps> = ({
  children,
  productId,
  orderId,
  productName
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-fit max-h-[90vh] overflow-y-auto bg-background/60 backdrop-blur-2xl border-border/40 rounded-[2.5rem] p-0  custom-scrollbar">
        {/* WoodenGallery Signature Gradient Top-Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 via-primary to-secondary" />

        <DialogHeader className="p-8 pb-0">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <Star className="w-6 h-6 text-amber-600 fill-amber-500" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black tracking-tight text-heading">Share Your Chronicle</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-70">
                Documenting your experience with {productName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="relative p-8 pt-4">
          <ReviewForm
            productId={productId}
            orderId={orderId}
            onSuccess={() => setOpen(false)}
            isDialog={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

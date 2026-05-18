import React, { useState } from "react";
import { Star, Send, Loader2 } from "lucide-react";
import { useCreateReview } from "@/lib/hooks/useReview";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  productId: string;
  orderId?: string;
  onSuccess?: () => void;
  isDialog?: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ productId, orderId, onSuccess, isDialog }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const { mutate: createReview, isPending } = useCreateReview();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!review.trim()) return;
    if (!orderId) return; // For safety, though parent should handle this
    
    createReview({
      productId,
      orderId,
      rating,
      review,
    }, {
      onSuccess: () => {
        setReview("");
        setRating(5);
        if (onSuccess) onSuccess();
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative group overflow-hidden",
        isDialog 
          ? "bg-transparent border-none p-0" 
          : "bg-primary/[0.03] border border-primary/10 rounded-[3rem] p-10"
      )}
    >
      {!isDialog && (
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32" />
      )}
      
      <div className="relative space-y-8">
        {!isDialog && (
          <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tighter text-foreground">Share Your Chronicle</h3>
            <p className="text-sm font-bold text-muted-foreground opacity-70">Contribute to our artisanal verification protocol.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Star Selection */}
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Satisfaction Metric</span>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="group/star p-1 transition-all hover:scale-125 hover:-rotate-12 active:scale-95"
                >
                  <Star
                    className={`w-8 h-8 transition-all ${
                      star <= (hoverRating || rating)
                        ? "text-amber-500 fill-amber-500 scale-110"
                        : "text-muted-foreground/20 fill-transparent"
                    }`}
                  />
                </button>
              ))}
              <AnimatePresence mode="wait">
                <motion.span
                  key={hoverRating || rating}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="ml-4 text-sm font-black text-amber-600/80"
                >
                  {["Poor", "Fair", "Good", "Excellent", "Elite"][(hoverRating || rating) - 1]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Nuanced Feedback</span>
            <div className="relative">
               <Textarea
                placeholder="Describe your sensorial experience with this harvest..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="min-h-[160px] rounded-[2rem] bg-background/50 border-border/40 focus:border-primary/30 p-8 text-sm font-bold placeholder:text-muted-foreground/30 resize-none transition-all focus:ring-4 focus:ring-primary/5 shadow-inner"
                disabled={isPending}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isPending || !review.trim()}
            className="w-full sm:w-auto h-14 px-10 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-black tracking-tight gap-3 transition-all active:scale-95 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Encrypting Feedback...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Publish Chronicle
              </>
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

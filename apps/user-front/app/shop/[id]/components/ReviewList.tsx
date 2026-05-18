import React from "react";
import { Star, User } from "lucide-react";
import { Review } from "@/lib/api/review";
import { motion } from "framer-motion";

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="py-20 text-center space-y-4 bg-muted/10 rounded-[3rem] border border-dashed border-border/40">
        <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto text-muted-foreground opacity-50">
          <Star className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-black tracking-tight text-foreground/60">No Chronicles Yet</h3>
          <p className="text-sm font-bold text-muted-foreground opacity-70">Be the first to share your artisanal experience with this product.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review, index) => (
        <motion.div
          key={review._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative bg-muted/20 hover:bg-muted/30 border border-border/20 rounded-[2.5rem] p-8 transition-all shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20 shadow-inner group-hover:rotate-6 transition-transform">
                <User className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-black tracking-tight text-foreground leading-tight">{review.userId?.name || "Anonymous Patron"}</h4>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < review.rating 
                          ? "text-amber-500 fill-amber-500" 
                          : "text-muted-foreground/30 fill-muted-foreground/10"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 sm:text-right">
              {new Date(review.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
          
          <div className="mt-6 pl-16">
            <p className="text-sm font-bold text-muted-foreground leading-relaxed whitespace-pre-line group-hover:text-foreground/80 transition-colors">
              {review.review}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

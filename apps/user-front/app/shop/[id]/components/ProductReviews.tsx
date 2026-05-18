import React from "react";
import { ReviewList } from "./ReviewList";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { useProductReviews } from "@/lib/hooks/useReview";
import { useOrders } from "@/lib/hooks/useOrders";
import { useMe } from "@/lib/hooks/useAuth";
import { Sparkles, BadgeCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductReviewsProps {
  productId: string;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const { data: reviews, isLoading: reviewsLoading } = useProductReviews(productId);
  const { data: orders } = useOrders();
  const { data: userData } = useMe();
  
  // Find a COMPLETED order containing this product to get a valid orderId
  const relevantOrder = orders?.find((order: any) => 
    order.status === "completed" && 
    order.items.some((item: any) => item.product === productId || item.product?._id === productId)
  );

  const orderId = relevantOrder?._id;

  // Check if they already reviewed THIS SPECIFIC instance
  const hasAlreadyReviewedThisInstance = reviews?.some((r: any) => 
    (r.userId?._id === userData?.user?.id || r.userId === userData?.user?.id) && 
    r.orderId === orderId
  );

  const canReview = !!orderId && !hasAlreadyReviewedThisInstance;

  if (reviewsLoading) {
    return (
      <div className="space-y-10 py-20 border-t border-border/20 mt-20">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64 bg-muted/20 rounded-xl" />
          <Skeleton className="h-4 w-48 bg-muted/10 rounded-lg" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 w-full bg-muted/10 rounded-[3rem]" />)}
        </div>
      </div>
    );
  }

  return (
    <section className="border-t border-border/20 pt-24 mt-24 space-y-20">
      {/* Reviews Header */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 pb-4 border-b border-border/10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shadow-sm border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-heading">Artisanal Chronicles</h2>
          </div>
          <p className="text-muted-foreground font-bold text-sm ml-13">Verified testimonials from our elite patron community.</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-3xl font-black tracking-tighter text-foreground">{reviews?.length || 0}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Reviews</div>
          </div>
          <div className="w-px h-10 bg-border/40" />
          <div className="text-right">
            <div className="text-3xl font-black tracking-tighter text-amber-500">
              {reviews?.length > 0 
                ? (reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1)
                : "0.0"}
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Average Rating</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
        {/* Left: Review List */}
        <div className="lg:col-span-7 space-y-12">
          <ReviewList reviews={reviews || []} />
        </div>

        {/* Right: Submission Form */}
        <div className="lg:col-span-5 space-y-10">
          <div className="sticky top-32">
            {canReview ? (
              <ReviewForm productId={productId} orderId={orderId} />
            ) : (
              <div className="bg-muted/10 border border-border/20 rounded-[3rem] p-10 space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-muted/20 flex items-center justify-center text-muted-foreground mx-auto opacity-70">
                  <BadgeCheck className="w-8 h-8" />
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-black tracking-tight text-foreground/80">
                    {hasAlreadyReviewedThisInstance ? "Chronicle Recorded" : "Verified Access Only"}
                  </h3>
                  <p className="text-sm font-bold text-muted-foreground leading-relaxed max-w-xs mx-auto opacity-70">
                    {hasAlreadyReviewedThisInstance 
                      ? "Your feedback for this specific purchase is already safely stored in our ledger."
                      : "To share your chronicle, you must possess a completed acquisition of this artisanal product."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

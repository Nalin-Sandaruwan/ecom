"use client";

import React, { useState } from "react";
import { CreditCard, Truck, ShieldCheck, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMe } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/api/order";
import { createCheckoutSession } from "@/lib/api/payment";
import { toast } from "sonner";

interface CartSummaryProps {
  items: any[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export default function CartSummary({ items, subtotal, shipping, tax, total }: CartSummaryProps) {
  const { data: userData } = useMe();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState("");
  const [showAddressInput, setShowAddressInput] = useState(false);

  const handleCheckout = async () => {
    if (!userData?.user) {
      toast.error("Please login to proceed with checkout");
      router.push("/login?redirect=/cart");
      return;
    }

    if (!showAddressInput) {
      setShowAddressInput(true);
      return;
    }

    if (!items || items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!address.trim()) {
      toast.error("Please enter a delivery address");
      return;
    }

    try {
      setIsProcessing(true);

      // 1. Create Order
      const orderItems = items.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      }));

      const orderResponse = await createOrder({
        items: orderItems,
        deliveryAddress: address
      });

      const orderId = orderResponse.data.order._id;

      // 2. Create Checkout Session
      const sessionResponse = await createCheckoutSession(orderId);

      if (sessionResponse.sessionUrl) {
        window.location.href = sessionResponse.sessionUrl;
      } else {
        throw new Error("Failed to get checkout URL");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to process checkout. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
      <div className="bg-muted/10 border border-border/40 rounded-[3rem] p-8 space-y-8 backdrop-blur-md relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-all duration-1000" />

        <h2 className="text-2xl font-bold tracking-tight">Order Summary</h2>

        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Subtotal</span>
            <span className="font-bold tabular-nums">LKR {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Shipping</span>
            <span className={cn("font-bold", shipping === 0 ? "text-emerald-500" : "tabular-nums")}>
              {shipping === 0 ? "FREE" : `LKR ${shipping.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Estimated Tax</span>
            <span className="font-bold tabular-nums">LKR {tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-border/20 pt-4 mt-2">
            <div className="flex justify-between text-lg items-end">
              <span className="font-bold">Total</span>
              <div className="text-right">
                <span className="text-3xl font-bold text-primary tabular-nums tracking-tighter">
                  LKR {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {showAddressInput && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <MapPin className="w-3 h-3 text-primary" />
              Delivery Address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full delivery address..."
              className="w-full h-24 bg-background/50 border border-border/40 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>
        )}

        <div className="space-y-4 pt-4">
          <Button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full h-16 rounded-3xl font-bold text-sm tracking-[0.2em] uppercase shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              showAddressInput ? "Confirm & Pay" : "Checkout Now"
            )}
          </Button>

          <div className="pt-6 grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-muted/5 border border-border/20 hover:border-primary/20 transition-colors group/tool">
              <Truck className="w-5 h-5 text-muted-foreground mb-1 group-hover/tool:text-primary transition-colors" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">Fast</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-muted/5 border border-border/20 hover:border-primary/20 transition-colors group/tool">
              <ShieldCheck className="w-5 h-5 text-muted-foreground mb-1 group-hover/tool:text-primary transition-colors" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">Safe</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-muted/5 border border-border/20 hover:border-primary/20 transition-colors group/tool">
              <CreditCard className="w-5 h-5 text-muted-foreground mb-1 group-hover/tool:text-primary transition-colors" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">Easy</span>
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground text-center leading-relaxed px-4 pt-2">
            Secure and encrypted payments.
            <br />
            Complimentary shipping over LKR 50.
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { CreditCard, Truck, ShieldCheck, MapPin, Loader2, Upload, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMe } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { createOrder, uploadPaymentSlip } from "@/lib/api/order";
import { createCheckoutSession } from "@/lib/api/payment";
import { toast } from "sonner";
import { useCart } from "@/lib/hooks/useCart";

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
  const { clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [showAddressInput, setShowAddressInput] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "bank">("bank");

  // Bank Modal States
  const [showBankModal, setShowBankModal] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [isUploadingSlip, setIsUploadingSlip] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Receipt image must be smaller than 5MB");
        return;
      }
      setSlipFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSlip = async () => {
    if (!createdOrderId || !slipFile) {
      toast.error("Please select a receipt image to upload");
      return;
    }

    try {
      setIsUploadingSlip(true);
      await uploadPaymentSlip(createdOrderId, slipFile);
      toast.success("Payment receipt uploaded successfully! Awaiting verification.");
      clearCart();
      setShowBankModal(false);
      router.push("/profile/orders");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to upload receipt. You can re-upload it in your Orders History.");
    } finally {
      setIsUploadingSlip(false);
    }
  };

  const handleCloseModal = () => {
    clearCart();
    setShowBankModal(false);
    router.push("/profile/orders");
    toast.info("Order placed successfully. Please upload your payment slip in Order History to expedite verification.");
  };

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

    if (!contactPhone.trim()) {
      toast.error("Please enter a contact phone number");
      return;
    }

    try {
      setIsProcessing(true);

      // 1. Create Order
      const orderItems = items
        .filter(item => item && item.product && item.product._id)
        .map(item => ({
          product: item.product._id,
          quantity: item.quantity
        }));

      const orderResponse = await createOrder({
        items: orderItems,
        deliveryAddress: address,
        contactPhone: contactPhone
      });

      const orderId = orderResponse.data.order._id;

      if (paymentMethod === "stripe") {
        // 2. Create Checkout Session
        const sessionResponse = await createCheckoutSession(orderId);

        if (sessionResponse.sessionUrl) {
          window.location.href = sessionResponse.sessionUrl;
        } else {
          throw new Error("Failed to get checkout URL");
        }
      } else {
        // 2. Bank Transfer checkout: Open receipt upload popup modal
        setCreatedOrderId(orderId);
        setShowBankModal(true);
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
    <>
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
          <div className="flex justify-between text-[11px] font-bold text-primary bg-primary/5 border border-primary/10 rounded-xl px-4 py-2 mt-1">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" /> Estimated Delivery
            </span>
            <span>4-5 business days</span>
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
            
            <div className="space-y-3 mt-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Phone className="w-3 h-3 text-primary" />
                Contact Phone Number
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="e.g. +94 77 123 4567"
                className="w-full h-12 bg-background/50 border border-border/40 rounded-2xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
        )}

        {showAddressInput && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500 pt-4 border-t border-border/10">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <CreditCard className="w-3 h-3 text-primary" />
              Payment Method
            </label>
            <div className="flex flex-col gap-3">
              {/* Preselected Bank Wire Option */}
              <div className="h-16 rounded-[1.5rem] border border-primary/20 bg-primary/5 flex items-center justify-between px-5 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-primary">Bank Wire Transfer</span>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase mt-0.5">Deposit receipt required</p>
                  </div>
                </div>
                <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
              </div>

              {/* Maintenance Notice for Stripe Cards */}
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 text-center">
                <p className="text-[9px] font-black text-amber-600 uppercase tracking-wider">
                  ⚠️ Online Card Payment is temporarily disabled for maintenance
                </p>
                <p className="text-[8px] font-bold text-amber-600/70 uppercase tracking-widest mt-1">
                  Please use Bank Transfer to place your order smoothly.
                </p>
              </div>
            </div>
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
            Flat delivery fee of LKR 1,800 Islandwide.
          </p>
        </div>
      </div>
    </div>

      {/* Bank Transfer Receipt Upload Modal */}
      {showBankModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-2xl p-4 animate-in fade-in duration-300">
          <div className="relative max-w-xl w-full bg-background border border-border/40 rounded-[3rem] p-8 md:p-10 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleCloseModal}
              className="absolute top-6 right-6 w-10 h-10 rounded-full border border-border/40 hover:bg-muted/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Bank Wire Transfer</div>
              <h3 className="text-3xl font-black tracking-tighter text-heading">Transfer Receipt</h3>
              <p className="text-xs font-semibold text-muted-foreground">
                To complete your bank transfer payment, please deposit the total amount to our bank account below and upload a clear screenshot/photo of your payment slip receipt.
              </p>
            </div>

            {/* Bank details card */}
            <div className="p-6 bg-muted/10 border border-border/40 rounded-3xl space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Official Bank Credentials</p>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-bold">
                <div>
                  <span className="text-[10px] font-medium text-muted-foreground/80 block uppercase">Bank Name</span>
                  <span className="text-heading">Commercial bank</span>
                </div>
                <div>
                  <span className="text-[10px] font-medium text-muted-foreground/80 block uppercase">Account Number</span>
                  <span className="text-primary font-black">8026341367</span>
                </div>
                <div>
                  <span className="text-[10px] font-medium text-muted-foreground/80 block uppercase">Account Name</span>
                  <span className="text-heading">W.A.K.D Sankalpa</span>
                </div>
                <div>
                  <span className="text-[10px] font-medium text-muted-foreground/80 block uppercase">Branch</span>
                  <span className="text-heading">Enderamulla</span>
                </div>
              </div>
            </div>

            {/* File uploader */}
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Upload Deposit Slip Receipt</p>

              {!slipPreview ? (
                <label className="border-2 border-dashed border-border/40 hover:border-primary/40 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-primary/5 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-muted/20 flex items-center justify-center text-muted-foreground">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-xs font-bold text-heading">Click or Drag Image Here</p>
                    <p className="text-[10px] text-muted-foreground/80 font-medium">Supports JPG, PNG, WEBP (Max 5MB)</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative border border-border/40 rounded-3xl overflow-hidden bg-muted/5 p-4 flex flex-col items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      setSlipFile(null);
                      setSlipPreview(null);
                    }}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 shadow-sm transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <img
                    src={slipPreview}
                    alt="Slip Preview"
                    className="max-h-48 max-w-full rounded-2xl object-contain border border-border/40 bg-background animate-in zoom-in duration-300"
                  />
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                    Slip Receipt Attached
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-2">
              <Button
                variant="outline"
                onClick={handleCloseModal}
                className="flex-1 h-14 rounded-2xl font-black uppercase tracking-tighter hover:bg-muted/10 border-border/40"
              >
                Upload Later
              </Button>
              <Button
                onClick={handleUploadSlip}
                disabled={isUploadingSlip || !slipFile}
                className="flex-1 h-14 rounded-2xl font-black uppercase tracking-tighter bg-primary text-primary-foreground shadow-xl shadow-primary/10 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                {isUploadingSlip ? "Uploading..." : "Confirm Payment"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

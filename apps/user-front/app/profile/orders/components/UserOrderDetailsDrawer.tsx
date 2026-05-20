"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  MapPin,
  Package,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Star,
  Upload
} from "lucide-react";
import { ReviewDialog } from "./ReviewDialog";
import { generateOrderPDF } from "@/lib/utils/orderUtils";
import { useOrders } from "@/lib/hooks/useOrders";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { toast } from "sonner";

interface OrderItem {
  product: {
    _id: string;
    productName: string;
    imageURIs: string[];
    price: number;
  };
  quantity: number;
  price: number;
}

interface UserOrderDetailsDrawerProps {
  children: React.ReactNode;
  order: {
    _id: string;
    items: OrderItem[];
    totalPrice: number;
    status: string;
    paymentStatus: string;
    deliveryAddress: string;
    trackingNumber?: string;
    paymentSlipURI?: string;
    createdAt: string;
  };
}

export const UserOrderDetailsDrawer: React.FC<UserOrderDetailsDrawerProps> = ({
  children,
  order
}) => {
  const { uploadSlip, isUploadingSlip } = useOrders(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [open, setOpen] = useState(false);

  const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Receipt image must be smaller than 5MB");
        return;
      }
      uploadSlip({ orderId: order._id, file });
    }
  };

  const renderContent = () => (
    <div className="flex flex-col h-full text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 pb-6 border-b border-border/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            <ShoppingBag className="w-3 h-3" />
            Order Manifest
          </div>
          <h2 className="text-2xl sm:text-3xl font-black flex items-center gap-3 text-foreground">
            Order #{order._id.slice(-6).toUpperCase()}
          </h2>
          <p className="text-muted-foreground font-medium text-xs">
            Finalized on {new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(new Date(order.createdAt))}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end">
          <p className="text-2xl sm:text-3xl font-black text-primary">LKR {order.totalPrice.toFixed(2)}</p>
        </div>
      </div>

      <div className="py-6 space-y-8 flex-1">
        {/* Logistics & Security Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
          {/* Shipping Info */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <MapPin className="w-3 h-3 text-primary" /> Delivery Destination
            </h4>
            <div className="bg-muted/10 border border-border/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3">
              <div>
                <p className="text-sm font-bold text-heading text-foreground">Shipping Address</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
                  {order.deliveryAddress}
                </p>
              </div>
              <div className="pt-3 border-t border-border/20 flex items-center justify-between text-xs font-bold">
                <span className="text-muted-foreground uppercase tracking-widest text-[9px]">Estimated Delivery</span>
                <span className="text-primary uppercase tracking-widest text-[9px] bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-lg">4-5 Days</span>
              </div>
              {order.trackingNumber && (
                <div className="pt-3 border-t border-border/40">
                  <p className="text-xs font-bold text-heading uppercase tracking-wider text-foreground">Tracking Number</p>
                  <p className="text-sm font-black text-primary mt-1">
                    {order.trackingNumber}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Security */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-emerald-500" /> Transaction Security
            </h4>
            <div className="space-y-4">
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest truncate">
                    {order.paymentStatus === 'paid' ? 'Payment Verified' : 'Awaiting Review'}
                  </p>
                  <p className="text-[10px] text-emerald-600/60 font-medium truncate">Bank Wire / Stripe</p>
                </div>
              </div>

              {/* Payment Receipt Uploader / Viewer */}
              {order.paymentStatus !== "paid" ? (
                <div className="border border-dashed border-border/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center gap-3 bg-muted/5 animate-in fade-in duration-300">
                  {order.paymentSlipURI ? (
                    <div className="w-full flex flex-col items-center gap-2">
                      <img
                        src={order.paymentSlipURI}
                        alt="Payment Slip"
                        className="max-h-24 rounded-xl border border-border/40 object-contain bg-background"
                      />
                      <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        Slip Awaiting Review
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center gap-1.5">
                      <p className="text-[10px] font-bold text-muted-foreground">No deposit receipt uploaded yet.</p>
                    </div>
                  )}

                  <label className="h-9 px-4 rounded-xl border border-primary/20 hover:border-primary/40 text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 hover:bg-primary/5 transition-all cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    {order.paymentSlipURI ? "Update Slip" : "Upload Slip"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSlipUpload}
                      disabled={isUploadingSlip}
                      className="hidden"
                    />
                  </label>
                  {isUploadingSlip && (
                    <span className="text-[9px] text-muted-foreground font-bold animate-pulse">Uploading Slip...</span>
                  )}
                </div>
              ) : (
                order.paymentSlipURI && (
                  <div className="border border-emerald-500/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center gap-2 bg-emerald-500/5 animate-in fade-in duration-300">
                    <img
                      src={order.paymentSlipURI}
                      alt="Verified Payment Slip"
                      className="max-h-24 rounded-xl border border-emerald-500/20 object-contain bg-background"
                    />
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Payment Slip Verified
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Itemized Harvest (Product List) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <ShoppingBag className="w-3 h-3 text-primary" /> Artisanal Harvest
            </h4>
            <span className="text-[10px] font-black text-muted-foreground">{order.items.length} Packages</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {order.items.map((item, i) => (
              <div key={i} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 rounded-[1.8rem] sm:rounded-[2.5rem] bg-muted/5 border border-border/20 hover:bg-muted/10 transition-all hover:border-primary/20 gap-4 sm:gap-6">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-border/40 bg-background flex items-center justify-center flex-shrink-0">
                    {item.product?.imageURIs?.[0] ? (
                      <img src={item.product.imageURIs[0]} alt={item.product.productName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <Package className="w-8 h-8 opacity-20 text-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-heading text-foreground leading-tight truncate">{item.product?.productName || "Product"}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mt-1.5">Qty: {item.quantity}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/20">
                  {order.status === "completed" && item.product?._id && (
                    <ReviewDialog
                      productId={item.product._id}
                      orderId={order._id}
                      productName={item.product.productName}
                    >
                      <Button variant="outline" className="h-9 px-4 rounded-xl border-amber-500/20 text-amber-600 hover:bg-amber-500/5 hover:border-amber-500/40 text-[10px] font-black uppercase tracking-tighter gap-2 flex-shrink-0">
                        <Star className="w-3 h-3 fill-amber-500" />
                        Share Chronicle
                      </Button>
                    </ReviewDialog>
                  )}
                  <div className="text-right ml-auto sm:ml-0">
                    <p className="font-black text-primary tracking-tight">LKR {item.price.toFixed(2)}</p>
                    <p className="text-[10px] font-bold text-muted-foreground">Each</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pb-6 pt-4 border-t border-border/40 mt-auto">
        <Button 
          onClick={() => generateOrderPDF(order)}
          className="w-full h-14 rounded-2xl bg-foreground text-background font-black uppercase tracking-tighter shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          Download Digital Receipt
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-[850px] w-[90vw] h-[85vh] overflow-y-auto bg-background/80 backdrop-blur-2xl border border-border/40 rounded-[2.5rem] p-8 custom-scrollbar">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-primary/50 to-secondary" />
          {renderContent()}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh] bg-background">
        <div className="mx-auto w-full max-w-[800px] max-h-[calc(90vh-1rem)] overflow-y-auto overflow-x-hidden p-6 pt-2 custom-scrollbar">
          {renderContent()}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

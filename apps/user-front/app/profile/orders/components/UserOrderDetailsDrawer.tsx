"use client";

import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerTrigger
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  MapPin,
  Package,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Star
} from "lucide-react";
import { ReviewDialog } from "./ReviewDialog";
import { generateOrderPDF } from "@/lib/utils/orderUtils";

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
    createdAt: string;
  };
}

export const UserOrderDetailsDrawer: React.FC<UserOrderDetailsDrawerProps> = ({
  children,
  order
}) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh] bg-background">
        <div className="mx-auto w-full max-w-[800px] overflow-y-auto overflow-x-hidden">
          <DrawerHeader className="px-8 pt-8 text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/40">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                  <ShoppingBag className="w-3 h-3" />
                  Order Manifest
                </div>
                <DrawerTitle className="text-3xl font-black  flex items-center gap-3">
                  Order #{order._id.slice(-6).toUpperCase()}
                </DrawerTitle>
                <DrawerDescription className="text-muted-foreground font-medium">
                  Finalized on {new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(new Date(order.createdAt))}
                </DrawerDescription>
              </div>

              <div className="flex flex-col items-end">
                <p className="text-3xl font-black text-primary">LKR {order.totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </DrawerHeader>

          <div className="px-8 py-8 space-y-10">
            {/* Logistics & Security Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Shipping Info */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-primary" /> Delivery Destination
                </h4>
                <div className="bg-muted/10 border border-border/40 rounded-3xl p-6">
                  <p className="text-sm font-bold text-heading">Shipping Address</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
                    {order.deliveryAddress}
                  </p>
                </div>
              </div>

              {/* Payment Security */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" /> Transaction Security
                </h4>
                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                      {order.paymentStatus === 'paid' ? 'Authenticated Payment' : 'Payment Awaiting'}
                    </p>
                    <p className="text-[10px] text-emerald-600/60 font-medium">Processed via Stripe Secure</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Itemized Harvest (Product List) */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <ShoppingBag className="w-3 h-3 text-primary" /> Artisanal Harvest
                </h4>
                <span className="text-[10px] font-black text-muted-foreground">{order.items.length} Packages</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {order.items.map((item, i) => (
                  <div key={i} className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-[2.5rem] bg-muted/5 border border-border/20 hover:bg-muted/10 transition-all hover:border-primary/20 gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border border-border/40 bg-background flex items-center justify-center">
                        {item.product?.imageURIs?.[0] ? (
                          <img src={item.product.imageURIs[0]} alt={item.product.productName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <Package className="w-8 h-8 opacity-20" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-heading leading-none">{item.product?.productName || "Product"}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mt-2">Qty: {item.quantity}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      {order.status === "completed" && item.product?._id && (
                        <ReviewDialog
                          productId={item.product._id}
                          orderId={order._id}
                          productName={item.product.productName}
                        >
                          <Button variant="outline" className="h-9 px-4 rounded-xl border-amber-500/20 text-amber-600 hover:bg-amber-500/5 hover:border-amber-500/40 text-[10px] font-black uppercase tracking-tighter gap-2">
                            <Star className="w-3 h-3 fill-amber-500" />
                            Share Chronicle
                          </Button>
                        </ReviewDialog>
                      )}
                      <div className="text-right">
                        <p className="font-black text-primary tracking-tight">LKR {item.price.toFixed(2)}</p>
                        <p className="text-[10px] font-bold text-muted-foreground">Each</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DrawerFooter className="px-8 pb-10 pt-4 border-t border-border/40">
            <Button 
              onClick={() => generateOrderPDF(order)}
              className="w-full h-14 rounded-2xl bg-foreground text-background font-black uppercase tracking-tighter shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              Download Digital Receipt
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

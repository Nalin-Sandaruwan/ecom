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
import { 
  PackageCheck, 
  Truck, 
  Clock, 
  CheckCircle2, 
  CreditCard,
  ShoppingBag
} from "lucide-react";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

interface TrackStepProps {
  icon: any;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
  isLast?: boolean;
}

const TrackStep: React.FC<TrackStepProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  isCompleted, 
  isActive, 
  isLast 
}) => (
  <div className="flex gap-6">
    <div className="flex flex-col items-center">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border ${
        isCompleted 
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-lg shadow-emerald-500/10" 
          : isActive 
            ? "bg-primary/10 border-primary/20 text-primary shadow-lg shadow-primary/10 animate-pulse" 
            : "bg-muted/30 border-border/20 text-muted-foreground opacity-40"
      }`}>
        <Icon className="w-5 h-5" />
      </div>
      {!isLast && (
        <div className={`w-[2px] flex-1 my-2 rounded-full transition-colors duration-500 ${
          isCompleted ? "bg-emerald-500/40" : "bg-border/20"
        }`} />
      )}
    </div>
    <div className={`pb-10 pt-1 space-y-1 transition-opacity duration-500 text-left ${!isActive && !isCompleted ? "opacity-40" : "opacity-100"}`}>
      <h4 className="font-black text-heading uppercase tracking-tighter text-foreground">{title}</h4>
      <p className="text-xs font-medium text-muted-foreground max-w-xs">{description}</p>
      {isCompleted && (
        <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-2">
           <CheckCircle2 className="w-3 h-3" />
           Verified
        </div>
      )}
    </div>
  </div>
);

interface TrackOrderDrawerProps {
  children: React.ReactNode;
  order: {
    _id: string;
    status: string;
    paymentStatus: string;
    trackingNumber?: string;
  };
}

export const TrackOrderDrawer: React.FC<TrackOrderDrawerProps> = ({ 
  children, 
  order 
}) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [open, setOpen] = useState(false);

  const steps = [
    {
      id: "placed",
      title: "Order Placed",
      description: "Your artisanal selection has been registered in our manifest.",
      icon: ShoppingBag,
      isCompleted: true,
      isActive: false
    },
    {
      id: "paid",
      title: "Securely Paid",
      description: "Transaction finalized and verified via secure payment protocols.",
      icon: CreditCard,
      isCompleted: order.paymentStatus === 'paid',
      isActive: order.paymentStatus !== 'paid'
    },
    {
      id: "prepearing",
      title: "In Preparation",
      description: "Elite growers are carefully selecting and packaging your harvest.",
      icon: Clock,
      isCompleted: ["delivering", "completed"].includes(order.status),
      isActive: order.status === "prepearing" && order.paymentStatus === 'paid'
    },
    {
      id: "delivering",
      title: "Elite Delivery",
      description: "Your package is currently in transit to its destination.",
      icon: Truck,
      isCompleted: order.status === "completed",
      isActive: order.status === "delivering"
    },
    {
      id: "completed",
      title: "Delivered",
      description: "Journey complete. Enjoy your artisanal collection.",
      icon: PackageCheck,
      isCompleted: order.status === "completed",
      isActive: false
    }
  ];

  const renderContent = () => (
    <div className="flex flex-col h-full text-left">
      <div className="pb-6 border-b border-border/40">
         <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            <Truck className="w-3 h-3" />
            Live Logistics
         </div>
         <h3 className="text-3xl font-black tracking-tighter text-heading text-foreground mt-2">
           Tracking Summary
         </h3>
         <div className="text-muted-foreground font-medium flex flex-col gap-1.5 mt-1.5">
           <span className="text-xs">Real-time visualization of your order journey.</span>
           <div className="flex flex-wrap gap-2 mt-1.5">
             {order.trackingNumber && (
               <span className="text-[10px] font-black text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-xl w-fit uppercase tracking-wider">
                 Tracking Number: {order.trackingNumber}
               </span>
             )}
             <span className="text-[10px] font-black text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl w-fit uppercase tracking-wider">
               Est. Delivery: 4-5 Days
             </span>
           </div>
         </div>
      </div>

      <div className="overflow-y-auto flex-1 px-2 pb-6 pt-6 custom-scrollbar">
        <div className="flex flex-col">
          {steps.map((step, i) => (
            <TrackStep 
              key={step.id} 
              {...step} 
              isLast={i === steps.length - 1} 
            />
          ))}
        </div>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-[550px] w-[90vw] h-fit max-h-[85vh] overflow-y-auto bg-background/80 backdrop-blur-2xl border border-border/40 rounded-[2.5rem] p-8 custom-scrollbar">
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
      <DrawerContent className="max-h-[85vh] bg-background">
        <div className="mx-auto w-full max-w-[500px] overflow-y-auto max-h-[calc(85vh-1rem)] px-6 pb-6 pt-2 custom-scrollbar">
          {renderContent()}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

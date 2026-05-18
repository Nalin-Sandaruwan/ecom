"use client";

import React from "react";
import { Package, CheckCircle, Clock, Loader2, Info } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { useDeleteAdminProduct, useApproveAdminProduct } from "@/lib/hooks/useAdminProduct";
import { AdminProduct } from "@/lib/api/adminProduct";
import { cn } from "@/lib/utils";

// Sub-components
import { ProductMetrics } from "./ProductMetrics";
import { ProductCertifications } from "./ProductCertifications";
import { FarmerAttribution } from "./FarmerAttribution";
import { AdministrativeOversight } from "./AdministrativeOversight";
import { CertificateLightbox } from "./CertificateLightbox";

interface ProductDetailsDrawerProps {
  product: AdminProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProductDetailsDrawer = ({ product, open, onOpenChange }: ProductDetailsDrawerProps) => {
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteAdminProduct();
  const { mutate: approveProduct, isPending: isApproving } = useApproveAdminProduct();
  const [selectedCert, setSelectedCert] = React.useState<string | null>(null);

  if (!product) return null;

  const handleDelete = () => {
    if (confirm("Are you sure you want to remove this product from the platform? This action cannot be undone.")) {
      deleteProduct(product._id, {
        onSuccess: () => onOpenChange(false)
      });
    }
  };

  const handleApprove = () => {
    approveProduct(product._id);
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: "OUT_OF_STOCK", color: "bg-red-500/10 text-red-500 border-red-500/20" };
    if (quantity < 10) return { label: "CRITICAL_LEVEL", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" };
    return { label: "OPTIMAL_STOCK", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" };
  };

  const stock = getStockStatus(product.quantity);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right" >
      <DrawerContent className="h-full mt-0 rounded-l-[3rem] rounded-r-none border-l border-border/40 bg-background/80 backdrop-blur-3xl sm:max-w-[85vw] ml-auto overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary via-secondary to-primary/50" />

        <div className="h-full overflow-y-auto custom-scrollbar">
          <DrawerHeader className="p-8 pb-4">
            <div className="space-y-4">
              <div className="w-full aspect-video sm:aspect-square rounded-[2.5rem] overflow-hidden border border-border/20 shadow-2xl relative group">
                {product.imageURIs[0] ? (
                  <img src={product.imageURIs[0]} alt={product.productName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Package className="w-12 h-12 text-muted-foreground opacity-20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <p className="text-white text-[10px] font-bold uppercase tracking-widest">Main Product Visual</p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="rounded-md px-2 py-0 text-[9px] font-black tracking-widest uppercase border-primary/20 text-primary bg-primary/5">
                    {product.productType}
                  </Badge>
                  <div className={cn("px-2 py-0 rounded-md text-[9px] font-black tracking-widest uppercase border", stock.color)}>
                    {stock.label}
                  </div>

                  {/* Clickable Status Badge */}
                  <button
                    onClick={handleApprove}
                    disabled={isApproving}
                    className={cn(
                      "flex items-center gap-1.5 px-2 py-0 rounded-md border text-[9px] font-black tracking-widest uppercase transition-all active:scale-95",
                      product.isActive
                        ? "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20"
                        : "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20"
                    )}
                  >
                    {isApproving ? (
                      <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    ) : product.isActive ? (
                      <CheckCircle className="w-2.5 h-2.5" />
                    ) : (
                      <Clock className="w-2.5 h-2.5" />
                    )}
                    {product.isActive ? "Approved" : "Pending Approval"}
                  </button>
                </div>
                <DrawerTitle className="text-3xl font-bold tracking-tight text-foreground">{product.productName}</DrawerTitle>
                <DrawerDescription className="text-xs font-medium uppercase tracking-widest text-muted-foreground mt-1">
                  SKU: {product._id.toUpperCase()}
                </DrawerDescription>
              </div>
            </div>
          </DrawerHeader>

          <div className="p-8 pt-0 space-y-8">
            {/* 1. Universal Context: Description & Detailed Metrics */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Universal Context</h4>
              <div className="py-6 px-2 rounded-[2rem] bg-muted/10 border border-border/10 space-y-3">
                <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                  <Info className="w-3.5 h-3.5" /> Description
                </div>
                <p className="text-sm font-medium leading-relaxed text-foreground/80">{product.productDescription}</p>
              </div>

              {/* Product Metrics Component (Price, Stock, Category) */}
              <ProductMetrics product={product} />
            </div>

            <hr className="border-border/10" />

            {/* 2. Product Certifications: Visual Audit Gallery */}
            <ProductCertifications product={product} onViewCert={setSelectedCert} />

            <hr className="border-border/10" />

            {/* 3. Farmer Attribution: Profile & Contact Info */}
            <FarmerAttribution product={product} />

            {/* 4. Action Center: Administrative Controls (Approve/Delete) */}
            <AdministrativeOversight
              product={product}
              isApproving={isApproving}
              isDeleting={isDeleting}
              onApprove={handleApprove}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </DrawerContent>

      {/* Lightbox for large image viewing */}
      <CertificateLightbox
        selectedCert={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </Drawer>
  );
};

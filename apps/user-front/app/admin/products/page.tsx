"use client";

import React, { useState } from "react";
import {
  Package,
  Search,
  Filter,
  RefreshCcw,
  Activity,
  ArrowRight,
  User,
  AlertTriangle,
  Loader2,
  CheckCircle,
  Clock
} from "lucide-react";
import { AdminPageHeader } from "../components/AdminPageHeader";
import { AdminMetricCard } from "../components/AdminMetricCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAdminProducts } from "@/lib/hooks/useAdminProduct";
import { ProductDetailsDrawer } from "./components/ProductDetailsDrawer";
import { AdminProduct } from "@/lib/api/adminProduct";

export default function AdminProductsPage() {
  const { data: productsResponse, isLoading, isError, refetch } = useAdminProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending">("all");

  const products = productsResponse?.data?.products || [];

  const filteredProducts = React.useMemo(() =>
    products.filter((p: AdminProduct) => {
      const matchesSearch = p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.farmerId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categoryId?.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" ? true :
        statusFilter === "approved" ? p.isActive === true :
          p.isActive === false;

      return matchesSearch && matchesStatus;
    }), [products, searchTerm, statusFilter]);

  const stats = React.useMemo(() => ({
    total: products.length,
    lowStock: products.filter(p => p.quantity > 0 && p.quantity < 10).length,
    outOfStock: products.filter(p => p.quantity === 0).length,
    totalValue: products.reduce((acc, p) => acc + (p.price * p.quantity), 0)
  }), [products]);

  const handleInspect = (product: AdminProduct) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  // Keep selected product in sync with updated product list
  React.useEffect(() => {
    if (selectedProduct) {
      const updated = products.find(p => p._id === selectedProduct._id);
      if (updated) setSelectedProduct(updated);
    }
  }, [products]);

  return (
    <div className="space-y-10 pb-10">
      <AdminPageHeader
        title="Universal Inventory"
        description="Audit platform harvests, monitor global stock levels, and oversee farmer listings."
        primaryAction={{
          label: "Supply Chain Audit",
          icon: Activity,
          onClick: () => window.location.href = "/admin"
        }}
      />

      {/* Global Inventory Pulse */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-[2rem] bg-muted/20" />)
        ) : (
          <>
            <AdminMetricCard label="Total Harvests" value={stats.total.toString()} icon={Package} trend="Live" isPositive={true} />
            <AdminMetricCard label="Global Inventory Value" value={`LKR ${(stats.totalValue / 1000).toFixed(1)}K`} icon={Activity} trend="Calculated" isPositive={true} />
            <AdminMetricCard label="Critical Stock" value={stats.lowStock.toString()} icon={AlertTriangle} trend="Attention" isPositive={false} />
            <AdminMetricCard label="Depleted Listings" value={stats.outOfStock.toString()} icon={Package} trend="Inactive" isPositive={false} />
          </>
        )}
      </div>

      {/* Audit Tools */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/20 border border-border/20 rounded-[2rem] p-4 px-6">
        <div className="flex items-center gap-3 w-full sm:w-96 bg-background/50 border border-border/40 rounded-xl px-4 py-2 group focus-within:border-primary/50 transition-all">
          <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product, farmer, or category..."
            className="bg-transparent border-none text-sm font-semibold focus:ring-0 placeholder:text-muted-foreground/60 w-full"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="h-10 rounded-xl border-border/40 font-bold flex items-center gap-2 hover:bg-primary/5 transition-all text-xs"
          >
            <RefreshCcw className="w-4 h-4" /> Sync Registry
          </Button>

          {/* Approval Filter Tabs */}
          <div className="flex bg-background/50 p-1 rounded-xl border border-border/40">
            {[
              { id: "all", label: "All" },
              { id: "approved", label: "Approved" },
              { id: "pending", label: "Pending" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                  statusFilter === tab.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="h-6 w-[1px] bg-border/40 hidden sm:block" />
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">
            Listing {filteredProducts.length} Artisanal Goods
          </p>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {isLoading ? (
          [1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-32 rounded-[2.5rem] bg-muted/10 border border-border/10" />)
        ) : isError ? (
          <div className="col-span-full py-20 text-center space-y-4 rounded-[3rem] border border-dashed border-border/40">
            <Loader2 className="w-10 h-10 animate-spin text-muted-foreground mx-auto" />
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Synchronizing supply chain...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full py-20 text-center space-y-4 rounded-[3rem] border border-dashed border-border/40">
            <Package className="w-10 h-10 text-muted-foreground mx-auto opacity-20" />
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">No harvests found in current viewport</p>
          </div>
        ) : (
          filteredProducts.map((product: AdminProduct) => (
            <div
              key={product._id}
              onClick={() => handleInspect(product)}
              className="group cursor-pointer flex flex-col sm:flex-row items-center justify-between p-5 rounded-[2.5rem] bg-muted/20 border border-border/20 hover:bg-muted/30 hover:border-primary/20 transition-all gap-6"
            >
              <div className="flex items-center gap-5 w-full">
                <div className="w-20 h-20 rounded-[1.8rem] bg-background border border-border/10 overflow-hidden shadow-sm group-hover:scale-105 transition-all duration-500 flex-shrink-0">
                  {product.imageURIs[0] ? (
                    <img src={product.imageURIs[0]} alt={product.productName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted/50">
                      <Package className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-foreground truncate">{product.productName}</h3>
                    <Badge variant="outline" className="rounded-md px-2 py-0 text-[8px] font-black tracking-widest uppercase border-primary/20 text-primary bg-primary/5">
                      {product.categoryId?.name}
                    </Badge>
                    <div className={cn(
                      "flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[8px] font-black tracking-widest uppercase",
                      product.isActive
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    )}>
                      {product.isActive ? (
                        <><CheckCircle className="w-2.5 h-2.5" /> Approved</>
                      ) : (
                        <><Clock className="w-2.5 h-2.5" /> Pending Approval</>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                      <User className="w-3.5 h-3.5 text-primary" />
                      <span className="truncate">{product.farmerId?.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-tighter">
                        {product.quantity} Units in Stock
                      </p>
                      <div className="w-1 h-1 rounded-full bg-border/40" />
                      <p className="text-[10px] font-black text-foreground/80 lowercase tracking-tight">
                        LKR {product.price}/unit
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <div className={cn(
                  "px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border whitespace-nowrap",
                  product.quantity === 0 ? "bg-red-500/10 text-red-500 border-red-500/20" :
                    product.quantity < 10 ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                      "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                )}>
                  {product.quantity === 0 ? "DEPLETED" : product.quantity < 10 ? "CRITICAL" : "HEALTHY"}
                </div>
                <Button variant="ghost" className="w-10 h-10 rounded-xl p-0 hover:bg-primary/10 hover:text-primary transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <ProductDetailsDrawer

        product={selectedProduct}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
    </div>
  );
}

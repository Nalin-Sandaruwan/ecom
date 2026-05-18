"use client";

import React, { useState } from "react";
import { Plus, Package, Search, Filter, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFarmerProducts } from "@/lib/hooks/useProduct";
import { ProductTableRow } from "./components/ProductTableRow";
import { ProductDetailsDrawer } from "./components/ProductDetailsDrawer";
import { DeleteProductDialog } from "./components/DeleteProductDialog";
import { EditProductDialog } from "./components/EditProductDialog";
import CreateProductDialog from "../dashoard/components/CreateProductDialog";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsPage() {
    const { data, isLoading, isError, refetch } = useFarmerProducts();
    const [searchTerm, setSearchTerm] = useState("");

    // Selection states for actions
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const products = data?.data?.products || [];

    const filteredProducts = products.filter((p: any) =>
        p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categoryId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleView = (product: any) => {
        setSelectedProduct(product);
        setIsDetailsOpen(true);
    };

    const handleEdit = (product: any) => {
        setSelectedProduct(product);
        setIsEditOpen(true);
    };

    const handleDelete = (product: any) => {
        setSelectedProduct(product);
        setIsDeleteOpen(true);
    };

    return (
        <div className="min-h-screen p-4 md:p-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {/* <Package className="w-10 h-10 text-primary" /> */}
                        My Products
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage your artisanal collection and market presence</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => refetch()}
                        className="rounded-2xl h-12 w-12 bg-background/40 backdrop-blur-xl border-border/40 hover:bg-primary/10 transition-all"
                    >
                        <RefreshCcw className="w-5 h-5" />
                    </Button>
                    <CreateProductDialog>
                        <Button className="h-12 px-6 rounded-2xl bg-primary text-primary-foreground font-bold uppercase tracking-wide shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            List New Product
                        </Button>
                    </CreateProductDialog>
                </div>
            </div>

            {/* Stats/Filters Row */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products by name or category..."
                        className="h-12 pl-11 rounded-2xl bg-background/40 backdrop-blur-xl border-border/40 focus:ring-primary/20 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="h-12 px-6 rounded-2xl bg-background/40 backdrop-blur-xl border-border/40 font-bold uppercase tracking-wide flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                </Button>
            </div>

            {/* Table Header */}
            {!isLoading && !isError && filteredProducts.length > 0 && (
                <div className="hidden md:flex items-center gap-6 px-10 py-4 bg-muted/20 border border-border/40 rounded-[1.5rem] mb-2">
                    <div className="w-24 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Asset</div>
                    <div className="flex-1 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Product Detail</div>
                    <div className="hidden lg:block w-32 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Category Specs</div>
                    <div className="w-32 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Inventory</div>
                    <div className="w-28 text-right text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Market Value</div>
                    <div className="w-[140px] text-right text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Actions</div>
                </div>
            )}

            {/* Products Column (Rows) */}
            {isLoading ? (
                <div className="flex flex-col gap-4">
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="h-24 rounded-[1.8rem] bg-muted/10 animate-pulse border border-border/40" />
                    ))}
                </div>
            ) : isError ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-background/40 backdrop-blur-xl border border-border/40 rounded-[3rem]">
                    <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-4">
                        <RefreshCcw className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold">Failed to load products</h3>
                    <p className="text-muted-foreground max-w-xs">There was an issue connecting to the market. Please try again.</p>
                    <Button onClick={() => refetch()} variant="outline" className="rounded-xl px-8 h-12 font-bold uppercase tracking-wide">
                        Retry Connection
                    </Button>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 bg-background/40 backdrop-blur-xl border border-border/40 rounded-[3rem]">
                    <div className="w-24 h-24 rounded-[2.5rem] bg-primary/5 flex items-center justify-center text-primary/30">
                        <Package className="w-12 h-12" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-heading">No Products Found</h3>
                        <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                            {searchTerm
                                ? `No products matching "${searchTerm}" were found in your inventory.`
                                : "Your collection is currently empty. Start your journey by listing your first artisanal product."}
                        </p>
                    </div>
                    {!searchTerm && (
                        <CreateProductDialog>
                            <Button className="h-14 px-10 rounded-2xl bg-primary text-primary-foreground font-bold uppercase tracking-wide shadow-2xl shadow-primary/20">
                                Add My First Product
                            </Button>
                        </CreateProductDialog>
                    )}
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product: any) => (
                            <ProductTableRow
                                key={product._id}
                                product={product}
                                onView={handleView}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Modals & Overlays */}
            <ProductDetailsDrawer
                product={selectedProduct}
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
            />

            <EditProductDialog
                product={selectedProduct}
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
            />

            <DeleteProductDialog
                product={selectedProduct}
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
            />
        </div>
    );
}

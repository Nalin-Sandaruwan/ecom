"use client";

import Navbar from "../../../components/Navbar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { notFound } from "next/navigation";
import { use } from "react";
import { useProduct } from "@/lib/hooks/useProduct";

// Modular Components
import ShowcaseSkeleton from "./components/ShowcaseSkeleton";
import ProductVisuals from "./components/ProductVisuals";
import ProductInfo from "./components/ProductInfo";
import ProductCheckout from "./components/ProductCheckout";
import { ProductReviews } from "./components/ProductReviews";

export default function ProductShowcase({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: productData, isLoading, isError } = useProduct(resolvedParams.id);
  const product = productData?.data?.product;

  if (!isLoading && (!product || isError)) {
    notFound();
  }

  if (isLoading) {
    return <ShowcaseSkeleton />;
  }

  return (
    <div className="bg-background min-h-screen flex flex-col pt-[80px] overflow-x-hidden">
      <Navbar />

      {/* Background Decor - Clipped to prevent overflow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/10 blur-[150px] rounded-full -mr-40 -mt-20" />
        <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-secondary/5 blur-[120px] rounded-full -ml-20 -mb-20" />
      </div>

      <main className="relative z-10 flex-grow mx-auto max-w-7xl w-full px-6 lg:px-8 py-10 lg:py-20">

        {/* Navigation Action */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Link href="/shop" className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all">
            <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
            Back to Selection
          </Link>
        </motion.div>

        {/* Product Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24 items-start">

          {/* Visual Showcase (Left Column) */}
          <ProductVisuals
            productName={product.productName}
            imageURIs={product.imageURIs}
            productType={product.productType}
          />

          {/* Narrative & Action (Right Column) */}
          <div className="lg:col-span-7 xl:col-span-6 space-y-12">
            <ProductInfo
              productName={product.productName}
              categoryName={product.categoryId?.name}
              description={product.productDescription}
              farmer={product.farmerId}
              certificates={product.certificateURIs}
            />

            <ProductCheckout
              product={product}
            />
          </div>
        </div>

        {/* Artisanal Chronicles (Reviews) Section */}
        <ProductReviews productId={product._id} />
      </main>
    </div>
  );
}

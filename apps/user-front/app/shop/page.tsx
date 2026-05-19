"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import {
  Sparkles,
  Leaf,
  Utensils,
  Tag,
  Star
} from "lucide-react";

import { useProducts } from "@/lib/hooks/useProduct";
import { useCategories } from "@/lib/hooks/useCategory";

// Modular Components
import ShopHeader from "./components/ShopHeader";
import ShopSidebar from "./components/ShopSidebar";
import ProductGrid from "./components/ProductGrid";
import ShopFilters from "./components/ShopFilters";

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: productsData, isLoading } = useProducts();
  const { data: categories = [] } = useCategories();

  const products = productsData?.data?.products || [];

  const filteredProducts = products.filter((p: any) => {
    const matchesCategory = selectedCategory === "all" || p.categoryId?._id === selectedCategory;
    const matchesType = selectedType === "all" || p.productType === selectedType;
    const matchesSearch = p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.productDescription?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesType && matchesSearch;
  });

  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      <main className="pt-32 pb-32 container mx-auto px-6 lg:px-8">
        <ShopHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />



        <div className="flex flex-col lg:flex-row gap-12 pt-8">
          <ShopSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          <div className="flex-1">
            <ProductGrid
              products={filteredProducts}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

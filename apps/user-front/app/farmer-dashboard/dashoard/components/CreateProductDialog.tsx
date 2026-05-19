"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProduct } from "@/lib/hooks/useProduct";
import { useCategories } from "@/lib/hooks/useCategory";
import {
  Loader2,
  Plus,
  Package,
  DollarSign,
  LayoutGrid,
  FileText,
  Image as ImageIcon,
  Layers,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const productSchema = z.object({
  productName: z.string().min(3, "Product name must be at least 3 characters"),
  productDescription: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().min(1, "Price is required"),
  quantity: z.string().min(1, "Quantity is required"),
  productType: z.enum(["produce", "seeds", "fertilizers", "equipment", "other"]),
  categoryId: z.string().min(1, "Please select a category"),
});

type ProductFormValues = z.infer<typeof productSchema>;

function CreateProductDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
  const { mutate: createProduct, isPending } = useCreateProduct();
  const { data: categories, isLoading: isLoadingCats } = useCategories();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: "",
      productDescription: "",
      price: "",
      quantity: "",
      productType: "produce" as any,
      categoryId: "",
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    const formData = new FormData();
    formData.append("productName", data.productName);
    formData.append("productDescription", data.productDescription);
    formData.append("price", data.price);
    formData.append("quantity", data.quantity);
    formData.append("productType", data.productType);
    formData.append("categoryId", data.categoryId);

    if (selectedImages) {
      for (let i = 0; i < selectedImages.length; i++) {
        formData.append("images", selectedImages[i]);
      }
    }



    createProduct(formData, {
      onSuccess: () => {
        setOpen(false);
        reset();
        setSelectedImages(null);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[90vh] overflow-y-auto bg-background/60 backdrop-blur-2xl border-border/40 rounded-[2.5rem] p-0 shadow-2xl custom-scrollbar">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-primary/50" />

        <DialogHeader className="p-8 pb-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight text-heading">List New Product</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground font-medium">Broadcast your handcrafted masterpiece to the global elite market</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="productName" className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-1.5">
                <Package className="w-3.5 h-3.5" /> Product Name
              </Label>
              <Input
                {...register("productName")}
                id="productName"
                placeholder="e.g. Minimalist Mahogany Silhouette"
                className="h-12 rounded-2xl bg-background/40 border-border/40 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all px-5"
              />
              {errors.productName && <p className="text-[10px] font-bold text-destructive ml-1">{errors.productName.message}</p>}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="categoryId" className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-1.5">
                <LayoutGrid className="w-3.5 h-3.5" /> Category
              </Label>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <SelectTrigger className="w-full h-12 rounded-2xl bg-background/40 border-border/40 focus:ring-2 focus:ring-primary/20 focus:border-primary px-5 text-sm font-medium">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl bg-background/80 backdrop-blur-xl border-border/40">
                      {isLoadingCats ? (
                        <div className="p-2 text-xs text-muted-foreground">Loading...</div>
                      ) : (
                        (Array.isArray(categories) ? categories : []).map((cat: any) => (
                          <SelectItem key={cat._id} value={cat._id} className="rounded-xl focus:bg-primary/10 px-4 py-3 cursor-pointer transition-colors">
                            {cat.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && <p className="text-[10px] font-bold text-destructive ml-1">{errors.categoryId.message}</p>}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price" className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-1.5">
                <DollarSign className="w-3.5 h-3.5" /> Price (LKR)
              </Label>
              <Input
                {...register("price")}
                id="price"
                type="text"
                placeholder="45000"
                className="h-12 rounded-2xl bg-background/40 border-border/40 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all px-5"
              />
              {errors.price && <p className="text-[10px] font-bold text-destructive ml-1">{errors.price.message}</p>}
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-1.5">
                <Layers className="w-3.5 h-3.5" /> Quantity / Pieces
              </Label>
              <Input
                {...register("quantity")}
                id="quantity"
                type="text"
                placeholder="5"
                className="h-12 rounded-2xl bg-background/40 border-border/40 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all px-5"
              />
              {errors.quantity && <p className="text-[10px] font-bold text-destructive ml-1">{errors.quantity.message}</p>}
            </div>

            {/* Product Type */}
            <div className="col-span-full space-y-2">
              <Label htmlFor="productType" className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-1.5">
                <Layers className="w-3.5 h-3.5" /> Craft Classification
              </Label>
              <Controller
                name="productType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full h-12 rounded-2xl bg-background/40 border-border/40 focus:ring-2 focus:ring-primary/20 focus:border-primary px-5 text-sm font-medium">
                      <SelectValue placeholder="Select Craft Type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl bg-background/80 backdrop-blur-xl border-border/40">
                      <SelectItem value="produce" className="rounded-xl focus:bg-primary/10 px-4 py-3 cursor-pointer transition-colors">Wooden Sculptures</SelectItem>
                      <SelectItem value="seeds" className="rounded-xl focus:bg-primary/10 px-4 py-3 cursor-pointer transition-colors">Wall Panels</SelectItem>
                      <SelectItem value="fertilizers" className="rounded-xl focus:bg-primary/10 px-4 py-3 cursor-pointer transition-colors">Tabletop Pieces</SelectItem>
                      <SelectItem value="equipment" className="rounded-xl focus:bg-primary/10 px-4 py-3 cursor-pointer transition-colors">Custom Carvings</SelectItem>
                      <SelectItem value="other" className="rounded-xl focus:bg-primary/10 px-4 py-3 cursor-pointer transition-colors">Other Crafts</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.productType && <p className="text-[10px] font-bold text-destructive ml-1">{errors.productType.message}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="productDescription" className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-1.5">
              <FileText className="w-3.5 h-3.5" /> Description
            </Label>
            <Textarea
              {...register("productDescription")}
              id="productDescription"
              placeholder="Tell our patrons about the unique origins and artisanal quality of this product..."
              rows={3}
              className="rounded-3xl bg-background/40 border-border/40 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all px-5 py-3 resize-none"
            />
            {errors.productDescription && <p className="text-[10px] font-bold text-destructive ml-1">{errors.productDescription.message}</p>}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="images" className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-1.5">
              <ImageIcon className="w-3.5 h-3.5" /> Product Images (up to 2)
            </Label>
            <div className="relative group cursor-pointer">
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={(e) => setSelectedImages(e.target.files)}
                className="hidden"
              />
              <Label
                htmlFor="images"
                className={cn(
                  "flex flex-col items-center justify-center w-full h-32 rounded-3xl border-2 border-dashed transition-all cursor-pointer",
                  selectedImages
                    ? "border-green-500/50 bg-green-500/5"
                    : "border-border/40 bg-background/20 hover:bg-primary/5 hover:border-primary/40"
                )}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex flex-col items-center gap-2",
                    selectedImages ? "text-green-600" : "text-muted-foreground"
                  )}
                >
                  {selectedImages ? <CheckCircle2 className="w-6 h-6" /> : <Plus className="w-5 h-5" />}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-center px-4 font-bold uppercase tracking-wide">
                      {selectedImages ? `${selectedImages.length} Images Added Successfully` : "Select artisanal visuals"}
                    </span>
                    <span className="text-[8px] font-medium text-muted-foreground/60 uppercase tracking-[0.2em] mt-1">Images only</span>
                  </div>
                </motion.div>
              </Label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 pb-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-wide hover:bg-muted/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 h-14 rounded-2xl bg-primary text-primary-foreground font-bold uppercase tracking-wide shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Listing...
                </>
              ) : (
                <>
                  List Product
                  <Plus className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateProductDialog;

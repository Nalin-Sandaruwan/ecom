"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { useUpdateProduct } from "@/lib/hooks/useProduct";
import { useCategories } from "@/lib/hooks/useCategory";
import {
  Loader2,
  Package,
  DollarSign,
  LayoutGrid,
  FileText,
  Image as ImageIcon,
  Layers,
  Save,
} from "lucide-react";

const productSchema = z.object({
  productName: z.string().min(3, "Product name must be at least 3 characters"),
  productDescription: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().min(1, "Price is required"),
  quantity: z.string().min(1, "Quantity is required"),
  productType: z.enum(["produce", "seeds", "fertilizers", "equipment", "other"]),
  categoryId: z.string().min(1, "Please select a category"),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface EditProductDialogProps {
  product: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProductDialog({ product, open, onOpenChange }: EditProductDialogProps) {
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
  const { mutate: updateProduct, isPending } = useUpdateProduct();
  const { data: categories, isLoading: isLoadingCats } = useCategories();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (product) {
      reset({
        productName: product.productName,
        productDescription: product.productDescription,
        price: product.price.toString(),
        quantity: product.quantity.toString(),
        productType: product.productType,
        categoryId: product.categoryId?._id || product.categoryId,
      });
    }
  }, [product, reset]);

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

    updateProduct({ id: product._id, formData }, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] overflow-y-auto bg-background/60 backdrop-blur-2xl border-border/40 rounded-[2.5rem] p-0 shadow-2xl custom-scrollbar">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-primary/50" />

        <DialogHeader className="p-8 pb-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight text-heading">Edit Product</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground font-medium">Refine your artisanal listing for the global market</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-1.5">
                <Package className="w-3.5 h-3.5" /> Product Name
              </Label>
              <Input
                {...register("productName")}
                className="h-12 rounded-2xl bg-background/40 border-border/40 focus:ring-2 focus:ring-primary/20 transition-all px-5"
              />
              {errors.productName && <p className="text-[10px] font-bold text-destructive">{errors.productName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-1.5">
                <LayoutGrid className="w-3.5 h-3.5" /> Category
              </Label>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full h-12 rounded-2xl bg-background/40 border-border/40 px-5">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl bg-background/80 backdrop-blur-xl border-border/40">
                      {(Array.isArray(categories) ? categories : []).map((cat: any) => (
                        <SelectItem key={cat._id} value={cat._id} className="rounded-xl">
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && <p className="text-[10px] font-bold text-destructive">{errors.categoryId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-1.5">
                <DollarSign className="w-3.5 h-3.5" /> Price ($)
              </Label>
              <Input
                {...register("price")}
                className="h-12 rounded-2xl bg-background/40 border-border/40 px-5"
              />
              {errors.price && <p className="text-[10px] font-bold text-destructive">{errors.price.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-1.5">
                <Layers className="w-3.5 h-3.5" /> Quantity / Kg
              </Label>
              <Input
                {...register("quantity")}
                className="h-12 rounded-2xl bg-background/40 border-border/40 px-5"
              />
              {errors.quantity && <p className="text-[10px] font-bold text-destructive">{errors.quantity.message}</p>}
            </div>

            <div className="col-span-full space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-1.5">
                <Layers className="w-3.5 h-3.5" /> Product Type
              </Label>
              <Controller
                name="productType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full h-12 rounded-2xl bg-background/40 border-border/40 px-5">
                      <SelectValue placeholder="Select Product Type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl bg-background/80 backdrop-blur-xl">
                      <SelectItem value="produce">Produce</SelectItem>
                      <SelectItem value="seeds">Seeds</SelectItem>
                      <SelectItem value="fertilizers">Fertilizers</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-1.5">
              <FileText className="w-3.5 h-3.5" /> Description
            </Label>
            <Textarea
              {...register("productDescription")}
              rows={3}
              className="rounded-3xl bg-background/40 border-border/40 px-5 py-3 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-1.5">
              <ImageIcon className="w-3.5 h-3.5" /> Update Images (Optional)
            </Label>
            <div className="relative group cursor-pointer">
              <input
                type="file"
                id="edit-images"
                multiple
                accept="image/*"
                onChange={(e) => setSelectedImages(e.target.files)}
                className="hidden"
              />
              <Label
                htmlFor="edit-images"
                className="flex flex-col items-center justify-center w-full h-24 rounded-3xl border-2 border-dashed border-border/40 bg-background/20 hover:bg-primary/5 transition-all cursor-pointer"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {selectedImages ? `${selectedImages.length} images selected` : "Select new visuals to replace old ones"}
                </span>
              </Label>
            </div>
          </div>

          <div className="flex gap-3 pt-4 pb-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-wide"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 h-14 rounded-2xl bg-primary text-primary-foreground font-bold uppercase tracking-wide shadow-xl shadow-primary/20"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Save Changes
                  <Save className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateFarmerProfile } from "@/lib/hooks/useFarmer";
import { Loader2, UserPlus, MapPin, FileText, Palette, Hammer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const farmerSchema = z.object({
  farmName: z.string().min(3, "Studio name must be at least 3 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type FarmerFormValues = z.infer<typeof farmerSchema>;

export function CreateFarmerDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { mutate: createProfile, isPending } = useCreateFarmerProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FarmerFormValues>({
    resolver: zodResolver(farmerSchema),
    defaultValues: {
      farmName: "",
      address: "",
      description: "",
    },
  });

  const onSubmit = (data: FarmerFormValues) => {
    createProfile(
      {
        farmName: data.farmName,
        description: data.description,
        address: data.address,
      },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-background/60 backdrop-blur-2xl border-border/40 rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-primary/50" />

        <DialogHeader className="p-8 pb-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Palette className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight text-heading">Create Artisan Studio</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground font-medium">Define your craft legacy on WoodenGallery</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-0 space-y-6">
          <div className="space-y-5">
            {/* Farm Name */}
            <div className="space-y-2">
              <Label htmlFor="farmName" className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-1.5">
                <Hammer className="w-3.5 h-3.5" /> Studio / Workshop Name
              </Label>
              <Input
                {...register("farmName")}
                id="farmName"
                placeholder="e.g. Ceylon Minimalist Carvings"
                className="h-12 rounded-2xl bg-background/40 border-border/40 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all px-5"
              />
              {errors.farmName && <p className="text-[10px] font-bold text-destructive ml-1">{errors.farmName.message}</p>}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-1.5">
                <MapPin className="w-3.5 h-3.5" /> Studio Address
              </Label>
              <Input
                {...register("address")}
                id="address"
                placeholder="e.g. 45 Galle Road, Colombo 03, Sri Lanka"
                className="h-12 rounded-2xl bg-background/40 border-border/40 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all px-5"
              />
              {errors.address && <p className="text-[10px] font-bold text-destructive ml-1">{errors.address.message}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-1.5">
                <FileText className="w-3.5 h-3.5" /> Artisan Bio & Woodworking Methods
              </Label>
              <Textarea
                {...register("description")}
                id="description"
                placeholder="Tell us about your organic wood selections, seasoning, and minimalist carving methods in Sri Lanka..."
                rows={4}
                className="rounded-3xl bg-background/40 border-border/40 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all px-5 py-3 resize-none"
              />
              {errors.description && <p className="text-[10px] font-bold text-destructive ml-1">{errors.description.message}</p>}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
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
                  Creating...
                </>
              ) : (
                <>
                  Launch Studio
                  <UserPlus className="w-5 h-5 ml-2" />
                </>
              )
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

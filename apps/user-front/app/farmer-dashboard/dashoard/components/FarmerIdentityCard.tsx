"use client";

import React from "react";
import { Palette, MapPin, Info, Edit3, ShieldCheck, ExternalLink, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateFarmerDialog } from "./CreateFarmerDialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface FarmerIdentityCardProps {
  profile?: {
    data: {
      farmName: string;
      description: string;
      address: string;
      createdAt?: string;
    }
  };
  isLoading: boolean;
}

export const FarmerIdentityCard: React.FC<FarmerIdentityCardProps> = ({ profile, isLoading }) => {
  const data = profile?.data;

  if (isLoading) {
    return (
      <div className="bg-muted/10 border border-border/40 rounded-[2.5rem] p-8 space-y-6">
        <Skeleton className="h-40 w-full rounded-3xl bg-muted/20" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-48 bg-muted/20" />
          <Skeleton className="h-4 w-64 bg-muted/20" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-10 flex flex-col items-center text-center space-y-6 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="w-20 h-20 rounded-[2rem] bg-background border border-primary/20 flex items-center justify-center shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-500">
          <Palette className="w-10 h-10 text-primary" />
        </div>
        <div className="space-y-2 relative z-10">
          <h3 className="text-2xl font-black text-heading">Identity Required</h3>
          <p className="text-sm text-muted-foreground max-w-[240px] leading-relaxed">
            Launch your studio's digital presence to start connecting with elite customers.
          </p>
        </div>
        <CreateFarmerDialog>
          <Button className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-tighter shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10 px-8">
            Establish Studio Identity
          </Button>
        </CreateFarmerDialog>
      </div>
    );
  }

  const joinDate = data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Apr 2024";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-background border border-border/40 rounded-[2.8rem] overflow-hidden transition-all duration-700 hover:border-primary/20"
    >
      {/* Cover Aesthetic Section */}
      <div className="h-32 bg-gradient-to-br from-primary via-primary/80 to-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent animate-pulse" />
        <div className="absolute -bottom-1 left-0 w-full h-12 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Floating Meta */}
      <div className="px-8 -mt-10 relative z-20 flex justify-between items-end">
        <div className="w-20 h-20 rounded-[2.2rem] bg-background border-4 border-background flex items-center justify-center group-hover:rotate-6 transition-transform duration-500">
          <div className="w-full h-full rounded-[1.8rem] bg-primary/10 flex items-center justify-center border border-primary/5">
            <Palette className="w-9 h-9 text-primary" />
          </div>
        </div>
        <div className="flex items-center gap-2 bg-background/80 backdrop-blur-xl border border-border/40 px-4 py-2 rounded-2xl hover:bg-background transition-colors cursor-default">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Elite Verified</span>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="p-8 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
            <Calendar className="w-3 h-3" />
            Member Since {joinDate}
          </div>
          <h3 className="text-3xl font-bold tracking-tighter text-heading group-hover:text-primary transition-colors">
            {data.farmName}
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground group-hover:translate-x-1 transition-transform">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold">{data.address}</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-primary/20 to-transparent rounded-full" />
          <p className="text-sm text-muted-foreground leading-relaxed italic font-medium">
            "{data.description}"
          </p>
        </div>

        <hr className="border-border/40" />

        {/* Action Strip */}
        <div className="flex items-center gap-4">
          <CreateFarmerDialog>
            <button className="flex-1 h-12 rounded-xl bg-muted/30 border border-border/40 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest text-heading hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-all group/btn">
              <Edit3 className="w-4 h-4 group-hover/btn:-rotate-12 transition-transform" />
              Edit Profile
            </button>
          </CreateFarmerDialog>
          <button className="w-12 h-12 rounded-xl bg-background border border-border/40 flex items-center justify-center text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all hover:scale-105 active:scale-95">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

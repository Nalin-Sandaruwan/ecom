"use client";

import React from "react";
import { useMe } from "@/lib/hooks/useAuth";
import {
  User,
  Mail,
  Phone,
  Calendar,
  BadgeCheck,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoCard } from "./components/InfoCard";
import { ProfileBanner } from "./components/ProfileBanner";
import { EditProfileDialog } from "./components/EditProfileDialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { data: userData, isLoading } = useMe();
  const user = userData?.user;

  if (isLoading) {
    return (
      <div className="space-y-10 animate-pulse">
        <Skeleton className="h-64 rounded-[2.8rem] bg-muted/20" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-24 rounded-[2rem] bg-muted/10" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Personal Dossier</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your elite artisanal profile and identity markers.</p>
        </div>

        <EditProfileDialog user={user}>
          <Button className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3">
            <Edit3 className="w-5 h-5" />
            Edit Profile
          </Button>
        </EditProfileDialog>
      </div>

      {/* Cinematic Profile Header */}
      <ProfileBanner user={user} />

      {/* Detailed Info Grid */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 ml-4">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Certified Coordinates</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard icon={User} label="Full Identity Name" value={user?.name} />
          <InfoCard icon={Mail} label="Secure Marketplace Email" value={user?.email} />
          <InfoCard icon={Phone} label="Contact Coordinates" value={user?.phone} />
          <InfoCard icon={Calendar} label="Artisanal Tenure" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Member Since 2024"} />
        </div>
      </div>

      {/* Security and Trust Strip */}
      <div className="relative group bg-muted/20 border border-border/40 rounded-[2rem] p-8 overflow-hidden transition-all hover:bg-muted/30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full -mr-16 -mt-16" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="p-4 rounded-2xl bg-background border border-border/40 shadow-xl text-primary group-hover:rotate-6 transition-transform">
            <BadgeCheck className="w-8 h-8" />
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="text-lg font-bold text-heading">Identity Security Protocols</h3>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              Your personal artisanal data is protected under high-level encryption standards.
              Credential shifts (Email/Password) require secondary authentication levels for security.
            </p>
          </div>
          <Button variant="outline" className="h-12 rounded-xl px-6 border-border/40 font-bold uppercase tracking-widest text-[10px]">
            Review Security
          </Button>
        </div>
      </div>
    </div>
  );
}

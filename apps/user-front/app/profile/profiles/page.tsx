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
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileBanner } from "./components/ProfileBanner";
import { InfoCard } from "./components/InfoCard";
import { EditProfileDialog } from "./components/EditProfileDialog";

export default function ProfilePage() {
  const { data: userData, isLoading } = useMe();
  const user = userData?.user;

  if (isLoading) {
    return (
      <div className="space-y-10 animate-pulse">
        <div className="h-64 bg-muted/30 rounded-[1.8rem] sm:rounded-[3rem]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-[1.8rem] sm:rounded-[2.5rem] bg-muted/20" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight ">Personal Intelligence</h1>
          <p className="text-muted-foreground text-sm mt-1">Audit your personal coordinates and account credentials.</p>
        </div>

        <EditProfileDialog user={user}>
          <Button variant="outline" className="h-12 px-6 rounded-2xl gap-3 border-border/40 font-bold bg-background/50 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all shadow-sm group">
            <Edit3 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            Edit Profile
          </Button>
        </EditProfileDialog>
      </div>

      {/* Cinematic Banner */}
      <ProfileBanner user={user} />

      {/* Deep Information Matrix */}
      <div className="space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Data Matrix</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InfoCard icon={User} label="Full Legal Name" value={user?.name} />
          <InfoCard icon={Mail} label="Authenticated Email" value={user?.email} />
          <InfoCard icon={Phone} label="Contact Hotline" value={user?.phone} />
          <InfoCard icon={Calendar} label="Member Since" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "April 2024"} />
        </div>
      </div>

      {/* Security Protocol */}
      <div className="relative group overflow-hidden bg-muted/20 border border-border/20 rounded-[1.8rem] sm:rounded-[2.5rem] p-5 sm:p-8 transition-all hover:bg-muted/30 shadow-inner">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
        <div className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary shadow-sm hover:rotate-6 transition-transform flex-shrink-0">
            <BadgeCheck className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-black tracking-tight text-foreground">Artisan Security Protocol</h3>
            <p className="text-xs font-bold text-muted-foreground leading-relaxed max-w-2xl opacity-80">
              Your personal information is encrypted and isolated within our platform framework.
              We utilize military-grade authentication to ensure your digital identity remains sovereign.
              To adjust sensitive credentials like email or access tokens, please contact security support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

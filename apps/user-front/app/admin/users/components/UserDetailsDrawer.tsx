"use client";

import React from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Calendar, 
  UserX, 
  UserCheck, 
  Trash2,
  X,
  ShieldCheck,
  Activity,
  Loader2
} from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "../../../../components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUpdateAdminUser, useDeleteAdminUser } from "@/lib/hooks/useAdminUser";
import { cn } from "@/lib/utils";
import { UserDetail } from "@/lib/api/adminUser";

interface UserDetailsDrawerProps {
  user: UserDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserDetailsDrawer = ({ user, open, onOpenChange }: UserDetailsDrawerProps) => {
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateAdminUser();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteAdminUser();

  if (!user) return null;

  const handleToggleStatus = () => {
    updateStatus({ 
      id: user._id, 
      data: { isActive: !user.isActive } 
    });
  };

  const handleDeleteUser = () => {
    deleteUser(user._id, {
      onSuccess: () => onOpenChange(false)
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md bg-background/80 backdrop-blur-2xl border-l border-border/40 p-0 overflow-y-auto">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary via-secondary to-primary/50" />
        
        <SheetHeader className="p-8 pb-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-2xl font-bold tracking-tight">{user.name ?? "Unknown User"}</SheetTitle>
              <SheetDescription className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Account ID: {user._id?.toUpperCase() ?? "—"}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="p-8 pt-0 space-y-8">
          {/* Main Info Card */}
          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/20">
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold uppercase tracking-wide">Platform Role</span>
                </div>
                <Badge className={cn(
                  "rounded-md px-3 py-1 text-[10px] font-black tracking-widest uppercase border-none",
                  user.role === "admin" ? "bg-amber-500/10 text-amber-600" :
                  user.role === "farmer" ? "bg-primary/10 text-primary" :
                  "bg-blue-500/10 text-blue-600"
                )}>
                  {user.role ?? "—"}
                </Badge>
             </div>

             <div className="grid grid-cols-1 gap-3">
                <InfoItem icon={Mail} label="Email Address" value={user.email ?? undefined} />
                <InfoItem icon={Phone} label="Contact Number" value={user.phone ?? undefined} />
                <InfoItem icon={Calendar} label="Member Since" value={user.createdAt ? formatDate(user.createdAt) : undefined} />
             </div>
          </div>

          <hr className="border-border/20" />

          {/* Verification & Status */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Account Telemetry</h4>
            <div className="grid grid-cols-2 gap-3">
               <div className="p-4 rounded-3xl bg-background/40 border border-border/30 flex flex-col gap-2">
                  <ShieldCheck className={cn("w-5 h-5", user.isVerified ? "text-emerald-500" : "text-amber-500")} />
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Verification</span>
                  <span className="text-xs font-bold">{user.isVerified ? "IDENTITY_SECURED" : "PENDING_REVIEW"}</span>
               </div>
               <div className="p-4 rounded-3xl bg-background/40 border border-border/30 flex flex-col gap-2">
                  <Activity className={cn("w-5 h-5", user.isActive ? "text-emerald-500" : "text-destructive")} />
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Session Status</span>
                  <span className="text-xs font-bold">{user.isActive ? "ACTIVE_SESSION" : "SUSPENDED"}</span>
               </div>
            </div>
          </div>

          {/* Action Center */}
          <div className="space-y-4 pt-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Account Controls</h4>
            <div className="flex flex-col gap-3">
              <Button 
                onClick={handleToggleStatus}
                disabled={isUpdating}
                variant={user.isActive ? "destructive" : "default"}
                className={cn(
                  "h-14 rounded-2xl font-bold uppercase tracking-widest text-[11px] gap-2 shadow-md transition-all active:scale-95",
                  !user.isActive && "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/10"
                )}
              >
                {user.isActive ? (
                  <>
                    <UserX className="w-4 h-4" /> Suspend Account Access
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" /> Restore Account Access
                  </>
                )}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    disabled={isDeleting}
                    variant="outline" 
                    className="h-14 rounded-2xl border-destructive/20 text-destructive hover:bg-destructive/10 font-bold uppercase tracking-widest text-[11px] gap-2 transition-all active:scale-95"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Permanently Remove Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-[2rem] bg-background/80 backdrop-blur-2xl border-border/40">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold">Absolute Confirmation Required</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-muted-foreground">
                      This action will permanently purge <span className="font-bold text-foreground">{user.name}</span>'s account from the platform. All associated data will be lost. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-3">
                    <AlertDialogCancel className="rounded-xl border-border/40 font-bold uppercase tracking-widest text-[10px]">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteUser}
                      className="rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold uppercase tracking-widest text-[10px]"
                    >
                      Purge Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const InfoItem = ({ icon: Icon, label, value }: { icon: any, label: string, value?: string }) => (
  <div className="p-4 rounded-2xl bg-muted/10 border border-border/10 space-y-1">
    <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
      <Icon className="w-3 h-3" />
      {label}
    </div>
    <p className="text-sm font-semibold truncate">{value ?? "N/A"}</p>
  </div>
);

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  ShoppingBag,
  Settings,
  ShieldCheck,
  ChevronRight,
  UserCircle,
  ShieldAlert,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMe } from "@/lib/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/app/protected/protectedRoute";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ href, icon: Icon, label, isActive, onClick }: SidebarItemProps) => (
  <Link
    href={href}
    onClick={onClick}
    className={cn(
      "flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group",
      isActive
        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    )}
  >
    <div className="flex items-center gap-3">
      <div className={cn(
        "p-2 rounded-xl transition-colors",
        isActive ? "bg-white/20" : "bg-muted group-hover:bg-background"
      )}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="font-medium text-sm">{label}</span>
    </div>
    <ChevronRight className={cn(
      "w-4 h-4 transition-transform duration-300",
      isActive ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
    )} />
  </Link>
);

const SidebarContent = ({ user, isLoading, pathname, onNavItemClick }: {
  user: any;
  isLoading: boolean;
  pathname: string;
  onNavItemClick?: () => void;
}) => {
  const sidebarLinks = [
    { label: "My Profile", href: "/profile/profiles", icon: User },
    { label: "My Orders", href: "/profile/orders", icon: ShoppingBag },
    { label: "Account Settings", href: "/profile/settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* User Info Card */}
      <div className="bg-muted/30 border border-border/40 rounded-3xl p-6 backdrop-blur-sm">
        {isLoading ? (
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-2xl" />
            <div className="flex flex-col gap-2">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-32 h-3" />
            </div>
          </div>
        ) : user ? (
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                <UserCircle className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-background rounded-lg border border-border p-1">
                <ShieldCheck className="w-3 h-3 text-primary" />
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="font-bold text-foreground leading-tight">{user.name}</h2>
              <p className="text-xs text-muted-foreground truncate max-w-[140px]">{user.email}</p>
              <div className="mt-1 inline-flex px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider w-fit">
                {user.role}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Navigation Menu */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-4 mb-2">
          User Dashboard
        </p>
        {sidebarLinks.map((link) => (
          <SidebarItem
            key={link.href}
            {...link}
            isActive={pathname === link.href}
            onClick={onNavItemClick}
          />
        ))}
      </div>

      {/* Help Card */}
      <div className="mt-auto bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 rounded-3xl p-6">
        <p className="text-xs font-semibold text-primary mb-1">Need help?</p>
        <p className="text-[11px] text-muted-foreground mb-4">Check our support center for any issues.</p>
        <Link
          href="/contact"
          className="text-[11px] font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          Go to Support <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: userData, isLoading } = useMe();
  const user = userData?.user;
  const [open, setOpen] = React.useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border/40 px-6 py-4 flex items-center justify-between pt-24">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-bold text-lg tracking-tight">User Hub</h1>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl border border-border/40 h-10 w-10">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] p-6 pt-12">
              <SheetHeader className="mb-8 text-left">
                <SheetTitle className="text-2xl font-black tracking-tighter">Profile Navigation</SheetTitle>
              </SheetHeader>
              <SidebarContent
                user={user}
                isLoading={isLoading}
                pathname={pathname}
                onNavItemClick={() => setOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex-1 w-full max-w-[1600px] mx-auto relative">
          <div className="flex gap-8 p-6 lg:p-8 pt-6 lg:pt-24 min-h-full">
            {/* Desktop Fixed Sidebar */}
            <aside className="hidden lg:flex w-72 flex-col fixed h-[calc(100vh-8rem)] overflow-y-auto pr-2 pb-12 custom-scrollbar">
              <SidebarContent
                user={user}
                isLoading={isLoading}
                pathname={pathname}
              />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-80 w-full">
              <div className="bg-background/50 border border-border/40 rounded-[2.5rem] p-6 lg:p-10 min-h-[calc(100vh-12rem)] shadow-sm">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}


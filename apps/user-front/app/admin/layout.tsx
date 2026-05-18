"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Settings,
  Box,
  TrendingUp,
  Search,
  Bell,
  UserCircle,
  Home,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import ProtectedRouteAdmin from "@/app/protected/protectedRouteAdmin";
import { useMe } from "@/lib/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

const NavItem = ({ href, icon: Icon, label, isActive }: NavItemProps) => (
  <Link
    href={href}
    className={cn(
      "flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 group shadow-lg shadow-transparent",
      isActive
        ? "bg-primary text-primary-foreground shadow-primary/20 scale-[1.02]"
        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
    )}
  >
    <div className="flex items-center gap-3">
      <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
      <span className="font-bold text-sm tracking-tight">{label}</span>
    </div>
    {isActive && <ChevronRight className="w-4 h-4 text-primary-foreground animate-in slide-in-from-left-2" />}
  </Link>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: userData, isLoading } = useMe();
  const user = userData?.user;

  const adminLinks = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "User Management", href: "/admin/users", icon: Users },
    { label: "Product Inventory", href: "/admin/products", icon: Box },
    { label: "Order Tracking", href: "/admin/orders", icon: ShoppingBag },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <ProtectedRouteAdmin>
      <div className="min-h-screen bg-background text-foreground flex">

        {/* Admin Sidebar */}
        <aside className="w-80 border-r border-border/40 flex flex-col p-8 sticky top-0 h-screen overflow-y-auto bg-background/50 backdrop-blur-xl transition-colors">
          {/* Brand */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-[1.2rem] bg-primary flex items-center justify-center shadow-xl shadow-primary/20 transition-transform hover:scale-105">
              <ShoppingBag className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-heading leading-none">COMMAND</h1>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-1.5 opacity-80">System Hub</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.4em] ml-5 mb-4">Management</p>
            {adminLinks.map((link) => (
              <NavItem
                key={link.href}
                {...link}
                isActive={pathname === link.href}
              />
            ))}
          </div>

          {/* Quick Shortcuts */}
          <div className="mt-10 pt-10 border-t border-border/20 flex flex-col gap-2">
            <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.4em] ml-5 mb-4">Shortcuts</p>
            <Link href="/">
              <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all group">
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm tracking-tight text-foreground">Marketplace</span>
              </div>
            </Link>
          </div>

          {/* User Profile Card */}
          <div className="mt-auto pt-8 border-t border-border/20">
            {isLoading ? (
              <div className="flex items-center gap-3 px-5">
                <Skeleton className="w-12 h-12 rounded-2xl bg-muted/60" />
                <div className="space-y-2">
                  <Skeleton className="w-24 h-4 bg-muted/60" />
                  <Skeleton className="w-16 h-3 bg-muted/60" />
                </div>
              </div>
            ) : user ? (
              <div className="flex items-center justify-between px-5 group cursor-pointer transition-all hover:translate-x-1">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-all shadow-sm">
                    <UserCircle className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-foreground line-clamp-1">{user.name}</h4>
                    <p className="text-[10px] font-extrabold text-primary uppercase tracking-widest">{user.role}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </aside>

        {/* Main Interface Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">

          {/* Universal Admin Header */}
          <header className="h-24 border-b border-border/40 flex items-center justify-between px-12 bg-background/50 backdrop-blur-xl z-50">
            <div className="flex items-center gap-4 bg-muted/20 border border-border/40 rounded-2xl px-5 py-2.5 w-[28rem] group focus-within:border-primary/50 transition-all shadow-sm">
              <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Audit intelligence search..."
                className="bg-transparent border-none text-sm font-semibold focus:ring-0 placeholder:text-muted-foreground/60 w-full"
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <button className="relative w-12 h-12 rounded-2xl bg-muted/20 border border-border/40 flex items-center justify-center hover:bg-muted/30 hover:border-primary/20 transition-all group overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 group-hover:animate-pulse" />
                  <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors relative z-10" />
                  <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-primary rounded-full border-2 border-background animate-bounce" />
                </button>
              </div>
              <div className="h-10 w-[1px] bg-border/40 mx-2" />
              <button className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wide shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                New Report
                <TrendingUp className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Canvas Scroll Area */}
          <main className="flex-1 overflow-y-auto p-12 bg-background custom-scrollbar">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRouteAdmin>
  );
}


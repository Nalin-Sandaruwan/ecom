"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, ShoppingBag, ShoppingCart, Menu, X, User, LogOut, Settings, LayoutDashboard, ChevronDown } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";
import { useMe, useLogout } from "@/lib/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { data: userData, isLoading } = useMe();
  const { totalItemsCount } = useCart();
  const { mutate: logout } = useLogout();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserSubMenuOpen, setIsUserSubMenuOpen] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "About", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ];

  const user = userData?.user;

  // Helper to get initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto container px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Image
                src="/logo.png"
                alt="Chili Bazaar"
                width={300}
                height={80}
                className="h-12 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-6">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      isActive ? "text-primary font-semibold" : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <Link href="/cart" className="relative p-2 text-muted-foreground hover:text-foreground transition-all hover:scale-110">
              <ShoppingCart className="w-5 h-5" />
              {mounted && totalItemsCount > 0 && (
                <span className="absolute top-0 right-0 -translate-y-1 translate-x-1 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* Search Icon */}
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer hidden sm:block">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Theme Toggle Button */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded-full bg-muted"
                aria-label="Toggle Dark Mode"
              >
                <Sun className="h-4 w-4 dark:hidden" />
                <Moon className="h-4 w-4 hidden dark:block" />
              </button>
            )}

            {/* User Section (Desktop) */}
            <div className="hidden md:flex items-center gap-4">
              {isLoading ? (
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
              ) : user ? (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <button className="outline-none group">
                      <Avatar className="w-9 h-9 border-2 border-transparent group-hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:scale-105">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl p-2 bg-background/95 backdrop-blur-xl border-border/40 shadow-xl animate-in fade-in zoom-in duration-200">
                    <DropdownMenuLabel className="px-3 py-2">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border/40 my-1" />
                    {user.role !== 'admin' && (
                      <Link href={user.role === 'farmer' ? "/farmer-dashboard/dashoard" : "/profile/profiles"}>
                        <DropdownMenuItem className="rounded-xl px-3 py-2 cursor-pointer transition-colors focus:bg-primary/10 focus:text-primary group">
                          <User className="mr-2 h-4 w-4 text-muted-foreground group-focus:text-primary" />
                          <span>Profile</span>
                        </DropdownMenuItem>
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link href="/admin">
                        <DropdownMenuItem className="rounded-xl px-3 py-2 cursor-pointer transition-colors focus:bg-primary/10 focus:text-primary group">
                          <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground group-focus:text-primary" />
                          <span>Admin Dashboard</span>
                        </DropdownMenuItem>
                      </Link>
                    )}
                    <Link href={user.role === 'farmer' ? "/farmer-dashboard/settings" : "/profile/settings"}>
                      <DropdownMenuItem className="rounded-xl px-3 py-2 cursor-pointer transition-colors focus:bg-primary/10 focus:text-primary group">
                        <Settings className="mr-2 h-4 w-4 text-muted-foreground group-focus:text-primary" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator className="bg-border/40 my-1" />
                    <DropdownMenuItem
                      onClick={() => logout()}
                      className="rounded-xl px-3 py-2 cursor-pointer transition-colors focus:bg-destructive/10 focus:text-destructive group"
                    >
                      <LogOut className="mr-2 h-4 w-4 text-muted-foreground group-focus:text-destructive" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center text-sm font-semibold leading-6 bg-primary text-primary-foreground px-5 py-2 rounded-full hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-md"
                >
                  Login <span aria-hidden="true" className="ml-1.5">&rarr;</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus:outline-none"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl absolute w-full shadow-lg max-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="px-6 py-4 flex flex-col gap-2">
            {user && (
              <div className="mb-2">
                <button
                  onClick={() => setIsUserSubMenuOpen(!isUserSubMenuOpen)}
                  className="w-full flex items-center justify-between py-4 border-b border-border/20 group"
                >
                  <div className="flex items-center gap-3 text-left">
                    <Avatar className="w-10 h-10 border border-border/50">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold group-hover:text-primary transition-colors">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform duration-200", isUserSubMenuOpen && "rotate-180")} />
                </button>

                {isUserSubMenuOpen && (
                  <div className="mt-2 ml-12 flex flex-col gap-1 border-l-2 border-primary/20 pl-4 animate-in slide-in-from-top-2 duration-300">
                    {user.role !== 'admin' && (
                      <Link
                        href={user.role === 'farmer' ? "/farmer-dashboard/dashoard" : "/profile/profiles"}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 py-3 text-sm font-medium text-muted-foreground hover:text-primary transition-all"
                      >
                        <User className="w-4 h-4" /> Profile
                      </Link>
                    )}
                    <Link
                      href={user.role === 'farmer' ? "/farmer-dashboard/settings" : "/profile/settings"}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 py-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 py-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 py-3 text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-medium text-muted-foreground hover:text-primary transition-colors py-3 border-b border-border/20 last:border-0"
              >
                {item.label}
              </Link>
            ))}

            {!user && (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-4 text-center text-sm font-semibold bg-primary text-primary-foreground px-5 py-3.5 rounded-xl shadow-md w-full transition-all active:scale-95"
              >
                Login to Account
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

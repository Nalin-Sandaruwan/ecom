"use client";

import React from "react";
import { BadgeCheck, MapPin, Home, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SystemBannerProps {
  status: string;
  uptime: string;
}

export const SystemBanner: React.FC<SystemBannerProps> = ({ status, uptime }) => {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-background to-secondary/10 border border-border/40 p-8 sm:p-10 transition-all duration-500">
      {/* Background blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[30%] h-[50%] rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-secondary/10 blur-[80px] pointer-events-none" />
      
      <div className="relative flex flex-col sm:flex-row items-center justify-between gap-8">
        <div className="flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2.5rem] bg-background shadow-2xl shadow-primary/10 flex items-center justify-center border-4 border-background group hover:scale-105 transition-transform duration-500">
            <div className="relative">
               <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 animate-pulse" />
               <BadgeCheck className="w-12 h-12 sm:w-16 sm:h-16 text-primary relative z-10" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h2 className="text-2xl sm:text-4xl font-bold text-foreground tracking-tight">Command Center</h2>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  {status}
                </div>
              </div>
              <div className="text-muted-foreground text-sm font-medium flex items-center justify-center sm:justify-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary/40" />
                System Uptime: <span className="text-foreground font-bold">{uptime}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center sm:justify-start gap-4">
               <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted/30" />
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                    +12
                  </div>
               </div>
               <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Active Nodes</span>
            </div>
          </div>
        </div>

        <Link href="/">
           <Button className="h-14 px-8 rounded-2xl bg-foreground text-background font-bold uppercase tracking-tight text-xs group transition-all hover:scale-105">
              <Home className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
              Return Home
           </Button>
        </Link>
      </div>
    </div>
  );
};

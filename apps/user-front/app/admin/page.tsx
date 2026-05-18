"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  ShoppingBag,
  DollarSign,
  Activity,
  History,
} from "lucide-react";
import { useAdminStats } from "@/lib/hooks/useAdmin";
import { Skeleton } from "@/components/ui/skeleton";
import { SystemBanner } from "./components/SystemBanner";
import { AdminMetricCard } from "./components/AdminMetricCard";
import { AuditLogFeed } from "./components/AuditLogFeed";
import { QuickInsightsSidebar } from "./components/QuickInsightsSidebar";
import { Button } from "@/components/ui/button";

export default function AdminOverview() {
  const { data: stats, isLoading } = useAdminStats();

  const metrics = stats?.metrics;

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `LKR ${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `LKR ${(val / 1000).toFixed(1)}K`;
    return `LKR ${val.toFixed(2)}`;
  };

  const formatNumber = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    return val.toString();
  };

  return (
    <div className="space-y-10 pb-10">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-heading">System Intelligence</h1>
          <p className="text-muted-foreground text-sm font-medium">Coordinate global operations and audit system health.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl h-12 border-border/40 font-bold flex items-center gap-2 hover:bg-primary/5 transition-all">
            <History className="w-4 h-4" />
            Audit Logs
          </Button>
          <Button className="rounded-2xl h-12 bg-primary text-primary-foreground font-bold uppercase tracking-wide text-[11px] px-6 shadow-lg shadow-primary/20 hover:scale-105 transition-all">
            Security Patch
          </Button>
        </div>
      </div>

      {/* Hero Banner Section */}
      <SystemBanner status="Online - Optimal" uptime="14d 08h 22m" />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-[2rem] bg-muted/20" />
            ))}
          </>
        ) : (
          <>
            <AdminMetricCard 
              label="Total Revenue" 
              value={formatCurrency(metrics?.totalRevenue || 0)} 
              icon={DollarSign} 
              trend="+18.4%" 
              isPositive={true} 
            />
            <AdminMetricCard 
              label="Global Users" 
              value={formatNumber(metrics?.globalUsers || 0)} 
              icon={Users} 
              trend="+12.2%" 
              isPositive={true} 
            />
            <AdminMetricCard 
              label="System Load" 
              value={`${metrics?.systemLoad || 0}%`} 
              icon={Activity} 
              trend="-4.1%" 
              isPositive={false} 
            />
            <AdminMetricCard 
              label="New Orders" 
              value={formatNumber(metrics?.newOrders || 0)} 
              icon={ShoppingBag} 
              trend="+2.4%" 
              isPositive={true} 
            />
          </>
        )}
      </div>

      {/* Diagnostic & Audit Feed Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <AuditLogFeed />
        <QuickInsightsSidebar />
      </div>
    </div>
  );
}

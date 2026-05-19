"use client";

import React from "react";
import {
    Package,
    Users,
    DollarSign,
    ShoppingBag,
    Activity,
    Plus,
    UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "./components/StatCard";
import { RecentActivityItem } from "./components/RecentActivityItem";
import { FarmInsights } from "./components/FarmInsights";
import { CreateFarmerDialog } from "./components/CreateFarmerDialog";
import { FarmerIdentityCard } from "./components/FarmerIdentityCard";
import { useFarmerProfilesMe, useFarmerStats } from "@/lib/hooks/useFarmer";
import { Skeleton } from "@/components/ui/skeleton";
import CreateProductDialog from "./components/CreateProductDialog";

export default function FarmerDashboardPage() {
    const { data: profile, isLoading } = useFarmerProfilesMe();
    const { data: statsData, isLoading: isStatsLoading } = useFarmerStats();
    const stats = statsData?.data;

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    {isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-9 w-48 bg-muted/20" />
                            <Skeleton className="h-4 w-64 bg-muted/20" />
                        </div>
                    ) : (
                        <>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {profile?.farmName || "Overview"}
                            </h1>
                            <p className="text-muted-foreground text-sm mt-1">
                                {profile?.description || "Welcome back! Here's how your artisan studio is performing today."}
                            </p>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <CreateFarmerDialog>
                        <Button variant="outline" className="rounded-2xl h-12 px-6 border-primary/20 hover:bg-primary/5 text-primary font-bold flex items-center gap-2 group transition-all">
                            <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                            Create Artisan Profile
                        </Button>
                    </CreateFarmerDialog>
                    <CreateProductDialog>
                        <Button className="rounded-2xl h-12 px-6 shadow-lg shadow-primary/20 bg-primary font-bold flex items-center gap-2 group">
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            Add New Product
                        </Button>
                    </CreateProductDialog>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {isStatsLoading ? (
                    <>
                        <Skeleton className="h-32 rounded-[2rem] bg-muted/20" />
                        <Skeleton className="h-32 rounded-[2rem] bg-muted/20" />
                        <Skeleton className="h-32 rounded-[2rem] bg-muted/20" />
                        <Skeleton className="h-32 rounded-[2rem] bg-muted/20" />
                    </>
                ) : (
                    <>
                        <StatCard 
                            title="Total Revenue" 
                            value={`LKR ${(stats?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
                            icon={DollarSign} 
                            trend="+12.5%" 
                            color="primary" 
                        />
                        <StatCard 
                            title="Active Orders" 
                            value={stats?.activeOrders?.toString() || "0"} 
                            icon={ShoppingBag} 
                            trend="+8.2%" 
                            color="amber-500" 
                        />
                        <StatCard 
                            title="Total Products" 
                            value={stats?.totalProducts?.toString() || "0"} 
                            icon={Package} 
                            trend="+2.4%" 
                            color="green-500" 
                        />
                        <StatCard 
                            title="Customers" 
                            value={stats?.uniqueCustomers?.toString() || "0"} 
                            icon={Users} 
                            trend="+15.0%" 
                            color="blue-500" 
                        />
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-muted/20 border border-border/40 rounded-[2.5rem] p-8 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary" />
                            Recent Activity
                        </h2>
                        <Button variant="ghost" className="text-primary font-bold text-xs rounded-xl">View All</Button>
                    </div>

                    <div className="space-y-6">
                        <RecentActivityItem
                            id={1}
                            title="New order received from Sarah J."
                            details="1x Premium Mahogany Silhouette Sculpture"
                            amount="+LKR 24,500.00"
                            status="Paid"
                            time="4 mins ago"
                        />
                        <RecentActivityItem
                            id={2}
                            title="Inventory alert"
                            details="Minimalist Teak Wall Art blocks running low"
                            amount="Stock"
                            status="Alert"
                            time="15 mins ago"
                        />
                        <RecentActivityItem
                            id={3}
                            title="Payout processed"
                            details="Direct transfer to bank"
                            amount="+LKR 124,000.00"
                            status="Success"
                            time="2 hours ago"
                        />
                    </div>
                </div>

                {/* Right Column: Identity & Insights */}
                <div className="space-y-8">
                    <FarmerIdentityCard profile={profile} isLoading={isLoading} />

                    {/* Quick Insights */}
                    {/* <FarmInsights
                        trendProduct="Organic Strawberries"
                        recommendation="Consider increasing your harvest capacity for the next 48 hours."
                    /> */}
                </div>
            </div>
        </div>
    );
}

"use client";

import Navbar from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShowcaseSkeleton() {
  return (
    <div className="bg-background min-h-screen pt-[80px]">
      <Navbar />
      <div className="mx-auto max-w-7xl w-full px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 animate-pulse">
          {/* Visual Column Skeleton */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-8">
            <Skeleton className="aspect-square w-full rounded-[3rem] bg-muted/20" />
            <div className="grid grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl bg-muted/10" />
              ))}
            </div>
          </div>

          {/* Info Column Skeleton */}
          <div className="lg:col-span-6 xl:col-span-5 space-y-12">
            <div className="space-y-6">
              <Skeleton className="h-6 w-1/4 rounded-full bg-muted/20" />
              <Skeleton className="h-20 w-full rounded-2xl bg-muted/20" />
              <div className="flex gap-4">
                <Skeleton className="h-8 w-24 rounded-xl bg-muted/20" />
                <Skeleton className="h-8 w-40 rounded-xl bg-muted/10" />
              </div>
            </div>

            <Skeleton className="h-40 w-full rounded-[2.5rem] bg-muted/20" />

            <div className="space-y-4">
              <Skeleton className="h-4 w-full bg-muted/10" />
              <Skeleton className="h-4 w-full bg-muted/10" />
              <Skeleton className="h-4 w-2/3 bg-muted/10" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-10">
              <Skeleton className="h-16 flex-1 rounded-2xl bg-muted/30" />
              <Skeleton className="h-16 flex-1 rounded-2xl bg-muted/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

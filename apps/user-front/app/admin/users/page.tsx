"use client";

import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Shield,
  UserCheck,
  MoreVertical,
  Mail,
  Search,
  Filter,
  UserX,
  RefreshCcw,
  Loader2
} from "lucide-react";
import { AdminPageHeader } from "../components/AdminPageHeader";
import { AdminMetricCard } from "../components/AdminMetricCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAdminUsers } from "@/lib/hooks/useAdminUser";
import { UserDetailsDrawer } from "./components/UserDetailsDrawer";
import { Skeleton } from "@/components/ui/skeleton";
import { UserDetail } from "@/lib/api/adminUser";

export default function UserManagementPage() {
  const { data: usersResponse, isLoading, isError, refetch } = useAdminUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const users = usersResponse?.data?.users || [];

  const filteredUsers = React.useMemo(() => {
    const term = searchTerm.toLowerCase();
    return users.filter((user: UserDetail) =>
      (user.name?.toLowerCase() ?? "").includes(term) ||
      (user.email?.toLowerCase() ?? "").includes(term) ||
      (user._id?.toLowerCase() ?? "").includes(term)
    );
  }, [users, searchTerm]);

  const stats = React.useMemo(() => ({
    total: users.length,
    farmers: users.filter(u => u.role === "farmer").length,
    admins: users.filter(u => u.role === "admin").length,
    suspended: users.filter(u => !u.isActive).length
  }), [users]);

  const handleInspect = (user: UserDetail) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin": return "bg-amber-500/10 text-amber-600";
      case "farmer": return "bg-primary/10 text-primary";
      default: return "bg-blue-500/10 text-blue-600";
    }
  };


  return (
    <div className="space-y-10 pb-10">
      <AdminPageHeader
        title="User Management"
        description="Monitor platform roles, account status, and registration velocity."
        primaryAction={{
          label: "Audit Logs",
          icon: Users,
          onClick: () => window.location.href = "/admin"
        }}
      />

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-[2rem] bg-muted/20" />)
        ) : (
          <>
            <AdminMetricCard label="Total Members" value={stats.total.toString()} icon={Users} trend="Global" isPositive={true} />
            <AdminMetricCard label="Artisanal Farmers" value={stats.farmers.toString()} icon={UserCheck} trend="Verified" isPositive={true} />
            <AdminMetricCard label="System Admins" value={stats.admins.toString()} icon={Shield} trend="Control" isPositive={true} />
            <AdminMetricCard label="Restricted" value={stats.suspended.toString()} icon={UserX} trend="Suspended" isPositive={false} />
          </>
        )}
      </div>

      {/* Directory Tools */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/20 border border-border/20 rounded-[2rem] p-4 px-6">
        <div className="flex items-center gap-3 w-full sm:w-96 bg-background/50 border border-border/40 rounded-xl px-4 py-2 group focus-within:border-primary/50 transition-all">
          <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email or ID..."
            className="bg-transparent border-none text-sm font-semibold focus:ring-0 placeholder:text-muted-foreground/60 w-full"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="h-10 rounded-xl border-border/40 font-bold flex items-center gap-2 hover:bg-primary/5 transition-all text-xs"
          >
            <RefreshCcw className="w-4 h-4" /> Sync
          </Button>
          <div className="h-6 w-[1px] bg-border/40 hidden sm:block" />
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">
            Showing {filteredUsers.length} of {stats.total} Members
          </p>
        </div>
      </div>

      {/* User Directory Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {isLoading ? (
          [1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-28 rounded-[2.5rem] bg-muted/10" />)
        ) : isError ? (
          <div className="col-span-full py-20 text-center space-y-4 rounded-[3rem] border border-dashed border-border/40">
            <Loader2 className="w-10 h-10 animate-spin text-muted-foreground mx-auto" />
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Gateway timeout detected</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="col-span-full py-20 text-center space-y-4 rounded-[3rem] border border-dashed border-border/40">
            <UserX className="w-10 h-10 text-muted-foreground mx-auto opacity-20" />
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">No matching artisanal profiles found</p>
          </div>
        ) : (
          filteredUsers.map((user: UserDetail) => (
            <div
              key={user._id}
              onClick={() => handleInspect(user)}
              className="group cursor-pointer flex flex-col sm:flex-row items-center justify-between p-6 rounded-[2.5rem] bg-muted/20 border border-border/20 hover:bg-muted/30 hover:border-primary/20 transition-all gap-6"
            >
              <div className="flex items-center gap-5 w-full">
                <div className="w-16 h-16 rounded-[1.5rem] bg-background border border-border/10 flex items-center justify-center text-xl font-bold text-primary shadow-sm group-hover:scale-105 transition-all">
                  {user.name?.charAt(0) ?? "?"}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-foreground">{user.name ?? "Unknown User"}</h3>
                    <Badge className={cn(
                      "rounded-md px-2 py-0.5 text-[9px] font-black tracking-widest uppercase border-none",
                      getRoleBadgeColor(user.role ?? "")
                    )}>
                      {user.role ?? "—"}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                      <Mail className="w-3 h-3" /> {user.email ?? "—"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <div className={cn(
                  "px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border whitespace-nowrap",
                  user.isActive ? "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"
                )}>
                  {user.isActive ? "Account Active" : "Account Restricted"}
                </div>
                <Button variant="ghost" className="w-10 h-10 rounded-xl p-0 hover:bg-primary/10 hover:text-primary transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <UserDetailsDrawer
        user={selectedUser}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
    </div>
  );
}

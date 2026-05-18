"use client";

import React from "react";
import { Terminal, Activity, ShieldAlert, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuditLogs } from "@/lib/hooks/useAudit";
import { Skeleton } from "@/components/ui/skeleton";

export const AuditLogFeed = () => {
  const { data: auditResponse, isLoading } = useAuditLogs(1, 10);
  const logs = auditResponse?.data?.logs || [];

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="xl:col-span-2 space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-3">
          <Terminal className="w-3 h-3 text-primary" /> Live System Audit
        </h2>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-muted animate-pulse' : 'bg-primary animate-pulse'}`} />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            {isLoading ? 'Syncing...' : 'Real-time Stream'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 rounded-[1.8rem] bg-muted/10 border border-border/10" />
            ))}
          </>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 rounded-[2rem] bg-muted/5 border border-dashed border-border/20 text-muted-foreground">
            <Activity className="w-8 h-8 opacity-20 mb-3" />
            <p className="text-xs font-bold uppercase tracking-widest">No Recent Activity Logs</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log._id} className="group flex items-center justify-between p-5 rounded-3xl bg-muted/20 border border-border/20 hover:bg-muted/30 hover:border-primary/20 transition-all font-medium">
              <div className="flex items-center gap-5">
                <div className="w-10 h-10 rounded-2xl bg-background flex items-center justify-center border border-border/10">
                  {log.status === "failure" ? (
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Activity className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground">
                      {log.action}
                    </p>
                    {log.userId && (
                      <span className="flex items-center gap-1 text-[9px] font-bold bg-primary/5 text-primary/60 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        <User className="w-2.5 h-2.5" />
                        {log.userId.name}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide opacity-60">
                    ID: {log._id.slice(-8).toUpperCase()} • {formatTime(log.timestamp)} • IP: {log.ip}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-10 h-10 rounded-xl p-0 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

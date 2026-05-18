"use client";

import React from "react";
import { 
  Settings, 
  ShieldCheck, 
  Globe, 
  UserCog, 
  Bell, 
  Database, 
  Lock, 
  ChevronRight,
  Save,
  Undo2
} from "lucide-react";
import { AdminPageHeader } from "../components/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SettingsGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="space-y-6">
    <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground ml-4">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
);

const SettingItem = ({ icon: Icon, label, description, status }: { icon: any, label: string, description: string, status?: string }) => (
  <div className="group flex items-center justify-between p-6 rounded-[2rem] bg-muted/20 border border-border/20 hover:bg-muted/30 hover:border-primary/20 transition-all cursor-pointer">
    <div className="flex items-center gap-5">
      <div className="w-12 h-12 rounded-[1.2rem] bg-background border border-border/10 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <div className="space-y-0.5">
        <h3 className="text-sm font-bold text-foreground">{label}</h3>
        <p className="text-[11px] text-muted-foreground font-medium opacity-70">{description}</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      {status && <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{status}</span>}
      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-40 group-hover:translate-x-1 group-hover:text-primary transition-all" />
    </div>
  </div>
);

export default function AdminSettingsPage() {
  return (
    <div className="space-y-12 pb-10">
      <AdminPageHeader 
        title="Admin Controls" 
        description="Configure platform parameters, security protocols, and system-wide operation rules." 
        primaryAction={{
          label: "Save Changes",
          icon: Save,
          onClick: () => console.log("Save Settings")
        }}
        secondaryAction={{
          label: "Discard",
          icon: Undo2,
          onClick: () => console.log("Undo")
        }}
      />

      <div className="grid grid-cols-1 gap-12">
        {/* Core Settings */}
        <SettingsGroup title="General Operations">
          <SettingItem 
            icon={Globe} 
            label="Regional Availability" 
            description="Manage global market access and shipping zones." 
            status="Global Active"
          />
          <SettingItem 
            icon={Settings} 
            label="Platform Commission" 
            description="Adjust the flat service fee for farmer transactions." 
            status="5.0%"
          />
          <SettingItem 
            icon={Bell} 
            label="System Notifications" 
            description="Configure global broadcast rules for incidents." 
            status="Configured"
          />
          <SettingItem 
            icon={Database} 
            label="Data Governance" 
            description="Control retention policies and audit log exports." 
          />
        </SettingsGroup>

        {/* Security Section */}
        <SettingsGroup title="Privacy & Security">
          <SettingItem 
            icon={ShieldCheck} 
            label="Access Control" 
            description="Define administrative roles and permission levels." 
            status="Hierarchical"
          />
          <SettingItem 
            icon={Lock} 
            label="Enforced 2FA" 
            description="Universal multi-factor requirements for admin nodes." 
            status="Enabled"
          />
          <SettingItem 
            icon={UserCog} 
            label="Farmer Verification" 
            description="Update the KYC automation and manual review rules." 
          />
          <SettingItem 
            icon={Lock} 
            label="API Registry" 
            description="Manage external tokens and integration endpoints." 
          />
        </SettingsGroup>

        {/* High-Impact Actions */}
        <div className="pt-8 border-t border-border/20">
          <div className="bg-red-500/5 border border-red-500/20 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-lg font-bold text-foreground italic">Platform Interruption</h3>
              <p className="text-sm text-muted-foreground font-medium max-w-xl">
                Activate maintenance mode to pause all platform trading and logistics. Only authorized administrative nodes will maintain access during this state.
              </p>
            </div>
            <Button variant="outline" className="h-14 px-10 rounded-2xl border-red-500/30 text-red-500 font-bold uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-500/10">
              Enable Maintenance
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

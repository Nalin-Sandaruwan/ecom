"use client";

import React from "react";
import {
  Bell,
  Lock,
  UserX,
  ShieldCheck,
  Languages,
  Smartphone,
  ChevronRight,
  Eye,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/lib/hooks/useAuth";

const SettingRow = ({ icon: Icon, title, description, badge, destructive }: any) => (
  <div className="flex items-center justify-between p-2 rounded-[2rem] hover:bg-muted/30 transition-all duration-300 group cursor-pointer">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${destructive
          ? "bg-destructive/5 border-destructive/10 text-destructive"
          : "bg-background border-border/10 text-muted-foreground group-hover:text-primary group-hover:border-primary/20"
        }`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h3 className={`text-sm font-bold ${destructive ? "text-destructive" : "text-foreground"}`}>{title}</h3>
          {badge && (
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-tighter">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
    <ChevronRight className={`w-4 h-4 transition-transform ${destructive ? "text-destructive/40" : "text-muted-foreground group-hover:translate-x-1 group-hover:text-primary"}`} />
  </div>
);

export default function SettingsPage() {
  const { mutate: logout } = useLogout();

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your account preferences and security settings.</p>
        </div>
      </div>

      {/* Security Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Lock className="w-4 h-4 text-primary" />
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Security & Access</h2>
        </div>
        <div className="bg-muted/20 border border-border/30 rounded-[2.5rem] p-3 space-y-2">
          <SettingRow
            icon={ShieldCheck}
            title="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
            badge="Recommended"
          />
          <SettingRow
            icon={Eye}
            title="Change Password"
            description="Update your password regularly to keep your account safe"
          />
          <SettingRow
            icon={Smartphone}
            title="Active Sessions"
            description="Manage your logged-in devices and apps"
          />
        </div>
      </section>

      {/* Notifications Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Bell className="w-4 h-4 text-primary" />
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Preferences</h2>
        </div>
        <div className="bg-muted/20 border border-border/30 rounded-[2.5rem] p-3 space-y-2">
          <SettingRow
            icon={Bell}
            title="Notification Settings"
            description="Choose what information you want to receive"
          />
          <SettingRow
            icon={Languages}
            title="Language"
            description="Set your preferred language for the interface"
            badge="English"
          />
        </div>
      </section>

      {/* Danger Zone */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2 text-destructive">
          <UserX className="w-4 h-4" />
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-70">Danger Zone</h2>
        </div>
        <div className="bg-destructive/5 border border-destructive/10 rounded-[2.5rem] p-3 space-y-2">
          <div onClick={() => logout()}>
            <SettingRow
              icon={LogOut}
              title="Sign Out"
              description="Securely logout from your current session"
              destructive
            />
          </div>
          <SettingRow
            icon={UserX}
            title="Delete Account"
            description="Permanently remove your account and all data"
            destructive
          />
        </div>
      </section>

      {/* Privacy Note */}
      <p className="text-center text-[11px] text-muted-foreground pt-4 leading-relaxed">
        By managing your settings, you agree to our <span className="text-primary font-bold cursor-pointer underline underline-offset-4">Privacy Policy</span> and <span className="text-primary font-bold cursor-pointer underline underline-offset-4">Terms of Service</span>.
      </p>
    </div>
  );
}

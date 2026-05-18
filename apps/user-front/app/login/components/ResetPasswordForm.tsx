"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, KeyRound, Loader2 } from "lucide-react";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  onSubmit: (data: ResetPasswordFormValues) => void;
  isResettingPass: boolean;
}

export function ResetPasswordForm({ onSubmit, isResettingPass }: ResetPasswordFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground ml-1 flex items-center gap-2">
          <KeyRound className="w-3.5 h-3.5" /> New Password
        </label>
        <input
          {...register("password")}
          type="password"
          placeholder="••••••••"
          className="w-full flex h-12 rounded-xl border border-border/50 bg-background/50 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all disabled:opacity-50"
          disabled={isResettingPass}
        />
        {errors.password && <p className="text-[12px] text-destructive ml-1">{errors.password.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground ml-1 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5" /> Confirm New Password
        </label>
        <input
          {...register("confirmPassword")}
          type="password"
          placeholder="••••••••"
          className="w-full flex h-12 rounded-xl border border-border/50 bg-background/50 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all disabled:opacity-50"
          disabled={isResettingPass}
        />
        {errors.confirmPassword && <p className="text-[12px] text-destructive ml-1">{errors.confirmPassword.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isResettingPass}
        className="mt-6 w-full group flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground h-12 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
      >
        {isResettingPass ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reset Password"}
      </button>
    </form>
  );
}

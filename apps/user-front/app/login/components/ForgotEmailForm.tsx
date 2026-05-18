"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Loader2, ChevronLeft } from "lucide-react";

const forgotEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type ForgotEmailFormValues = z.infer<typeof forgotEmailSchema>;

interface ForgotEmailFormProps {
  onSubmit: (data: ForgotEmailFormValues) => void;
  isSendingOTP: boolean;
  onBack: () => void;
}

export function ForgotEmailForm({ onSubmit, isSendingOTP, onBack }: ForgotEmailFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotEmailFormValues>({
    resolver: zodResolver(forgotEmailSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground ml-1 flex items-center gap-2">
          <Mail className="w-3.5 h-3.5" /> Email Address
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="name@example.com"
          className="w-full flex h-12 rounded-xl border border-border/50 bg-background/50 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all disabled:opacity-50"
          disabled={isSendingOTP}
        />
        {errors.email && <p className="text-[12px] text-destructive ml-1">{errors.email.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSendingOTP}
        className="mt-6 w-full group flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground h-12 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
      >
        {isSendingOTP ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Code"}
      </button>
      
      <button 
        type="button" 
        onClick={onBack}
        className="w-full text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 mt-2"
      >
        <ChevronLeft className="w-3 h-3" /> Back to Login
      </button>
    </form>
  );
}

"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ShieldCheck, Loader2 } from "lucide-react";

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export type OTPFormValues = z.infer<typeof otpSchema>;

interface OTPVerificationFormProps {
  onSubmit: (data: OTPFormValues) => void;
  isVerifyingOTP: boolean;
  onResend: () => void;
}

export function OTPVerificationForm({ onSubmit, isVerifyingOTP, onResend }: OTPVerificationFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground ml-1 flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5" /> Verification Code
        </label>
        <input
          {...register("otp")}
          placeholder="000000"
          maxLength={6}
          className="w-full flex h-14 text-center text-2xl tracking-[0.5em] font-bold rounded-xl border border-border/50 bg-background/50 px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all disabled:opacity-50"
          disabled={isVerifyingOTP}
        />
        {errors.otp && <p className="text-[12px] text-destructive text-center">{errors.otp.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isVerifyingOTP}
        className="mt-6 w-full group flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground h-12 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
      >
        {isVerifyingOTP ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify OTP"}
      </button>
      
      <button 
        type="button" 
        onClick={onResend}
        className="w-full text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 mt-2"
      >
        Resend Code
      </button>
    </form>
  );
}

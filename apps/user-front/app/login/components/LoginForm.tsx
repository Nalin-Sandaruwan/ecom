"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onLogin: (data: LoginFormValues) => void;
  isLoggingIn: boolean;
  loginError: any;
  onForgotPassword: () => void;
}

export function LoginForm({ onLogin, isLoggingIn, loginError, onForgotPassword }: LoginFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  return (
    <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground ml-1 flex items-center gap-2">
          <Mail className="w-3.5 h-3.5" /> Email Address
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="name@example.com"
          className="w-full flex h-12 rounded-xl border border-border/50 bg-background/50 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all disabled:opacity-50"
          disabled={isLoggingIn}
        />
        {errors.email && <p className="text-[12px] text-destructive ml-1">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" /> Password
          </label>
          <button 
            type="button"
            onClick={onForgotPassword}
            className="text-xs text-primary hover:text-primary/80 transition-colors bg-transparent border-none p-0 cursor-pointer"
          >
            Forgot password?
          </button>
        </div>
        <input
          {...register("password")}
          type="password"
          placeholder="••••••••"
          className="w-full flex h-12 rounded-xl border border-border/50 bg-background/50 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all disabled:opacity-50"
          disabled={isLoggingIn}
        />
        {errors.password && <p className="text-[12px] text-destructive ml-1">{errors.password.message}</p>}
      </div>

      {loginError && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 flex items-center gap-2 mt-2">
          <p className="text-xs text-destructive text-center w-full font-medium">
            {(loginError as any)?.response?.data?.message || "Invalid credentials."}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoggingIn}
        className="mt-6 w-full group flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground h-12 rounded-xl font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
      >
        {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
        {!isLoggingIn && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
      </button>
    </form>
  );
}

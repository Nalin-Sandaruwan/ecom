"use client";

import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ShoppingBag, ArrowRight, Loader2, User, Mail, Lock, Phone } from "lucide-react";
import { useSignup } from "@/lib/hooks/useAuth";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  role: z.enum(["user", "farmer"], {
    message: "Please select a role",
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "user",
    }
  });

  const { mutate: signup, isPending, error: apiError } = useSignup();

  const onSubmit = (data: SignupFormValues) => {
    signup({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: data.role,
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background py-16">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-xl p-6 sm:p-8 relative z-10">
        {/* Glass Card */}
        <div className="bg-background/60 backdrop-blur-xl border border-border/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Top border highlight */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-primary to-secondary/50" />

          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-primary/80 shadow-lg shadow-primary/20 mb-6 hover:scale-105 transition-transform">
              <ShoppingBag className="w-6 h-6 text-primary-foreground" />
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-heading mb-2">
              Create Account
            </h1>
            <p className="text-sm text-muted-foreground text-center">
              Join WoodenGallery and define your journey
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5 focus-within:translate-y-[-2px] transition-transform">
                <label htmlFor="name" className="text-sm font-medium text-foreground ml-1 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-primary" /> Full Name
                </label>
                <input
                  {...register("name")}
                  id="name"
                  placeholder="John Doe"
                  className="w-full h-11 rounded-xl border border-border/50 bg-background/50 px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
                {errors.name && <p className="text-[12px] text-destructive ml-1">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5 focus-within:translate-y-[-2px] transition-transform">
                <label htmlFor="email" className="text-sm font-medium text-foreground ml-1 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-primary" /> Email
                </label>
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="w-full h-11 rounded-xl border border-border/50 bg-background/50 px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
                {errors.email && <p className="text-[12px] text-destructive ml-1">{errors.email.message}</p>}
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5 focus-within:translate-y-[-2px] transition-transform">
              <label htmlFor="phone" className="text-sm font-medium text-foreground ml-1 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-primary" /> Phone Number
              </label>
              <input
                {...register("phone")}
                id="phone"
                type="tel"
                placeholder="071-234-5678"
                className="w-full h-11 rounded-xl border border-border/50 bg-background/50 px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              />
              {errors.phone && <p className="text-[12px] text-destructive ml-1">{errors.phone.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div className="space-y-1.5 focus-within:translate-y-[-2px] transition-transform">
                <label htmlFor="password" className="text-sm font-medium text-foreground ml-1 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-primary" /> Password
                </label>
                <input
                  {...register("password")}
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full h-11 rounded-xl border border-border/50 bg-background/50 px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
                {errors.password && <p className="text-[12px] text-destructive ml-1">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5 focus-within:translate-y-[-2px] transition-transform">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground ml-1 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-primary" /> Confirm
                </label>
                <input
                  {...register("confirmPassword")}
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="w-full h-11 rounded-xl border border-border/50 bg-background/50 px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
                {errors.confirmPassword && <p className="text-[12px] text-destructive ml-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {apiError && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 flex items-center gap-2">
                <p className="text-xs text-destructive text-center w-full font-medium">
                  {(apiError as any)?.response?.data?.message || "Internal server error. Please try again."}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full group flex items-center justify-center gap-2 bg-primary text-primary-foreground h-14 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed uppercase tracking-tighter"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  creating legacy...
                </>
              ) : (
                <>
                  Join the platform
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already a member?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline underline-offset-4 transition-all">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

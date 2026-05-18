"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

type AuthStep = "LOGIN" | "FORGOT_EMAIL" | "FORGOT_OTP" | "FORGOT_RESET";

interface AuthHeaderProps {
  step: AuthStep;
  resetEmail?: string;
}

export function AuthHeader({ step, resetEmail }: AuthHeaderProps) {
  const getTitle = () => {
    switch (step) {
      case "LOGIN": return "Welcome Back";
      case "FORGOT_EMAIL": return "Forgot Password";
      case "FORGOT_OTP": return "Verify OTP";
      case "FORGOT_RESET": return "Reset Password";
    }
  };

  const getDescription = () => {
    switch (step) {
      case "LOGIN": return "Enter your credentials to access your account";
      case "FORGOT_EMAIL": return "Enter your email to receive a reset code";
      case "FORGOT_OTP": return `We sent a code to your email ${resetEmail}`;
      case "FORGOT_RESET": return "Choose a strong new password for your account";
    }
  };

  return (
    <div className="flex flex-col items-center mb-8">
      <Link href="/" className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-primary/80 shadow-lg shadow-primary/20 mb-6 hover:scale-105 transition-transform">
        <ShoppingBag className="w-6 h-6 text-primary-foreground" />
      </Link>
      <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground mb-2">
        {getTitle()}
      </h1>
      <p className="text-sm text-muted-foreground text-center">
        {getDescription()}
      </p>
    </div>
  );
}

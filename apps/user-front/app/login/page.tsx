"use client";

import Link from "next/link";
import React from "react";
import { AuthHeader } from "./components/AuthHeader";
import { LoginForm, LoginFormValues } from "./components/LoginForm";
import { ForgotEmailForm, ForgotEmailFormValues } from "./components/ForgotEmailForm";
import { OTPVerificationForm, OTPFormValues } from "./components/OTPVerificationForm";
import { ResetPasswordForm, ResetPasswordFormValues } from "./components/ResetPasswordForm";
import { useLogin, useForgotPassword, useVerifyOTP, useResetPassword } from "@/lib/hooks/useAuth";

type AuthStep = "LOGIN" | "FORGOT_EMAIL" | "FORGOT_OTP" | "FORGOT_RESET";

export default function LoginPage() {
  const [step, setStep] = React.useState<AuthStep>("LOGIN");
  const [resetEmail, setResetEmail] = React.useState("");
  const [resetOTP, setResetOTP] = React.useState("");

  const { mutate: login, isPending: isLoggingIn, error: loginError } = useLogin();
  const { mutate: sendOTP, isPending: isSendingOTP } = useForgotPassword();
  const { mutate: verifyOTP, isPending: isVerifyingOTP } = useVerifyOTP();
  const { mutate: resetPass, isPending: isResettingPass } = useResetPassword();

  const onLoginSubmit = (data: LoginFormValues) => {
    login(data);
  };

  const onForgotEmailSubmit = (data: ForgotEmailFormValues) => {
    sendOTP(data.email, {
      onSuccess: () => {
        setResetEmail(data.email);
        setStep("FORGOT_OTP");
      }
    });
  };

  const onOTPSubmit = (data: OTPFormValues) => {
    verifyOTP({ email: resetEmail, otp: data.otp }, {
      onSuccess: () => {
        setResetOTP(data.otp);
        setStep("FORGOT_RESET");
      }
    });
  };

  const onResetSubmit = (data: ResetPasswordFormValues) => {
    resetPass({ email: resetEmail, otp: resetOTP, password: data.password }, {
      onSuccess: () => {
        setStep("LOGIN");
      }
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md p-6 sm:p-8 relative z-10">
        <div className="bg-background/60 backdrop-blur-xl border border-border/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary/50" />

          {/* Logo & Header */}
          <AuthHeader step={step} resetEmail={resetEmail} />

          {/* Step Content */}
          {step === "LOGIN" && (
            <LoginForm
              onLogin={onLoginSubmit}
              isLoggingIn={isLoggingIn}
              loginError={loginError}
              onForgotPassword={() => setStep("FORGOT_EMAIL")}
            />
          )}

          {step === "FORGOT_EMAIL" && (
            <ForgotEmailForm
              onSubmit={onForgotEmailSubmit}
              isSendingOTP={isSendingOTP}
              onBack={() => setStep("LOGIN")}
            />
          )}

          {step === "FORGOT_OTP" && (
            <OTPVerificationForm
              onSubmit={onOTPSubmit}
              isVerifyingOTP={isVerifyingOTP}
              onResend={() => setStep("FORGOT_EMAIL")}
            />
          )}

          {step === "FORGOT_RESET" && (
            <ResetPasswordForm
              onSubmit={onResetSubmit}
              isResettingPass={isResettingPass}
            />
          )}

          {/* Footer Link (Only on login) */}
          {step === "LOGIN" && (
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

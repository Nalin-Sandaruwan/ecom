import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { signup, SignupPayload, login, LoginPayload, getMe, logout, updateMe, forgotPassword, verifyOTP, resetPassword } from "../api/auth";
import { toast } from "sonner";

export const useSignup = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignupPayload) => signup(data),
    onSuccess: (data) => {
      toast.success("Account created successfully!");
      router.push("/login"); // Redirect to login on success
    },
    onError: (error) => {
      const message =
        (error as any)?.response?.data?.message ||
        "Signup failed. Please try again.";
      toast.error(message);
    },
  });
};

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginPayload) => login(data),
    onSuccess: (data) => {
      toast.success("Login successful!");
      queryClient.invalidateQueries({ queryKey: ["me"] });
      router.push("/shop"); // Redirect to shop on success
    },
    onError: (error) => {
      const message =
        (error as any)?.response?.data?.message ||
        "Login failed. Please check your credentials.";
      toast.error(message);
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false, // Don't retry auth checks too many times
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["me"], null); // Instantly clear user cache
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Logged out successfully");
      router.push("/login");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    },
  });
};

export const useUpdateMe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name?: string; phone?: string }) => updateMe(data),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error) => {
      const message =
        (error as any)?.response?.data?.message ||
        "Profile update failed. Please try again.";
      toast.error(message);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
    onSuccess: () => {
      toast.success("OTP has been sent to your email!");
    },
    onError: (error) => {
      const message = (error as any)?.response?.data?.message || "Failed to send OTP.";
      toast.error(message);
    },
  });
};

export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: (data: { email: string; otp: string }) => verifyOTP(data),
    onSuccess: () => {
      toast.success("OTP verified successfully!");
    },
    onError: (error) => {
      const message = (error as any)?.response?.data?.message || "Invalid or expired OTP.";
      toast.error(message);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: { email: string; otp: string; password?: string }) => resetPassword(data),
    onSuccess: () => {
      toast.success("Password reset successful! Please log in.");
    },
    onError: (error) => {
      const message = (error as any)?.response?.data?.message || "Failed to reset password.";
      toast.error(message);
    },
  });
};

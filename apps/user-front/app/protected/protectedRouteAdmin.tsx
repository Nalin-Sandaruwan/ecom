"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useMe } from "@/lib/hooks/useAuth";
import { ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProtectedRouteAdmin({ children }: { children: React.ReactNode }) {
  const { data: userData, isLoading, isError } = useMe();
  const user = userData?.user;
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      router.replace("/login");
    }
  }, [isLoading, isError, user, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#09090b]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="h-20 w-20 rounded-[2rem] bg-indigo-500/10 flex items-center justify-center animate-pulse border border-indigo-500/20">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
          </div>
          <p className="text-indigo-500/50 font-black tracking-[0.3em] text-[10px] uppercase">
            Initializing Command Center...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !user) return null;

  if (user.role !== "admin") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#09090b] p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6 max-w-lg px-12 py-16 bg-[#121216] border border-white/5 rounded-[3rem] shadow-2xl relative"
        >
          <div className="h-24 w-24 rounded-[2.5rem] bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-2 border border-indigo-500/20">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <div className="space-y-3">
            <h2 className="text-4xl font-black text-white tracking-tighter">Restricted Access</h2>
            <p className="text-zinc-500 text-sm leading-relaxed mx-auto max-w-xs">
              This terminal is reserved for system administrators. Unauthorized access attempts are logged.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full pt-6">
            <Button
              onClick={() => router.replace("/")}
              className="flex-1 rounded-2xl h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg shadow-indigo-500/20 transition-all"
            >
              Return to Surface
            </Button>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex-1 rounded-2xl h-14 border-white/10 hover:bg-white/5 font-black transition-all"
            >
              Go Back
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}

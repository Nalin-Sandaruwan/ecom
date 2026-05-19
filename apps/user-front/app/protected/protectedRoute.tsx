"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useMe } from "@/lib/hooks/useAuth";
import { ShieldAlert, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { data: userData, isLoading, isError } = useMe();
    const user = userData?.user;
    const router = useRouter();

    useEffect(() => {
        // Only redirect if the request is fully completed (not loading)
        // and either encountered an error or there's no user session.
        if (!isLoading && (isError || !user)) {
            router.replace("/");
        }
    }, [isLoading, isError, user, router]);

    // Show a premium loading UI while fetching the profile
    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center animate-pulse">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                        <div className="absolute -inset-4 bg-primary/20 blur-3xl -z-10 rounded-full animate-pulse" />
                    </div>
                    <p className="text-muted-foreground font-bold tracking-widest text-[10px] uppercase animate-pulse">
                        Verifying Security...
                    </p>
                </div>
            </div>
        );
    }

    // Handle unauthenticated state
    if (isError || !user) {
        return null;
    }

    // Block access if the user is authenticated but not active
    if (user.isActive === false) {
        return (
            <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center bg-background p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-6 text-center max-w-md px-8 py-12 bg-muted/30 border border-border/40 rounded-[2.5rem] backdrop-blur-xl shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-destructive/50 via-destructive to-destructive/50" />
                    <div className="h-20 w-20 rounded-[2rem] bg-destructive/10 flex items-center justify-center text-destructive mb-2 shadow-inner">
                        <ShieldAlert className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-foreground tracking-tight">Account On Hold</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Your WoodenGallery account is currently pending review or has been deactivated.
                            Please contact our support team to restore your access.
                        </p>
                    </div>
                    <Button
                        onClick={() => router.replace("/contact")}
                        className="w-full rounded-2xl h-12 bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all font-bold"
                    >
                        Contact Support
                    </Button>
                </motion.div>
            </div>
        );
    }

    // Allow access for authenticated, active users
    return <>{children}</>;
}

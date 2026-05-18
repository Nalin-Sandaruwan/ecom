import React from "react";
import { BadgeCheck, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileBannerProps {
  user: any;
}

export const ProfileBanner = ({ user }: ProfileBannerProps) => {
  return (
    <div className="relative overflow-hidden rounded-[2.8rem] bg-gradient-to-br from-primary/10 via-background to-secondary/10 border border-border/40 p-8 sm:p-12 shadow-2xl shadow-primary/5">
      {/* Cinematic Overlays */}
      <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[60%] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-secondary/10 blur-[100px] pointer-events-none" />
      
      <div className="relative flex flex-col sm:flex-row items-center gap-10">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-32 h-32 sm:w-40 sm:h-40 rounded-[3rem] bg-background shadow-2xl shadow-primary/10 flex items-center justify-center border-8 border-background group hover:rotate-3 transition-transform duration-700"
        >
          <div className="w-full h-full rounded-[2.5rem] bg-primary/5 flex items-center justify-center border border-primary/10">
            <span className="text-5xl sm:text-6xl font-black text-primary/40 group-hover:text-primary transition-colors duration-500">
              {user?.name?.[0].toUpperCase()}
            </span>
          </div>
        </motion.div>
        
        <div className="text-center sm:text-left space-y-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-heading leading-tight">
                {user?.name}
              </h2>
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                <BadgeCheck className="w-4 h-4" />
                Verified Member
              </div>
            </div>
            <p className="text-muted-foreground font-bold text-sm flex items-center justify-center sm:justify-start gap-2 opacity-70">
              <MapPin className="w-4 h-4 text-primary" />
              Srilanka, Colombo
            </p>
          </div>
          
          <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-3">
             <div className="px-3 py-1 bg-background/50 backdrop-blur-md border border-border/40 rounded-xl text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Account ID: #{user?._id?.slice(-6).toUpperCase()}
             </div>
             <div className="px-3 py-1 bg-primary/5 border border-primary/20 rounded-xl text-[10px] font-bold text-primary uppercase tracking-widest">
                Tier: Trusted Artisan
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

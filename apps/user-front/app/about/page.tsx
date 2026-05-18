"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  MapPin, 
  Heart, 
  Sparkles, 
  Leaf, 
  Globe, 
  Award, 
  History,
  TrendingUp,
  Smile
} from "lucide-react";
import Navbar from "@/components/Navbar";

const MetricItem = ({ icon: Icon, value, label }: any) => (
  <div className="flex flex-col items-center text-center space-y-3">
    <div className="w-16 h-16 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
      <Icon className="w-8 h-8" />
    </div>
    <div>
      <h4 className="text-3xl font-bold tracking-tighter text-primary">{value}</h4>
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  </div>
);

const StorySection = ({ title, subtitle, content, icon: Icon, reverse = false }: any) => (
  <div className={cn(
    "flex flex-col gap-12 py-20 items-center",
    reverse ? "lg:flex-row-reverse" : "lg:flex-row"
  )}>
    <motion.div 
      initial={{ opacity: 0, x: reverse ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex-1 space-y-6"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
        <Icon className="w-3 h-3" /> ChilleBazzar Roots
      </div>
      <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-primary leading-[0.9]">{title}</h2>
      <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-xl">
        {content}
      </p>
    </motion.div>
    
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="flex-1 w-full aspect-video rounded-[3rem] bg-gradient-to-br from-muted/50 to-muted border border-border/40 relative overflow-hidden group shadow-2xl"
    >
       <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
       <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-24 h-24 text-primary/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700" />
       </div>
       <div className="absolute bottom-10 left-10 p-6 bg-background/80 backdrop-blur-md rounded-3xl border border-border/40">
          <p className="text-xs font-bold tracking-tight text-primary/80">{subtitle}</p>
       </div>
    </motion.div>
  </div>
);

import { cn } from "@/lib/utils";

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      <main className="pb-32">
        {/* Hero Section */}
        <div className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/20 blur-[120px] rounded-full -z-10" />
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest"
            >
              <History className="w-3.5 h-3.5" /> Our Heritage
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black tracking-tighter text-heading"
            >
              The Science <br /> of Freshness.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed"
            >
              Founded in 2026, ChilleBazzar was built to redefine the boundary between local farmers and the global modern table.
            </motion.p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Story Section 1 */}
        <StorySection 
          icon={Leaf}
          title="Rooted in Quality."
          subtitle="Ethical Sourcing"
          content="We started with a simple belief: the best products come from healthy soil and happy farmers. We spend months visiting independent farms to ensure that every leaf of spinach and every jar of honey meets our elite standards."
        />

        {/* Metrics Section */}
        <div className="py-24 grid grid-cols-2 lg:grid-cols-4 gap-12 border-y border-border/40 bg-muted/5 rounded-[4rem] px-12">
           <MetricItem icon={Users} value="48.2K" label="Active Members" />
           <MetricItem icon={Leaf} value="150+" label="Elite Farmers" />
           <MetricItem icon={Globe} value="12" label="Global Hubs" />
           <MetricItem icon={Smile} value="99.9%" label="Happy Customers" />
        </div>

        {/* Story Section 2 */}
        <StorySection 
          reverse
          icon={Sparkles}
          title="Crafted for Excellence."
          subtitle="Artisanal Standards"
          content="Every collection we present is a result of meticulous curation. From our hand-woven baskets to our cold-pressed artisanal oils, we prioritize the sensory experience of premium living over the convenience of mass production."
        />

        {/* Team Section Placeholder */}
        <div className="pt-32 space-y-16">
           <div className="text-center space-y-4">
              <h2 className="text-5xl font-extrabold tracking-tighter text-primary">Meet the Visionaries</h2>
              <p className="text-muted-foreground max-w-sm mx-auto font-medium">The minds behind the marketplace of tomorrow.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Julian Thorne", role: "Chief Curation Officer", icon: Award },
                { name: "Elena Rossi", role: "Head of Logistics", icon: TrendingUp },
                { name: "Marcus Chen", role: "Director of Sourcing", icon: MapPin }
              ].map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-muted/10 border border-border/40 rounded-[3rem] p-10 backdrop-blur-sm group hover:bg-muted/20 hover:border-primary/20 transition-all duration-500 text-center space-y-6"
                >
                  <div className="w-24 h-24 rounded-[2.5rem] bg-background/50 border border-border/40 mx-auto flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                    <member.icon className="w-10 h-10" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-extrabold tracking-tighter text-primary">{member.name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-1">{member.role}</p>
                  </div>
                  <div className="flex justify-center gap-4 text-muted-foreground">
                     <Heart className="w-4 h-4 hover:text-red-500 cursor-pointer transition-colors" />
                     <Globe className="w-4 h-4 hover:text-primary cursor-pointer transition-colors" />
                  </div>
                </motion.div>
              ))}
           </div>
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-40 bg-zinc-900 border border-white/5 rounded-[4rem] p-20 text-center text-white space-y-8 relative overflow-hidden"
        >
           <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[150px] rounded-full -mr-48 -mt-48" />
           <div className="relative z-10 space-y-6">
              <Sparkles className="w-16 h-16 text-primary mx-auto opacity-50" />
              <h2 className="text-6xl font-bold tracking-tighter leading-tight text-white">Ready to experience <br /> the new standard?</h2>
              <p className="text-white/70 max-w-lg mx-auto font-medium">Join the movement toward an ethical, premium, and stunning shopping future.</p>
              <button className="px-12 h-16 bg-primary text-primary-foreground rounded-2xl font-bold text-xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                Shop the Collection
              </button>
           </div>
        </motion.div>
      </div>
      </main>
    </div>
  );
}

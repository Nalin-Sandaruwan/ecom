"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  MapPin, 
  Phone, 
  Send, 
  MessageSquare, 
  Globe, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const ContactInfoCard = ({ icon: Icon, title, detail, subdetail, color }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="bg-muted/10 border border-border/40 rounded-[2.5rem] p-8 backdrop-blur-sm group hover:bg-muted/20 hover:border-primary/20 transition-all duration-500 relative overflow-hidden"
  >
    <div className={`absolute -right-4 -top-4 w-32 h-32 bg-${color}/10 blur-[60px] rounded-full group-hover:bg-${color}/20 transition-all`} />
    <div className="relative z-10 flex flex-col h-full">
      <div className={`w-14 h-14 rounded-2xl bg-background/50 border border-border/40 flex items-center justify-center mb-6 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all group-hover:scale-110 duration-500`}>
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-xl font-bold tracking-tight mb-2 uppercase text-primary">{title}</h3>
      <p className="text-foreground font-bold mb-1">{detail}</p>
      <p className="text-muted-foreground text-xs font-medium">{subdetail}</p>
      
      <button className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:gap-3 transition-all duration-300">
        Initiate <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  </motion.div>
);

export default function ContactPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      <main className="pb-32">
        {/* Hero Section */}
        <div className="relative pt-32 pb-20 overflow-hidden text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/20 blur-[120px] rounded-full -z-10" />
          <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest"
            >
              <Sparkles className="w-3 h-3" /> Connect with us
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black tracking-tighter text-heading"
            >
              Get In Touch
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed"
            >
              Have questions about our premium wood-crafted collections? Our dedicated team is ready to assist you in every step.
            </motion.p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Form Container */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-muted/10 border border-border/40 rounded-[3rem] p-10 backdrop-blur-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32" />
            
            <div className="relative z-10 space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold tracking-tight text-primary">Send a Message</h2>
                <p className="text-muted-foreground text-sm font-medium">Responses usually arrive within 2 business hours.</p>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">First Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter name"
                      className="w-full bg-background/50 border border-border/40 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Last Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter name"
                      className="w-full bg-background/50 border border-border/40 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Email Address</label>
                  <input 
                     type="email" 
                     placeholder="name@example.com"
                     className="w-full bg-background/50 border border-border/40 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Message</label>
                  <textarea 
                    rows={4}
                    placeholder="How can we help you?"
                    className="w-full bg-background/50 border border-border/40 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all outline-none resize-none"
                  />
                </div>

                <Button className="w-full h-14 rounded-2xl text-lg font-extrabold tracking-tight bg-primary shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group">
                  Send Message
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ContactInfoCard 
              icon={Mail} 
              title="Email Support" 
              detail="support@woodengallery.com" 
              subdetail="24/7 technical monitoring" 
              color="indigo-500"
            />
            <ContactInfoCard 
              icon={Phone} 
              title="Direct Call" 
              detail="+1 (555) 724-4553" 
              subdetail="Mon-Fri, 9AM-6PM EST" 
              color="primary"
            />
            <ContactInfoCard 
              icon={MapPin} 
              title="Headquarters" 
              detail="120 Hudson Yards, NY" 
              subdetail="Suite 42, Floor 84" 
              color="amber-500"
            />
            <ContactInfoCard 
              icon={MessageSquare} 
              title="Live Chat" 
              detail="Speak with an expert" 
              subdetail="Instant response during day" 
              color="primary"
            />
            
            <div className="sm:col-span-2 bg-gradient-to-br from-indigo-600 to-primary rounded-[2.5rem] p-10 text-white shadow-2xl shadow-primary/30 flex flex-col sm:flex-row items-center justify-between gap-8 group overflow-hidden relative">
               <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left">
                  <Globe className="w-10 h-10 mb-4 text-white/80" />
                  <h3 className="text-2xl font-extrabold tracking-tighter uppercase mb-2 text-white">Global Partnerships</h3>
                  <p className="text-white/70 text-xs font-bold leading-relaxed max-w-xs">
                    Interested in becoming a WoodenGallery crafting partner? Join our elite network.
                  </p>
               </div>
               <Button className="relative z-10 bg-white text-primary rounded-2xl h-14 px-8 font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all">
                 Apply Now
               </Button>
            </div>
          </div>
          </div>
        </div>
      </main>
    </div>
  );
}

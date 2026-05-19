"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Eye,
  Database,
  UserRound,
  Globe,
  Mail,
  Fingerprint,
  Cookie,
  FileText
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

const Section = ({ icon: Icon, title, content, id }: any) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="bg-muted/10 border border-border/40 rounded-[2.5rem] p-8 backdrop-blur-sm relative overflow-hidden group hover:bg-muted/20 transition-all duration-500"
  >
    <div className="flex items-start gap-6 relative z-10">
      <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-black tracking-tight text-foreground">{title}</h2>
        <div className="text-muted-foreground leading-relaxed text-sm space-y-4">
          {content}
        </div>
      </div>
    </div>
  </motion.section>
);

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: "intro",
      icon: ShieldCheck,
      title: "Introduction",
      content: (
        <p>
          Welcome to WoodenGallery. We respect your privacy and are committed to protecting your personal data.
          This privacy policy will inform you as to how we look after your personal data when you visit our website
          and tell you about your privacy rights and how the law protects you.
        </p>
      )
    },
    {
      id: "data",
      icon: Database,
      title: "Information We Collect",
      content: (
        <div className="space-y-4">
          <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="bg-background/40 p-4 rounded-2xl border border-border/20">
              <span className="font-bold text-foreground block mb-1 underline decoration-primary/30 text-xs uppercase tracking-wider">Identity</span>
              Includes first name, last name, and username.
            </li>
            <li className="bg-background/40 p-4 rounded-2xl border border-border/20">
              <span className="font-bold text-foreground block mb-1 underline decoration-primary/30 text-xs uppercase tracking-wider">Contact</span>
              Includes billing address, email, and telephone numbers.
            </li>
            <li className="bg-background/40 p-4 rounded-2xl border border-border/20">
              <span className="font-bold text-foreground block mb-1 underline decoration-primary/30 text-xs uppercase tracking-wider">Financial</span>
              Processed securely via third-party providers.
            </li>
            <li className="bg-background/40 p-4 rounded-2xl border border-border/20">
              <span className="font-bold text-foreground block mb-1 underline decoration-primary/30 text-xs uppercase tracking-wider">Behavioral</span>
              Purchasing habits and site interaction data.
            </li>
          </ul>
        </div>
      )
    },
    {
      id: "usage",
      icon: Eye,
      title: "How We Use Your Data",
      content: (
        <div className="space-y-4">
          <p>We only use your personal data when the law allows us to. Most commonly, we will use your data for:</p>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-xs font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Contract Performance
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Legitimate Business Interests
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Legal & Regulatory Compliance
            </div>
          </div>
        </div>
      )
    },
    {
      id: "security",
      icon: Lock,
      title: "Data Security",
      content: (
        <p>
          We have put in place appropriate security measures to prevent your personal data from being accidentally lost,
          used or accessed in an unauthorised way, altered or disclosed. We use enterprise-grade encryption for all sensitive
          transactions and data transmissions.
        </p>
      )
    },
    {
      id: "cookies",
      icon: Cookie,
      title: "Cookie Policy",
      content: (
        <p>
          WoodenGallery uses cookies to enhance your shopping experience. These small data files allow us to remember
          your preferences, track your cart, and provide personalized product recommendations. You can choose to
          refuse all or some cookies through your browser settings.
        </p>
      )
    },
    {
      id: "rights",
      icon: UserRound,
      title: "Your Legal Rights",
      content: (
        <p>
          Under certain circumstances, you have rights under data protection laws in relation to your personal data,
          including the right to request access, correction, erasure, restriction, transfer, to object to processing,
          and to withdraw consent at any time.
        </p>
      )
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/20 blur-[120px] rounded-full -z-10" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest"
          >
            <Fingerprint className="w-3 h-3" /> Security First
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-heading"
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed"
          >
            Last update: October 17, 2026. Your trust is our most valuable asset.
            We've designed our policy to be as clear and transparent as possible.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-32">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Quick Nav Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-32 space-y-1 bg-muted/20 border border-border/40 p-4 rounded-[2.5rem] backdrop-blur-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 ml-4">Quick Jump</p>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all text-left group"
                >
                  <section.icon className="w-4 h-4" />
                  {section.title}
                </button>
              ))}
              <div className="pt-8 p-4">
                <div className="bg-primary/10 rounded-3xl p-6 border border-primary/20">
                  <Mail className="w-6 h-6 text-primary mb-3" />
                  <p className="text-[10px] uppercase font-black text-foreground mb-1">Questions?</p>
                  <p className="text-[9px] text-muted-foreground">privacy@woodengallery.com</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Policy Content */}
          <div className="flex-1 space-y-8">
            {sections.map((section) => (
              <Section
                key={section.id}
                id={section.id}
                icon={section.icon}
                title={section.title}
                content={section.content}
              />
            ))}

            {/* Final Footer Card */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="mt-12 p-12 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[3rem] border border-primary/10 text-center space-y-6"
            >
              <FileText className="w-12 h-12 text-primary mx-auto" />
              <h3 className="text-2xl font-black tracking-tight">Full Terms of Service</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                By using our platform, you also agree to our general Terms of Service and Community Guidelines.
              </p>
              <button className="underline text-foreground text-xs font-bold hover:text-primary transition-colors">
                Read Full Terms
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

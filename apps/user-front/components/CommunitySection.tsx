"use client";

import { type FormEvent, useId, useState } from "react";
import Image from "next/image";
import { Mail, MapPin, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const CommunitySection = () => {
  const emailInputId = useId();
  const [email, setEmail] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Subscribed:", email);
  };

  return (
    <section className="relative w-full bg-primary py-24 lg:py-32 overflow-hidden">
      {/* Decorative Gradient Overlay */}
      <div className="absolute inset-0 bg-black/5 pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* Left Side: Title and Info */}
          <div className="lg:col-span-7 space-y-12 lg:space-y-24">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-7xl lg:text-[100px] font-black text-white leading-[0.9] tracking-[-0.04em]"
            >
              Let's join ChilleBazzar,<br />
              & build <span className="italic font-serif opacity-90">gorgeous</span><br />
              harvests
            </motion.h2>

            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
              {/* Contact Items */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <address className="not-italic text-white text-sm font-medium leading-tight">
                    1929, Chille Bazaar Hub, Artisanal Way,<br />
                    Colombo, Sri Lanka
                  </address>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <a href="mailto:hello@chillebazzar.com" className="text-white text-sm font-medium">
                    hello@chillebazzar.com
                  </a>
                </div>
              </div>

              {/* Newsletter Form */}
              <div className="w-full max-w-[320px] space-y-4">
                <h3 className="text-white text-xl font-bold tracking-tight">
                  Subscribe to our<br />newsletter
                </h3>
                <form onSubmit={handleSubmit} className="relative flex items-center border-b border-white/40 pb-2">
                  <input
                    id={emailInputId}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="bg-transparent text-white text-sm outline-none w-full placeholder:text-white/50 py-2"
                  />
                  <button
                    type="submit"
                    className="bg-white w-8 h-8 rounded-sm flex items-center justify-center hover:bg-white/90 transition-colors ml-2"
                  >
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Side: Large Media Placeholder */}
          <div className="lg:col-span-5 relative min-h-[400px] lg:min-h-[600px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-black/20 rounded-[20px] backdrop-blur-sm overflow-hidden border border-white/10"
            >
              <Image
                src="/cyborg-hand.png"
                alt="Technology and Artisan Fusion"
                fill
                className="object-cover opacity-80 mix-blend-overlay"
              />
              {/* Optional Glass Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
            </motion.div>
          </div>
        </div>

        {/* Footer Bottom Strip */}
        <div className="mt-24 lg:mt-32">
          <div className="w-full h-px bg-white/20 mb-8" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest">
              © 2026 ChilleBazzar by Sans Brothers
            </p>
            <div className="flex gap-8">
              <a href="#" className="text-white/60 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                Terms & Conditions
              </a>
              <a href="#" className="text-white/60 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Camera, X, Mail, Globe, MapPin, Phone } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Hide footer on dashboard and profile routes
  if (pathname?.startsWith("/farmer-dashboard") || pathname?.startsWith("/profile")) {
    return null;
  }

  return (
    <footer className="relative bg-background border-t border-border/40 pt-24 pb-12 overflow-hidden">
      {/* Decorative Gradient */}
      <div className="absolute top-0 right-0 -z-10 w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 w-[30%] h-[30%] bg-secondary/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8">
          
          {/* Brand Identity */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <span className="text-2xl font-black tracking-tight text-heading flex items-center group-hover:scale-105 transition-transform">
                Wooden<span className="text-primary font-light">Gallery</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs font-medium">
              WoodenGallery is a boutique gallery dedicated to the preservation of premium wood crafting and the delivery of elegant, comfortable interior furnishings directly to your sanctuary.
            </p>
            <div className="flex items-center gap-4">
              {[Camera, X, Mail].map((Icon, i) => (
                <Link 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-xl bg-muted/50 border border-border/40 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Matrix */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12">
            
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">The Market</h4>
              <ul className="space-y-4">
                <li><Link href="/shop" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Artisanal Selection</Link></li>
                <li><Link href="/shop" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Fresh Harvest</Link></li>
                <li><Link href="/shop" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Premium Pantry</Link></li>
                <li><Link href="/shop" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Seasonal Boutique</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Digital Identity</h4>
              <ul className="space-y-4">
                <li><Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Artisan Login</Link></li>
                <li><Link href="/farmer-dashboard/dashoard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Farmer Terminal</Link></li>
                <li><Link href="/register" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Join Registry</Link></li>
                <li><Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Member Perks</Link></li>
              </ul>
            </div>

            <div className="space-y-6 col-span-2 md:col-span-1">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Provenance</h4>
              <ul className="space-y-4">
                <li><Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Our Ethos</Link></li>
                <li><Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Reach Out</Link></li>
                <li><Link href="/privacy-policy" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Privacy Sanctity</Link></li>
                <li><Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Trade Terms</Link></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Traceable Footer Bottom */}
        <div className="mt-24 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8 order-2 md:order-1">
            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
              © {currentYear} WoodenGallery Registry. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center gap-8 order-1 md:order-2">
             <div className="flex items-center gap-2 text-muted-foreground/40">
               <Globe className="w-3 h-3" />
               <span className="text-[9px] font-bold uppercase tracking-widest">Global Marketplace</span>
             </div>
             <div className="w-1 h-1 rounded-full bg-border" />
             <div className="flex items-center gap-2 text-muted-foreground/40">
               <MapPin className="w-3 h-3" />
               <span className="text-[9px] font-bold uppercase tracking-widest">Colombo, Sri Lanka</span>
             </div>
          </div>
        </div>

        {/* Final Sign-off */}
        <div className="mt-8 text-center sm:text-right">
           <span className="text-[8px] font-bold text-muted-foreground/30 uppercase tracking-[0.5em]">
             Handcrafted with Precision for Global Artisancy
           </span>
        </div>
      </div>
    </footer>
  );
}

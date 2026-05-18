"use client";

import React from "react";
import { Eye, ExternalLink, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AdminProduct } from "@/lib/api/adminProduct";

interface ProductCertificationsProps {
  product: AdminProduct;
  onViewCert: (uri: string) => void;
}

export const ProductCertifications = ({ product, onViewCert }: ProductCertificationsProps) => {
  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Product Certifications</h4>
      {product.certificateURIs && product.certificateURIs.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {product.certificateURIs.map((uri, index) => (
            <div
              key={index}
              className="group/cert relative aspect-[3/4] rounded-2xl overflow-hidden border border-border/20 shadow-lg bg-muted/20"
            >
              <img
                src={uri}
                alt={`Certificate ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover/cert:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/cert:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => onViewCert(uri)}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                >
                  <Eye className="w-5 h-5" />
                </button>
                {/* <a 
                  href={uri} 
                  download
                  className="w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center text-white hover:bg-primary transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                </a> */}
              </div>
              <div className="absolute top-2 right-2">
                <Badge className="bg-emerald-500/80 backdrop-blur-md text-[8px] h-5 px-1.5 border-none">
                  <ShieldCheck className="w-3 h-3 mr-1" /> VERIFIED
                </Badge>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 rounded-[2rem] border border-dashed border-border/40 flex flex-col items-center justify-center text-center space-y-3 bg-muted/5">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-muted-foreground/40" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-foreground/60">No Certificates Found</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Awaiting verification assets</p>
          </div>
        </div>
      )}
    </div>
  );
};

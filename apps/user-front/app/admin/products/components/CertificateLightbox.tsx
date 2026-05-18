"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ExternalLink, X } from "lucide-react";
import { motion } from "framer-motion";

interface CertificateLightboxProps {
  selectedCert: string | null;
  onClose: () => void;
}

export const CertificateLightbox = ({ selectedCert, onClose }: CertificateLightboxProps) => {
  return (
    <Dialog open={!!selectedCert} onOpenChange={onClose}>
      <DialogContent className="max-w-fit p-0 border-none bg-transparent shadow-none flex items-center justify-center [&>button]:hidden">
        {/* Visually hidden accessibility requirements */}
        <DialogTitle className="sr-only">Certificate View</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed view of product certification document
        </DialogDescription>
        <div className="relative flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative rounded-[2rem] overflow-hidden border border-white/20 shadow-2xl bg-background/40 backdrop-blur-3xl"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition-all z-10"
            >
              <X className="w-6 h-6" />
            </button>
            {selectedCert && (
              <img
                src={selectedCert}
                alt="Certificate Detail"
                className="max-w-[90vw] max-h-[85vh] object-contain block w-auto h-auto"
              />
            )}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 whitespace-nowrap">
              <p className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em]">High Resolution Audit View</p>
              <div className="w-px h-4 bg-white/20" />
              <a
                href={selectedCert || ""}
                download
                className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:text-primary/80 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Save Asset
              </a>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

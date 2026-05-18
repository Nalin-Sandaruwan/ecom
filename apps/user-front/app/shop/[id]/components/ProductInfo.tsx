"use client";

import { motion } from "framer-motion";
import { Star, Verified } from "lucide-react";

interface ProductInfoProps {
  productName: string;
  categoryName?: string;
  description: string;
  farmer?: {
    name: string;
    email: string;
  };
  certificates?: string[];
}

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function ProductInfo({
  productName,
  categoryName,
  description,
  farmer,
  certificates,
}: ProductInfoProps) {
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  // Prevent scroll when preview is open
  useEffect(() => {
    if (selectedCert) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedCert]);
  return (
    <div className="space-y-8">
      {/* Product Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            {categoryName || "Premium Collection"}
          </span>
          <div className="h-px flex-grow bg-gradient-to-r from-primary/20 to-transparent" />
        </div>

        <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tighter text-heading leading-[1.1] text-balance">
          {productName}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-2">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 shadow-sm">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-bold text-amber-700">4.9</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
              Verified Artisan Excellence
            </span>
          </div>

          {farmer && (
            <div className="flex items-center gap-3 bg-muted/5 px-4 py-2 rounded-2xl border border-border/20 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Verified className="w-4 h-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Cultivated By</span>
                <span className="text-xs font-bold text-heading">{farmer.name}</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/30 to-transparent rounded-full" />
        <p className="text-base sm:text-md text-muted-foreground leading-relaxed font-normal pl-2 ">
          "{description}"
        </p>
      </motion.div>

      {/* Certificates Showcase */}
      {certificates && certificates.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 pt-4 border-t border-border/10"
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">Quality Certificates</span>
            <div className="h-px flex-grow bg-border/20" />
          </div>
          
          <div className="flex flex-wrap gap-4">
            {certificates.map((cert, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCert(cert)}
                className="group relative w-20 h-20 rounded-2xl border border-border/40 bg-muted/20 overflow-hidden cursor-pointer shadow-sm hover:border-primary/40 hover:shadow-md transition-all"
              >
                <img 
                  src={cert} 
                  alt={`Certificate ${index + 1}`} 
                  className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[8px] font-bold uppercase text-primary-foreground bg-primary px-2 py-0.5 rounded-full shadow-lg">View</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Lightbox Preview */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-2xl p-4 sm:p-10"
            onClick={() => setSelectedCert(null)}
          >
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors z-[10000]"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCert(null);
              }}
            >
              <X className="w-6 h-6" />
            </motion.button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full h-full max-h-[80vh] flex items-center justify-center"
            >
              <img
                src={selectedCert}
                alt="Certificate Full Preview"
                className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl border border-border/40 bg-muted/10"
              />
              <div className="absolute -bottom-10 left-0 right-0 text-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60">Official Verification Document</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

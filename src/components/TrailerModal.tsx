"use client";

import { useState, useEffect } from "react";
import { Play, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface TrailerModalProps {
  youtubeKey: string;
  title: string;
}

export function TrailerModal({ youtubeKey, title }: TrailerModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 glass-elevated text-foreground font-medium text-sm px-5 py-3 rounded-2xl hover:border-white/35 active:-translate-y-px transition-all"
      >
        <Play className="w-4 h-4" />
        Watch Trailer
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[300] bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 12 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl glass-elevated rounded-[24px] overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <h3 className="text-sm font-medium text-foreground truncate">
                  {title} — Official Trailer
                </h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close trailer"
                  className="p-1 text-muted hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="relative aspect-video bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1`}
                  title={`${title} Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

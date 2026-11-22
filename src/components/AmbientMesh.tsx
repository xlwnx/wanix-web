"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

interface AmbientContextValue {
  backdropUrl: string | null;
  setBackdropUrl: (url: string | null) => void;
}

const AmbientContext = createContext<AmbientContextValue>({
  backdropUrl: null,
  setBackdropUrl: () => {},
});

export function AmbientProvider({ children }: { children: ReactNode }) {
  const [backdropUrl, setBackdropUrl] = useState<string | null>(null);

  return (
    <AmbientContext.Provider value={{ backdropUrl, setBackdropUrl }}>
      {children}
    </AmbientContext.Provider>
  );
}

export function useAmbientBackdrop() {
  return useContext(AmbientContext);
}

export function SetAmbientBackdrop({ url }: { url: string | null }) {
  const { setBackdropUrl } = useAmbientBackdrop();

  useEffect(() => {
    setBackdropUrl(url);
    return () => setBackdropUrl(null);
  }, [url, setBackdropUrl]);

  return null;
}

export function AmbientMesh() {
  const { backdropUrl } = useAmbientBackdrop();

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#060609]"
    >
      {/* Drifting Multi-Orb Mesh Gradient (visible on all pages, primary on non-hero pages) */}
      <div className="mesh-orb mesh-orb-1" />
      <div className="mesh-orb mesh-orb-2" />
      <div className="mesh-orb mesh-orb-3" />

      {/* Hero Artwork Color-Bleed Mesh (active on Home, Detail, Collection) */}
      <AnimatePresence mode="sync">
        {backdropUrl && (
          <motion.div
            key={backdropUrl}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.48 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute inset-0 scale-125"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={backdropUrl}
              alt=""
              className="w-full h-full object-cover blur-[90px] saturate-[185%] brightness-90"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle readability veil */}
      <div className="absolute inset-0 bg-black/35" />
    </div>
  );
}

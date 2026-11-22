"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-24 md:bottom-6 right-5 z-[200] p-3 rounded-2xl glass-elevated text-foreground hover:border-accent hover:text-accent active:-translate-y-px transition-all shadow-lg"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
}

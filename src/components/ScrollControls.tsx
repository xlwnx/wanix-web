"use client";

import { useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function useRailScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, []);

  return { scrollRef, scroll };
}

interface ScrollButtonsProps {
  label: string;
  onScroll: (direction: "left" | "right") => void;
}

export function ScrollButtons({ label, onScroll }: ScrollButtonsProps) {
  return (
    <div className="hidden sm:flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onScroll("left")}
        aria-label={`Scroll ${label} left`}
        className="p-2 rounded-2xl glass text-muted hover:text-foreground hover:border-white/25 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => onScroll("right")}
        aria-label={`Scroll ${label} right`}
        className="p-2 rounded-2xl glass text-muted hover:text-foreground hover:border-white/25 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

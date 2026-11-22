"use client";

import { MediaItem } from "@/lib/tmdb";
import { MediaCard } from "./MediaCard";
import { useRailScroll, ScrollButtons } from "./ScrollControls";

interface MediaRailProps {
  title: string;
  items: MediaItem[];
}

export function MediaRail({ title, items }: MediaRailProps) {
  const { scrollRef, scroll } = useRailScroll();

  if (!items.length) return null;

  return (
    <section className="relative py-5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          <ScrollButtons label={title} onScroll={scroll} />
        </div>

        <div
          ref={scrollRef}
          className="flex gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2"
        >
          {items.map((item, idx) => (
            <div
              key={`${item.media_type ?? "m"}-${item.id}`}
              className="relative w-[140px] sm:w-[170px] lg:w-[185px] shrink-0"
            >
              <MediaCard item={item} index={idx} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

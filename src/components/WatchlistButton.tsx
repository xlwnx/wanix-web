"use client";

import { Plus, Check } from "lucide-react";
import { MediaItem } from "@/lib/tmdb";
import { getMediaType } from "@/lib/media";
import { useWatchlist } from "@/lib/watchlist";

interface WatchlistButtonProps {
  item: MediaItem;
}

export function WatchlistButton({ item }: WatchlistButtonProps) {
  const { toggle, has } = useWatchlist();
  const type = getMediaType(item);
  const saved = has(item.id, type);

  return (
    <button
      type="button"
      onClick={() => toggle({ ...item, media_type: type })}
      className={`inline-flex items-center gap-2 font-medium text-sm px-5 py-3 rounded-2xl border active:-translate-y-px transition-all ${saved
        ? "bg-accent/15 text-accent border-accent/50 backdrop-blur-md"
        : "glass-elevated text-foreground hover:border-white/35"
        }`}
    >
      {saved ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      {saved ? "In My List" : "Add to List"}
    </button>
  );
}

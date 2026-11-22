"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { useWatchlist } from "@/lib/watchlist";
import { MediaCard } from "@/components/MediaCard";

export default function WatchlistPage() {
  const { items, clear } = useWatchlist();

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-8">
      <div className="max-w-[1440px] mx-auto space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              My List
            </h1>
            <p className="text-sm text-muted mt-1">
              {items.length} saved title{items.length === 1 ? "" : "s"}
            </p>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="px-3.5 py-1.5 rounded-lg glass text-xs text-muted hover:text-foreground hover:border-white/25 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="py-20 px-6 text-center space-y-4 rounded-[24px] glass">
            <div className="w-12 h-12 rounded-2xl glass-elevated mx-auto flex items-center justify-center text-accent">
              <Bookmark className="w-5 h-5" />
            </div>
            <p className="text-muted text-sm max-w-md mx-auto">
              Your watchlist is empty. Save movies or TV series you want to
              watch later.
            </p>
            <Link
              href="/discover"
              className="inline-flex items-center px-5 py-2.5 rounded-2xl bg-accent text-black text-sm font-semibold hover:brightness-95 active:-translate-y-px transition-all"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
            {items.map((item, idx) => (
              <MediaCard
                key={`${item.media_type}-${item.id}`}
                item={item}
                index={idx}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

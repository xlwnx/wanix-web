"use client";

import Link from "next/link";
import Image from "next/image";
import { Play, X } from "lucide-react";
import { useHistory } from "@/lib/history";
import { tmdbImage } from "@/lib/tmdb";
import { getMediaTitle, getWatchHref } from "@/lib/media";

export function ContinueWatchingRail() {
  const { items, clear } = useHistory();

  if (!items.length) return null;

  return (
    <section className="py-5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">
            Continue Watching
          </h2>
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>

        <div className="flex gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar pb-2">
          {items.map((item) => {
            const type = item.media_type ?? "movie";
            const title = getMediaTitle(item);
            const href = getWatchHref(type, item.id, item.season, item.episode);
            const poster = tmdbImage(item.backdrop_path ?? item.poster_path, "w500");

            return (
              <Link
                key={`${type}-${item.id}`}
                href={href}
                className="group relative w-[240px] sm:w-[270px] shrink-0 rounded-[20px] overflow-hidden glass hover:border-accent/50 hover:scale-[1.02] transition-all"
              >
                <div className="relative aspect-video w-full bg-white/5">
                  {poster && (
                    <Image
                      src={poster}
                      alt={title}
                      fill
                      sizes="270px"
                      className="object-cover group-hover:opacity-80 transition-opacity"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <span className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-accent text-black flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
                  </span>
                </div>
                <div className="p-2.5">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-accent transition-colors">
                    {title}
                  </p>
                  <p className="text-xs text-muted">
                    {type === "tv"
                      ? `Season ${item.season ?? 1} • Episode ${item.episode ?? 1}`
                      : "Movie"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

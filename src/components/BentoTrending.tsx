"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Star, ArrowUpRight } from "lucide-react";
import { MediaItem, tmdbImage } from "@/lib/tmdb";
import {
  getMediaTitle,
  getMediaType,
  getMediaYear,
  getWatchHref,
} from "@/lib/media";

interface BentoTrendingProps {
  items: MediaItem[];
}

export function BentoTrending({ items }: BentoTrendingProps) {
  const top = items.slice(0, 10);
  if (!top.length) return null;

  const lead = top[0];
  const secondary = top.slice(1, 5);
  const tail = top.slice(5, 10);

  const leadType = getMediaType(lead);
  const leadTitle = getMediaTitle(lead, "Featured");
  const leadYear = getMediaYear(lead);
  const leadWatch = getWatchHref(leadType, lead.id);

  return (
    <section className="py-6">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-accent">
              Weekly Charts
            </p>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-0.5">
              Top 10 Trending This Week
            </h2>
          </div>
          <Link
            href="/discover"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl glass text-xs font-medium text-foreground hover:border-accent/50 hover:text-accent transition-all"
          >
            Explore All
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Primary Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
          {/* #1 Hero Tile (6 cols, 2 rows) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="md:col-span-6 md:row-span-2 group relative min-h-[320px] sm:min-h-[380px] rounded-[24px] overflow-hidden glass"
          >
            {lead.backdrop_path && (
              <Image
                src={tmdbImage(lead.backdrop_path, "w1280")}
                alt={leadTitle}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent" />

            <div className="relative z-10 h-full p-5 sm:p-7 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-xl bg-accent text-black font-bold text-xs tracking-wide">
                  #1 TRENDING
                </span>
                {lead.vote_average > 0 && (
                  <span className="inline-flex items-center gap-1 glass-elevated px-2.5 py-1 rounded-xl text-xs font-medium text-foreground">
                    <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                    {lead.vote_average.toFixed(1)}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted uppercase tracking-wider">
                  <span>{leadType === "tv" ? "Series" : "Movie"}</span>
                  {leadYear && <span>• {leadYear}</span>}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {leadTitle}
                </h3>
                <p className="text-xs sm:text-sm text-muted line-clamp-2 max-w-lg">
                  {lead.overview}
                </p>
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <Link
                    href={leadWatch}
                    className="inline-flex items-center gap-2 bg-accent text-black font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-2xl hover:brightness-95 active:-translate-y-px transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    Watch Now
                  </Link>
                  <Link
                    href={`/${leadType}/${lead.id}`}
                    className="inline-flex items-center gap-1.5 glass-elevated text-foreground font-medium text-xs sm:text-sm px-4 py-2.5 rounded-2xl hover:border-white/35 active:-translate-y-px transition-all"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* #2-#5 Supporting Bento Tiles */}
          {secondary.map((item, idx) => {
            const type = getMediaType(item);
            const title = getMediaTitle(item);
            const year = getMediaYear(item);
            const img = tmdbImage(item.backdrop_path ?? item.poster_path, "w780");
            return (
              <motion.div
                key={`${type}-${item.id}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 20,
                  delay: (idx + 1) * 0.06,
                }}
                className="md:col-span-3"
              >
                <Link
                  href={`/${type}/${item.id}`}
                  className="group relative block h-48 sm:h-[180px] rounded-[20px] overflow-hidden glass hover:border-accent/55 transition-all"
                >
                  {img && (
                    <Image
                      src={img}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="relative z-10 h-full p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-xl bg-accent text-black font-bold text-xs flex items-center justify-center">
                        {idx + 2}
                      </span>
                      {item.vote_average > 0 && (
                        <span className="inline-flex items-center gap-1 glass-elevated px-2 py-0.5 rounded-xl text-[11px] font-medium text-foreground">
                          <Star className="w-3 h-3 fill-accent text-accent" />
                          {item.vote_average.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-accent transition-colors">
                        {title}
                      </h3>
                      <p className="text-[11px] text-muted uppercase tracking-wider">
                        {type === "tv" ? "Series" : "Movie"}
                        {year ? ` • ${year}` : ""}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* #6-#10 Compact Bento Row */}
        {tail.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4">
            {tail.map((item, idx) => {
              const type = getMediaType(item);
              const title = getMediaTitle(item);
              const year = getMediaYear(item);
              const poster = tmdbImage(item.poster_path, "w300");
              return (
                <Link
                  key={`${type}-${item.id}`}
                  href={`/${type}/${item.id}`}
                  className="group flex items-center gap-3 p-2.5 rounded-[20px] glass hover:border-accent/50 transition-all"
                >
                  <div className="relative w-12 h-16 shrink-0 rounded-xl overflow-hidden bg-white/5">
                    {poster && (
                      <Image
                        src={poster}
                        alt={title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <span className="text-[11px] font-mono font-bold text-accent">
                      #{idx + 6}
                    </span>
                    <h4 className="text-xs sm:text-sm font-medium text-foreground truncate group-hover:text-accent transition-colors">
                      {title}
                    </h4>
                    <p className="text-[11px] text-muted truncate">
                      {type === "tv" ? "Series" : "Movie"}
                      {year ? ` • ${year}` : ""}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

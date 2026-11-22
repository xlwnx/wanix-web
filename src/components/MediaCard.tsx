"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { MediaItem, tmdbImage } from "@/lib/tmdb";
import { getMediaTitle, getMediaType, getMediaYear } from "@/lib/media";

interface MediaCardProps {
  item: MediaItem;
  index?: number;
}

export function MediaCard({ item, index = 0 }: MediaCardProps) {
  const type = getMediaType(item);
  const title = getMediaTitle(item);
  const year = getMediaYear(item);
  const poster = tmdbImage(item.poster_path, "w500");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 20,
        delay: Math.min(index * 0.04, 0.28),
      }}
      className="group relative shrink-0"
    >
      <Link
        href={`/${type}/${item.id}`}
        aria-label={`${title}${year ? ` (${year})` : ""}`}
        className="block rounded-[20px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[20px] glass transition-all duration-300 group-hover:scale-[1.03] group-hover:border-accent/55">
          {poster ? (
            <Image
              src={poster}
              alt={title}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 185px"
              className="object-cover transition-opacity duration-300 group-hover:opacity-85"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-muted px-3 text-center">
              No Poster
            </div>
          )}

          {item.vote_average > 0 && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 glass-elevated px-2 py-0.5 rounded-xl text-[11px] font-medium text-foreground">
              <Star className="w-3 h-3 fill-accent text-accent" />
              <span>{item.vote_average.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="mt-2.5 px-1 space-y-0.5">
          <h3 className="text-sm font-medium text-foreground truncate group-hover:text-accent transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted">
            {year && <span>{year}</span>}
            {year && <span>•</span>}
            <span className="uppercase tracking-wider text-[10px]">
              {type === "tv" ? "Series" : "Movie"}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { MediaItem, tmdbImage } from "@/lib/tmdb";
import {
  getMediaTitle,
  getMediaType,
  getMediaYear,
  getWatchHref,
} from "@/lib/media";
import { useAmbientBackdrop } from "./AmbientMesh";

interface HeroSpotlightProps {
  items: MediaItem[];
}

export function HeroSpotlight({ items }: HeroSpotlightProps) {
  const featured = items.slice(0, 5);
  const [index, setIndex] = useState(0);
  const { setBackdropUrl } = useAmbientBackdrop();

  useEffect(() => {
    if (featured.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % featured.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [featured.length]);

  const activeBackdrop = featured[index]?.backdrop_path
    ? tmdbImage(featured[index].backdrop_path, "w300")
    : null;

  useEffect(() => {
    setBackdropUrl(activeBackdrop);
    return () => setBackdropUrl(null);
  }, [activeBackdrop, setBackdropUrl]);

  if (!featured.length) return null;

  const current = featured[index];
  const type = getMediaType(current);
  const title = getMediaTitle(current, "Featured");
  const year = getMediaYear(current);
  const backdrop = tmdbImage(current.backdrop_path, "original");
  const watchHref = getWatchHref(type, current.id);

  return (
    <section className="relative w-full min-h-[72dvh] sm:min-h-[82dvh] max-h-[860px] flex items-end overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_58%,transparent_100%)]"
        >
          {backdrop && (
            <Image
              src={backdrop}
              alt={title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center opacity-90"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 max-w-[1440px] mx-auto w-full px-4 sm:px-8 pt-28 pb-14 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <motion.div
            key={`content-${current.id}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="lg:col-span-8 max-w-2xl p-5 sm:p-7 rounded-[24px] glass space-y-4"
          >
            <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-muted">
              <span className="text-accent">
                {type === "tv" ? "Featured Series" : "Featured Film"}
              </span>
              {year && <span>• {year}</span>}
              {current.vote_average > 0 && (
                <span className="inline-flex items-center gap-1 text-foreground">
                  • <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                  {current.vote_average.toFixed(1)}
                </span>
              )}
            </div>

            {current.logo_path ? (
              <div className="relative h-16 sm:h-24 w-60 sm:w-96">
                <Image
                  src={tmdbImage(current.logo_path, "w500")}
                  alt={title}
                  fill
                  priority
                  sizes="384px"
                  className="object-contain object-left drop-shadow-lg"
                />
              </div>
            ) : (
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.08]">
                {title}
              </h1>
            )}

            <p className="text-sm sm:text-base text-muted line-clamp-3 leading-relaxed max-w-xl">
              {current.overview}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href={watchHref}
                className="inline-flex items-center gap-2 bg-accent text-black font-semibold text-sm px-6 py-3 rounded-2xl hover:brightness-95 active:-translate-y-px transition-all"
              >
                <Play className="w-4 h-4 fill-black" />
                Watch Now
              </Link>
              <Link
                href={`/${type}/${current.id}`}
                className="inline-flex items-center gap-2 glass-elevated text-foreground font-medium text-sm px-5 py-3 rounded-2xl hover:border-white/30 active:-translate-y-px transition-all"
              >
                <Info className="w-4 h-4" />
                More Info
              </Link>
            </div>
          </motion.div>

          {featured.length > 1 && (
            <div className="lg:col-span-4 flex lg:flex-col items-center lg:items-end justify-between gap-3">
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl glass">
                {featured.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Show spotlight ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === index
                      ? "w-8 bg-accent"
                      : "w-3 bg-white/25 hover:bg-white/50"
                      }`}
                  />
                ))}
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setIndex((prev) => (prev - 1 + featured.length) % featured.length)
                  }
                  aria-label="Previous featured title"
                  className="p-2.5 rounded-2xl glass-elevated text-muted hover:text-foreground hover:border-white/35 active:-translate-y-px transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIndex((prev) => (prev + 1) % featured.length)}
                  aria-label="Next featured title"
                  className="p-2.5 rounded-2xl glass-elevated text-muted hover:text-foreground hover:border-white/35 active:-translate-y-px transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

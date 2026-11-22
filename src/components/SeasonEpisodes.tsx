"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Calendar, Clock } from "lucide-react";
import { EpisodeItem, SeasonSummary, tmdbImage } from "@/lib/tmdb";

interface SeasonEpisodesProps {
  tvId: number;
  seasons: SeasonSummary[];
  currentSeason?: number;
  currentEpisode?: number;
}

export function SeasonEpisodes({
  tvId,
  seasons,
  currentSeason,
  currentEpisode,
}: SeasonEpisodesProps) {
  const validSeasons = seasons.filter((s) => s.season_number > 0);
  const [selectedSeason, setSelectedSeason] = useState<number>(
    currentSeason ?? validSeasons[0]?.season_number ?? 1
  );
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch(`/api/tv/${tvId}/season/${selectedSeason}`)
      .then((res) => res.json())
      .then((data) => {
        if (active && Array.isArray(data.episodes)) {
          setEpisodes(data.episodes);
        }
      })
      .catch(() => {
        if (active) setEpisodes([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [tvId, selectedSeason]);

  if (!validSeasons.length) return null;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-foreground">Episodes</h2>
        <div className="flex flex-wrap gap-2">
          {validSeasons.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setLoading(true);
                setSelectedSeason(s.season_number);
              }}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-medium transition-all border ${
                selectedSeason === s.season_number
                  ? "bg-accent text-black border-accent"
                  : "glass text-muted hover:text-foreground hover:border-white/25"
              }`}
            >
              Season {s.season_number}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-[20px] glass skeleton-shimmer"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {episodes.map((ep) => {
            const still = tmdbImage(ep.still_path, "w500");
            const isPlaying =
              currentSeason === selectedSeason &&
              currentEpisode === ep.episode_number;
            return (
              <Link
                key={ep.id}
                href={`/watch/tv/${tvId}/${selectedSeason}/${ep.episode_number}`}
                className={`group flex flex-col sm:flex-row gap-3 sm:gap-4 p-3.5 rounded-[20px] glass transition-all hover:scale-[1.01] ${
                  isPlaying
                    ? "border-accent bg-accent/10"
                    : "hover:border-accent/50"
                }`}
              >
                <div className="relative w-full sm:w-44 aspect-video shrink-0 rounded-2xl overflow-hidden bg-white/5">
                  {still ? (
                    <Image
                      src={still}
                      alt={ep.name}
                      fill
                      sizes="176px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted">
                      No Preview
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="w-9 h-9 rounded-full bg-accent text-black flex items-center justify-center">
                      <Play className="w-4 h-4 fill-black ml-0.5" />
                    </span>
                  </div>
                </div>

                <div className="min-w-0 flex-1 flex flex-col justify-center space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-accent">
                      E{String(ep.episode_number).padStart(2, "0")}
                    </span>
                    <div className="flex items-center gap-3 text-[11px] text-muted">
                      {ep.runtime && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {ep.runtime}m
                        </span>
                      )}
                      {ep.air_date && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {ep.air_date}
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-foreground truncate group-hover:text-accent transition-colors">
                    {ep.name}
                  </h3>
                  <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                    {ep.overview || "No episode description available."}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

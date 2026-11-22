import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { getMediaDetail, tmdbImage } from "@/lib/tmdb";
import { SeasonEpisodes } from "@/components/SeasonEpisodes";
import { RecordHistory } from "@/components/RecordHistory";
import { VidriftPlayer } from "@/components/VidriftPlayer";

export const instant = false;

export default async function WatchTvPage(
  props: { params: Promise<{ id: string; season: string; episode: string }> }
) {
  const { id, season, episode } = await props.params;
  const tv = await getMediaDetail("tv", id).catch(() => null);
  const title = tv?.name ?? `Series #${id}`;
  const seasonNum = Number(season) || 1;
  const episodeNum = Number(episode) || 1;

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-8">
      {tv && (
        <RecordHistory
          id={tv.id}
          media_type="tv"
          name={tv.name}
          overview={tv.overview}
          poster_path={tv.poster_path}
          backdrop_path={tv.backdrop_path}
          vote_average={tv.vote_average}
          vote_count={tv.vote_count}
          popularity={tv.popularity}
          original_language={tv.original_language}
          season={seasonNum}
          episode={episodeNum}
        />
      )}
      <div className="max-w-6xl mx-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href={`/tv/${id}`}
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {title}
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {episodeNum > 1 && (
              <Link
                href={`/watch/tv/${id}/${seasonNum}/${episodeNum - 1}`}
                className="inline-flex items-center gap-1 text-xs font-medium glass-elevated hover:border-accent/50 text-foreground px-3 py-1.5 rounded-md transition-colors"
              >
                Prev
              </Link>
            )}
            <span className="text-xs font-mono text-accent glass px-2.5 py-1 rounded-md">
              S{String(seasonNum).padStart(2, "0")} • E
              {String(episodeNum).padStart(2, "0")}
            </span>
            <Link
              href={`/watch/tv/${id}/${seasonNum}/${episodeNum + 1}`}
              className="inline-flex items-center gap-1 text-xs font-medium glass-elevated hover:border-accent/50 text-foreground px-3 py-1.5 rounded-md transition-colors"
            >
              Next Episode
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <VidriftPlayer
          tmdbId={Number(id)}
          mediaType="tv"
          title={title}
          posterUrl={tmdbImage(tv?.backdrop_path ?? tv?.poster_path, "w1280")}
          season={seasonNum}
          episode={episodeNum}
        />

        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
            {title} — Season {seasonNum}, Episode {episodeNum}
          </h1>
          {tv?.overview && (
            <p className="text-sm text-muted max-w-3xl leading-relaxed">
              {tv.overview}
            </p>
          )}
        </div>

        {tv?.seasons && (
          <div className="pt-6 border-t border-white/8">
            <SeasonEpisodes
              tvId={Number(id)}
              seasons={tv.seasons}
              currentSeason={seasonNum}
              currentEpisode={episodeNum}
            />
          </div>
        )}
      </div>
    </div>
  );
}

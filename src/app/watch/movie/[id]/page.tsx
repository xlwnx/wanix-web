import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getMediaDetail, tmdbImage } from "@/lib/tmdb";
import { RecordHistory } from "@/components/RecordHistory";
import { VidriftPlayer } from "@/components/VidriftPlayer";

export const instant = false;

export default async function WatchMoviePage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  const movie = await getMediaDetail("movie", id).catch(() => null);
  const title = movie?.title ?? `Movie #${id}`;

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-8">
      {movie && (
        <RecordHistory
          id={movie.id}
          media_type="movie"
          title={movie.title}
          overview={movie.overview}
          poster_path={movie.poster_path}
          backdrop_path={movie.backdrop_path}
          vote_average={movie.vote_average}
          vote_count={movie.vote_count}
          popularity={movie.popularity}
          original_language={movie.original_language}
        />
      )}
      <div className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={`/movie/${id}`}
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {title}
          </Link>
          <span className="text-xs font-mono text-muted">TMDB #{id}</span>
        </div>

        <VidriftPlayer
          tmdbId={Number(id)}
          mediaType="movie"
          title={title}
          posterUrl={tmdbImage(movie?.backdrop_path ?? movie?.poster_path, "w1280")}
        />

        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
            {title}
          </h1>
          {movie?.overview && (
            <p className="text-sm text-muted max-w-3xl leading-relaxed">
              {movie.overview}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

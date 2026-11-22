import Link from "next/link";
import Image from "next/image";
import { Play, Star, Calendar, Clock, Globe, DollarSign } from "lucide-react";
import { MediaDetail, tmdbImage } from "@/lib/tmdb";
import { getMediaTitle, getMediaYear, getWatchHref } from "@/lib/media";
import { TrailerModal } from "./TrailerModal";
import { SeasonEpisodes } from "./SeasonEpisodes";
import { MediaRail } from "./MediaRail";
import { WatchlistButton } from "./WatchlistButton";
import { ShareButton } from "./ShareButton";
import { CastRail } from "./CastRail";
import { SetAmbientBackdrop } from "./AmbientMesh";

interface MediaDetailViewProps {
  media: MediaDetail;
  type: "movie" | "tv";
}

function formatMoney(amount?: number) {
  if (!amount || amount <= 0) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function MediaDetailView({ media, type }: MediaDetailViewProps) {
  const title = getMediaTitle(media);
  const date = media.release_date ?? media.first_air_date ?? "";
  const year = getMediaYear(media);
  const runtime =
    media.runtime ??
    (media.episode_run_time && media.episode_run_time[0]) ??
    null;

  const backdrop = tmdbImage(media.backdrop_path, "original");
  const poster = tmdbImage(media.poster_path, "w500");

  const trailer =
    media.videos?.results.find(
      (v) => v.site === "YouTube" && v.type === "Trailer" && v.official
    ) ??
    media.videos?.results.find(
      (v) => v.site === "YouTube" && v.type === "Trailer"
    );

  const watchHref = getWatchHref(type, media.id);

  const cast = media.credits?.cast.slice(0, 16) ?? [];
  const directors =
    media.credits?.crew.filter((c) => c.job === "Director").slice(0, 3) ?? [];
  const writers =
    media.credits?.crew
      .filter((c) => c.job === "Writer" || c.job === "Screenplay")
      .slice(0, 3) ?? [];
  const reviews = media.reviews?.results.slice(0, 3) ?? [];
  const related =
    media.recommendations?.results.length
      ? media.recommendations.results
      : media.similar?.results ?? [];

  const usCert =
    type === "movie"
      ? media.release_dates?.results
          .find((r) => r.iso_3166_1 === "US")
          ?.release_dates.find((d) => d.certification)?.certification
      : media.content_ratings?.results.find((r) => r.iso_3166_1 === "US")
          ?.rating;

  const imdbId = media.external_ids?.imdb_id ?? media.imdb_id;
  const keywords =
    (media.keywords?.keywords ?? media.keywords?.results ?? []).slice(0, 10);
  const providers = media["watch/providers"]?.results?.US?.flatrate ?? [];
  const logoPath = media.images?.logos?.[0]?.file_path ?? null;

  const ambientBackdrop = tmdbImage(media.backdrop_path, "w300") || null;

  return (
    <div className="min-h-screen">
      <SetAmbientBackdrop url={ambientBackdrop} />
      {/* Backdrop Hero */}
      <div className="relative w-full min-h-[540px] lg:min-h-[620px] flex items-end">
        {backdrop && (
          <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)]">
            <Image
              src={backdrop}
              alt={title}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
          </div>
        )}

        <div className="relative z-10 max-w-[1440px] mx-auto w-full px-4 sm:px-8 pt-28 pb-12 flex flex-col md:flex-row gap-8 items-start md:items-end">
          {poster && (
            <div className="relative w-44 sm:w-56 aspect-[2/3] shrink-0 rounded-[20px] overflow-hidden glass hidden sm:block">
              <Image
                src={poster}
                alt={title}
                fill
                sizes="224px"
                className="object-cover"
              />
            </div>
          )}

          <div className="flex-1 p-5 sm:p-7 rounded-[24px] glass space-y-4">
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted">
              <span className="px-2.5 py-1 rounded-xl glass-elevated text-accent font-medium uppercase tracking-wider">
                {type === "tv" ? "TV Series" : "Movie"}
              </span>
              {usCert && (
                <span className="px-2.5 py-1 rounded-xl glass-elevated text-foreground font-mono text-[11px]">
                  {usCert}
                </span>
              )}
              {year && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {date}
                </span>
              )}
              {runtime && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {runtime} min
                </span>
              )}
              {media.number_of_seasons && (
                <span>
                  {media.number_of_seasons} Season
                  {media.number_of_seasons > 1 ? "s" : ""} •{" "}
                  {media.number_of_episodes} Episodes
                </span>
              )}
              {media.vote_average > 0 && (
                <span className="inline-flex items-center gap-1 text-foreground font-medium">
                  <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                  {media.vote_average.toFixed(1)}
                  <span className="text-muted font-normal">
                    ({media.vote_count.toLocaleString()} votes)
                  </span>
                </span>
              )}
            </div>

            {logoPath ? (
              <div className="relative h-16 sm:h-24 w-64 sm:w-96">
                <Image
                  src={tmdbImage(logoPath, "w500")}
                  alt={title}
                  fill
                  priority
                  sizes="384px"
                  className="object-contain object-left drop-shadow-lg"
                />
              </div>
            ) : (
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
                {title}
              </h1>
            )}

            {media.tagline && (
              <p className="text-sm sm:text-base italic text-muted">
                “{media.tagline}”
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {media.genres.map((g) => (
                <Link
                  key={g.id}
                  href={`/discover?type=${type}&genre=${g.id}`}
                  className="text-xs px-3 py-1 rounded-xl glass-elevated text-foreground hover:border-accent/60 transition-colors"
                >
                  {g.name}
                </Link>
              ))}
            </div>

            <p className="text-sm sm:text-base text-muted leading-relaxed max-w-3xl">
              {media.overview}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={watchHref}
                className="inline-flex items-center gap-2 bg-accent text-black font-semibold text-sm px-6 py-3 rounded-2xl hover:brightness-95 active:-translate-y-px transition-all"
              >
                <Play className="w-4 h-4 fill-black" />
                {type === "tv" ? "Watch S1 E1" : "Watch Now"}
              </Link>
              {trailer && (
                <TrailerModal youtubeKey={trailer.key} title={title} />
              )}
              <WatchlistButton item={{ ...media, media_type: type }} />
              <ShareButton title={title} />
              {imdbId && (
                <a
                  href={`https://www.imdb.com/title/${imdbId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 glass-elevated text-foreground font-medium text-xs px-4 py-3 rounded-2xl hover:border-accent/50 active:-translate-y-px transition-all"
                >
                  IMDb
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Bento Grid */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-10 space-y-14">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          {/* Facts Bento Tile (7 cols) */}
          <div
            className={`${
              providers.length > 0 || keywords.length > 0
                ? "lg:col-span-7"
                : "lg:col-span-12"
            } grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-[24px] glass`}
          >
            <div>
              <p className="text-xs text-muted uppercase tracking-wider mb-1">
                Status
              </p>
              <p className="text-sm font-medium text-foreground">{media.status}</p>
              {(media.original_title ?? media.original_name) &&
                (media.original_title ?? media.original_name) !== title && (
                  <p className="text-xs text-muted mt-1 truncate">
                    Original: {media.original_title ?? media.original_name}
                  </p>
                )}
            </div>
            <div>
              <p className="text-xs text-muted uppercase tracking-wider mb-1">
                Languages
              </p>
              <p className="text-sm font-medium text-foreground inline-flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-accent shrink-0" />
                <span className="truncate">
                  {media.spoken_languages.map((l) => l.english_name).join(", ") ||
                    "English"}
                </span>
              </p>
            </div>
            {type === "movie" ? (
              <>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider mb-1">
                    Budget
                  </p>
                  <p className="text-sm font-medium text-foreground inline-flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-accent" />
                    {formatMoney(media.budget)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider mb-1">
                    Box Office
                  </p>
                  <p className="text-sm font-medium text-foreground inline-flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-accent" />
                    {formatMoney(media.revenue)}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider mb-1">
                    Network
                  </p>
                  <p className="text-sm font-medium text-foreground truncate">
                    {media.networks?.map((n) => n.name).join(", ") ||
                      media.production_companies.map((c) => c.name).join(", ") ||
                      "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider mb-1">
                    Country
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {media.production_countries.map((c) => c.name).join(", ") ||
                      "N/A"}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Providers & Keywords Bento Tile (5 cols) */}
          {(providers.length > 0 || keywords.length > 0) && (
            <div className="lg:col-span-5 p-6 rounded-[24px] glass space-y-5">
              {providers.length > 0 && (
                <div className="space-y-2.5">
                  <h3 className="text-xs font-medium uppercase tracking-wider text-muted">
                    Streaming in US (JustWatch)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {providers.map((p) => (
                      <div
                        key={p.provider_id}
                        className="flex items-center gap-2 glass-elevated rounded-xl px-2.5 py-1.5"
                      >
                        {p.logo_path && (
                          <Image
                            src={tmdbImage(p.logo_path, "w300")}
                            alt={p.provider_name}
                            width={18}
                            height={18}
                            className="rounded"
                          />
                        )}
                        <span className="text-xs text-foreground">
                          {p.provider_name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {keywords.length > 0 && (
                <div className="space-y-2.5">
                  <h3 className="text-xs font-medium uppercase tracking-wider text-muted">
                    Keywords
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {keywords.map((k) => (
                      <Link
                        key={k.id}
                        href={`/search?q=${encodeURIComponent(k.name)}`}
                        className="text-xs px-2.5 py-1 rounded-xl glass-elevated text-muted hover:text-accent hover:border-accent/40 transition-colors"
                      >
                        #{k.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Collection Banner Bento Tile */}
          {type === "movie" && media.belongs_to_collection && (
            <Link
              href={`/collection/${media.belongs_to_collection.id}`}
              className="lg:col-span-12 flex items-center justify-between gap-4 p-6 rounded-[24px] glass-elevated hover:border-accent/50 transition-all group"
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-accent">
                  Part of Collection
                </p>
                <p className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-accent transition-colors mt-0.5">
                  {media.belongs_to_collection.name}
                </p>
              </div>
              <span className="px-4 py-2 rounded-2xl glass text-xs font-medium text-foreground group-hover:border-accent/50 transition-colors shrink-0">
                View Collection →
              </span>
            </Link>
          )}
        </section>

        {/* TV Seasons & Episodes */}
        {type === "tv" && media.seasons && (
          <SeasonEpisodes tvId={media.id} seasons={media.seasons} />
        )}

        {/* Top Cast */}
        <CastRail cast={cast} directors={directors} writers={writers} />

        {/* Asymmetric Reviews Bento Grid */}
        {reviews.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Audience Reviews
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
              {reviews.map((rev, idx) => (
                <article
                  key={rev.id}
                  className={`${
                    idx === 0 && reviews.length > 1
                      ? "md:col-span-6"
                      : reviews.length === 1
                      ? "md:col-span-12"
                      : "md:col-span-3"
                  } p-6 rounded-[24px] glass space-y-3 flex flex-col justify-between`}
                >
                  <p className="text-xs sm:text-sm text-muted line-clamp-5 leading-relaxed">
                    {rev.content}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                    <span className="font-medium text-foreground truncate">
                      {rev.author}
                    </span>
                    {rev.author_details.rating !== null && (
                      <span className="inline-flex items-center gap-1 text-accent font-medium shrink-0">
                        <Star className="w-3 h-3 fill-accent" />
                        {rev.author_details.rating}/10
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Recommendations */}
      {related.length > 0 && (
        <MediaRail
          title="More Like This"
          items={related.map((item) => ({
            ...item,
            media_type: item.media_type ?? type,
          }))}
        />
      )}
    </div>
  );
}

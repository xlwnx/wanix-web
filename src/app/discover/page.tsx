import Link from "next/link";
import { Film } from "lucide-react";
import { discoverMedia, getGenres } from "@/lib/tmdb";
import { MediaCard } from "@/components/MediaCard";
import { Pagination } from "@/components/Pagination";

export const instant = false;

interface DiscoverPageProps {
  searchParams: Promise<{
    type?: string;
    genre?: string;
    year?: string;
    sort?: string;
    cert?: string;
    page?: string;
  }>;
}

const MOVIE_CERTS = ["G", "PG", "PG-13", "R"];
const TV_CERTS = ["TV-PG", "TV-14", "TV-MA"];

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "primary_release_date.desc", label: "Newest First" },
];

const YEAR_OPTIONS = ["2026", "2025", "2024", "2023", "2022", "2021", "2020"];

export default async function DiscoverPage(props: DiscoverPageProps) {
  const sp = await props.searchParams;
  const type: "movie" | "tv" = sp.type === "tv" ? "tv" : "movie";
  const genre = sp.genre ?? "";
  const year = sp.year ?? "";
  const sortBy = sp.sort ?? "popularity.desc";
  const cert = sp.cert ?? "";
  const page = Math.max(1, Number(sp.page) || 1);

  const [genres, data] = await Promise.all([
    getGenres(type),
    discoverMedia(type, { page, genre, year, sortBy, certification: cert }),
  ]);

  const buildHref = (overrides: Record<string, string | number>) => {
    const params = new URLSearchParams();
    params.set("type", String(overrides.type ?? type));
    const g = overrides.genre !== undefined ? overrides.genre : genre;
    const y = overrides.year !== undefined ? overrides.year : year;
    const s = overrides.sort !== undefined ? overrides.sort : sortBy;
    const c = overrides.cert !== undefined ? overrides.cert : cert;
    const p = overrides.page !== undefined ? overrides.page : 1;
    if (g) params.set("genre", String(g));
    if (y) params.set("year", String(y));
    if (s) params.set("sort", String(s));
    if (c) params.set("cert", String(c));
    if (Number(p) > 1) params.set("page", String(p));
    return `/discover?${params.toString()}`;
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-8">
      <div className="max-w-[1440px] mx-auto space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {type === "tv" ? "TV Series" : "Movies"}
          </h1>
          <p className="text-sm text-muted mt-1">
            {data.total_results.toLocaleString()} titles available
          </p>
        </div>

        {/* Sort & Genre Bento Filter Deck */}
        <div className="p-5 sm:p-6 rounded-[24px] glass space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {SORT_OPTIONS.map((opt) => (
              <Link
                key={opt.value}
                href={buildHref({ sort: opt.value, page: 1 })}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  sortBy === opt.value
                    ? "glass-elevated text-accent border-accent/60"
                    : "glass text-muted hover:text-foreground"
                }`}
              >
                {opt.label}
              </Link>
            ))}
            <span className="text-white/15 mx-1">|</span>
            <Link
              href={buildHref({ year: "", page: 1 })}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                !year
                  ? "glass-elevated text-accent border-accent/60"
                  : "glass text-muted hover:text-foreground"
              }`}
            >
              All Years
            </Link>
            {YEAR_OPTIONS.map((y) => (
              <Link
                key={y}
                href={buildHref({ year: y, page: 1 })}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  year === y
                    ? "glass-elevated text-accent border-accent/60"
                    : "glass text-muted hover:text-foreground"
                }`}
              >
                {y}
              </Link>
            ))}
            <span className="text-white/15 mx-1">|</span>
            {(type === "movie" ? MOVIE_CERTS : TV_CERTS).map((c) => (
              <Link
                key={c}
                href={buildHref({ cert: cert === c ? "" : c, page: 1 })}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                  cert === c
                    ? "glass-elevated text-accent border-accent/60"
                    : "glass text-muted hover:text-foreground"
                }`}
              >
                {c}
              </Link>
            ))}
            {(genre || year || cert) && (
              <Link
                href={`/discover?type=${type}`}
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-accent hover:underline"
              >
                Reset Filters
              </Link>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={buildHref({ genre: "", page: 1 })}
              className={`px-3 py-1.5 rounded-xl text-xs border transition-all ${
                !genre
                  ? "bg-foreground text-black border-foreground font-medium"
                  : "glass text-muted hover:text-foreground"
              }`}
            >
              All Genres
            </Link>
            {genres.map((g) => (
              <Link
                key={g.id}
                href={buildHref({ genre: String(g.id), page: 1 })}
                className={`px-3 py-1.5 rounded-xl text-xs border transition-all ${
                  genre === String(g.id)
                    ? "bg-foreground text-black border-foreground font-medium"
                    : "glass text-muted hover:text-foreground"
                }`}
              >
                {g.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Grid */}
        {data.results.length === 0 ? (
          <div className="py-20 px-6 text-center rounded-[24px] glass space-y-4">
            <div className="w-12 h-12 rounded-2xl glass-elevated mx-auto flex items-center justify-center text-accent">
              <Film className="w-5 h-5" />
            </div>
            <p className="text-muted text-sm">
              No titles found for the selected filters.
            </p>
            <Link
              href={`/discover?type=${type}`}
              className="inline-flex items-center px-5 py-2.5 rounded-2xl bg-accent text-black text-xs font-semibold hover:brightness-95 transition-all"
            >
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
            {data.results.map((item, idx) => (
              <MediaCard key={item.id} item={item} index={idx} />
            ))}
          </div>
        )}

        <Pagination
          page={page}
          totalPages={data.total_pages}
          prevHref={buildHref({ page: page - 1 })}
          nextHref={buildHref({ page: page + 1 })}
        />
      </div>
    </div>
  );
}

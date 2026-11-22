import Link from "next/link";
import {
  Flame,
  Rocket,
  Zap,
  Drama,
  Laugh,
  Skull,
  Sparkles,
  BookOpen,
} from "lucide-react";
import {
  getTrending,
  getMovieList,
  getTvList,
  getMediaLogo,
} from "@/lib/tmdb";
import { HeroSpotlight } from "@/components/HeroSpotlight";
import { MediaRail } from "@/components/MediaRail";
import { ContinueWatchingRail } from "@/components/ContinueWatchingRail";
import { BentoTrending } from "@/components/BentoTrending";

const QUICK_GENRES = [
  { id: 28, name: "Action", icon: Flame, span: "col-span-2 sm:col-span-1" },
  { id: 878, name: "Sci-Fi", icon: Rocket, span: "col-span-1" },
  { id: 53, name: "Thriller", icon: Zap, span: "col-span-1" },
  { id: 18, name: "Drama", icon: Drama, span: "col-span-1" },
  { id: 35, name: "Comedy", icon: Laugh, span: "col-span-1" },
  { id: 27, name: "Horror", icon: Skull, span: "col-span-1" },
  { id: 16, name: "Animation", icon: Sparkles, span: "col-span-1" },
  { id: 99, name: "Documentary", icon: BookOpen, span: "col-span-2 sm:col-span-1" },
];

export default async function HomePage() {
  const [
    trendingAll,
    nowPlaying,
    topRatedMovies,
    upcomingMovies,
    popularTv,
    topRatedTv,
    airingTodayTv,
  ] = await Promise.all([
    getTrending("all", "week"),
    getMovieList("now_playing"),
    getMovieList("top_rated"),
    getMovieList("upcoming"),
    getTvList("popular"),
    getTvList("top_rated"),
    getTvList("airing_today"),
  ]);

  const featuredWithLogos = await Promise.all(
    trendingAll.slice(0, 5).map(async (item) => {
      const type = item.media_type ?? (item.title ? "movie" : "tv");
      const logo_path = await getMediaLogo(type, item.id);
      return { ...item, logo_path };
    })
  );

  return (
    <div className="min-h-screen">
      <HeroSpotlight items={featuredWithLogos} />
      <div className="-mt-6 relative z-20 space-y-6">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 p-3 rounded-[24px] glass">
            {QUICK_GENRES.map((g) => {
              const Icon = g.icon;
              return (
                <Link
                  key={g.id}
                  href={`/discover?type=movie&genre=${g.id}`}
                  className={`${g.span} flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl glass-elevated text-xs font-medium text-foreground hover:text-accent hover:border-accent/55 active:-translate-y-px transition-all`}
                >
                  <Icon className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span className="truncate">{g.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
        <ContinueWatchingRail />
        <BentoTrending items={trendingAll} />
        <MediaRail title="Now Playing in Theaters" items={nowPlaying} />
        <MediaRail title="Popular TV Series" items={popularTv} />
        <MediaRail title="Airing Today on TV" items={airingTodayTv} />
        <MediaRail title="Top Rated Movies" items={topRatedMovies} />
        <MediaRail title="Top Rated TV Series" items={topRatedTv} />
        <MediaRail title="Upcoming Releases" items={upcomingMovies} />
      </div>
    </div>
  );
}

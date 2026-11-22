import { cache } from "react";
import type { Metadata } from "next";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export function tmdbImage(
  path: string | null | undefined,
  size: "w300" | "w500" | "w780" | "w1280" | "original" = "w500"
): string {
  if (!path) return "";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export interface MediaItem {
  id: number;
  media_type?: "movie" | "tv";
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
  original_language: string;
  logo_path?: string | null;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface VideoItem {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface ReviewItem {
  id: string;
  author: string;
  content: string;
  created_at: string;
  author_details: {
    rating: number | null;
    avatar_path: string | null;
  };
}

export interface SeasonSummary {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
  air_date: string | null;
}

export interface EpisodeItem {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  episode_number: number;
  season_number: number;
  air_date: string | null;
  runtime: number | null;
  vote_average: number;
}

export interface MediaDetail extends MediaItem {
  tagline?: string;
  status: string;
  runtime?: number;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  genres: Genre[];
  budget?: number;
  revenue?: number;
  homepage?: string;
  imdb_id?: string;
  spoken_languages: { english_name: string; iso_639_1: string }[];
  production_companies: { id: number; name: string; logo_path: string | null }[];
  production_countries: { iso_3166_1: string; name: string }[];
  networks?: { id: number; name: string; logo_path: string | null }[];
  seasons?: SeasonSummary[];
  credits?: { cast: CastMember[]; crew: CrewMember[] };
  videos?: { results: VideoItem[] };
  reviews?: { results: ReviewItem[] };
  similar?: { results: MediaItem[] };
  recommendations?: { results: MediaItem[] };
  external_ids?: { imdb_id?: string | null; instagram_id?: string | null; twitter_id?: string | null };
  keywords?: { keywords?: { id: number; name: string }[]; results?: { id: number; name: string }[] };
  "watch/providers"?: {
    results?: {
      US?: {
        flatrate?: { provider_id: number; provider_name: string; logo_path: string }[];
        rent?: { provider_id: number; provider_name: string; logo_path: string }[];
        buy?: { provider_id: number; provider_name: string; logo_path: string }[];
      };
    };
  };
  release_dates?: {
    results: {
      iso_3166_1: string;
      release_dates: { certification: string }[];
    }[];
  };
  content_ratings?: {
    results: { iso_3166_1: string; rating: string }[];
  };
  belongs_to_collection?: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
  images?: {
    logos: { file_path: string; iso_639_1: string | null }[];
  };
}

export interface CollectionDetail {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: MediaItem[];
}

export interface PersonDetail {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  known_for_department: string;
  profile_path: string | null;
  external_ids?: { imdb_id?: string | null };
  combined_credits?: {
    cast: (MediaItem & { character?: string })[];
    crew: (MediaItem & { job?: string })[];
  };
}

async function tmdbFetch<T>(
  endpoint: string,
  params: Record<string, string | number> = {}
): Promise<T> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error("TMDB_API_KEY is missing in environment variables.");
  }

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("language", "en-US");
  for (const [k, v] of Object.entries(params)) {
    if (v !== "" && v !== undefined && v !== null) {
      url.searchParams.set(k, String(v));
    }
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`TMDB API error (${res.status}) on ${endpoint}`);
  }

  return res.json() as Promise<T>;
}

export async function getTrending(
  type: "all" | "movie" | "tv" = "all",
  window: "day" | "week" = "week"
) {
  const data = await tmdbFetch<{ results: MediaItem[] }>(
    `/trending/${type}/${window}`
  );
  return data.results;
}

export async function getMovieList(
  category: "now_playing" | "popular" | "top_rated" | "upcoming",
  page = 1
) {
  const data = await tmdbFetch<{ results: MediaItem[] }>(`/movie/${category}`, {
    page,
  });
  return data.results.map((item) => ({ ...item, media_type: "movie" as const }));
}

export async function getTvList(
  category: "popular" | "top_rated" | "on_the_air" | "airing_today",
  page = 1
) {
  const data = await tmdbFetch<{ results: MediaItem[] }>(`/tv/${category}`, {
    page,
  });
  return data.results.map((item) => ({ ...item, media_type: "tv" as const }));
}

export const getMediaDetail = cache(async (type: "movie" | "tv", id: string | number) => {
  const extra =
    type === "movie"
      ? "credits,videos,reviews,similar,recommendations,external_ids,keywords,watch/providers,release_dates,images"
      : "credits,videos,reviews,similar,recommendations,external_ids,keywords,watch/providers,content_ratings,images";
  return tmdbFetch<MediaDetail>(`/${type}/${id}`, {
    append_to_response: extra,
    include_image_language: "en,null",
  });
});

export async function buildMediaMetadata(
  type: "movie" | "tv",
  id: string
): Promise<Metadata> {
  const item = await getMediaDetail(type, id).catch(() => null);
  if (!item) {
    return { title: `${type === "movie" ? "Movie" : "Series"} Not Found — Wanix` };
  }
  const title = item.title ?? item.name ?? "Untitled";
  const image = tmdbImage(item.backdrop_path ?? item.poster_path, "w1280");
  return {
    title: `${title} — Wanix`,
    description: item.overview,
    openGraph: image ? { images: [{ url: image }] } : undefined,
  };
}

export async function getMediaLogo(type: "movie" | "tv", id: number): Promise<string | null> {
  try {
    const data = await tmdbFetch<{ logos: { file_path: string; iso_639_1: string | null }[] }>(
      `/${type}/${id}/images`,
      { include_image_language: "en,null" }
    );
    return data.logos?.[0]?.file_path ?? null;
  } catch {
    return null;
  }
}

export const getPersonDetail = cache(async (id: string | number) => {
  return tmdbFetch<PersonDetail>(`/person/${id}`, {
    append_to_response: "combined_credits,external_ids",
  });
});

export const getCollection = cache(async (id: string | number) => {
  return tmdbFetch<CollectionDetail>(`/collection/${id}`);
});

export async function getTvSeason(
  tvId: string | number,
  seasonNumber: number
) {
  return tmdbFetch<{ episodes: EpisodeItem[]; name: string; overview: string }>(
    `/tv/${tvId}/season/${seasonNumber}`
  );
}

export async function getGenres(type: "movie" | "tv") {
  const data = await tmdbFetch<{ genres: Genre[] }>(`/genre/${type}/list`);
  return data.genres;
}

export async function discoverMedia(
  type: "movie" | "tv",
  options: {
    page?: number;
    genre?: string;
    year?: string;
    sortBy?: string;
    certification?: string;
  } = {}
) {
  const params: Record<string, string | number> = {
    page: options.page ?? 1,
    sort_by: options.sortBy ?? "popularity.desc",
    "vote_count.gte": 50,
  };
  if (options.genre) params.with_genres = options.genre;
  if (options.year) {
    if (type === "movie") params.primary_release_year = options.year;
    else params.first_air_date_year = options.year;
  }
  if (options.certification) {
    params.certification_country = "US";
    params.certification = options.certification;
  }

  const data = await tmdbFetch<{
    results: MediaItem[];
    total_pages: number;
    total_results: number;
  }>(`/discover/${type}`, params);

  return {
    ...data,
    results: data.results.map((item) => ({ ...item, media_type: type })),
  };
}

export async function searchMulti(query: string, page = 1) {
  const data = await tmdbFetch<{
    results: MediaItem[];
    total_pages: number;
    total_results: number;
  }>("/search/multi", {
    query,
    page,
    include_adult: "false",
  });

  return {
    ...data,
    results: data.results.filter(
      (item) => item.media_type === "movie" || item.media_type === "tv"
    ),
  };
}

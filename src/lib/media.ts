export interface MediaIdentity {
  id: number;
  media_type?: "movie" | "tv";
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
}

export function getMediaType(item: Pick<MediaIdentity, "media_type" | "title">): "movie" | "tv" {
  return item.media_type ?? (item.title ? "movie" : "tv");
}

export function getMediaTitle(
  item: Pick<MediaIdentity, "title" | "name">,
  fallback = "Untitled"
): string {
  return item.title ?? item.name ?? fallback;
}

export function getMediaYear(
  item: Pick<MediaIdentity, "release_date" | "first_air_date">
): string {
  const date = item.release_date ?? item.first_air_date ?? "";
  return date ? date.slice(0, 4) : "";
}

export function getWatchHref(
  type: "movie" | "tv",
  id: number | string,
  season = 1,
  episode = 1
): string {
  return type === "tv"
    ? `/watch/tv/${id}/${season}/${episode}`
    : `/watch/movie/${id}`;
}

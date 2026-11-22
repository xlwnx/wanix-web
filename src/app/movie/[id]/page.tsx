import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMediaMetadata, getMediaDetail } from "@/lib/tmdb";
import { MediaDetailView } from "@/components/MediaDetailView";

export const instant = false;

export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await props.params;
  return buildMediaMetadata("movie", id);
}

export default async function MovieDetailPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  const movie = await getMediaDetail("movie", id).catch(() => null);
  if (!movie) notFound();

  return <MediaDetailView media={movie} type="movie" />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMediaMetadata, getMediaDetail } from "@/lib/tmdb";
import { MediaDetailView } from "@/components/MediaDetailView";

export const instant = false;

export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await props.params;
  return buildMediaMetadata("tv", id);
}

export default async function TvDetailPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  const tv = await getMediaDetail("tv", id).catch(() => null);
  if (!tv) notFound();

  return <MediaDetailView media={tv} type="tv" />;
}

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCollection, tmdbImage } from "@/lib/tmdb";
import { MediaCard } from "@/components/MediaCard";
import { SetAmbientBackdrop } from "@/components/AmbientMesh";

export const instant = false;

export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await props.params;
  const col = await getCollection(id).catch(() => null);
  if (!col) return { title: "Collection Not Found — Wanix" };
  return {
    title: `${col.name} — Wanix`,
    description: col.overview,
  };
}

export default async function CollectionPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  const col = await getCollection(id).catch(() => null);
  if (!col) notFound();

  const backdrop = tmdbImage(col.backdrop_path, "original");
  const ambientBackdrop = tmdbImage(col.backdrop_path, "w300") || null;
  const parts = [...col.parts].sort((a, b) =>
    (a.release_date ?? "").localeCompare(b.release_date ?? "")
  );

  return (
    <div className="min-h-screen">
      <SetAmbientBackdrop url={ambientBackdrop} />
      <div className="relative w-full min-h-[380px] flex items-end">
        {backdrop && (
          <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]">
            <Image
              src={backdrop}
              alt={col.name}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-55"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
          </div>
        )}

        <div className="relative z-10 max-w-[1440px] mx-auto w-full px-4 sm:px-8 pt-28 pb-10">
          <div className="max-w-3xl p-6 sm:p-8 rounded-[24px] glass space-y-3">
            <span className="text-xs font-medium uppercase tracking-widest text-accent">
              Film Collection • {parts.length} Titles
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              {col.name}
            </h1>
            {col.overview && (
              <p className="text-sm sm:text-base text-muted leading-relaxed">
                {col.overview}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          {parts.map((item, idx) => (
            <MediaCard
              key={item.id}
              item={{ ...item, media_type: "movie" }}
              index={idx}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

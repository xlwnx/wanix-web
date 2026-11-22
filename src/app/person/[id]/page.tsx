import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, MapPin } from "lucide-react";
import { getPersonDetail, tmdbImage } from "@/lib/tmdb";
import { MediaCard } from "@/components/MediaCard";

export const instant = false;

export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await props.params;
  const person = await getPersonDetail(id).catch(() => null);
  if (!person) return { title: "Person Not Found — Wanix" };
  return {
    title: `${person.name} — Wanix`,
    description: person.biography || `${person.name} filmography on Wanix.`,
  };
}

export default async function PersonPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  const person = await getPersonDetail(id).catch(() => null);
  if (!person) notFound();

  const photo = tmdbImage(person.profile_path, "w500");
  const credits = (person.combined_credits?.cast ?? [])
    .filter((c) => c.poster_path)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 24);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-8">
      <div className="max-w-[1440px] mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-3 relative aspect-[3/4] w-48 md:w-full rounded-[24px] overflow-hidden glass">
            {photo ? (
              <Image
                src={photo}
                alt={person.name}
                fill
                sizes="260px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted">
                No Photo
              </div>
            )}
          </div>

          <div className="md:col-span-9 p-6 sm:p-8 rounded-[24px] glass space-y-4">
            <div>
              <span className="text-xs font-medium uppercase tracking-widest text-accent">
                {person.known_for_department}
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground mt-1">
                {person.name}
              </h1>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-muted">
              {person.birthday && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-accent" />
                  Born {person.birthday}
                  {person.deathday ? ` — Died ${person.deathday}` : ""}
                </span>
              )}
              {person.place_of_birth && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  {person.place_of_birth}
                </span>
              )}
            </div>

            {person.biography && (
              <p className="text-sm sm:text-base text-muted leading-relaxed max-w-3xl whitespace-pre-line">
                {person.biography}
              </p>
            )}

            {person.external_ids?.imdb_id && (
              <a
                href={`https://www.imdb.com/name/${person.external_ids.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 glass-elevated text-foreground font-medium text-xs px-3.5 py-2 rounded-lg hover:border-accent/50 transition-colors"
              >
                IMDb Profile
              </a>
            )}
          </div>
        </div>

        {credits.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Known For
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
              {credits.map((item, idx) => (
                <MediaCard
                  key={`${item.media_type ?? "m"}-${item.id}-${idx}`}
                  item={item}
                  index={idx}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

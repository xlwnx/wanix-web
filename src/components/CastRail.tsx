"use client";

import Link from "next/link";
import Image from "next/image";
import { CastMember, tmdbImage } from "@/lib/tmdb";
import { useRailScroll, ScrollButtons } from "./ScrollControls";

interface CastRailProps {
  cast: CastMember[];
  directors: { name: string }[];
  writers: { name: string }[];
}

export function CastRail({ cast, directors, writers }: CastRailProps) {
  const { scrollRef, scroll } = useRailScroll();

  if (!cast.length) return null;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">Top Cast</h2>
          {directors.length > 0 && (
            <p className="text-xs text-muted">
              Directed by{" "}
              <span className="text-foreground font-medium">
                {directors.map((d) => d.name).join(", ")}
              </span>
              {writers.length > 0 && (
                <>
                  {" "}• Written by{" "}
                  <span className="text-foreground font-medium">
                    {writers.map((w) => w.name).join(", ")}
                  </span>
                </>
              )}
            </p>
          )}
        </div>

        <ScrollButtons label="cast" onScroll={scroll} />
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2"
      >
        {cast.map((person) => {
          const profile = tmdbImage(person.profile_path, "w300");
          return (
            <Link
              key={person.id}
              href={`/person/${person.id}`}
              className="group w-32 sm:w-36 shrink-0 space-y-2"
            >
              <div className="relative aspect-[3/4] rounded-[20px] overflow-hidden glass group-hover:border-accent/50 transition-all group-hover:scale-[1.02]">
                {profile ? (
                  <Image
                    src={profile}
                    alt={person.name}
                    fill
                    sizes="144px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted">
                    No Photo
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground truncate group-hover:text-accent transition-colors">
                  {person.name}
                </p>
                <p className="text-xs text-muted truncate">
                  {person.character}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

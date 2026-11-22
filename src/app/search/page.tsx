import Link from "next/link";
import { Search } from "lucide-react";
import { searchMulti } from "@/lib/tmdb";
import { MediaCard } from "@/components/MediaCard";
import { Pagination } from "@/components/Pagination";

export const instant = false;

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage(props: SearchPageProps) {
  const sp = await props.searchParams;
  const query = sp.q?.trim() ?? "";
  const page = Math.max(1, Number(sp.page) || 1);

  const data = query ? await searchMulti(query, page) : null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-8">
      <div className="max-w-[1440px] mx-auto space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {query ? `Results for “${query}”` : "Search Wanix"}
          </h1>
          {data && (
            <p className="text-sm text-muted mt-1">
              Found {data.results.length} matching titles on this page
            </p>
          )}
        </div>

        {!query ? (
          <div className="py-20 px-6 text-center rounded-[24px] glass space-y-4">
            <div className="w-12 h-12 rounded-2xl glass-elevated mx-auto flex items-center justify-center text-accent">
              <Search className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-foreground font-medium">Start searching</p>
              <p className="text-muted text-sm">
                Use the search bar above or press{" "}
                <span className="font-mono text-foreground">/</span> to find movies and TV series.
              </p>
            </div>
            <Link
              href="/discover"
              className="inline-flex items-center px-5 py-2.5 rounded-2xl bg-accent text-black text-sm font-semibold hover:brightness-95 transition-all"
            >
              Browse Discover
            </Link>
          </div>
        ) : data && data.results.length === 0 ? (
          <div className="py-20 px-6 text-center rounded-[24px] glass space-y-4">
            <div className="w-12 h-12 rounded-2xl glass-elevated mx-auto flex items-center justify-center text-accent">
              <Search className="w-5 h-5" />
            </div>
            <p className="text-muted text-sm">
              No movies or TV series matched “{query}”. Try another title.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
            {data?.results.map((item, idx) => (
              <MediaCard
                key={`${item.media_type}-${item.id}`}
                item={item}
                index={idx}
              />
            ))}
          </div>
        )}

        {data && (
          <Pagination
            page={page}
            totalPages={data.total_pages}
            prevHref={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`}
            nextHref={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`}
          />
        )}
      </div>
    </div>
  );
}

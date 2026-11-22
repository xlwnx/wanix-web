"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Home, Film, Tv, Bookmark } from "lucide-react";

const TABS = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/discover?type=movie",
    label: "Movies",
    icon: Film,
    match: (p: string, t: string | null) => p === "/discover" && t !== "tv",
  },
  {
    href: "/discover?type=tv",
    label: "TV Shows",
    icon: Tv,
    match: (p: string, t: string | null) => p === "/discover" && t === "tv",
  },
  {
    href: "/watchlist",
    label: "My List",
    icon: Bookmark,
    match: (p: string) => p === "/watchlist",
  },
];

export function MobileNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-3 inset-x-3 z-[100] glass-elevated rounded-[22px] px-1.5"
    >
      <div className="grid grid-cols-4 h-15">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = tab.match(pathname, type);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`my-1.5 flex flex-col items-center justify-center gap-0.5 rounded-2xl text-[10px] font-medium transition-all ${
                active
                  ? "bg-accent/15 text-accent"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

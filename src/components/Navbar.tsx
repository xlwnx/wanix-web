"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home", match: (p: string) => p === "/" },
  {
    href: "/discover?type=movie",
    label: "Movies",
    match: (p: string, t: string | null) => p === "/discover" && t !== "tv",
  },
  {
    href: "/discover?type=tv",
    label: "TV Shows",
    match: (p: string, t: string | null) => p === "/discover" && t === "tv",
  },
  {
    href: "/watchlist",
    label: "My List",
    match: (p: string) => p === "/watchlist",
  },
];

export function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-[100] px-3 sm:px-6 pt-3 pointer-events-none">
      <div
        className={`pointer-events-auto max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4 rounded-[20px] transition-all duration-500 ${scrolled ? "glass-elevated" : "glass"
          }`}
      >
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-foreground font-semibold tracking-tight text-lg"
          >
            <Image
              src="/logo.svg"
              alt="Wanix Logo"
              width={28}
              height={28}
              className="rounded-lg"
            />
            <span>WANIX</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1.5 text-sm">
            {NAV_LINKS.map((link) => {
              const active = link.match(pathname, type);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-xl transition-all ${active
                    ? "bg-accent/15 text-accent font-medium border border-accent/35"
                    : "text-muted hover:text-foreground hover:bg-white/5"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className="hidden sm:flex items-center relative">
            <Search className="w-4 h-4 text-muted absolute left-3 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, TV... ( / )"
              aria-label="Search movies and TV shows"
              className="w-52 lg:w-68 bg-white/5 border border-white/12 rounded-xl pl-9 pr-3 py-1.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background transition-all"
            />
          </form>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-xl text-foreground hover:text-accent hover:bg-white/5 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="pointer-events-auto md:hidden mt-2 max-w-[1400px] mx-auto glass-elevated rounded-[20px] px-4 py-4 space-y-4">
          <form onSubmit={handleSearch} className="flex items-center relative">
            <Search className="w-4 h-4 text-muted absolute left-3 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, TV..."
              className="w-full bg-white/5 border border-white/12 rounded-xl pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </form>
          <nav className="grid grid-cols-2 gap-2">
            {NAV_LINKS.map((link) => {
              const active = link.match(pathname, type);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded-xl text-sm transition-colors ${
                    active
                      ? "bg-accent/15 text-accent font-medium border border-accent/35"
                      : "bg-white/5 text-foreground hover:text-accent"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

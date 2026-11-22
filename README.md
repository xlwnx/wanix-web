<div align="center">
  <img src="public/logo.svg" alt="Wanix Logo" width="64" height="64" />
  <h1>WANIX</h1>
  <p><strong>Cinema &amp; TV Series Discovery and Streaming Web App</strong></p>
  <p>
    Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, TMDB API v3, and VidRift.
  </p>
</div>

---

## Overview

**Wanix** is a responsive English (US) movie and TV series platform styled with a **Liquid Glass + Bento Grid** interface over a dark ambient canvas. Hero backdrops dynamically bleed their colors into the blurred background mesh across the home spotlight, detail views, and collection pages, while browse and search routes use a drifting multi-orb cinema mesh.

## Key Features

- **Dynamic Hero Spotlight & Ambient Color-Bleed** — Auto-rotating featured titles on Home with official TMDB title logos, spring transitions, and live full-page blurred backdrop color extraction.
- **Top 10 Trending Bento Grid** — Asymmetric 12-column Bento layout highlighting the weekly `#1` lead title alongside `#2–#10` trending movies and series.
- **Comprehensive Metadata (TMDB API v3)** — Full details including synopsis, official YouTube trailers, US age certifications (`PG-13`, `R`, `TV-MA`), spoken languages, budget & box office, TV networks, US JustWatch streaming providers, clickable keywords, audience reviews, franchise collections, and actor/director filmography pages.
- **Integrated VidRift Player** — Embedded movie and TV episode playback via `embed.vidrift.in` with custom `WANIX` branding, progress saving & auto-resume (`vidrift:progress` / `vidrift:resume`), parent-owned fullscreen across episode changes, and an in-player season/episode switcher.
- **Browse, Filter & Instant Search** — Filter Movies and TV Shows by sort order, release year, US age rating, and genre, or press `/` from anywhere to jump into multi-search.
- **Personal Watchlist & Continue Watching** — Client-side `My List` and `Continue Watching` rails persisted in `localStorage`.
- **Desktop & Mobile-First Navigation** — Floating Liquid Glass top navigation bar for desktop and a 4-tab bottom dock for mobile viewports.

## Routes

| Route | Description |
| --- | --- |
| `/` | Home spotlight, quick genres, continue watching, Top 10 trending Bento Grid, and movie/TV rails |
| `/discover` | Filterable catalog for Movies (`?type=movie`) and TV Series (`?type=tv`) |
| `/search` | Paginated multi-search across movies and TV series |
| `/movie/[id]` | Full movie detail page with trailer modal, cast rail, collection banner, and reviews |
| `/tv/[id]` | Full TV series detail page with interactive season & episode guide |
| `/person/[id]` | Actor & crew profile page with biography, IMDb link, and filmography |
| `/collection/[id]` | Film franchise / collection overview and chronologically sorted parts |
| `/watch/movie/[id]` | VidRift movie player with progress auto-resume |
| `/watch/tv/[id]/[season]/[episode]` | VidRift TV player with Prev/Next navigation and season episode picker |
| `/watchlist` | Saved `My List` titles stored locally |

## Tech Stack

- **Framework:** Next.js `16.4.6` (App Router, Turbopack, Cache Components)
- **Language:** TypeScript `5` & React `19.3`
- **Styling:** Tailwind CSS `4.3.3` + custom Liquid Glass & CSS `@property` animations
- **Motion & Icons:** Framer Motion `14` & Lucide React
- **Data & Playback:** TMDB API v3 (server-side) & VidRift Embed API

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/xlwnx/wanix-web.git
cd wanix-web
```

### 2. Configure environment variables

Create a `.env.local` file in the project root with your TMDB API v3 key:

```env
TMDB_API_KEY=your_tmdb_api_key_here
```

### 3. Install dependencies and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

## Credits

- Metadata, artwork, and logos powered by [The Movie Database (TMDB)](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB.
- Video playback embedded via [VidRift](https://vidrift.net/).

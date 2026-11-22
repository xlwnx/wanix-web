"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { readStorage, writeStorage } from "@/lib/storage";

interface VidriftPlayerProps {
  tmdbId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterUrl?: string;
  season?: number;
  episode?: number;
}

const PROGRESS_KEY_PREFIX = "wanix_progress_v1_";
const ALLOWED_ORIGINS = new Set([
  "https://embed.vidrift.in",
  "https://embed.vidrift.net",
]);

function getProgressKey(
  mediaType: "movie" | "tv",
  tmdbId: number,
  season?: number,
  episode?: number
) {
  return mediaType === "tv"
    ? `${PROGRESS_KEY_PREFIX}tv_${tmdbId}_${season ?? 1}_${episode ?? 1}`
    : `${PROGRESS_KEY_PREFIX}movie_${tmdbId}`;
}

export function VidriftPlayer({
  tmdbId,
  mediaType,
  title,
  posterUrl,
  season = 1,
  episode = 1,
}: VidriftPlayerProps) {
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const embedUrl = useMemo(() => {
    const basePath =
      mediaType === "movie"
        ? `https://embed.vidrift.in/embed/movie/${tmdbId}`
        : `https://embed.vidrift.in/embed/tv/${tmdbId}/${season}/${episode}`;

    const params = new URLSearchParams({
      title,
      brand: "WANIX",
      brandColor: "E5A93C",
      showTitle: "1",
      exit: "1",
      download: "1",
    });
    if (posterUrl) params.set("poster", posterUrl);
    return `${basePath}?${params.toString()}`;
  }, [tmdbId, mediaType, title, posterUrl, season, episode]);

  useEffect(() => {
    const sendToPlayer = (msg: Record<string, unknown>) => {
      const win = iframeRef.current?.contentWindow;
      if (!win) return;
      win.postMessage(msg, "https://embed.vidrift.in");
    };

    const handleLoad = () => {
      const saved = readStorage<{ currentTime?: number } | null>(
        getProgressKey(mediaType, tmdbId, season, episode),
        null
      );
      if (typeof saved?.currentTime === "number" && saved.currentTime > 10) {
        sendToPlayer({ type: "vidrift:resume", currentTime: saved.currentTime });
      }
    };

    const handleMessage = (e: MessageEvent) => {
      if (!ALLOWED_ORIGINS.has(e.origin) || !e.data?.type) return;

      switch (e.data.type) {
        case "vidrift:progress": {
          writeStorage(
            getProgressKey(mediaType, tmdbId, e.data.season, e.data.episode),
            {
              currentTime: e.data.currentTime,
              duration: e.data.duration,
            }
          );
          break;
        }
        case "vidrift:exit": {
          router.push(`/${mediaType}/${tmdbId}`);
          break;
        }
        case "vidrift:episode": {
          if (mediaType === "tv" && e.data.season && e.data.episode) {
            router.replace(
              `/watch/tv/${tmdbId}/${e.data.season}/${e.data.episode}`
            );
          }
          break;
        }
      }
    };

    const iframe = iframeRef.current;
    if (iframe && iframe.src !== embedUrl) {
      iframe.src = embedUrl;
    }
    iframe?.addEventListener("load", handleLoad);
    window.addEventListener("message", handleMessage);

    return () => {
      sendToPlayer({ type: "vidrift:pause" });
      if (iframe) {
        iframe.src = "about:blank";
      }
      iframe?.removeEventListener("load", handleLoad);
      window.removeEventListener("message", handleMessage);
    };
  }, [tmdbId, mediaType, season, episode, router, embedUrl]);

  return (
    <div className="space-y-2">
      <div className="player-shell relative aspect-video w-full rounded-[24px] overflow-hidden glass">
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={`Watch ${title}`}
          allowFullScreen
          allow="autoplay; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          className="w-full h-full border-0"
        />
      </div>
      <p className="hidden sm:block text-[11px] text-muted text-right">
        Shortcuts: <span className="font-mono text-foreground">F</span> fullscreen •{" "}
        <span className="font-mono text-foreground">Space</span> play/pause •{" "}
        <span className="font-mono text-foreground">←/→</span> seek 10s
      </p>
    </div>
  );
}

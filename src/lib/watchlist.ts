"use client";

import { useCallback } from "react";
import { MediaItem } from "./tmdb";
import { writeStorage, useStoredList } from "./storage";

const STORAGE_KEY = "wanix_watchlist_v1";

export function useWatchlist() {
  const { items, setItems, clear } = useStoredList<MediaItem>(STORAGE_KEY);

  const toggle = useCallback(
    (item: MediaItem) => {
      setItems((prev) => {
        const exists = prev.some(
          (x) => x.id === item.id && x.media_type === item.media_type
        );
        const next = exists
          ? prev.filter(
              (x) => !(x.id === item.id && x.media_type === item.media_type)
            )
          : [item, ...prev];
        writeStorage(STORAGE_KEY, next);
        return next;
      });
    },
    [setItems]
  );

  const has = useCallback(
    (id: number, type: "movie" | "tv") =>
      items.some((x) => x.id === id && x.media_type === type),
    [items]
  );

  return { items, toggle, has, clear };
}

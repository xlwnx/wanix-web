"use client";

import { MediaItem } from "./tmdb";
import { readStorage, writeStorage, useStoredList } from "./storage";

const HISTORY_KEY = "wanix_history_v1";
const MAX_HISTORY = 12;

export interface HistoryItem extends MediaItem {
  season?: number;
  episode?: number;
  watchedAt: number;
}

export function useHistory() {
  const { items, clear } = useStoredList<HistoryItem>(HISTORY_KEY);
  return { items, clear };
}

export function recordWatchHistory(item: Omit<HistoryItem, "watchedAt">) {
  const prev = readStorage<HistoryItem[]>(HISTORY_KEY, []);
  const filtered = prev.filter(
    (x) => !(x.id === item.id && x.media_type === item.media_type)
  );
  const next: HistoryItem[] = [
    { ...item, watchedAt: Date.now() },
    ...filtered,
  ].slice(0, MAX_HISTORY);
  writeStorage(HISTORY_KEY, next);
}

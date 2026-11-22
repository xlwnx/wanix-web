"use client";

import { useEffect } from "react";
import { recordWatchHistory, HistoryItem } from "@/lib/history";

export function RecordHistory(props: Omit<HistoryItem, "watchedAt">) {
  const { id, media_type, season, episode } = props;

  useEffect(() => {
    recordWatchHistory(props);
    // Only re-record when the watched media or episode identity changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, media_type, season, episode]);

  return null;
}

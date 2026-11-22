"use client";

import { useState, useEffect, useCallback } from "react";

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or private browsing errors
  }
}

export function useStoredList<T>(key: string) {
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    Promise.resolve().then(() => {
      setItems(readStorage<T[]>(key, []));
    });
  }, [key]);

  const clear = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore storage errors
    }
  }, [key]);

  return { items, setItems, clear };
}

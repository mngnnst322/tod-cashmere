"use client";

import { useCallback, useSyncExternalStore } from "react";

// Saved ("hearted") catalog items live in this browser only.
const KEY = "katalog-favorites";
const EVENT = "katalog-favorites-change";
const EMPTY = "[]";

function read() {
  try {
    return localStorage.getItem(KEY) ?? EMPTY;
  } catch {
    return EMPTY;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useCatalogFavorites() {
  const raw = useSyncExternalStore(subscribe, read, () => EMPTY);
  let ids: string[] = [];
  try {
    ids = JSON.parse(raw);
  } catch {
    // corrupt value: treat as empty
  }

  const toggle = useCallback((id: string) => {
    let current: string[] = [];
    try {
      current = JSON.parse(read());
    } catch {
      // ignore
    }
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // storage blocked: nothing to persist
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { ids, toggle };
}

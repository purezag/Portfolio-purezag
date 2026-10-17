"use client";

import { useSyncExternalStore } from "react";

export function useMedia(query: string, serverFallback = false) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}

export const useFinePointer = () => useMedia("(hover: hover) and (pointer: fine)", true);

export const useReducedMotionPref = () => useMedia("(prefers-reduced-motion: reduce)");

"use client";

import { useLayoutEffect, useRef } from "react";

export function useFitText<T extends HTMLElement>(deps: unknown[] = [], max = Infinity) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    const box = node?.parentElement;
    if (!node || !box) return;

    const fit = () => {
      const available = box.clientWidth;
      if (!available) return;
      node.style.fontSize = "100px";
      const natural = node.scrollWidth;
      if (natural) node.style.fontSize = `${Math.min(max, (100 * available) / natural)}px`;
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    document.fonts?.ready.then(fit);
    return () => observer.disconnect();
  }, [...deps, max]);

  return ref;
}

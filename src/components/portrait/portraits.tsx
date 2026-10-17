"use client";

import { useEffect, useRef } from "react";
import { usePanelCover } from "@/components/deck";
import { useFinePointer, useReducedMotionPref } from "@/hooks/use-media";
import { ABOUT_SRC, PORTRAIT_HD_SRC, PORTRAIT_SRC, loadImage } from "@/lib/assets";
import { cn } from "@/lib/cn";
import { ParticleEngine } from "./particle-engine";
import { PixelEngine } from "./pixel-engine";

type PortraitProps = { className?: string; label: string };

function useCoveredCheck() {
  const cover = usePanelCover();
  const ref = useRef(cover);
  ref.current = cover;
  return () => (ref.current?.get() ?? 0) >= 0.999;
}

export function ParticlePortrait({ className, label, ready }: PortraitProps & { ready: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const engine = useRef<ParticleEngine | null>(null);
  const reduced = useReducedMotionPref();
  const fine = useFinePointer();
  const isCovered = useCoveredCheck();
  const readyRef = useRef(ready);
  readyRef.current = ready;

  useEffect(() => {
    let disposed = false;
    loadImage(PORTRAIT_SRC).then((image) => {
      if (disposed || !canvas.current) return;
      engine.current = new ParticleEngine(canvas.current, {
        image,
        reveal: null,
        reduced,
        isCovered,
      });
      if (readyRef.current) engine.current.start();
      loadImage(fine ? PORTRAIT_HD_SRC : PORTRAIT_SRC).then((hd) => engine.current?.setReveal(hd));
    });
    return () => {
      disposed = true;
      engine.current?.destroy();
      engine.current = null;
    };
  }, [reduced, fine]);

  useEffect(() => {
    if (ready) engine.current?.start();
  }, [ready]);

  return (
    <canvas
      ref={canvas}
      role="img"
      aria-label={label}
      className={cn("block size-full font-mono", className)}
    />
  );
}

export function PixelPortrait({ className, label }: PortraitProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotionPref();
  const isCovered = useCoveredCheck();

  useEffect(() => {
    let disposed = false;
    let engine: PixelEngine | null = null;
    loadImage(ABOUT_SRC).then((image) => {
      if (disposed || !canvas.current) return;
      engine = new PixelEngine(canvas.current, { image, reduced, isCovered });
    });
    return () => {
      disposed = true;
      engine?.destroy();
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvas}
      role="img"
      aria-label={label}
      className={cn("block size-full font-mono", className)}
    />
  );
}

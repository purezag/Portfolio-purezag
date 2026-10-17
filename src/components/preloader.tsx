"use client";

import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { LOGO_PATH, LOGO_VIEWBOX } from "@/lib/logo";
import { PORTRAIT_SRC, loadImage } from "@/lib/assets";
import { useApp } from "@/providers/app-provider";

const EXPO = [0.16, 1, 0.3, 1] as const;
const QUART = [0.76, 0, 0.24, 1] as const;

export function Preloader() {
  const { t, markReady, markLanded } = useApp();
  const [phase, setPhase] = useState<"loading" | "leaving" | "landed" | "done">("loading");
  const [percent, setPercent] = useState(0);
  const progress = useMotionValue(0);
  const scaleX = useTransform(progress, [0, 100], [0, 1]);
  const mark = useRef<HTMLDivElement>(null);
  const curtain = useRef<HTMLDivElement>(null);

  useMotionValueEvent(progress, "change", (value) => setPercent(Math.round(value)));

  useEffect(() => {
    let cancelled = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const assets = Promise.all([
      document.fonts.ready,
      loadImage(PORTRAIT_SRC).catch(() => null),
    ]);

    const run = async () => {
      await animate(progress, 82, { duration: reduced ? 0.2 : 1.7, ease: [0.45, 0, 0.2, 1] });
      await assets;
      if (cancelled) return;
      await animate(progress, 100, { duration: reduced ? 0.1 : 0.45, ease: EXPO });
      if (cancelled) return;
      setPhase("leaving");

      const target = document.querySelector<HTMLElement>("[data-nav-logo]");
      const node = mark.current;
      const wipe = curtain.current;
      if (!node || !wipe) return;

      const from = node.getBoundingClientRect();
      const to = target?.getBoundingClientRect();
      const flight = to
        ? animate(
            node,
            {
              x: to.left + to.width / 2 - (from.left + from.width / 2),
              y: to.top + to.height / 2 - (from.top + from.height / 2),
              scale: to.width / from.width,
            },
            { duration: reduced ? 0 : 1.05, ease: EXPO, delay: 0.15 },
          )
        : animate(node, { opacity: 0 }, { duration: 0.4 });

      window.setTimeout(() => !cancelled && markReady(), reduced ? 0 : 450);
      const reveal = animate(
        wipe,
        { clipPath: ["inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"] },
        { duration: reduced ? 0.2 : 1.1, ease: QUART, delay: 0.2 },
      );
      await flight;
      if (cancelled) return;
      markLanded();
      setPhase("landed");
      await reveal;
      if (!cancelled) setPhase("done");
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [markReady, markLanded, progress]);

  if (phase === "done") return null;

  const steps = t.preloader.steps;
  const step = steps[Math.min(steps.length - 1, Math.floor((percent / 100) * steps.length))];
  const leaving = phase !== "loading";

  return (
    <div className="fixed inset-0 z-[100]" aria-hidden="true">
      <div ref={curtain} className="absolute inset-0 bg-bg">
        <div className="grid-backdrop absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <motion.div
          className="mono-label absolute inset-x-5 top-5 flex justify-between text-muted md:inset-x-8 md:top-7"
          animate={{ opacity: leaving ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <span>gp/runtime</span>
          <span>v2.0.26</span>
        </motion.div>
        <motion.div
          className="absolute inset-x-0 top-1/2 mx-auto mt-[clamp(76px,16vw,104px)] flex w-[min(240px,64vw)] flex-col gap-3"
          animate={{ opacity: leaving ? 0 : 1, y: leaving ? 8 : 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="h-px w-full overflow-hidden bg-line">
            <motion.div className="h-full origin-left bg-fg" style={{ scaleX }} />
          </div>
          <div className="mono-label flex items-center justify-between text-muted normal-case">
            <span className="flex items-center gap-1.5">
              <span className="text-faint">&gt;</span>
              {step}
              <span className="inline-block h-3 w-[6px] translate-y-px bg-fg [animation:blink_1s_steps(1)_infinite]" />
            </span>
            <span className="tabular-nums text-fg">{String(percent).padStart(3, "0")}%</span>
          </div>
        </motion.div>
        <motion.div
          className="mono-label absolute inset-x-5 bottom-5 flex justify-between text-muted md:inset-x-8 md:bottom-7"
          animate={{ opacity: leaving ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <span>-31.77, -52.34</span>
          <span>©2026</span>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div
          ref={mark}
          className="relative size-[clamp(92px,24vw,124px)] -translate-y-3 text-fg"
          style={{ visibility: phase === "landed" ? "hidden" : "visible" }}
        >
          <svg viewBox={LOGO_VIEWBOX} className="absolute inset-0 size-full overflow-visible">
            <motion.path
              d={LOGO_PATH}
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 1 }}
              animate={{ pathLength: 1, opacity: leaving ? 0 : 1 }}
              transition={{ pathLength: { duration: 1.6, ease: [0.65, 0, 0.35, 1] }, opacity: { duration: 0.3 } }}
            />
            <motion.path
              d={LOGO_PATH}
              fillRule="evenodd"
              fill="currentColor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.25, ease: "easeOut" }}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

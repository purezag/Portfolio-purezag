"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { SECTIONS, type SectionId } from "@/components/navbar";
import { cn } from "@/lib/cn";
import { useApp } from "@/providers/app-provider";

const EXPO = [0.16, 1, 0.3, 1] as const;

export function ScrollRail() {
  const { t, ready, scrollTo } = useApp();
  const { scrollY, scrollYProgress } = useScroll();
  const [current, setCurrent] = useState<SectionId>("home");
  const [percent, setPercent] = useState(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    const probe = y + window.innerHeight * 0.5;
    let next: SectionId = "home";
    for (const id of SECTIONS) {
      const anchor = document.querySelector<HTMLElement>(`[data-anchor="${id}"]`);
      if (anchor && anchor.getBoundingClientRect().top + y <= probe) next = id;
    }
    setCurrent(next);
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => setPercent(Math.round(value * 100)));

  return (
    <motion.aside
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 right-0 z-40 flex w-5 flex-col items-center justify-center gap-5 md:w-8 lg:w-14 lg:gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: 0.8, ease: EXPO, delay: 1 }}
    >
      <ul className="flex flex-col items-center gap-3 lg:pointer-events-auto">
        {SECTIONS.map((id, index) => (
          <li key={id}>
            <button
              type="button"
              tabIndex={-1}
              onClick={() => (id === "home" ? scrollTo(0) : scrollTo(id))}
              className="group relative flex h-5 w-4 items-center justify-end md:w-6 lg:w-8"
            >
              <span className="mono-label pointer-events-none absolute right-8 whitespace-nowrap rounded-full border border-line bg-surface/80 px-2 py-1 normal-case text-muted opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100">
                0{index + 1} {t.nav[id]}
              </span>
              <span
                className={cn(
                  "h-px bg-fg transition-all duration-500 ease-expo",
                  current === id ? "w-3.5 opacity-100 md:w-5 lg:w-6" : "w-1.5 opacity-30 group-hover:w-4 group-hover:opacity-60 md:w-2.5",
                )}
              />
            </button>
          </li>
        ))}
      </ul>
      <span className="mono-label text-[9px] tabular-nums text-faint [writing-mode:vertical-rl] md:text-[11px]">
        {String(percent).padStart(3, "0")}%
      </span>
    </motion.aside>
  );
}

"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import type { Lang } from "@/lib/i18n";
import { useApp } from "@/providers/app-provider";

const EXPO = [0.16, 1, 0.3, 1] as const;
const LANGS: Lang[] = ["pt", "en"];

function ThemeGlyph({ dark }: { dark: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden="true">
      <mask id="theme-glyph-mask">
        <rect width="24" height="24" fill="white" />
        <motion.circle
          r="6"
          fill="black"
          initial={false}
          animate={{ cx: dark ? 16.5 : 30, cy: dark ? 7.5 : -6 }}
          transition={{ duration: 0.7, ease: EXPO }}
        />
      </mask>
      <motion.circle
        cx="12"
        cy="12"
        fill="currentColor"
        mask="url(#theme-glyph-mask)"
        initial={false}
        animate={{ r: dark ? 8 : 4.5 }}
        transition={{ duration: 0.7, ease: EXPO }}
      />
      <motion.g
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        style={{ originX: "12px", originY: "12px" }}
        initial={false}
        animate={{ opacity: dark ? 0 : 1, rotate: dark ? -45 : 0, scale: dark ? 0.6 : 1 }}
        transition={{ duration: 0.6, ease: EXPO }}
      >
        {Array.from({ length: 8 }, (_, index) => {
          const angle = (index * Math.PI) / 4;
          return (
            <line
              key={index}
              x1={12 + Math.cos(angle) * 7.5}
              y1={12 + Math.sin(angle) * 7.5}
              x2={12 + Math.cos(angle) * 9.5}
              y2={12 + Math.sin(angle) * 9.5}
            />
          );
        })}
      </motion.g>
    </svg>
  );
}

export function ControlsDock() {
  const { theme, lang, t, ready, toggleTheme, toggleLang } = useApp();

  return (
    <motion.div
      className="fixed inset-x-0 bottom-[max(14px,env(safe-area-inset-bottom))] z-50 flex justify-center pointer-events-none"
      initial={{ opacity: 0, y: 24 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.9, ease: EXPO, delay: 0.9 }}
    >
      <div data-vt="site-dock" className="pointer-events-auto flex items-center gap-1 rounded-full border border-line-strong bg-surface/80 p-1 shadow-[0_8px_30px_-12px_rgb(var(--shade)/0.35)] backdrop-blur-xl [view-transition-name:site-dock]">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={t.controls.theme}
          className="flex h-9 items-center gap-2 rounded-full pl-2.5 pr-3 text-fg transition-colors hover:bg-card"
        >
          <ThemeGlyph dark={theme === "dark"} />
          <span className="mono-label w-[44px] text-left normal-case text-muted">
            {theme === "dark" ? t.controls.dark : t.controls.light}
          </span>
        </button>

        <span className="h-5 w-px bg-line-strong" aria-hidden="true" />

        <button
          type="button"
          onClick={toggleLang}
          aria-label={t.controls.lang}
          className="relative flex h-9 items-center rounded-full p-0.5"
        >
          {LANGS.map((code) => (
            <span
              key={code}
              className={cn(
                "mono-label relative z-10 grid h-8 w-10 place-items-center rounded-full transition-colors duration-300",
                lang === code ? "text-bg" : "text-muted",
              )}
            >
              {lang === code && (
                <motion.span
                  layoutId="lang-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-fg"
                  transition={{ duration: 0.5, ease: EXPO }}
                />
              )}
              {code}
            </span>
          ))}
        </button>
      </div>
    </motion.div>
  );
}

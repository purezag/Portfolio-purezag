"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { PreviewMedia } from "@/components/preview-media";
import { FadeIn, SectionTag } from "@/components/reveal";
import { useFinePointer } from "@/hooks/use-media";
import { cn } from "@/lib/cn";
import { projects, type Project } from "@/lib/projects";
import { useApp } from "@/providers/app-provider";
import { CaseModal } from "./case-modal";

const EXPO = [0.16, 1, 0.3, 1] as const;
const CARD_MAX = 360;

type Placement = { left: number; top: number; width: number };

export function Work() {
  const { t, scrollTo } = useApp();
  const fine = useFinePointer();
  const [active, setActive] = useState<number | null>(null);
  const [placement, setPlacement] = useState<Placement | null>(null);
  const [opened, setOpened] = useState<number | null>(null);
  const area = useRef<HTMLDivElement>(null);
  const cells = useRef<(HTMLButtonElement | null)[]>([]);
  const leaveTimer = useRef<number | undefined>(undefined);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const place = useCallback((index: number) => {
    const host = area.current;
    const cell = cells.current[index];
    if (!host || !cell) return;
    const hostRect = host.getBoundingClientRect();
    const rect = cell.getBoundingClientRect();
    const scale = host.offsetWidth / hostRect.width || 1;
    const width = Math.min(CARD_MAX, host.offsetWidth);
    const cellLeft = (rect.left - hostRect.left) * scale;
    const cellTop = (rect.top - hostRect.top) * scale;
    const cellWidth = rect.width * scale;
    const cellHeight = rect.height * scale;
    const height = width * 0.625 + 122;
    const left = Math.min(Math.max(0, cellLeft + cellWidth / 2 - width / 2), host.offsetWidth - width);
    const top = Math.min(Math.max(cellTop + cellHeight / 2 - height / 2, -140), host.offsetHeight - height + 32);
    setPlacement({ left, top, width });
  }, []);

  const show = useCallback(
    (index: number) => {
      window.clearTimeout(leaveTimer.current);
      place(index);
      setActive(index);
    },
    [place],
  );

  const hide = useCallback(() => {
    window.clearTimeout(leaveTimer.current);
    leaveTimer.current = window.setTimeout(() => setActive(null), 140);
  }, []);

  const openCase = useCallback((index: number, trigger: HTMLElement | null) => {
    lastTrigger.current = trigger;
    setOpened(index);
  }, []);

  useEffect(() => {
    if (active === null) return;
    const onResize = () => place(active);
    const onDown = (event: PointerEvent) => {
      if (area.current && !area.current.contains(event.target as Node)) setActive(null);
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [active, place]);

  const current = active === null ? null : projects[active]!;

  return (
    <div className="relative flex min-h-[100svh] flex-col px-5 pb-28 pt-24 md:px-8 md:pb-24 md:pt-28">
      <FadeIn inView className="flex flex-col gap-5">
        <SectionTag index="02">{t.work.eyebrow}</SectionTag>
        <h2 className="text-[clamp(2.6rem,9vw,6rem)] font-medium leading-[0.92] tracking-[-0.055em]">
          {t.work.title}
          <sup className="ml-2 hidden align-top font-mono md:inline text-[0.22em] font-normal tracking-normal text-muted">
            ({String(projects.length).padStart(2, "0")})
          </sup>
        </h2>
      </FadeIn>

      <FadeIn inView delay={0.1} className="mt-12 md:mt-16 lg:mt-14 lg:flex lg:flex-1 lg:flex-col lg:justify-center">
        <div ref={area} className="relative" onPointerLeave={(event) => event.pointerType === "mouse" && hide()}>
          <ul className="grid grid-cols-2 border-l border-t border-line md:grid-cols-4 lg:grid-cols-6">
            {projects.map((project, index) => (
              <li key={project.id} className="border-b border-r border-line">
                <LogoCell
                  project={project}
                  index={index}
                  active={active === index}
                  cellRef={(node) => {
                    cells.current[index] = node;
                  }}
                  onEnter={() => show(index)}
                  onActivate={(trigger) => {
                    if (fine) openCase(index, trigger);
                    else if (active === index) setActive(null);
                    else show(index);
                  }}
                />
              </li>
            ))}
            <li className="col-span-2 border-b border-r border-line">
              <button
                type="button"
                onClick={() => scrollTo("contact")}
                className="group relative flex aspect-[8/3] w-full flex-col md:aspect-[2/1] lg:aspect-[8/3] items-start justify-end gap-1.5 p-4 text-left transition-colors duration-500 hover:bg-fg hover:text-bg md:p-5"
              >
                <span className="mono-label absolute left-4 top-4 text-faint md:left-5 md:top-5">+</span>
                <span className="text-[clamp(1.25rem,2.2vw,1.75rem)] font-medium leading-[1] tracking-[-0.04em]">{t.work.ctaTitle}</span>
                <span className="mono-label flex items-center gap-2 text-muted normal-case transition-colors group-hover:text-bg">
                  {t.work.ctaText}
                  <ArrowRight className="size-3.5 transition-transform duration-500 ease-expo group-hover:translate-x-1" />
                </span>
              </button>
            </li>
          </ul>

          <AnimatePresence>
            {current && placement && (
              <motion.div
                key="preview"
                className="absolute z-20"
                style={{ width: placement.width }}
                initial={{ opacity: 0, scale: 0.92, left: placement.left, top: placement.top }}
                animate={{ opacity: 1, scale: 1, left: placement.left, top: placement.top }}
                exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.25 } }}
                transition={{ duration: 0.55, ease: EXPO }}
                onPointerEnter={() => window.clearTimeout(leaveTimer.current)}
              >
                <PreviewCard
                  project={current}
                  onMore={(trigger) => active !== null && openCase(active, trigger)}
                  onClose={() => setActive(null)}
                  touch={!fine}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeIn>

      <CaseModal
        index={opened}
        onClose={() => {
          setOpened(null);
          window.setTimeout(() => lastTrigger.current?.focus({ preventScroll: true }), 50);
        }}
        onNavigate={setOpened}
      />
    </div>
  );
}

function LogoCell({
  project,
  index,
  active,
  cellRef,
  onEnter,
  onActivate,
}: {
  project: Project;
  index: number;
  active: boolean;
  cellRef: (node: HTMLButtonElement | null) => void;
  onEnter: () => void;
  onActivate: (trigger: HTMLElement) => void;
}) {
  const { t, lang } = useApp();

  return (
    <button
      ref={cellRef}
      type="button"
      aria-label={`${t.work.open}: ${project.name} — ${project.type[lang]}`}
      aria-haspopup="dialog"
      onPointerEnter={(event) => event.pointerType === "mouse" && onEnter()}
      onFocus={(event) => event.currentTarget.matches(":focus-visible") && onEnter()}
      onClick={(event) => onActivate(event.currentTarget)}
      className={cn(
        "group relative grid aspect-[4/3] w-full place-items-center transition-colors duration-500 md:aspect-square lg:aspect-[4/3]",
        active ? "bg-surface" : "hover:bg-surface",
      )}
    >
      <span className="mono-label absolute left-4 top-4 text-faint md:left-5 md:top-5">
        {String(index + 1).padStart(2, "0")}
      </span>
      {project.status && (
        <span className="mono-label absolute right-3 top-3 rounded-full border border-line-strong px-2 py-1 text-[9.5px] text-muted md:right-4 md:top-4">
          {t.work.status[project.status]}
        </span>
      )}
      <BrandMark
        project={project}
        className={cn(
          "transition-all duration-500 ease-expo",
          project.logo ? "h-[24%] w-[60%] md:h-[20%] md:w-[68%] lg:h-[24%] lg:w-[60%]" : "max-w-[72%] text-[clamp(1.3rem,2.4vw,1.9rem)]",
          active ? "scale-105 opacity-100" : "opacity-75 group-hover:opacity-100",
        )}
      />
      <span className="mono-label absolute bottom-4 left-4 text-faint md:bottom-5 md:left-5">
        {t.work.platform[project.platform]}
      </span>
    </button>
  );
}

function PreviewCard({
  project,
  onMore,
  onClose,
  touch,
}: {
  project: Project;
  onMore: (trigger: HTMLElement) => void;
  onClose: () => void;
  touch: boolean;
}) {
  const { t, lang } = useApp();

  return (
    <div
      onClick={(event) => onMore(event.currentTarget)}
      className="cursor-pointer overflow-hidden rounded-[20px] border border-line-strong bg-surface shadow-[0_30px_80px_-30px_rgb(var(--shade)/0.55)]"
    >
      <div className="relative aspect-[16/10]">
        <AnimatePresence initial={false}>
          <motion.div
            key={project.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <PreviewMedia project={project} className="size-full" />
          </motion.div>
        </AnimatePresence>
        {touch && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
            aria-label={t.work.close}
            className="absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-full bg-surface/90 text-fg backdrop-blur"
          >
            <span className="relative block size-3">
              <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 rotate-45 bg-current" />
              <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 -rotate-45 bg-current" />
            </span>
          </button>
        )}
      </div>
      <div className="flex items-end justify-between gap-4 p-4">
        <div className="flex min-w-0 flex-col gap-2">
          <p className="mono-label flex flex-wrap gap-x-2 text-muted">
            <span>{project.type[lang]}</span>
            <span className="text-faint">—</span>
            <span>{project.year}</span>
          </p>
          <p className="text-[1.6rem] font-medium leading-[1] tracking-[-0.045em]">{project.name}</p>
          <p className="truncate font-mono text-[11px] text-muted">
            {project.stack.length ? project.stack.join(" · ") : project.status ? t.work.status[project.status] : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onMore(event.currentTarget);
          }}
          className="group flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-fg pl-3.5 pr-2.5 text-[12px] font-medium text-bg"
        >
          {t.work.more}
          <ArrowUpRight className="size-3.5 transition-transform duration-500 ease-expo group-hover:rotate-45" />
        </button>
      </div>
    </div>
  );
}

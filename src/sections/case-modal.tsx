"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, ArrowUpRight, Close } from "@/components/icons";
import { PreviewMedia } from "@/components/preview-media";
import { projects, screenSrc, type Project } from "@/lib/projects";
import { useApp } from "@/providers/app-provider";

const EXPO = [0.16, 1, 0.3, 1] as const;

type Props = {
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function CaseModal({ index, onClose, onNavigate }: Props) {
  const { lockScroll } = useApp();
  const open = index !== null;

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [open, onClose, lockScroll]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="case-modal"
          className="fixed inset-0 z-[80]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="absolute inset-0 bg-[rgb(var(--shade)/0.45)] backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onClose}
          />
          <CaseSheet
            project={projects[index]!}
            index={index}
            onClose={onClose}
            onNext={() => onNavigate((index + 1) % projects.length)}
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function CaseSheet({
  project,
  index,
  onClose,
  onNext,
}: {
  project: Project;
  index: number;
  onClose: () => void;
  onNext: () => void;
}) {
  const { t, lang } = useApp();
  const scroller = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const next = projects[(index + 1) % projects.length]!;
  const screens = Array.from({ length: project.screens }, (_, i) => i + 1);

  useEffect(() => {
    closeButton.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [project.id]);

  const meta = [
    { label: t.modal.year, value: project.year },
    { label: t.modal.type, value: project.type[lang] },
    { label: t.modal.role, value: project.role[lang] },
    { label: t.modal.stack, value: project.stack.length ? project.stack.join(" · ") : t.work.status.soon },
  ];

  return (
    <motion.article
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-title"
      className="absolute inset-x-0 bottom-0 top-[5svh] flex flex-col overflow-hidden rounded-t-[26px] border border-line bg-bg text-fg md:inset-x-auto md:bottom-[3svh] md:left-1/2 md:top-[3svh] md:w-[min(1180px,94vw)] md:-translate-x-1/2 md:rounded-[28px]"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.85, ease: EXPO }}
    >
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-line px-5 md:px-7">
        <span className="mono-label flex items-center gap-2 text-muted">
          <span className="text-faint">case</span>
          {String(index + 1).padStart(2, "0")}/{String(projects.length).padStart(2, "0")}
        </span>
        <button
          ref={closeButton}
          type="button"
          onClick={onClose}
          aria-label={t.modal.close}
          className="-mr-2 grid size-10 place-items-center rounded-full transition-colors hover:bg-card"
        >
          <Close className="size-5" />
        </button>
      </header>

      <div ref={scroller} data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: EXPO }}
            className="px-5 pb-10 pt-8 md:px-10 md:pb-14 md:pt-12"
          >
            <p className="mono-label flex flex-wrap items-center gap-2 text-muted">
              <span>{project.type[lang]}</span>
              <span className="text-faint">—</span>
              <span>{t.work.platform[project.platform]}</span>
              {project.status && (
                <span className="rounded-full border border-line-strong px-2 py-1 text-[10px]">{t.work.status[project.status]}</span>
              )}
            </p>
            <h2
              id="case-title"
              className="mt-3 text-[clamp(2.75rem,10vw,7rem)] font-medium leading-[0.9] tracking-[-0.06em]"
            >
              {project.name}
            </h2>

            <dl className="mt-8 grid grid-cols-2 border-y border-line md:mt-12 md:grid-cols-4">
              {meta.map((item, i) => (
                <div
                  key={item.label}
                  className={`flex flex-col gap-2 py-4 ${i % 2 === 1 ? "pl-4" : "pr-4"} md:px-0 md:pr-6 ${i > 1 ? "border-t border-line md:border-t-0" : ""} ${i > 0 ? "md:border-l md:border-line md:pl-6" : ""}`}
                >
                  <dt className="mono-label text-faint">{item.label}</dt>
                  <dd className="text-sm leading-snug">{item.value}</dd>
                </div>
              ))}
            </dl>

            <PreviewMedia
              project={project}
              className="mt-8 aspect-[16/10] rounded-xl border border-line md:mt-12 md:rounded-2xl"
            />

            <div className="mt-8 grid gap-8 md:mt-12 md:grid-cols-12">
              <div className="flex flex-col gap-4 text-[15px] leading-relaxed text-muted md:col-span-7 md:text-base">
                {project.description.map((paragraph) => (
                  <p key={paragraph.pt}>{paragraph[lang]}</p>
                ))}
              </div>
              <div className="flex flex-col gap-4 md:col-span-4 md:col-start-9">
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-12 items-center justify-between rounded-full bg-fg pl-5 pr-2 text-sm font-medium text-bg"
                  >
                    {t.modal.live}
                    <span className="grid size-8 place-items-center rounded-full bg-bg text-fg transition-transform duration-500 ease-expo group-hover:rotate-45">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </a>
                ) : (
                  <span className="mono-label flex h-12 items-center rounded-full border border-dashed border-line-strong px-5 text-muted normal-case">
                    {project.status ? t.work.status[project.status] : t.modal.offline}
                  </span>
                )}
                {project.note && (
                  <div className="rounded-2xl border border-line bg-surface p-4">
                    <p className="mono-label mb-2 text-faint">// {t.modal.note}</p>
                    <p className="text-[13px] leading-relaxed text-muted">{project.note[lang]}</p>
                  </div>
                )}
              </div>
            </div>

            {project.screens > 0 && (
              <p className="mono-label mb-4 mt-12 text-faint md:mt-16">
                {t.modal.screens} · {String(project.screens).padStart(2, "0")}
              </p>
            )}
            <div className={project.platform === "mobile" ? "grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4" : "grid gap-3 md:grid-cols-2 md:gap-4"}>
              {screens.map((screen) => (
                <img
                  key={screen}
                  src={screenSrc(project.id, screen, 800)}
                  srcSet={`${screenSrc(project.id, screen, 800)} 800w, ${screenSrc(project.id, screen, 1600)} 1600w`}
                  sizes={project.platform === "mobile" ? "(min-width: 768px) 280px, 50vw" : screen === 1 ? "(min-width: 768px) 1100px, 100vw" : "(min-width: 768px) 550px, 100vw"}
                  alt={`${project.name} — ${screen}`}
                  width={project.platform === "mobile" ? 780 : 1600}
                  height={project.platform === "mobile" ? 1688 : 997}
                  loading={screen === 1 ? "eager" : "lazy"}
                  decoding="async"
                  className={`h-auto w-full rounded-xl border border-line bg-card md:rounded-2xl ${screen === 1 && project.platform !== "mobile" ? "md:col-span-2" : ""}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={onNext}
              className="group mt-12 flex w-full items-end justify-between gap-6 border-t border-line pt-6 text-left md:mt-16"
            >
              <span className="flex flex-col gap-2">
                <span className="mono-label text-faint">{t.modal.next}</span>
                <span className="text-[clamp(2rem,6vw,3.5rem)] font-medium leading-none tracking-[-0.05em] transition-transform duration-500 ease-expo group-hover:translate-x-2">
                  {next.name}
                </span>
              </span>
              <span className="grid size-12 shrink-0 place-items-center rounded-full border border-line-strong transition-colors duration-300 group-hover:bg-fg group-hover:text-bg">
                <ArrowRight className="size-5" />
              </span>
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

"use client";

import { motion } from "motion/react";
import { useLayoutEffect, useRef } from "react";
import { ParticlePortrait } from "@/components/portrait/portraits";
import { FadeIn, MaskLine } from "@/components/reveal";
import { useApp } from "@/providers/app-provider";

const NAME = "font-medium leading-[0.88] tracking-[-0.065em]";

function useNameSize() {
  const root = useRef<HTMLDivElement>(null);
  const column = useRef<HTMLDivElement>(null);
  const probe = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const host = root.current;
    const box = column.current;
    const ruler = probe.current;
    if (!host || !box || !ruler) return;
    const fit = () => {
      const natural = ruler.offsetWidth;
      if (!natural || !box.clientWidth) return;
      const size = Math.min(window.innerWidth < 1024 ? 104 : 140, (100 * box.clientWidth) / natural);
      host.style.setProperty("--name", `${size}px`);
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    document.fonts?.ready.then(fit);
    return () => observer.disconnect();
  }, []);

  return { root, column, probe };
}

export function Hero() {
  const { t, ready, scrollTo } = useApp();
  const { root, column, probe } = useNameSize();

  return (
    <div
      ref={root}
      className="relative flex min-h-[100svh] flex-col px-5 pb-24 pt-[72px] [--name:64px] lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:grid-rows-[auto_1fr_auto] lg:gap-x-10 lg:px-8 lg:pb-20 lg:gap-x-14"
    >
      <span ref={probe} aria-hidden="true" className={`pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap text-[100px] ${NAME}`}>
        Guilherme
      </span>

      <div
        aria-hidden="true"
        className="grid-backdrop pointer-events-none absolute inset-0 opacity-70 [--cell:56px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_45%,black,transparent)] lg:[--cell:72px]"
      />

      <FadeIn show={ready} delay={0.5} className="relative z-10 flex items-center justify-between lg:col-span-3">
        <span className="mono-label flex items-center gap-2 text-muted">
          <span className="text-faint">[01]</span>
          {t.hero.eyebrow}
        </span>
        <span className="mono-label text-muted">{t.hero.based}</span>
      </FadeIn>

      <h1 className="sr-only">Guilherme Pureza — {t.hero.role}</h1>

      <div ref={column} className="relative z-10 mt-8 lg:mt-[18svh] lg:self-start">
        <MaskLine show={ready} delay={0.35} className="mono-label mb-3 text-muted normal-case lg:mb-5">
          <span className="text-faint">~/gp $</span> whoami
        </MaskLine>
        <div aria-hidden="true" className={NAME} style={{ fontSize: "var(--name)" }}>
          <MaskLine show={ready} delay={0.45}>
            Guilherme
          </MaskLine>
          <MaskLine show={ready} delay={0.55} className="lg:hidden">
            Pureza<span className="text-faint">.</span>
          </MaskLine>
        </div>
      </div>

      <div className="relative -mx-5 my-4 min-h-[300px] flex-1 lg:mx-0 lg:my-0 lg:h-[calc(100svh-200px)] lg:max-h-[860px] lg:min-h-[440px] lg:w-auto lg:max-w-[40vw] lg:flex-none lg:aspect-[4/5]">
        <div className="absolute inset-y-0 -inset-x-[14%]">
          <ParticlePortrait ready={ready} label="Guilherme Pureza" className="touch-pan-y" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-4 lg:mt-[18svh] lg:self-start lg:gap-6">
        <MaskLine show={ready} delay={0.35} className="mono-label hidden text-muted normal-case lg:mb-[-4px] lg:block">
          <span className="text-faint">~/gp $</span> echo $ROLE
        </MaskLine>
        <div aria-hidden="true" className={`hidden lg:block ${NAME}`} style={{ fontSize: "var(--name)" }}>
          <MaskLine show={ready} delay={0.55}>
            Pureza<span className="text-faint">.</span>
          </MaskLine>
        </div>
        <MaskLine show={ready} delay={0.7} className="whitespace-nowrap text-[clamp(1rem,1.3vw,1.4rem)] font-medium tracking-[-0.03em]">
          <span className="font-mono text-faint">&lt;</span>
          {t.hero.role}
          <span className="font-mono text-faint"> /&gt;</span>
          <span className="ml-1 inline-block h-[0.9em] w-[0.45em] translate-y-[0.12em] bg-fg [animation:blink_1.1s_steps(1)_infinite]" />
        </MaskLine>
      </div>

      <FadeIn
        show={ready}
        delay={1.1}
        className="relative z-10 mt-6 flex items-end justify-between gap-4 border-t border-line pt-4 lg:col-span-3 lg:mt-0"
      >
        <span className="mono-label text-muted normal-case">{t.hero.stack}</span>
        <button
          type="button"
          onClick={() => scrollTo("work")}
          className="mono-label group flex items-center gap-3 text-muted normal-case transition-colors hover:text-fg"
        >
          <span className="hidden sm:inline">{t.hero.scroll}</span>
          <span className="relative block h-7 w-[1px] overflow-hidden bg-line-strong">
            <motion.span
              className="absolute inset-x-0 top-0 h-3 bg-fg"
              animate={{ y: ["-100%", "240%"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
            />
          </span>
        </button>
      </FadeIn>
    </div>
  );
}
